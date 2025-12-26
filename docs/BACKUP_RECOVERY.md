# Database Backup & Recovery Guide

This document provides comprehensive instructions for backing up and restoring the UGLIDESIGN database.

## Overview

The backup system consists of:
- **Automated backups** via GitHub Actions (every 6 hours)
- **Manual backup script** for on-demand backups
- **Restore script** for disaster recovery
- **R2 cloud storage** for off-site backup storage
- **30-day retention** policy

---

## Automated Backups

### Schedule

Backups run automatically:
- **Every 6 hours** (00:00, 06:00, 12:00, 18:00 UTC)
- **On-demand** via GitHub Actions workflow dispatch

### Configuration

Automated backups are configured in `.github/workflows/database-backup.yml`:

```yaml
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours
```

### Monitoring

Check backup status:
1. Go to GitHub Actions → "Database Backup" workflow
2. View recent runs
3. Download backup artifacts if needed

---

## Manual Backup

### Quick Start

```bash
# Set database URL
export DATABASE_URL="postgresql://user:pass@host:5432/db"

# Run backup
./scripts/backup-database.sh
```

### Configuration Options

```bash
# Custom backup directory
export BACKUP_DIR="/path/to/backups"

# Custom retention period (days)
export RETENTION_DAYS=60

# Enable R2 upload
export R2_ACCOUNT_ID="your-account-id"
export R2_ACCESS_KEY_ID="your-access-key"
export R2_SECRET_ACCESS_KEY="your-secret-key"
export S3_BUCKET="uglidesign-backups"

# Enable notifications
export BACKUP_WEBHOOK_URL="https://hooks.slack.com/services/..."

# Run backup
./scripts/backup-database.sh
```

### Backup Process

The script performs these steps:

1. ✅ Validates environment variables
2. ✅ Creates backup directory
3. ✅ Runs `pg_dump` to export database
4. ✅ Compresses backup with gzip
5. ✅ Uploads to R2 (if configured)
6. ✅ Cleans up old backups
7. ✅ Verifies backup integrity
8. ✅ Creates metadata file
9. ✅ Sends notification (if configured)

### Backup Location

**Local backups:**
```
/home/ubuntu/backups/
├── uglidesign_backup_20241226_120000.sql.gz
├── uglidesign_backup_20241226_120000.sql.gz.meta
├── uglidesign_backup_20241226_180000.sql.gz
└── uglidesign_backup_20241226_180000.sql.gz.meta
```

**R2 backups:**
```
s3://uglidesign-backups/database-backups/
├── uglidesign_backup_20241226_120000.sql.gz
├── uglidesign_backup_20241226_180000.sql.gz
└── ...
```

---

## Database Restore

### ⚠️ WARNING

**Restoring a backup will OVERWRITE the target database!**
- All existing data will be LOST
- Always create a pre-restore backup
- Test restore in staging environment first

### Quick Restore

```bash
# Set target database URL
export DATABASE_URL="postgresql://user:pass@host:5432/db"

# Restore from backup
./scripts/restore-database.sh /path/to/backup.sql.gz
```

### Restore Process

The script performs these steps:

1. ✅ Validates backup file
2. ✅ Confirms restore operation
3. ✅ Creates pre-restore backup
4. ✅ Decompresses backup (if needed)
5. ✅ Verifies backup format
6. ✅ Drops existing connections
7. ✅ Restores database
8. ✅ Verifies restore
9. ✅ Cleans up temporary files

### Restore from R2

```bash
# Download backup from R2
aws s3 cp s3://uglidesign-backups/database-backups/uglidesign_backup_20241226_120000.sql.gz . \
  --endpoint-url "https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com" \
  --region auto

# Restore
./scripts/restore-database.sh uglidesign_backup_20241226_120000.sql.gz
```

### Restore to Different Database

```bash
# Restore to staging database
./scripts/restore-database.sh backup.sql.gz "postgresql://user:pass@staging:5432/db"
```

---

## Disaster Recovery Scenarios

### Scenario 1: Accidental Data Deletion

**Recovery Time: 5-10 minutes**

```bash
# 1. Find latest backup
ls -lt /home/ubuntu/backups/ | head -5

# 2. Restore from backup
./scripts/restore-database.sh /home/ubuntu/backups/uglidesign_backup_LATEST.sql.gz

# 3. Verify data
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

### Scenario 2: Database Corruption

**Recovery Time: 10-15 minutes**

```bash
# 1. Stop application
# (Prevent new connections)

# 2. Download latest backup from R2
aws s3 cp s3://uglidesign-backups/database-backups/uglidesign_backup_LATEST.sql.gz . \
  --endpoint-url "https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"

# 3. Restore database
./scripts/restore-database.sh uglidesign_backup_LATEST.sql.gz

# 4. Verify restore
npm run db:push  # Run migrations if needed

# 5. Restart application
```

### Scenario 3: Complete Data Loss

**Recovery Time: 15-30 minutes**

```bash
# 1. Create new database
createdb uglidesign_new

# 2. Download latest backup from R2
aws s3 cp s3://uglidesign-backups/database-backups/uglidesign_backup_LATEST.sql.gz .

# 3. Restore to new database
export DATABASE_URL="postgresql://user:pass@host:5432/uglidesign_new"
./scripts/restore-database.sh uglidesign_backup_LATEST.sql.gz

# 4. Run migrations
npm run db:push

# 5. Verify data integrity
npm run test:integration

# 6. Update application to use new database
# 7. Restart application
```

### Scenario 4: Point-in-Time Recovery

**Recovery Time: 20-40 minutes**

```bash
# 1. List available backups
aws s3 ls s3://uglidesign-backups/database-backups/ \
  --endpoint-url "https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"

# 2. Download backup from specific time
aws s3 cp s3://uglidesign-backups/database-backups/uglidesign_backup_20241226_120000.sql.gz .

# 3. Restore to staging for verification
./scripts/restore-database.sh backup.sql.gz "postgresql://staging:5432/db"

# 4. Verify data in staging
# 5. If correct, restore to production
```

---

## Backup Verification

### Manual Verification

```bash
# 1. Decompress backup
gunzip -c backup.sql.gz > backup.sql

# 2. Check file size
ls -lh backup.sql

# 3. Verify format
head -n 10 backup.sql

# 4. Count tables
grep "CREATE TABLE" backup.sql | wc -l

# 5. Test restore in test database
createdb test_restore
psql test_restore < backup.sql
psql test_restore -c "SELECT COUNT(*) FROM users;"
dropdb test_restore
```

### Automated Verification

```bash
# Run backup with verification
./scripts/backup-database.sh

# Check logs for:
# ✅ Backup created successfully
# ✅ Backup compressed successfully
# ✅ Backup integrity verified
```

---

## Backup Monitoring

### Check Backup Status

```bash
# List recent backups
ls -lht /home/ubuntu/backups/ | head -10

# Check backup sizes
du -sh /home/ubuntu/backups/*

# Count backups
ls /home/ubuntu/backups/*.gz | wc -l

# Check oldest backup
ls -lt /home/ubuntu/backups/ | tail -1
```

### Monitor R2 Storage

```bash
# List R2 backups
aws s3 ls s3://uglidesign-backups/database-backups/ \
  --endpoint-url "https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com" \
  --human-readable

# Check total size
aws s3 ls s3://uglidesign-backups/database-backups/ \
  --endpoint-url "https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com" \
  --recursive --summarize
```

### Alerts

Set up alerts for:
- ❌ Backup failures (via GitHub Actions)
- ❌ Backup size anomalies (too small/large)
- ❌ Missing backups (> 6 hours old)
- ❌ R2 upload failures

---

## Best Practices

### Backup Strategy

1. **3-2-1 Rule**
   - 3 copies of data
   - 2 different storage types (local + R2)
   - 1 off-site copy (R2)

2. **Regular Testing**
   - Test restore monthly
   - Verify backup integrity weekly
   - Document recovery procedures

3. **Retention Policy**
   - Keep 30 days of daily backups
   - Keep 12 months of monthly backups
   - Archive yearly backups indefinitely

### Security

1. **Encrypt backups** (R2 encryption enabled)
2. **Secure credentials** (GitHub Secrets)
3. **Audit access** (R2 access logs)
4. **Test restores** (staging environment)

### Performance

1. **Schedule backups** during low-traffic hours
2. **Monitor backup duration** (should be < 5 minutes)
3. **Optimize backup size** (exclude unnecessary data)
4. **Use compression** (gzip reduces size by 80%)

---

## Troubleshooting

### Backup Fails

**Error: "DATABASE_URL not set"**
```bash
export DATABASE_URL="postgresql://..."
./scripts/backup-database.sh
```

**Error: "pg_dump: command not found"**
```bash
# Install PostgreSQL client
sudo apt-get install postgresql-client
```

**Error: "Permission denied"**
```bash
chmod +x ./scripts/backup-database.sh
```

### Restore Fails

**Error: "Backup file not found"**
```bash
# Check file path
ls -l /path/to/backup.sql.gz

# Use absolute path
./scripts/restore-database.sh /absolute/path/to/backup.sql.gz
```

**Error: "Database is being accessed by other users"**
```bash
# Drop connections
psql $DATABASE_URL -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = current_database();"
```

**Error: "Invalid backup format"**
```bash
# Verify backup file
gunzip -t backup.sql.gz
head -n 1 backup.sql
```

---

## Maintenance

### Weekly Tasks

- [ ] Verify latest backup exists
- [ ] Check backup sizes are reasonable
- [ ] Review backup logs for errors

### Monthly Tasks

- [ ] Test restore in staging environment
- [ ] Verify R2 backups are accessible
- [ ] Review retention policy
- [ ] Update documentation

### Quarterly Tasks

- [ ] Full disaster recovery drill
- [ ] Review and update recovery procedures
- [ ] Audit backup access logs
- [ ] Optimize backup strategy

---

## Support

For backup/restore issues:
1. Check GitHub Actions logs
2. Review this documentation
3. Test in staging environment
4. Contact DevOps team

**Emergency Contact:** [Your contact info]
