import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './index';

/**
 * Run database migrations
 * This function reads migration files from the drizzle directory
 * and applies them to the database in order
 */
export async function runMigrations(): Promise<void> {
  try {
    console.log('Running database migrations...');
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

/**
 * Run migrations from a custom folder path
 */
export async function runMigrationsFromFolder(
  folder: string
): Promise<void> {
  try {
    console.log(`Running database migrations from ${folder}...`);
    await migrate(db, { migrationsFolder: folder });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}
