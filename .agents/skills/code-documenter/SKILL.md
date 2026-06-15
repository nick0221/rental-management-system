---
name: code-documenter
description: 'Generates and validates inline code documentation (PHPDoc, JSDoc), README sections, and API/route documentation for the Rental Management System. Use when adding docstrings to classes and methods, creating route documentation, documenting database schema decisions, or generating TypeScript type documentation. Complements laravel-best-practices style rules.'
license: MIT
metadata:
  author: adapted-from-jeffallan/claude-skills
  domain: quality
  triggers: documentation, docstrings, PHPDoc, JSDoc, comments, API docs, type documentation, README
  role: specialist
  scope: implementation
  output-format: code
  related-skills: laravel-best-practices, react-expert, api-designer
---

# Code Documenter

Documentation specialist for inline documentation, type definitions, and developer guides in the Rental Management System.

## When to Use This Skill

- Adding PHPDoc blocks to complex PHP methods
- Documenting TypeScript types and interfaces
- Creating route documentation for new features
- Writing seed/factory documentation
- Documenting architectural decisions

## Core Workflow

1. **Identify** — Find undocumented or under-documented code
2. **Format** — Apply consistent doc style matching existing code
3. **Document** — Add meaningful descriptions, not obvious ones
4. **Validate** — Ensure code examples are accurate

## PHPDoc Patterns

### Enum Documentation
```php
/**
 * Defines the user's role in the system.
 *
 * Controls access to features via CheckRole middleware and Policies.
 * Super-admin has full access, Owner manages properties, Renter views
 * their own lease and submits maintenance requests.
 */
enum UserRole: string
{
    case SuperAdmin = 'super_admin';
    case Owner = 'owner';
    case Renter = 'renter';
}
```

### Complex Method Documentation
```php
/**
 * Calculate the monthly revenue for a property.
 *
 * Sums the monthly_rent of all active leases on units belonging
 * to this property. Excludes expired and terminated leases.
 *
 * @param Property $property The property to calculate revenue for.
 * @return float The total monthly revenue.
 */
public function monthlyRevenue(Property $property): float
{
    return $property->leases()
        ->where('status', LeaseStatus::Active)
        ->sum('monthly_rent');
}
```

### Form Request / Complex Validation
```php
/**
 * @property-read string $name        Property name (max 255 chars)
 * @property-read string $type        Must be a valid PropertyType enum value
 * @property-read string $address     Street address (max 500 chars)
 * @property-read string|null $description Optional description (max 5000 chars)
 */
```

## TypeScript Type Documentation

```typescript
/**
 * Represents a rental property managed by an owner.
 *
 * @property id - Unique identifier
 * @property owner_id - Foreign key to the owning User
 * @property name - Display name of the property (e.g. "Sunset Apartments")
 * @property type - Category of property (apartment_building, house, etc.)
 * @property status - Current operational status
 */
export interface Property {
  id: number
  owner_id: number
  owner?: User
  name: string
  slug: string
  type: PropertyType
  status: PropertyStatus
  address: string
  city: string
  state: string
  postal_code: string
  units?: Unit[]
  created_at: string
}
```

## Constraints

### MUST DO
- Match existing doc style in the file (check siblings first)
- Document non-obvious parameters and return types
- Document enums with their purpose and usage
- Keep comments meaningful — don't restate the obvious

### MUST NOT DO
- Add docblocks to trivial getters/setters
- Write outdated or inaccurate documentation
- Duplicate information already clear from types
- Document internal implementation details in public API docs

[Documentation](https://github.com/Jeffallan/claude-skills/skills/quality/code-documenter/)
