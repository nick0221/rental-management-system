---
name: api-designer
description: 'Use when designing API endpoints (Inertia routes or future REST API), creating form request validation patterns, or planning route organization for the Rental Management System. Invoke for resource modeling, route naming conventions, request/response schema design, and error handling standards. This project uses Inertia for all data flow — design routes as Inertia render endpoints, not JSON REST unless building a separate API.'
license: MIT
metadata:
  author: adapted-from-jeffallan/claude-skills
  domain: api-architecture
  triggers: API design, route design, form request, validation, resource modeling, endpoint design, Inertia routes
  role: architect
  scope: design
  output-format: specification
  related-skills: architecture-designer, fullstack-guardian, laravel-best-practices
---

# API Designer

Senior API architect designing Inertia-driven routes and form request patterns for the Rental Management System.

## When to Use This Skill

- Designing new route groups (admin, owner, renter)
- Creating Form Request validation classes
- Structuring Inertia page props
- Planning error handling and flash messages
- Modeling resource relationships for Inertia responses
- Designing future REST API endpoints (if needed)

## Core Workflow

1. **Identify resource** — Determine the entity and operations needed
2. **Design routes** — Define URI pattern, HTTP method, controller action
3. **Design validation** — Create Form Request with rules and authorization
4. **Design Inertia props** — Shape the data returned to the React page
5. **Document** — Add route comments or inline docs for complex endpoints

## Route Design Patterns for This Project

### Resource Naming Convention

| Pattern | Example | Notes |
|---------|---------|-------|
| List | `GET /owner/properties` | Paginated, searchable |
| Create | `GET /owner/properties/create` | Renders Inertia form page |
| Store | `POST /owner/properties` | Form submission |
| Show | `GET /owner/properties/{property}` | Detail view |
| Edit | `GET /owner/properties/{property}/edit` | Renders Inertia form page |
| Update | `PATCH /owner/properties/{property}` | Form submission |
| Delete | `DELETE /owner/properties/{property}` | With confirmation |

### Form Request Pattern

```php
class PropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Defer to Policy
        return match ($this->method()) {
            'POST' => $this->user()->can('create', Property::class),
            'PATCH', 'PUT' => $this->user()->can('update', $this->route('property')),
            default => false,
        };
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', Rule::enum(PropertyType::class)],
            'address' => ['required', 'string', 'max:500'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'max:255'],
            'postal_code' => ['required', 'string', 'max:20'],
            'description' => ['nullable', 'string', 'max:5000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The property name is required.',
            'name.max' => 'Property name must not exceed 255 characters.',
        ];
    }
}
```

### Inertia Props Shape

```php
// Controller
public function show(Property $property): Response
{
    $this->authorize('view', $property);

    return inertia('owner/properties/show', [
        'property' => $property->load(['units' => fn ($q) => $q->with('currentLease')]),
        'stats' => [
            'total_units' => $property->units()->count(),
            'occupied_units' => $property->units()->where('status', UnitStatus::Occupied)->count(),
            'active_leases' => $property->leases()->where('status', LeaseStatus::Active)->count(),
            'monthly_revenue' => $property->leases()
                ->where('status', LeaseStatus::Active)
                ->sum('monthly_rent'),
        ],
    ]);
}
```

```typescript
// Frontend type
interface PropertyShowPageProps {
  property: Property & {
    units: (Unit & { current_lease?: Lease })[]
  }
  stats: {
    total_units: number
    occupied_units: number
    active_leases: number
    monthly_revenue: number
  }
}
```

### Error & Flash Message Pattern

```php
// Controller
return redirect()->route('owner.properties.show', $property)
    ->with('success', 'Property created successfully.');

// On validation failure — handled automatically by Inertia
// Errors available as $errors prop in React page
```

```tsx
// React page — display flash/toast
import { usePage } from '@inertiajs/react'
import { toast } from 'sonner'

export default function Show() {
  const { success } = usePage().props

  useEffect(() => {
    if (success) toast.success(success)
  }, [success])

  // ...
}
```

## Constraints

### MUST DO
- Group routes by role prefix (admin, owner, renter) with corresponding middleware
- Use Form Request classes for all POST/PATCH/PUT validation
- Delegate authorization to Policies (not Form Request itself)
- Shape Inertia props to match frontend TypeScript types
- Use flash messages for success/error feedback

### MUST NOT DO
- Validate in controllers — use Form Requests
- Expose sensitive fields in Inertia responses
- Skip authorization on any write operation
- Use hardcoded URLs — use named routes + Wayfinder

## Route Map Template (for new features)

```
Feature: [name]
URI prefix: /{role}/{resource}
Middleware: [auth, verified, role:...]

[ ] GET    /              → Controller@index   → Inertia list page
[ ] GET    /create        → Controller@create  → Inertia form page
[ ] POST   /              → Controller@store   → redirect back
[ ] GET    /{id}          → Controller@show    → Inertia detail page
[ ] GET    /{id}/edit     → Controller@edit    → Inertia form page
[ ] PATCH  /{id}          → Controller@update  → redirect back
[ ] DELETE /{id}          → Controller@destroy → redirect to index
```

[Documentation](https://github.com/Jeffallan/claude-skills/skills/api-architecture/api-designer/)
