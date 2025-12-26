-- Add R2 storage metadata fields to generated_images table
-- Migration for transitioning from base64 to R2 object storage

-- Add storage_type column (default to 'base64' for existing records)
ALTER TABLE generated_images 
ADD COLUMN IF NOT EXISTS storage_type TEXT DEFAULT 'base64';

-- Add r2_key column for storing R2 object keys
ALTER TABLE generated_images 
ADD COLUMN IF NOT EXISTS r2_key TEXT;

-- Add comment for documentation
COMMENT ON COLUMN generated_images.storage_type IS 'Storage backend: base64 (legacy) or r2 (object storage)';
COMMENT ON COLUMN generated_images.r2_key IS 'R2 object key when storage_type is r2';

-- Create index on storage_type for migration queries
CREATE INDEX IF NOT EXISTS idx_generated_images_storage_type ON generated_images(storage_type);
