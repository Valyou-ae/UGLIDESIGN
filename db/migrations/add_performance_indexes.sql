-- Performance indexes for UGLI.design production readiness
-- These indexes optimize the most common query patterns

-- User queries: frequently search by email and username
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_affiliate_code ON users(affiliate_code);

-- Image queries: frequently filter by user, public status, and created_at for sorting
CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id);
CREATE INDEX IF NOT EXISTS idx_images_is_public ON images(is_public);
CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_images_user_public ON images(user_id, is_public);
CREATE INDEX IF NOT EXISTS idx_images_public_created ON images(is_public, created_at DESC) WHERE is_public = true;

-- Folder queries: frequently search by user and name
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_user_name ON folders(user_id, name);

-- Image folder relationship: frequently join on both columns
CREATE INDEX IF NOT EXISTS idx_image_folders_image_id ON image_folders(image_id);
CREATE INDEX IF NOT EXISTS idx_image_folders_folder_id ON image_folders(folder_id);

-- Likes queries: frequently check if user liked an image
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_image_id ON likes(image_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_image ON likes(user_id, image_id);

-- Credit transactions: frequently query by user and created_at for history
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_created ON credit_transactions(user_id, created_at DESC);

-- Subscriptions: frequently query by user and status
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Payments: frequently query by user and subscription
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_id ON payments(stripe_payment_id);

-- Notifications: frequently query by user and read status
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);

-- Referrals: frequently query by referrer and referee
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee_id ON referrals(referee_id);

-- Analyze tables to update statistics for query planner
ANALYZE users;
ANALYZE images;
ANALYZE folders;
ANALYZE image_folders;
ANALYZE likes;
ANALYZE credit_transactions;
ANALYZE subscriptions;
ANALYZE payments;
ANALYZE notifications;
ANALYZE referrals;
