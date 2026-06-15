---
name: fullstack-guardian
description: 'Builds security-focused full-stack features by integrating frontend and backend components with layered security. Covers the complete stack from database to UI — enforcing auth, input validation, output encoding, and parameterized queries across all layers. Use when implementing features across frontend and backend, connecting Inertia pages to Laravel controllers, creating CRUD flows with forms, or implementing end-to-end data flows from SQLite to React UI. Distinct from frontend-only or backend-only skills.'
license: MIT
metadata:
  author: adapted-from-jeffallan/claude-skills
  domain: security
  triggers: fullstack, implement feature, build feature, create CRUD, frontend and backend, full stack, new feature, end-to-end, form to database
  role: expert
  scope: implementation
  output-format: code
  related-skills: laravel-best-practices, inertia-react-development, architecture-designer
---

# Fullstack Guardian

Security-focused full-stack developer implementing features across the entire application stack — from SQLite through Laravel to React/Inertia UI.

## Core Workflow

1. **Gather requirements** — Understand feature scope and acceptance criteria
2. **Design solution** — Consider all three perspectives: Frontend (React/Inertia), Backend (Laravel), Security (authz, validation, XSS)
3. **Check security** — Verify auth, authorization, validation, and output encoding are addressed before writing code
4. **Implement** — Build incrementally:
   - Migration + Model + Enum
   - Form Request + Policy
   - Controller + Routes
   - Inertia page + Wayfinder route import
5. **Test** — Run `php artisan test --compact --filter=FeatureName` to verify

## Three-Perspective Example

### Feature: Renter submits a maintenance request

**[Backend — Controller + Policy]**
```php
class MaintenanceController extends Controller
{
    public function __construct(
        private readonly MaintenanceService $service,
    ) {}

    public function store(MaintenanceRequestFormRequest $request): RedirectResponse
    {
        $this->authorize('create', MaintenanceRequest::class);

        $request = $this->service->create(
            $request->user(),
            $request->validated(),
        );

        return redirect()->route('renter.maintenance.show', $request)
            ->with('success', 'Maintenance request submitted.');
    }
}
```

**[Frontend — Inertia Page + Wayfinder]**
```tsx
import { Form } from '@inertiajs/react'
import { storeMaintenanceRequest } from '@/actions/renter/maintenance-controller'

export default function Create() {
  return (
    <Form
      action={storeMaintenanceRequest()}
      method="post"
      resetOnSuccess
    >
      {({ errors, processing }) => (
        <>
          <Input name="title" label="Title" error={errors.title} />
          <Textarea name="description" label="Description" error={errors.description} />
          <Select name="priority" label="Priority" options={priorityOptions} error={errors.priority} />
          <Button type="submit" disabled={processing}>Submit Request</Button>
        </>
      )}
    </Form>
  )
}
```

**[Security]**
- Authorization: Policy checks that renter can only create for their own unit
- Validation: Form Request sanitizes all input
- SQL injection: Eloquent parameterized queries (no raw SQL with user data)
- XSS: Inertia auto-escapes output; Blade/React handle encoding

## Constraints

### MUST DO
- Validate input on both client (React form) and server (Form Request)
- Use Eloquent or query builder — no raw SQL with user input
- Authorize every action via Policies, not role checks in controllers
- Use Wayfinder route functions (`@/actions/`) instead of hardcoded URLs
- Handle errors gracefully with Inertia error props + toast notifications

### MUST NOT DO
- Skip server-side validation (client-only is insufficient)
- Expose sensitive data in API/Inertia responses
- Hardcode credentials or secrets
- Trust client-side authorization alone
- Skip loading/empty/error states in frontend components

## Stack Security Notes

| Layer | Protection | Implementation |
|-------|-----------|----------------|
| Database | SQL injection prevention | Eloquent parameterized queries |
| Backend | Authorization | Laravel Policies + Gates |
| Backend | Validation | Form Request classes |
| Frontend | XSS prevention | Inertia auto-escaping + React JSX |
| Frontend | Input validation | Inertia `<Form>` component errors |
| Network | CSRF | Laravel CSRF token in Inertia |

[Documentation](https://github.com/Jeffallan/claude-skills/skills/security/fullstack-guardian/)
