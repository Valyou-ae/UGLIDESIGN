# R2 Migration Testing Checklist

## Pre-Deployment Testing

### 1. Database Migration
- [ ] Run database migration: `20251226105844_add_r2_storage_fields.sql`
- [ ] Verify new columns exist:
  ```sql
  SELECT column_name, data_type, column_default 
  FROM information_schema.columns 
  WHERE table_name = 'generated_images' 
  AND column_name IN ('storage_type', 'r2_key');
  ```
- [ ] Verify index created:
  ```sql
  SELECT indexname FROM pg_indexes 
  WHERE tablename = 'generated_images' 
  AND indexname = 'idx_generated_images_storage_type';
  ```

### 2. R2 Configuration
- [ ] Verify R2 environment variables are set:
  - `R2_ACCOUNT_ID`
  - `R2_ACCESS_KEY_ID`
  - `R2_SECRET_ACCESS_KEY`
  - `R2_BUCKET_NAME`
- [ ] Test R2 connection on server startup (check logs for "R2 object storage initialized")
- [ ] Verify bucket exists and is accessible via Cloudflare dashboard

### 3. Image Upload (New Images)
- [ ] **Test 1: Create new image (authenticated user)**
  - Generate a new image
  - Verify image is uploaded to R2 (check R2 dashboard)
  - Verify database record has:
    - `storage_type = 'r2'`
    - `r2_key` is populated
    - `image_url` is R2 URL (not base64)
  - Verify image displays correctly in UI

- [ ] **Test 2: Create new image (guest user)**
  - Generate image as guest
  - Verify R2 upload
  - Verify image displays correctly

- [ ] **Test 3: Create multiple images in quick succession**
  - Generate 5 images rapidly
  - Verify all are uploaded to R2
  - Verify no race conditions or errors

### 4. Image Retrieval (Existing Base64 Images)
- [ ] **Test 4: View existing base64 images**
  - Navigate to My Creations
  - Verify old base64 images still display correctly
  - Check browser network tab: should use `/api/images/:id/image` endpoint
  - Verify no console errors

- [ ] **Test 5: Mix of base64 and R2 images**
  - Create new R2 image
  - View gallery with both old (base64) and new (R2) images
  - Verify both types display correctly

### 5. Image Deletion
- [ ] **Test 6: Delete R2 image**
  - Delete an image stored in R2
  - Verify image is deleted from database
  - Verify image is deleted from R2 (check R2 dashboard)
  - Verify no errors in logs

- [ ] **Test 7: Delete base64 image**
  - Delete an old base64 image
  - Verify image is deleted from database
  - Verify no R2 deletion attempted (check logs)

### 6. Migration Script
- [ ] **Test 8: Dry run migration**
  ```bash
  npm run migrate:images -- --dry-run --limit 10
  ```
  - Verify script identifies base64 images
  - Verify no changes are made
  - Check output statistics

- [ ] **Test 9: Limited migration**
  ```bash
  npm run migrate:images -- --limit 5 --batch-size 2
  ```
  - Verify 5 images are migrated
  - Verify database updated correctly
  - Verify images uploaded to R2
  - Verify images still display correctly

- [ ] **Test 10: Full migration (production)**
  ```bash
  npm run migrate:images -- --batch-size 10
  ```
  - Monitor logs for errors
  - Verify all base64 images migrated
  - Check final statistics
  - Verify database size reduction

### 7. Error Handling
- [ ] **Test 11: R2 unavailable**
  - Temporarily disable R2 (invalid credentials)
  - Create new image
  - Verify fallback to base64 storage
  - Verify warning logged
  - Restore R2 credentials

- [ ] **Test 12: R2 upload failure**
  - Simulate R2 error (e.g., network issue)
  - Verify graceful fallback to base64
  - Verify user can still create images

### 8. Performance Testing
- [ ] **Test 13: Image load time**
  - Measure page load time with base64 images
  - Measure page load time with R2 images
  - Verify R2 images load faster (especially on slow connections)

- [ ] **Test 14: Database size**
  - Check database size before migration
  - Run full migration
  - Check database size after migration
  - Verify significant reduction (should be 90%+ for images)

### 9. Gallery and Public Images
- [ ] **Test 15: Public gallery**
  - Create public R2 image
  - Verify appears in Discover gallery
  - Verify image URL is correct in gallery
  - Verify image displays correctly

- [ ] **Test 16: Share image**
  - Share an R2 image
  - Open share link in incognito window
  - Verify image displays correctly

### 10. Edge Cases
- [ ] **Test 17: Very large image**
  - Upload large image (>5MB base64)
  - Verify R2 upload succeeds
  - Verify no timeout errors

- [ ] **Test 18: Concurrent uploads**
  - Multiple users uploading simultaneously
  - Verify no conflicts or race conditions

- [ ] **Test 19: Image editing**
  - Edit an R2 image
  - Verify new version is uploaded to R2
  - Verify parent-child relationship maintained

## Post-Deployment Monitoring

### First 24 Hours
- [ ] Monitor error logs for R2-related errors
- [ ] Check R2 usage metrics (storage, requests, bandwidth)
- [ ] Monitor database size (should decrease as migration progresses)
- [ ] Check user reports for image display issues

### First Week
- [ ] Verify all new images are R2-stored
- [ ] Monitor R2 costs (should be minimal with zero egress fees)
- [ ] Check for any base64 images still being created (indicates fallback)
- [ ] Verify migration script completed successfully

## Rollback Plan

If critical issues occur:

1. **Immediate rollback (code only)**:
   ```bash
   git revert <commit-hash>
   ```
   - Old base64 images will continue to work
   - New R2 images will be inaccessible until code is restored

2. **Full rollback (with data)**:
   ```sql
   -- Revert storage_type for all images
   UPDATE generated_images SET storage_type = 'base64' WHERE storage_type = 'r2';
   ```
   - Note: R2 images will not display (URLs are invalid without R2 access)
   - Only use if R2 is permanently unavailable

3. **Partial rollback (disable R2 for new images)**:
   - Remove R2 environment variables
   - Server will fall back to base64 for new images
   - Existing R2 images will still work

## Success Criteria

- ✅ All new images uploaded to R2
- ✅ Existing base64 images still display correctly
- ✅ Migration script completes without errors
- ✅ Database size reduced by 80%+ (after full migration)
- ✅ Image load times improved
- ✅ No user-facing errors or broken images
- ✅ R2 costs within budget (<$1/month for typical usage)

## Known Limitations

1. **R2 Public Access**: Bucket must have public access enabled for images to be viewable
2. **Migration Time**: Large databases may take hours to migrate (run during low-traffic period)
3. **Bandwidth**: Initial migration uploads all images to R2 (monitor bandwidth)
4. **Rollback**: Reverting R2 images to base64 is not possible (one-way migration)

## Support Contacts

- **R2 Issues**: Cloudflare Support (support.cloudflare.com)
- **Database Issues**: Neon Support (neon.tech/docs/introduction/support)
- **Application Issues**: Development Team

---

**Last Updated**: December 26, 2024  
**Migration Status**: Ready for testing  
**Estimated Migration Time**: 2-4 hours (for 10,000 images)
