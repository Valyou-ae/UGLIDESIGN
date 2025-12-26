#!/bin/bash

# Database Restore Script for UGLIDESIGN
# This script restores a PostgreSQL database from a backup file

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" >&2
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Check arguments
if [ $# -lt 1 ]; then
    error "Usage: $0 <backup_file> [target_database_url]"
    error "Example: $0 uglidesign_backup_20241226_120000.sql.gz"
    error "Example: $0 uglidesign_backup_20241226_120000.sql.gz postgresql://user:pass@host:5432/db"
    exit 1
fi

BACKUP_FILE="$1"
TARGET_DB="${2:-$DATABASE_URL}"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Check if target database URL is set
if [ -z "$TARGET_DB" ]; then
    error "Target database URL is not set"
    error "Set DATABASE_URL environment variable or provide as second argument"
    exit 1
fi

log "🔄 Database Restore Process"
log "Backup file: $BACKUP_FILE"
log "Target database: $(echo $TARGET_DB | sed 's/:[^:@]*@/:***@/')"

# Confirm restore
warn "⚠️  WARNING: This will OVERWRITE the target database!"
warn "⚠️  All existing data will be LOST!"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    log "Restore cancelled by user"
    exit 0
fi

# Create pre-restore backup
log "Creating pre-restore backup..."
PRERESTORE_BACKUP="/tmp/prerestore_backup_$(date +%Y%m%d_%H%M%S).sql.gz"
if pg_dump "$TARGET_DB" | gzip > "$PRERESTORE_BACKUP"; then
    log "✅ Pre-restore backup created: $PRERESTORE_BACKUP"
else
    warn "Failed to create pre-restore backup"
fi

# Decompress if needed
RESTORE_FILE="$BACKUP_FILE"
if [[ "$BACKUP_FILE" == *.gz ]]; then
    log "Decompressing backup..."
    RESTORE_FILE="${BACKUP_FILE%.gz}"
    if gunzip -c "$BACKUP_FILE" > "$RESTORE_FILE"; then
        log "✅ Backup decompressed"
    else
        error "Failed to decompress backup"
        exit 1
    fi
fi

# Verify backup file
log "Verifying backup file..."
if head -n 1 "$RESTORE_FILE" | grep -q "PostgreSQL database dump"; then
    log "✅ Backup file format verified"
else
    error "Invalid backup file format"
    exit 1
fi

# Drop existing connections
log "Dropping existing database connections..."
psql "$TARGET_DB" -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid();" || warn "Failed to drop connections"

# Restore database
log "Restoring database..."
if psql "$TARGET_DB" < "$RESTORE_FILE"; then
    log "✅ Database restored successfully"
else
    error "Failed to restore database"
    error "Pre-restore backup available at: $PRERESTORE_BACKUP"
    exit 1
fi

# Clean up decompressed file if we created it
if [[ "$BACKUP_FILE" == *.gz ]]; then
    rm -f "$RESTORE_FILE"
fi

# Verify restore
log "Verifying restore..."
TABLE_COUNT=$(psql "$TARGET_DB" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
log "Tables in database: $TABLE_COUNT"

if [ "$TABLE_COUNT" -gt 0 ]; then
    log "✅ Restore verification passed"
else
    warn "Database appears to be empty after restore"
fi

log "🎉 Database restore completed successfully!"
log "Pre-restore backup: $PRERESTORE_BACKUP"

exit 0
