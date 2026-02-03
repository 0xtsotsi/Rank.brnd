import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * Database connection singleton
 * Creates a connection pool with PostgreSQL using postgres.js
 */

// Connection string from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create postgres.js client with connection pooling
// - max: 1 connection for serverless/edge environments
// - idle_timeout: 20 seconds to close idle connections
// - connect_timeout: 10 seconds to establish connection
const client = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create Drizzle ORM instance with the client
export const db = drizzle(client, { schema });

/**
 * Database connection types
 */
export type Database = typeof db;
export type Schema = typeof schema;

/**
 * Graceful shutdown helper
 * Closes the database connection pool
 */
export async function closeDatabaseConnection(): Promise<void> {
  await client.end();
}

/**
 * Health check function
 * Verifies the database connection is working
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}
