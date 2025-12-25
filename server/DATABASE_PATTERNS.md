# Database Access Patterns

This document explains the database access patterns used in the UGLI application.

## Overview

The application uses two database access methods:

1. **Drizzle ORM** (`db`) - Type-safe query builder
2. **PostgreSQL Pool** (`pool`) - Direct SQL queries

Both are valid approaches. Choose based on the use case.

## When to Use Drizzle ORM

Use Drizzle ORM (`db.select()`, `db.insert()`, etc.) for:

- Simple CRUD operations
- Type-safe queries where TypeScript inference is valuable
- Standard queries that map directly to schema types
- New code where possible

```typescript
// Example: Simple select
const [user] = await db.select().from(users).where(eq(users.id, userId));

// Example: Insert with returning
const [image] = await db.insert(generatedImages).values(data).returning();
```

## When to Use Pool Queries

Use direct pool queries (`pool.query()`) for:

- Complex queries with multiple JOINs
- Queries requiring raw SQL features (CTEs, window functions)
- Performance-critical queries where you need full control
- Operations requiring database transactions
- Queries with complex WHERE clauses or subqueries

```typescript
// Example: Complex query with pagination
const result = await pool.query(
  `SELECT * FROM generated_images WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
  [userId, limit, offset]
);
```

## Transactions

For multi-step operations that must be atomic, use the `withTransaction` helper:

```typescript
// Example: Atomic operation
const result = await storage.withTransaction(async (client) => {
  await client.query('UPDATE ...', [params]);
  await client.query('INSERT ...', [params]);
  return someValue;
});
```

The transaction helper:
- Automatically calls `BEGIN` before your function
- Calls `COMMIT` on success
- Calls `ROLLBACK` on any error
- Releases the connection back to the pool

## Connection Management

- **Drizzle** uses Neon HTTP driver (serverless, stateless)
- **Pool** maintains persistent connections (required for transactions)

Both are configured in `server/db.ts`.

## Best Practices

1. **Prefer Drizzle** for new simple queries
2. **Use pool** when you need transactions or complex SQL
3. **Always parameterize** queries to prevent SQL injection
4. **Use transactions** for multi-step operations that must be atomic
5. **Handle errors** appropriately - transactions auto-rollback on error

## Migration Path

When adding new features:
1. Start with Drizzle ORM
2. If the query becomes too complex, switch to pool
3. If multiple operations must be atomic, use `withTransaction`
