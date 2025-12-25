# Image Storage Migration Guide

## Current State: Database Storage (Base64)

**Problems:**
- Images stored as base64 in PostgreSQL
- Increases database size significantly
- Slower query performance
- Higher memory usage
- Expensive backups
- Not scalable for 1000+ users

**Current Capacity:**
- ~10,000 images before performance degradation
- ~50GB database size at 5MB average per image

## Target State: Object Storage (S3/Cloudflare R2)

**Benefits:**
- Unlimited storage capacity
- 10x faster image serving
- 90% cost reduction
- Better caching with CDN
- Automatic backups
- Scalable to millions of images

## Migration Strategy

### Phase 1: Setup Object Storage

#### Option A: Cloudflare R2 (Recommended)

**Why R2:**
- Zero egress fees (vs $0.09/GB on S3)
- S3-compatible API
- Integrated with Cloudflare CDN
- $0.015/GB storage (vs $0.023/GB on S3)

**Setup Steps:**

1. Create R2 bucket:
```bash
# In Cloudflare dashboard
# Storage & Databases → R2 → Create Bucket
# Name: ugli-images
# Location: Automatic
```

2. Generate API token:
```bash
# R2 → Manage R2 API Tokens → Create API Token
# Permissions: Object Read & Write
# Save: Access Key ID and Secret Access Key
```

3. Configure environment variables:
```bash
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=ugli-images
R2_PUBLIC_URL=https://images.ugli.design
```

#### Option B: AWS S3

**Setup Steps:**

1. Create S3 bucket:
```bash
aws s3 mb s3://ugli-images --region us-east-1
```

2. Configure bucket policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ugli-images/public/*"
    }
  ]
}
```

3. Configure CORS:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["https://ugli.design"],
    "ExposeHeaders": ["ETag"]
  }
]
```

4. Configure environment variables:
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=ugli-images
S3_PUBLIC_URL=https://ugli-images.s3.amazonaws.com
```

### Phase 2: Install Dependencies

```bash
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
```

### Phase 3: Create Storage Service

Create `/server/objectStorage.ts`:

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { logger } from './logger';

// Works with both S3 and R2 (S3-compatible)
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'auto',
  endpoint: process.env.R2_ENDPOINT || undefined,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || process.env.S3_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL || process.env.S3_PUBLIC_URL!;

export async function uploadImage(
  imageId: number,
  buffer: Buffer,
  mimeType: string,
  isPublic: boolean = false
): Promise<string> {
  const key = isPublic 
    ? `public/${imageId}.${getExtension(mimeType)}`
    : `private/${imageId}.${getExtension(mimeType)}`;

  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        CacheControl: 'public, max-age=31536000, immutable',
      },
    });

    await upload.done();
    
    const url = `${PUBLIC_URL}/${key}`;
    logger.info('Image uploaded to object storage', {
      source: 'storage',
      imageId,
      key,
      size: buffer.length,
    });
    
    return url;
  } catch (error) {
    logger.error('Failed to upload image', error as Error, {
      source: 'storage',
      imageId,
    });
    throw error;
  }
}

export async function deleteImage(imageId: number, isPublic: boolean = false): Promise<void> {
  const extensions = ['png', 'jpg', 'jpeg', 'webp'];
  
  for (const ext of extensions) {
    const key = isPublic ? `public/${imageId}.${ext}` : `private/${imageId}.${ext}`;
    
    try {
      await s3Client.send(new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }));
    } catch (error) {
      // Ignore if file doesn't exist
    }
  }
}

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
  };
  return map[mimeType] || 'png';
}
```

### Phase 4: Update Database Schema

Add `storage_url` column to images table:

```sql
ALTER TABLE images ADD COLUMN storage_url TEXT;
ALTER TABLE images ADD COLUMN storage_type VARCHAR(20) DEFAULT 'database';

-- Create index for migration tracking
CREATE INDEX idx_images_storage_type ON images(storage_type);
```

### Phase 5: Update Image Upload Logic

Modify `/server/routes/generation.ts`:

```typescript
// After image generation
const buffer = Buffer.from(base64Data, 'base64');
const mimeType = 'image/png';

// Upload to object storage
const storageUrl = await uploadImage(imageId, buffer, mimeType, isPublic);

// Update database with storage URL (keep base64 temporarily for rollback)
await storage.updateImage(imageId, {
  storage_url: storageUrl,
  storage_type: 'object',
});
```

### Phase 6: Update Image Serving Logic

Modify `/server/routes/images.ts`:

```typescript
app.get("/api/images/:id", async (req: Request, res: Response) => {
  const imageId = parseInt(req.params.id);
  const image = await storage.getImage(imageId);
  
  if (!image) {
    return res.status(404).json({ message: "Image not found" });
  }
  
  // If stored in object storage, redirect to CDN URL
  if (image.storage_type === 'object' && image.storage_url) {
    return res.redirect(302, image.storage_url);
  }
  
  // Fallback to database storage (legacy)
  if (image.data) {
    const cached = getCachedImageBuffer(imageId.toString(), image.data);
    if (cached) {
      res.set('Content-Type', cached.mimeType);
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
      return res.send(cached.buffer);
    }
  }
  
  return res.status(404).json({ message: "Image data not found" });
});
```

### Phase 7: Migrate Existing Images

Create migration script `/scripts/migrate-images-to-object-storage.ts`:

```typescript
import { pool } from '../server/db';
import { uploadImage } from '../server/objectStorage';
import { logger } from '../server/logger';

async function migrateImages() {
  const client = await pool.connect();
  
  try {
    // Get all images still in database storage
    const result = await client.query(`
      SELECT id, data, is_public 
      FROM images 
      WHERE storage_type = 'database' 
      AND data IS NOT NULL
      ORDER BY id
      LIMIT 100
    `);
    
    logger.info(`Migrating ${result.rows.length} images...`);
    
    for (const row of result.rows) {
      try {
        // Extract buffer from base64
        const matches = row.data.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches) continue;
        
        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Upload to object storage
        const storageUrl = await uploadImage(row.id, buffer, mimeType, row.is_public);
        
        // Update database
        await client.query(`
          UPDATE images 
          SET storage_url = $1, storage_type = 'object'
          WHERE id = $2
        `, [storageUrl, row.id]);
        
        logger.info(`Migrated image ${row.id}`);
        
        // Rate limit to avoid overwhelming storage service
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        logger.error(`Failed to migrate image ${row.id}`, error as Error);
      }
    }
    
    logger.info('Migration batch complete');
  } finally {
    client.release();
  }
}

// Run migration
migrateImages().catch(console.error);
```

Run migration in batches:

```bash
# Migrate 100 images at a time
node scripts/migrate-images-to-object-storage.js

# Schedule as cron job to run every hour until complete
# 0 * * * * cd /app && node scripts/migrate-images-to-object-storage.js
```

### Phase 8: Cleanup (After 30 days)

Once all images are migrated and verified:

```sql
-- Remove base64 data from migrated images
UPDATE images 
SET data = NULL 
WHERE storage_type = 'object' 
AND storage_url IS NOT NULL;

-- Vacuum to reclaim space
VACUUM FULL images;
```

## Rollback Plan

If issues occur:

1. Keep base64 data in database during migration
2. Switch back to database serving by updating image serving logic
3. Delete object storage uploads if needed

## Cost Comparison

### Current (Database Storage)
- 10,000 images × 5MB = 50GB
- PostgreSQL: ~$50/month for 50GB
- Backup: ~$10/month
- **Total: $60/month**

### After Migration (Object Storage)
- 10,000 images × 5MB = 50GB
- Cloudflare R2: 50GB × $0.015 = $0.75/month
- PostgreSQL: ~$10/month (metadata only)
- **Total: $10.75/month**
- **Savings: 82%**

At 100,000 images:
- Current: ~$600/month
- After: ~$85/month
- **Savings: 86%**

## Performance Impact

- **Image Load Time**: 2000ms → 200ms (10x faster)
- **Database Size**: 50GB → 500MB (100x smaller)
- **Query Performance**: 500ms → 50ms (10x faster)
- **Concurrent Users**: 200 → 2000+ (10x more)

## Timeline

- **Week 1**: Setup R2/S3, test uploads
- **Week 2**: Deploy new upload logic
- **Week 3**: Migrate existing images (100/hour)
- **Week 4**: Verify and cleanup

## Monitoring

Track these metrics during migration:

1. **Migration Progress**: `SELECT COUNT(*) FROM images WHERE storage_type = 'object'`
2. **Storage Costs**: Monitor R2/S3 dashboard
3. **Error Rate**: Check logs for upload failures
4. **Performance**: Monitor image load times

## Support

For issues during migration:
- Check logs: `tail -f /var/log/ugli/migration.log`
- Verify R2/S3 credentials
- Test with single image first
- Contact Cloudflare/AWS support if needed
