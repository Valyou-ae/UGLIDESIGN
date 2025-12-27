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
// Optimized for Railway PostgreSQL with SSL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.DB_POOL_MAX || '20'),  // Reduced to 20 for Railway
  min: parseInt(process.env.DB_POOL_MIN || '2'),   // Keep 2 minimum connections warm
  idleTimeoutMillis: 60000,  // Increased to 60 seconds
  connectionTimeoutMillis: 10000,  // Reduced to 10 seconds for faster failure detection
  keepAlive: true,  // Enable TCP keep-alive
  keepAliveInitialDelayMillis: 10000,  // Send keep-alive after 10 seconds
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Handle pool errors
pool.on("error", (err) => {
  logger.error("Unexpected error on idle database client", err, { source: 'database' });
});
