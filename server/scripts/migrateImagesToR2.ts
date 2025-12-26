/**
 * Migration Script: Base64 to R2 Storage
 * 
 * Migrates existing base64-encoded images from the database to Cloudflare R2 object storage.
 * 
 * Usage:
 *   npm run migrate:images [options]
 * 
 * Options:
 *   --batch-size <number>  Number of images to process per batch (default: 10)
 *   --dry-run              Preview migration without making changes
 *   --limit <number>       Limit total number of images to migrate (for testing)
 *   --user-id <id>         Migrate images for specific user only
 * 
 * Example:
 *   npm run migrate:images --dry-run
 *   npm run migrate:images --batch-size 5 --limit 100
 *   npm run migrate:images --user-id abc123
 */

import { pool } from '../db';
import { initR2Storage, isR2Configured } from '../r2Storage';
import { processImageForStorage } from '../imageStorageHelper';
import { logger } from '../logger';

interface MigrationStats {
  total: number;
  migrated: number;
  failed: number;
  skipped: number;
  bytesFreed: number;
}

interface MigrationOptions {
  batchSize: number;
  dryRun: boolean;
  limit?: number;
  userId?: string;
}

async function migrateImagesToR2(options: MigrationOptions): Promise<MigrationStats> {
  const stats: MigrationStats = {
    total: 0,
    migrated: 0,
    failed: 0,
    skipped: 0,
    bytesFreed: 0,
  };

  // Verify R2 is configured
  if (!isR2Configured()) {
    throw new Error('R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY environment variables.');
  }

  // Initialize R2
  const r2 = initR2Storage();
  logger.info('R2 storage initialized for migration');

  // Build query
  let query = `
    SELECT id, user_id, image_url, prompt, style, generation_type, storage_type
    FROM generated_images
    WHERE storage_type = 'base64' OR storage_type IS NULL
  `;

  const queryParams: any[] = [];
  let paramIndex = 1;

  if (options.userId) {
    query += ` AND user_id = $${paramIndex}`;
    queryParams.push(options.userId);
    paramIndex++;
  }

  query += ' ORDER BY created_at ASC';

  if (options.limit) {
    query += ` LIMIT $${paramIndex}`;
    queryParams.push(options.limit);
  }

  // Get images to migrate
  logger.info('Fetching images to migrate...', { options });
  const result = await pool.query(query, queryParams);
  const images = result.rows;

  stats.total = images.length;
  logger.info(`Found ${stats.total} images to migrate`);

  if (options.dryRun) {
    logger.info('DRY RUN MODE - No changes will be made');
  }

  // Process in batches
  for (let i = 0; i < images.length; i += options.batchSize) {
    const batch = images.slice(i, i + options.batchSize);
    logger.info(`Processing batch ${Math.floor(i / options.batchSize) + 1}/${Math.ceil(images.length / options.batchSize)}`, {
      batchSize: batch.length,
      progress: `${i + batch.length}/${images.length}`,
    });

    await Promise.all(
      batch.map(async (image) => {
        try {
          const imageUrl = image.image_url;

          // Skip if not base64
          if (!imageUrl.startsWith('data:')) {
            logger.warn('Image is not base64, skipping', { imageId: image.id });
            stats.skipped++;
            return;
          }

          // Calculate size before migration
          const base64Size = Buffer.byteLength(imageUrl, 'utf8');

          if (options.dryRun) {
            logger.info('Would migrate image', {
              imageId: image.id,
              userId: image.user_id,
              size: base64Size,
            });
            stats.migrated++;
            stats.bytesFreed += base64Size;
            return;
          }

          // Upload to R2
          const processed = await processImageForStorage(
            imageUrl,
            image.user_id,
            {
              prompt: image.prompt,
              style: image.style,
              generationType: image.generation_type,
              migratedFrom: 'base64',
              migratedAt: new Date().toISOString(),
            }
          );

          // Update database
          if (processed.storageType === 'r2') {
            await pool.query(
              `UPDATE generated_images 
               SET image_url = $1, storage_type = $2, r2_key = $3
               WHERE id = $4`,
              [processed.imageUrl, processed.storageType, processed.r2Key, image.id]
            );

            // Also update gallery images if exists
            await pool.query(
              `UPDATE gallery_images 
               SET image_url = $1
               WHERE source_image_id = $2`,
              [processed.imageUrl, image.id]
            );

            stats.migrated++;
            stats.bytesFreed += base64Size;

            logger.info('Image migrated successfully', {
              imageId: image.id,
              r2Key: processed.r2Key,
              sizeBefore: base64Size,
              sizeAfter: processed.imageUrl.length,
              savings: base64Size - processed.imageUrl.length,
            });
          } else {
            logger.warn('Image migration failed - still base64', { imageId: image.id });
            stats.failed++;
          }
        } catch (error) {
          logger.error('Failed to migrate image', {
            error,
            imageId: image.id,
          });
          stats.failed++;
        }
      })
    );

    // Small delay between batches to avoid overwhelming R2
    if (i + options.batchSize < images.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return stats;
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const options: MigrationOptions = {
    batchSize: 10,
    dryRun: false,
  };

  // Parse CLI arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--batch-size':
        options.batchSize = parseInt(args[++i], 10);
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--limit':
        options.limit = parseInt(args[++i], 10);
        break;
      case '--user-id':
        options.userId = args[++i];
        break;
      case '--help':
        console.log(`
Migration Script: Base64 to R2 Storage

Usage:
  npm run migrate:images [options]

Options:
  --batch-size <number>  Number of images to process per batch (default: 10)
  --dry-run              Preview migration without making changes
  --limit <number>       Limit total number of images to migrate (for testing)
  --user-id <id>         Migrate images for specific user only
  --help                 Show this help message

Examples:
  npm run migrate:images --dry-run
  npm run migrate:images --batch-size 5 --limit 100
  npm run migrate:images --user-id abc123
        `);
        process.exit(0);
    }
  }

  logger.info('Starting image migration to R2', { options });

  migrateImagesToR2(options)
    .then((stats) => {
      logger.info('Migration completed!', stats);
      console.log('\n=== Migration Summary ===');
      console.log(`Total images: ${stats.total}`);
      console.log(`Migrated: ${stats.migrated}`);
      console.log(`Failed: ${stats.failed}`);
      console.log(`Skipped: ${stats.skipped}`);
      console.log(`Database size freed: ${(stats.bytesFreed / 1024 / 1024).toFixed(2)} MB`);
      
      if (options.dryRun) {
        console.log('\nDRY RUN - No changes were made');
      }

      process.exit(stats.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      logger.error('Migration failed', error);
      console.error('Migration failed:', error.message);
      process.exit(1);
    });
}

export { migrateImagesToR2, type MigrationOptions, type MigrationStats };
