import { eq, and, or, desc, asc, sql, type SQL } from 'drizzle-orm';
import { db } from './index';

/**
 * Utility functions for common database operations
 */

/**
 * Pagination helper
 * Returns LIMIT and OFFSET values for paginated queries
 */
export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export function getPaginationLimit({ page, pageSize }: PaginationOptions): {
  limit: number;
  offset: number;
} {
  return {
    limit: pageSize,
    offset: (page - 1) * pageSize,
  };
}

/**
 * Search query builder
 * Builds case-insensitive search conditions for text columns
 */
export function buildSearchCondition(
  columns: Array<SQL>,
  searchTerm: string
): SQL {
  const conditions = columns.map((column) =>
    sql`${column} ILIKE ${`%${searchTerm}%`}`
  );
  return or(...conditions)!;
}

/**
 * Upsert helper
 * Performs an insert or update operation based on a conflict column
 */
export async function upsert<T extends Record<string, any>>(
  table: any,
  data: T,
  conflictColumn: any
): Promise<void> {
  await db
    .insert(table)
    .values(data)
    .onConflictDoUpdate({
      target: conflictColumn,
      set: data as any,
    });
}

/**
 * Batch insert helper
 * Inserts multiple records in a single query
 */
export async function batchInsert<T extends Record<string, any>>(
  table: any,
  records: T[]
): Promise<void> {
  if (records.length === 0) return;
  await db.insert(table).values(records);
}

/**
 * Soft delete helper
 * Marks a record as deleted without actually removing it
 */
export async function softDelete(
  table: any,
  idColumn: any,
  id: number,
  deletedAtColumn = 'deleted_at'
): Promise<void> {
  await db
    .update(table)
    .set({ [deletedAtColumn]: new Date() } as any)
    .where(eq(idColumn, id));
}

/**
 * Count records helper
 * Returns the total count of records matching a condition
 */
export async function countRecords(
  table: any,
  condition?: SQL
): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(table)
    .where(condition);
  return result[0]?.count ?? 0;
}

/**
 * Exists helper
 * Checks if any record matches the given condition
 */
export async function exists(table: any, condition: SQL): Promise<boolean> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(table)
    .where(condition);
  return (result[0]?.count ?? 0) > 0;
}

/**
 * Re-exports for convenience
 */
export { db, eq, and, or, desc, asc, sql, type SQL };
export * from './schema';
export * from './index';
