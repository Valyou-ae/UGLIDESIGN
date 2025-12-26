/**
 * Database test helpers
 */

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@/shared/schema';

let testPool: Pool | null = null;
let testDb: NodePgDatabase<typeof schema> | null = null;

/**
 * Setup test database connection
 */
export async function setupTestDatabase() {
  const connectionString = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('TEST_DATABASE_URL or DATABASE_URL must be set for integration tests');
  }

  testPool = new Pool({
    connectionString,
    max: 5, // Limit connections for tests
  });

  testDb = drizzle(testPool, { schema });

  return { db: testDb, pool: testPool };
}

/**
 * Clean up test database
 */
export async function cleanupTestDatabase() {
  if (!testPool || !testDb) {
    return;
  }

  try {
    // Truncate tables in reverse dependency order
    await testPool.query('TRUNCATE TABLE generated_images CASCADE');
    await testPool.query('TRUNCATE TABLE image_folders CASCADE');
    await testPool.query('TRUNCATE TABLE users CASCADE');
    await testPool.query('TRUNCATE TABLE stripe_customers CASCADE');
    await testPool.query('TRUNCATE TABLE stripe_subscriptions CASCADE');
  } catch (error) {
    console.error('Error cleaning up test database:', error);
  }
}

/**
 * Close test database connection
 */
export async function closeTestDatabase() {
  if (testPool) {
    await testPool.end();
    testPool = null;
    testDb = null;
  }
}

/**
 * Create a test user
 */
export async function createTestUser(overrides: Partial<typeof schema.users.$inferInsert> = {}) {
  if (!testDb) {
    throw new Error('Test database not initialized');
  }

  const defaultUser = {
    googleId: `test-google-id-${Date.now()}`,
    email: `test-${Date.now()}@example.com`,
    name: 'Test User',
    picture: 'https://example.com/avatar.jpg',
    credits: 100,
    ...overrides,
  };

  const [user] = await testDb.insert(schema.users).values(defaultUser).returning();
  return user;
}

/**
 * Create a test image
 */
export async function createTestImage(
  userId: number,
  overrides: Partial<typeof schema.generatedImages.$inferInsert> = {}
) {
  if (!testDb) {
    throw new Error('Test database not initialized');
  }

  const defaultImage = {
    userId,
    prompt: 'Test image prompt',
    imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    aspectRatio: '1:1',
    style: 'realistic',
    storageType: 'base64',
    ...overrides,
  };

  const [image] = await testDb.insert(schema.generatedImages).values(defaultImage).returning();
  return image;
}

/**
 * Create a test folder
 */
export async function createTestFolder(
  userId: number,
  overrides: Partial<typeof schema.imageFolders.$inferInsert> = {}
) {
  if (!testDb) {
    throw new Error('Test database not initialized');
  }

  const defaultFolder = {
    userId,
    name: `Test Folder ${Date.now()}`,
    ...overrides,
  };

  const [folder] = await testDb.insert(schema.imageFolders).values(defaultFolder).returning();
  return folder;
}

/**
 * Get test database instance
 */
export function getTestDb() {
  if (!testDb) {
    throw new Error('Test database not initialized. Call setupTestDatabase() first.');
  }
  return testDb;
}

/**
 * Get test pool instance
 */
export function getTestPool() {
  if (!testPool) {
    throw new Error('Test pool not initialized. Call setupTestDatabase() first.');
  }
  return testPool;
}
