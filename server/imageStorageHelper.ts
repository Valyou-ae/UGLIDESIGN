/**
 * Image Storage Helper
 * Handles automatic migration from base64 to R2 storage
 */

import { getR2Storage, isR2Configured } from './r2Storage';
import { logger } from './logger';

export interface ProcessedImageData {
  imageUrl: string;
  storageType: 'base64' | 'r2';
  r2Key?: string;
}

/**
 * Process image data for storage
 * - If R2 is configured and image is base64: upload to R2
 * - Otherwise: keep as base64 (backward compatibility)
 */
export async function processImageForStorage(
  imageUrl: string,
  userId: string,
  metadata?: Record<string, string>
): Promise<ProcessedImageData> {
  // Check if image is base64
  const isBase64 = imageUrl.startsWith('data:');

  // If not base64, return as-is (already a URL)
  if (!isBase64) {
    return {
      imageUrl,
      storageType: 'r2', // Assume external URLs are R2
      r2Key: undefined,
    };
  }

  // If R2 is not configured, keep as base64
  if (!isR2Configured()) {
    logger.warn('R2 not configured, storing image as base64', { userId });
    return {
      imageUrl,
      storageType: 'base64',
      r2Key: undefined,
    };
  }

  // Upload to R2
  try {
    const r2 = getR2Storage();
    const result = await r2.uploadBase64Image(imageUrl, userId, {
      ...metadata,
      originalFormat: 'base64',
    });

    logger.info('Image uploaded to R2', {
      userId,
      r2Key: result.key,
      size: result.size,
    });

    return {
      imageUrl: result.url,
      storageType: 'r2',
      r2Key: result.key,
    };
  } catch (error) {
    // Fallback to base64 if R2 upload fails
    logger.error('Failed to upload to R2, falling back to base64', {
      error,
      userId,
    });

    return {
      imageUrl,
      storageType: 'base64',
      r2Key: undefined,
    };
  }
}

/**
 * Delete image from R2 if it's stored there
 */
export async function deleteImageFromStorage(
  storageType: string,
  r2Key?: string
): Promise<void> {
  if (storageType === 'r2' && r2Key && isR2Configured()) {
    try {
      const r2 = getR2Storage();
      await r2.deleteImage(r2Key);
      logger.info('Image deleted from R2', { r2Key });
    } catch (error) {
      logger.error('Failed to delete image from R2', { error, r2Key });
      // Don't throw - deletion from DB should still succeed
    }
  }
}

/**
 * Get the actual image URL for serving
 * Handles both base64 and R2 storage
 */
export function getImageServeUrl(
  imageId: string,
  imageUrl: string,
  storageType: string
): string {
  // For base64, use the proxy endpoint
  if (storageType === 'base64' || imageUrl.startsWith('data:')) {
    return `/api/images/${imageId}/image`;
  }

  // For R2, return the direct URL
  return imageUrl;
}
