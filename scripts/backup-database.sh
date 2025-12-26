#!/bin/bash

# Database Backup Script for UGLIDESIGN
# This script creates automated backups of the PostgreSQL database

set -e  # Exit on error

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/home/ubuntu/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
S3_BUCKET="${S3_BUCKET:-uglidesign-backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="uglidesign_backup_${TIMESTAMP}.sql"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILE}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" >&2
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    error "DATABASE_URL environment variable is not set"
    exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

log "Starting database backup..."
log "Backup file: $BACKUP_FILE"

# Create backup
if pg_dump "$DATABASE_URL" > "$BACKUP_PATH"; then
    log "✅ Database backup created successfully"
    
    # Get backup size
    BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
    log "Backup size: $BACKUP_SIZE"
else
    error "Failed to create database backup"
    exit 1
fi

# Compress backup
log "Compressing backup..."
if gzip "$BACKUP_PATH"; then
    BACKUP_PATH="${BACKUP_PATH}.gz"
    COMPRESSED_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
    log "✅ Backup compressed successfully"
    log "Compressed size: $COMPRESSED_SIZE"
else
    warn "Failed to compress backup, continuing with uncompressed file"
fi

# Upload to S3/R2 (if configured)
if [ -n "$R2_ACCESS_KEY_ID" ] && [ -n "$R2_SECRET_ACCESS_KEY" ]; then
    log "Uploading backup to R2..."
    
    if aws s3 cp "$BACKUP_PATH" "s3://${S3_BUCKET}/database-backups/$(basename $BACKUP_PATH)" \
        --endpoint-url "https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com" \
        --region auto; then
        log "✅ Backup uploaded to R2 successfully"
    else
        warn "Failed to upload backup to R2"
    fi
else
    warn "R2 credentials not configured, skipping cloud upload"
fi

# Clean up old backups (keep last N days)
log "Cleaning up old backups (retention: ${RETENTION_DAYS} days)..."
find "$BACKUP_DIR" -name "uglidesign_backup_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete
find "$BACKUP_DIR" -name "uglidesign_backup_*.sql" -type f -mtime +${RETENTION_DAYS} -delete

REMAINING_BACKUPS=$(find "$BACKUP_DIR" -name "uglidesign_backup_*" -type f | wc -l)
log "✅ Cleanup complete. Remaining backups: $REMAINING_BACKUPS"

# Verify backup integrity
log "Verifying backup integrity..."
if gunzip -t "$BACKUP_PATH" 2>/dev/null; then
    log "✅ Backup integrity verified"
else
    error "Backup integrity check failed!"
    exit 1
fi

# Create backup metadata
METADATA_FILE="${BACKUP_PATH}.meta"
cat > "$METADATA_FILE" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "filename": "$(basename $BACKUP_PATH)",
  "size": "$(stat -f%z "$BACKUP_PATH" 2>/dev/null || stat -c%s "$BACKUP_PATH")",
  "database_url": "$(echo $DATABASE_URL | sed 's/:[^:@]*@/:***@/')",
  "retention_days": ${RETENTION_DAYS},
  "uploaded_to_r2": $([ -n "$R2_ACCESS_KEY_ID" ] && echo "true" || echo "false")
}
EOF

log "✅ Backup metadata created"

# Send notification (if webhook configured)
if [ -n "$BACKUP_WEBHOOK_URL" ]; then
    log "Sending backup notification..."
    curl -X POST "$BACKUP_WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "{
            \"text\": \"✅ Database backup completed successfully\",
            \"backup_file\": \"$(basename $BACKUP_PATH)\",
            \"size\": \"$COMPRESSED_SIZE\",
            \"timestamp\": \"$(date -Iseconds)\"
        }" \
        --silent --output /dev/null || warn "Failed to send notification"
fi

log "🎉 Backup process completed successfully!"
log "Backup location: $BACKUP_PATH"

exit 0
