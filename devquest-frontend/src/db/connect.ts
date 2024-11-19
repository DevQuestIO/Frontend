// src/db/connect.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Set to true in production with proper SSL cert
  }
});

export default pool;