/**
 * Cloudflare R2 Object Storage Service
 * Handles image uploads, downloads, and management using R2 (S3-compatible)
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { logger } from './logger';
import crypto from 'crypto';

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl?: string; // Optional custom domain for public access
}

interface UploadResult {
  url: string;
  key: string;
  size: number;
  mimeType: string;
}

class R2StorageService {
  private client: S3Client;
  private bucketName: string;
  private publicUrl: string;
  private accountId: string;

  constructor(config: R2Config) {
    this.accountId = config.accountId;
    this.bucketName = config.bucketName;
    
    // R2 endpoint format: https://<account_id>.r2.cloudflarestorage.com
    const endpoint = `https://${config.accountId}.r2.cloudflarestorage.com`;
    
    // Default public URL (can be overridden with custom domain)
    this.publicUrl = config.publicUrl || `https://pub-${config.accountId}.r2.dev`;

    this.client = new S3Client({
      region: 'auto', // R2 uses 'auto' as region
      endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });

    logger.info('R2 Storage initialized', {
      bucket: this.bucketName,
      endpoint,
    });
  }

  /**
   * Generate a unique key for storing an image
   */
  private generateKey(userId: string, mimeType: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const extension = this.getExtensionFromMimeType(mimeType);
    
    // Format: images/{userId}/{timestamp}-{random}.{ext}
    return `images/${userId}/${timestamp}-${random}.${extension}`;
  }

  /**
   * Get file extension from MIME type
   */
  private getExtensionFromMimeType(mimeType: string): string {
    const mimeMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'image/svg+xml': 'svg',
    };
    return mimeMap[mimeType] || 'jpg';
  }

  /**
   * Upload an image buffer to R2
   */
  async uploadImage(
    buffer: Buffer,
    mimeType: string,
    userId: string,
    metadata?: Record<string, string>
  ): Promise<UploadResult> {
    const key = this.generateKey(userId, mimeType);

    try {
      const upload = new Upload({
        client: this.client,
        params: {
          Bucket: this.bucketName,
          Key: key,
          Body: buffer,
          ContentType: mimeType,
          Metadata: {
            userId,
            uploadedAt: new Date().toISOString(),
            ...metadata,
          },
          // Make publicly readable
          // Note: R2 requires bucket-level public access to be enabled
          // ACL: 'public-read', // R2 doesn't support ACLs, use bucket settings
        },
      });

      await upload.done();

      const url = `${this.publicUrl}/${key}`;

      logger.info('Image uploaded to R2', {
        key,
        size: buffer.length,
        mimeType,
        userId,
      });

      return {
        url,
        key,
        size: buffer.length,
        mimeType,
      };
    } catch (error) {
      logger.error('Failed to upload image to R2', {
        error,
        key,
        userId,
      });
      throw new Error('Failed to upload image to R2');
    }
  }

  /**
   * Upload a base64 image string to R2
   */
  async uploadBase64Image(
    base64Data: string,
    userId: string,
    metadata?: Record<string, string>
  ): Promise<UploadResult> {
    // Parse base64 data URL: data:image/png;base64,iVBORw0KG...
    const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
    
    if (!matches) {
      throw new Error('Invalid base64 data URL format');
    }

    const mimeType = matches[1];
    const base64String = matches[2];
    const buffer = Buffer.from(base64String, 'base64');

    return this.uploadImage(buffer, mimeType, userId, metadata);
  }

  /**
   * Get an image from R2 (returns buffer)
   */
  async getImage(key: string): Promise<{ buffer: Buffer; mimeType: string }> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.client.send(command);
      
      if (!response.Body) {
        throw new Error('No image data received');
      }

      // Convert stream to buffer
      const chunks: Uint8Array[] = [];
      for await (const chunk of response.Body as any) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      return {
        buffer,
        mimeType: response.ContentType || 'image/jpeg',
      };
    } catch (error) {
      logger.error('Failed to get image from R2', { error, key });
      throw new Error('Failed to retrieve image from R2');
    }
  }

  /**
   * Delete an image from R2
   */
  async deleteImage(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.client.send(command);

      logger.info('Image deleted from R2', { key });
    } catch (error) {
      logger.error('Failed to delete image from R2', { error, key });
      throw new Error('Failed to delete image from R2');
    }
  }

  /**
   * Check if an image exists in R2
   */
  async imageExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.client.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound') {
        return false;
      }
      logger.error('Failed to check image existence in R2', { error, key });
      throw error;
    }
  }

  /**
   * Extract R2 key from URL
   */
  extractKeyFromUrl(url: string): string | null {
    try {
      // Handle both public URL and custom domain
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      
      // Remove leading slash
      return pathname.startsWith('/') ? pathname.slice(1) : pathname;
    } catch {
      return null;
    }
  }

  /**
   * Get public URL for a key
   */
  getPublicUrl(key: string): string {
    return `${this.publicUrl}/${key}`;
  }
}

// Singleton instance
let r2Instance: R2StorageService | null = null;

/**
 * Initialize R2 storage service
 */
export function initR2Storage(): R2StorageService {
  if (r2Instance) {
    return r2Instance;
  }

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || 'uglidesign-images';
  const publicUrl = process.env.R2_PUBLIC_URL; // Optional custom domain

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 credentials not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY environment variables.');
  }

  r2Instance = new R2StorageService({
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicUrl,
  });

  return r2Instance;
}

/**
 * Get R2 storage instance (must be initialized first)
 */
export function getR2Storage(): R2StorageService {
  if (!r2Instance) {
    throw new Error('R2 storage not initialized. Call initR2Storage() first.');
  }
  return r2Instance;
}

/**
 * Check if R2 is configured
 */
export function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY
  );
}

export default R2StorageService;
