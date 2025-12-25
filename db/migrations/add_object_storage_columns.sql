-- Migration: Add object storage support to images table
-- This migration adds columns to track whether images are stored in the database or object storage (R2/S3)

-- Add storage_url column to store the public URL of images in object storage
ALTER TABLE images ADD COLUMN IF NOT EXISTS storage_url TEXT;

-- Add storage_type column to track where the image is stored
ALTER TABLE images ADD COLUMN IF NOT EXISTS storage_type VARCHAR(20) DEFAULT 'database';

-- Add index for faster queries filtering by storage type
CREATE INDEX IF NOT EXISTS idx_images_storage_type ON images(storage_type);

-- Add index for faster queries on images with storage URLs
CREATE INDEX IF NOT EXISTS idx_images_storage_url ON images(storage_url) WHERE storage_url IS NOT NULL;

-- Add check constraint to ensure storage_type is valid
ALTER TABLE images ADD CONSTRAINT IF NOT EXISTS chk_storage_type 
  CHECK (storage_type IN ('database', 'object'));

-- Update statistics for query planner
ANALYZE images;

-- Display migration summary
DO $$
DECLARE
  total_images INTEGER;
  database_images INTEGER;
  object_images INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_images FROM images;
  SELECT COUNT(*) INTO database_images FROM images WHERE storage_type = 'database';
  SELECT COUNT(*) INTO object_images FROM images WHERE storage_type = 'object';
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ Migration complete!';
  RAISE NOTICE '';
  RAISE NOTICE 'Image Storage Summary:';
  RAISE NOTICE '  Total images: %', total_images;
  RAISE NOTICE '  Database storage: %', database_images;
  RAISE NOTICE '  Object storage: %', object_images;
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Deploy new application code with R2 integration';
  RAISE NOTICE '  2. Run migration script: node scripts/migrate-images-to-r2.js';
  RAISE NOTICE '  3. Monitor migration progress in logs';
  RAISE NOTICE '';
END $$;
