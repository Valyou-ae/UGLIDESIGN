import { drizzle } from 'drizzle-orm/node-postgres';
import pg from "pg";
import * as schema from "@shared/schema";
import { logger } from './logger';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Connection pool for session store and direct queries
// Optimized for Railway PostgreSQL - SSL handled by DATABASE_URL query params
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.DB_POOL_MAX || '20'),
  min: parseInt(process.env.DB_POOL_MIN || '2'),
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Use standard pg driver for Railway PostgreSQL (not Neon serverless)
export const db = drizzle(pool, { schema });

// Handle pool errors
pool.on("error", (err) => {
  logger.error("Unexpected error on idle database client", err, { source: 'database' });
});
