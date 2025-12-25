#!/bin/bash

# Script to apply database migrations for production readiness
# Run this on the production server where PostgreSQL client is available

set -e

echo "Applying performance indexes migration..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is not set"
  exit 1
fi

# Apply the migration using node-postgres
node -e "
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const migrationFile = path.join(__dirname, '../db/migrations/add_performance_indexes.sql');
const sql = fs.readFileSync(migrationFile, 'utf8');

(async () => {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    console.log('Applying migration...');
    await client.query(sql);
    
    console.log('✓ Migration applied successfully');
    client.release();
    await pool.end();
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  }
})();
"

echo "✓ All migrations applied successfully"
