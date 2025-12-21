import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import pg from "pg";
import * as schema from "@shared/schema";
import { logger } from './logger';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure Neon for better connection handling
neonConfig.fetchConnectionCache = true;

// Use Neon serverless driver for better cloud database connectivity
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Connection pool for session store and direct queries
// Optimized for Neon serverless database with cold start handling
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.DB_POOL_MAX || '10'),  // Reduced for serverless
  min: 0,  // Allow pool to shrink to 0 for serverless
  idleTimeoutMillis: 10000,  // Close idle connections quickly
  connectionTimeoutMillis: 60000,  // 60s timeout for cold starts
  ssl: { rejectUnauthorized: false },
  allowExitOnIdle: true,  // Allow process to exit if pool is idle
});

// Handle pool errors
pool.on("error", (err) => {
  logger.error("Unexpected error on idle database client", err, { source: 'database' });
});
