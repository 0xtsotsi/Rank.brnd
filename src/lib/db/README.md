# Database Setup with Drizzle ORM and PostgreSQL

This project uses **Drizzle ORM** with **PostgreSQL** for type-safe database operations.

## Prerequisites

- PostgreSQL 16+ installed and running
- Node.js 18+ and pnpm

## Environment Configuration

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the `DATABASE_URL` with your PostgreSQL connection string:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

## Database Schema

The schema is defined in `src/lib/db/schema.ts` and includes:

- `users` - User account information
- `sessions` - User session data for authentication

## Available Scripts

```bash
# Generate migration files from schema changes
npm run db:generate

# Apply migrations to the database
npm run db:migrate

# Push schema changes directly (development only)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio

# Introspect existing database
npm run db:pull
```

## Usage Example

```typescript
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Query users
const allUsers = await db.select().from(users);

// Find by ID
const user = await db.select().from(users).where(eq(users.id, 1));

// Insert user
await db.insert(users).values({
  email: 'user@example.com',
  name: 'John Doe',
});

// Update user
await db.update(users)
  .set({ name: 'Jane Doe' })
  .where(eq(users.id, 1));

// Delete user
await db.delete(users).where(eq(users.id, 1));
```

## Connection Pooling

The database connection uses `postgres.js` with optimized pooling for serverless environments:

- `max: 1` - Single connection for serverless/edge functions
- `idle_timeout: 20` - Close idle connections after 20 seconds
- `connect_timeout: 10` - Connection establishment timeout

## Migrations

### Creating Migrations

After modifying the schema, generate a migration:

```bash
npm run db:generate
```

This creates SQL migration files in the `drizzle/` directory.

### Applying Migrations

```bash
npm run db:migrate
```

### Programmatic Migrations

```typescript
import { runMigrations } from '@/lib/db/migrations';

await runMigrations();
```

## Utility Functions

Common database operations are available in `src/lib/db/utils.ts`:

```typescript
import {
  countRecords,
  batchInsert,
  upsert,
  getPaginationLimit,
} from '@/lib/db/utils';

// Count records
const count = await countRecords(users);

// Batch insert
await batchInsert(users, [
  { email: 'a@example.com', name: 'User A' },
  { email: 'b@example.com', name: 'User B' },
]);

// Upsert (insert or update)
await upsert(users, { email: 'x@example.com', name: 'User X' }, users.email);

// Pagination
const { limit, offset } = getPaginationLimit({ page: 2, pageSize: 10 });
```

## Health Check

```typescript
import { healthCheck } from '@/lib/db';

const isHealthy = await healthCheck();
```

## Type Safety

Drizzle ORM provides full TypeScript type inference:

```typescript
import type { User, NewUser } from '@/lib/db/schema';

const user: User = { id: 1, email: '...', ... };
const newUser: NewUser = { email: '...', name: '...' };
```
