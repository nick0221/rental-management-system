---
name: database-optimizer
description: 'Optimizes database queries and schema design for SQLite in the Rental Management System. Use when investigating slow queries, designing indexes, writing complex Eloquent queries, or optimizing database performance. Invoke for index design, query rewrite, N+1 prevention, and SQLite-specific performance considerations. Distinct from general Laravel query patterns covered in laravel-best-practices.'
license: MIT
metadata:
  author: adapted-from-jeffallan/claude-skills
  domain: infrastructure
  triggers: database optimization, slow query, query performance, index optimization, N+1, SQLite performance, query analysis
  role: specialist
  scope: optimization
  output-format: analysis-and-code
  related-skills: laravel-best-practices, architecture-designer
---

# Database Optimizer

Senior database optimizer with expertise in SQLite performance tuning, query optimization, and schema design for Laravel applications.

## When to Use This Skill

- Analyzing slow database queries
- Designing index strategies for SQLite
- Optimizing Eloquent queries (N+1, unnecessary loads)
- Tuning schema design for SQLite limitations
- Monitoring query performance in development

## Core Workflow

1. **Identify slow queries** — Enable Laravel query log or use `DB::listen()`
2. **Analyze** — Check for N+1, missing indexes, unnecessary columns
3. **Design solution** — Apply indexes, eager loading, query restructuring
4. **Implement** — Make changes incrementally
5. **Validate** — Re-run queries and compare performance

## SQLite-Specific Considerations

### Enable Query Logging
```php
// In AppServiceProvider or tinker
DB::listen(function ($query) {
    logger($query->sql, $query->bindings);
});
```

### Check Query Count
```php
// Track queries in a single request
DB::enableQueryLog();
// ... your code ...
$queries = DB::getQueryLog();
count($queries);
```

### Common Patterns for This Project

| Pattern | Solution | Why |
|---------|----------|-----|
| N+1 on property list | `Property::with('units')->get()` | Prevents repeated unit queries |
| Dashboard stats | `withCount('leases', 'units')` | Avoids loading entire collections just to count |
| Lease payments | `$lease->payments()->where('status', 'paid')->sum('amount')` | Aggregates in DB, not PHP |
| Active leases | `->where('status', LeaseStatus::Active)->whereDate('end_date', '>=', now())` | Two filtered conditions — index needed |
| Search properties | `->where('name', 'like', "%{$search}%")->orWhere('city', 'like', "%{$search}%")` | SQLite LIKE without index = full scan |

### Index Recommendations for This Project

```php
// Add to relevant migrations
$table->index('status');           // properties, units, leases, payments, maintenance_requests
$table->index('owner_id');         // properties
$table->index('property_id');      // units, leases, maintenance_requests
$table->index('unit_id');          // leases, maintenance_requests
$table->index('renter_id');        // leases
$table->index('user_id');          // payments
$table->index('due_date');         // payments (for overdue queries)
$table->index('lease_id');         // payments
$table->index(['status', 'end_date']);  // active leases query
$table->index(['status', 'due_date']);  // overdue payments query
```

### Performance Tips for SQLite

| Tip | Detail |
|-----|--------|
| WAL mode | Enable via `PRAGMA journal_mode=WAL;` for better concurrent reads |
| Foreign keys | `PRAGMA foreign_keys=ON;` (already enabled by Laravel) |
| Batch inserts | Use `insert()` for bulk data, not individual `create()` calls |
| Count efficiently | Use `Model::count()` or `->count()` not `->get()->count()` |
| Chunk large sets | Use `->chunk(100)` for processing large result sets |
| Avoid `->get()` on large tables | Use `->cursor()` or `->lazy()` for memory efficiency |

## Constraints

### MUST DO
- Enable `Model::preventLazyLoading()` in development to catch N+1
- Use `withCount()` instead of loading relations just to count
- Add database indexes for columns used in `WHERE`, `ORDER BY`, `JOIN`
- Use `chunk()` or `cursor()` for large datasets
- Profile queries with `DB::getQueryLog()` before optimizing

### MUST NOT DO
- Apply optimizations without measuring first
- Add redundant or unused indexes
- Make multiple changes simultaneously (can't attribute impact)
- Use `SELECT *` (list specific columns with `->select()` or `->pluck()`)

[Documentation](https://github.com/Jeffallan/claude-skills/skills/infrastructure/database-optimizer/)
