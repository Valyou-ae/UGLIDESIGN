import { pool } from '../server/db';
import { uploadImage } from '../server/objectStorage';
import { logger } from '../server/logger';

/**
 * Migration Script: Move images from PostgreSQL to Cloudflare R2
 * 
 * This script migrates images stored as Base64 in the database to R2 object storage.
 * It processes images in batches to avoid overwhelming the system.
 * 
 * Usage:
 *   node scripts/migrate-images-to-r2.js [batch_size]
 * 
 * Example:
 *   node scripts/migrate-images-to-r2.js 100
 */

const BATCH_SIZE = parseInt(process.argv[2] || '100', 10);
const DELAY_BETWEEN_UPLOADS = 100; // milliseconds

interface ImageRow {
  id: number;
  data: string;
  is_public: boolean;
}

async function migrateImageBatch(): Promise<void> {
  const client = await pool.connect();
  
  try {
    console.log(`\n🚀 Starting migration batch (size: ${BATCH_SIZE})...\n`);
    
    // Get images that are still stored in the database
    const result = await client.query<ImageRow>(`
      SELECT id, data, is_public 
      FROM images 
      WHERE storage_type = 'database' 
        AND data IS NOT NULL
        AND data != ''
      ORDER BY id
      LIMIT $1
    `, [BATCH_SIZE]);
    
    const totalImages = result.rows.length;
    
    if (totalImages === 0) {
      console.log('✅ No more images to migrate. Migration complete!');
      return;
    }
    
    console.log(`📦 Found ${totalImages} images to migrate\n`);
    
    let successCount = 0;
    let failureCount = 0;
    
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows[i];
      const progress = `[${i + 1}/${totalImages}]`;
      
      try {
        // Extract buffer from base64 data URL
        const matches = row.data.match(/^data:([^;]+);base64,(.+)$/);
        
        if (!matches) {
          console.log(`${progress} ⚠️  Image ${row.id}: Invalid data format, skipping`);
          failureCount++;
          continue;
        }
        
        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Upload to R2
        console.log(`${progress} ⬆️  Uploading image ${row.id} (${(buffer.length / 1024).toFixed(2)} KB)...`);
        const storageUrl = await uploadImage(row.id, buffer, mimeType, row.is_public);
        
        // Update database record
        await client.query(`
          UPDATE images 
          SET storage_url = $1, 
              storage_type = 'object'
          WHERE id = $2
        `, [storageUrl, row.id]);
        
        console.log(`${progress} ✅ Image ${row.id} migrated successfully`);
        successCount++;
        
        // Rate limit to avoid overwhelming R2
        if (i < result.rows.length - 1) {
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_UPLOADS));
        }
      } catch (error) {
        console.error(`${progress} ❌ Failed to migrate image ${row.id}:`, error);
        logger.error(`Failed to migrate image ${row.id}`, error as Error, {
          source: 'migration',
          imageId: row.id,
        });
        failureCount++;
      }
    }
    
    console.log(`\n📊 Migration batch complete:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${failureCount}`);
    console.log(`   📈 Success rate: ${((successCount / totalImages) * 100).toFixed(1)}%`);
    
    // Check remaining images
    const remainingResult = await client.query(`
      SELECT COUNT(*) as count
      FROM images 
      WHERE storage_type = 'database' 
        AND data IS NOT NULL
        AND data != ''
    `);
    
    const remaining = parseInt(remainingResult.rows[0].count, 10);
    console.log(`\n📋 Remaining images to migrate: ${remaining}`);
    
    if (remaining > 0) {
      console.log(`\n💡 Run this script again to migrate the next batch.`);
      console.log(`   Or schedule it as a cron job: 0 * * * * cd /app && node scripts/migrate-images-to-r2.js`);
    }
  } catch (error) {
    console.error('❌ Migration batch failed:', error);
    logger.error('Migration batch failed', error as Error, {
      source: 'migration',
    });
    throw error;
  } finally {
    client.release();
  }
}

async function showMigrationStatus(): Promise<void> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT 
        storage_type,
        COUNT(*) as count,
        ROUND(AVG(LENGTH(data)) / 1024, 2) as avg_size_kb
      FROM images
      GROUP BY storage_type
      ORDER BY storage_type
    `);
    
    console.log('\n📊 Current Migration Status:\n');
    console.log('Storage Type | Count | Avg Size (KB)');
    console.log('-------------|-------|-------------');
    
    for (const row of result.rows) {
      console.log(`${row.storage_type.padEnd(12)} | ${String(row.count).padEnd(5)} | ${row.avg_size_kb || 'N/A'}`);
    }
    
    console.log('');
  } finally {
    client.release();
  }
}

// Main execution
(async () => {
  try {
    // Show current status
    await showMigrationStatus();
    
    // Run migration
    await migrateImageBatch();
    
    // Show updated status
    await showMigrationStatus();
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    await pool.end();
    process.exit(1);
  }
})();
