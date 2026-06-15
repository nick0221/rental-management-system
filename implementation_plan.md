# Rental Management System — Implementation Plan

**Tech Stack:** Laravel 13 + Inertia v3 + React 19 + TypeScript + Shadcn UI + Tailwind CSS v4 + SQLite

---

## 1. Foundation & Configuration

### 1.1 Environment Setup
- Update `.env`: app name, database path, session/cache/queue driver (SQLite)
- Configure `config/app.php` with app name `Rental Management System`

### 1.2 RBAC: Role-Based Access Control (Build from Scratch)
No external package. Roles are simple enough to warrant a clean custom implementation.

**Database:**
- Add `role` enum column to `users` table: `super_admin`, `owner`, `renter` (default: `renter`)
- Create a `permissions` table (optional, for granular control if needed later)
- Create a `role_user` pivot table if multi-role needed (but keep it simple: one role per user)

**Backend:**
- Create `app/Enums/UserRole.php` — backed string enum
- Create `app/Models/Role.php` and `app/Models/Permission.php` if going granular
- Create `app/Http/Middleware/CheckRole.php` middleware
- Register middleware aliases in `bootstrap/app.php`: `role`, `super-admin`, `owner`, `renter`
- Create Gates in `AppServiceProvider` or dedicated `AuthServiceProvider`
- Add `authorizeRole()` / `hasRole()` methods to User model

**Frontend:**
- Create `usePermissions()` hook returning user role & permission checks
- Create a `<Can>` component for conditional rendering by role
- Route definitions with role middleware in `routes/web.php`

---

## 2. Database Schema & Models

### 2.1 Entities & Relationships

```
                           ┌─────────────┐
                           │    User     │ (Super-admin, Owner, Renter)
                           ├─────────────┤
                           │ id          │
                           │ name        │
                           │ email       │
                           │ password    │
                           │ role        │ ← enum: super_admin, owner, renter
                           │ phone       │
                           │ avatar      │
                           └──────┬──────┘
                                  │
                  ┌───────────────┼───────────────┐
                  │               │               │
             ┌────┴────┐   ┌─────┴─────┐   ┌─────┴──────┐
             │ Property│   │  Lease    │   │Maintenance │
             │ (Owner) │   │(Renter)   │   │  Request   │
             └─────────┘   └───────────┘   └────────────┘
                  │
             ┌────┴────┐
             │  Unit   │
             └─────────┘

  Property ──┬── User (owner_id)
             └── hasMany Unit
             └── hasMany Lease
             └── hasMany MaintenanceRequest (through Unit)

  Unit ──┬── belongsTo Property
          └── hasMany Lease
          └── hasMany MaintenanceRequest

  Lease ──┬── belongsTo Property
           └── belongsTo Unit
           └── belongsTo User (renter_id)
           └── hasMany Payment

  Payment ──┬── belongsTo Lease
             └── belongsTo User
             └── morphsTo Paymentable (for receipts/documents)

  MaintenanceRequest ──┬── belongsTo Property
                       └── belongsTo Unit
                       └── belongsTo User (reporter)
                       └── belongsTo User (assignee, nullable)
                       └── hasMany Document (morph)

  Document (polymorphic) ── morphsTo Documentable
```

### 2.2 Migrations (in order)

1. **Add role to users table** — `add_role_to_users_table`
   - `string('role')->default('renter')`, nullable `phone`, nullable `avatar`

2. **Create properties table** — `create_properties_table`
   - `id`, `owner_id` (FK → users), `name`, `slug`, `description` (text, nullable), `address`, `city`, `state`, `postal_code`, `country`, `type` (enum: apartment_building, house, commercial, mixed_use), `status` (enum: active, inactive, under_maintenance), `total_units` (int, default 0), timestamps, softDeletes

3. **Create units table** — `create_units_table`
   - `id`, `property_id` (FK → properties), `name` (e.g. "Unit 101"), `unit_number`, `floor` (nullable), `bedrooms` (int), `bathrooms` (int), `square_feet` (decimal, nullable), `rent_amount` (decimal), `security_deposit` (decimal, nullable), `status` (enum: available, occupied, maintenance, reserved), timestamps, softDeletes

4. **Create leases table** — `create_leases_table`
   - `id`, `property_id` (FK), `unit_id` (FK), `renter_id` (FK → users), `start_date` (date), `end_date` (date), `monthly_rent` (decimal), `security_deposit` (decimal), `status` (enum: active, expired, terminated, renewed), `terms` (text, nullable), `signed_at` (timestamp, nullable), `terminated_at` (timestamp, nullable), timestamps, softDeletes

5. **Create payments table** — `create_payments_table`
   - `id`, `lease_id` (FK), `user_id` (FK → payer), `amount` (decimal), `paid_at` (datetime), `due_date` (date), `status` (enum: pending, paid, overdue, refunded, partially_paid), `payment_method` (enum: cash, bank_transfer, credit_card, online, other), `reference_number` (nullable), `notes` (text, nullable), `receipt` (string, nullable), timestamps, softDeletes

6. **Create maintenance_requests table** — `create_maintenance_requests_table`
   - `id`, `property_id` (FK), `unit_id` (FK), `reporter_id` (FK → users), `assignee_id` (FK → users, nullable), `title`, `description` (text), `priority` (enum: low, medium, high, emergency), `status` (enum: reported, approved, in_progress, completed, cancelled), `scheduled_at` (datetime, nullable), `completed_at` (datetime, nullable), `cost` (decimal, nullable), timestamps, softDeletes

7. **Create documents table (polymorphic)** — `create_documents_table`
   - `id`, `documentable_id`, `documentable_type`, `name`, `path`, `type` (enum: lease, receipt, inspection, maintenance, other), `notes` (text, nullable), `uploaded_by` (FK → users), timestamps, softDeletes

### 2.3 Factories & Seeders

| Factory | Notes |
|---------|-------|
| `UserFactory` | Update to support role parameter, `phone`, `avatar` |
| `PropertyFactory` | Generate with realistic addresses, 3–20 units |
| `UnitFactory` | Generate unit names (101, 102…), random specs |
| `LeaseFactory` | Overlapping dates, various statuses |
| `PaymentFactory` | 12 months of payments for each active lease |
| `MaintenanceRequestFactory` | Various priorities/statuses |
| `DocumentFactory` | Simple factory with fake file paths |

**DatabaseSeeder:**
- 1 Super-admin user (`admin@rental.com`)
- 3 Owner users (each with 2–3 properties, 5–10 units)
- 10 Renter users (with active leases)
- Payments data for last 6 months
- 15–20 maintenance requests in varying states

**TestSeeder or dedicated test traits** for test suites.

---

## 3. Authentication & Role Setup

### 3.1 Fortify Configuration
- Fortify already installed and configured by the starter kit
- Register route: creates user with default `renter` role
- Add role selection dropdown on registration? (only `owner` and `renter` — super-admin is created via seeder)

### 3.2 Role Middleware

```php
// app/Http/Middleware/CheckRole.php
public function handle(Request $request, Closure $next, string ...$roles): Response
{
    if (! $request->user() || ! in_array($request->user()->role->value, $roles)) {
        abort(403);
    }
    return $next($request);
}
```

Register in `bootstrap/app.php`:
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role' => CheckRole::class,
    ]);
})
```

### 3.3 Route Protection

```php
// routes/web.php
Route::middleware(['auth', 'verified', 'role:super_admin'])->prefix('admin')->group(function () {
    // Admin-only routes
});

Route::middleware(['auth', 'verified', 'role:owner,super_admin'])->prefix('owner')->group(function () {
    // Owner routes
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Renter routes (default)
});
```

---

## 4. Backend Implementation (Controllers, Requests, Actions)

### 4.1 Directory Structure

```
app/
├── Enums/
│   ├── UserRole.php
│   ├── PropertyStatus.php
│   ├── PropertyType.php
│   ├── UnitStatus.php
│   ├── LeaseStatus.php
│   ├── PaymentStatus.php
│   ├── PaymentMethod.php
│   ├── MaintenancePriority.php
│   ├── MaintenanceStatus.php
│   └── DocumentType.php
├── Http/
│   ├── Controllers/
│   │   ├── Admin/
│   │   │   ├── UserController.php      (CRUD all users)
│   │   │   ├── PropertyController.php  (manage all properties)
│   │   │   └── DashboardController.php (admin analytics)
│   │   ├── Owner/
│   │   │   ├── PropertyController.php
│   │   │   ├── UnitController.php
│   │   │   ├── LeaseController.php
│   │   │   └── MaintenanceController.php
│   │   └── Renter/
│   │       ├── DashboardController.php
│   │       ├── ProfileController.php
│   │       ├── LeaseController.php
│   │       ├── PaymentController.php
│   │       └── MaintenanceController.php
│   └── Requests/
│       ├── PropertyRequest.php
│       ├── UnitRequest.php
│       ├── LeaseRequest.php
│       ├── PaymentRequest.php
│       └── MaintenanceRequest.php (form request)
├── Models/
│   ├── User.php          (update existing)
│   ├── Property.php
│   ├── Unit.php
│   ├── Lease.php
│   ├── Payment.php
│   ├── MaintenanceRequest.php
│   └── Document.php
└── Policies/
    ├── PropertyPolicy.php
    ├── UnitPolicy.php
    ├── LeasePolicy.php
    ├── PaymentPolicy.php
    └── MaintenanceRequestPolicy.php
```

### 4.2 Enums (Backed String Enums)

```php
enum UserRole: string
{
    case SuperAdmin = 'super_admin';
    case Owner = 'owner';
    case Renter = 'renter';
}
```

Each enum gets a `labels()` and `colors()` method for badge rendering on the frontend.

### 4.3 Controllers — Key Endpoints

**Admin Routes (`/admin`):**
| Method | URI | Controller@action |
|--------|-----|-------------------|
| GET | `/admin/dashboard` | Admin\DashboardController@index |
| GET | `/admin/users` | Admin\UserController@index |
| GET | `/admin/users/create` | Admin\UserController@create |
| POST | `/admin/users` | Admin\UserController@store |
| GET | `/admin/users/{user}/edit` | Admin\UserController@edit |
| PATCH | `/admin/users/{user}` | Admin\UserController@update |
| DELETE | `/admin/users/{user}` | Admin\UserController@destroy |
| GET | `/admin/properties` | Admin\PropertyController@index |
| GET | `/admin/properties/create` | Admin\PropertyController@create |
| POST | `/admin/properties` | Admin\PropertyController@store |
| GET | `/admin/properties/{property}/edit` | Admin\PropertyController@edit |
| PATCH | `/admin/properties/{property}` | Admin\PropertyController@update |
| DELETE | `/admin/properties/{property}` | Admin\PropertyController@destroy |

**Owner Routes (`/owner`):**
| Method | URI | Controller@action |
|--------|-----|-------------------|
| GET | `/owner/dashboard` | Owner\DashboardController@index |
| GET | `/owner/properties` | Owner\PropertyController@index |
| GET | `/owner/properties/create` | Owner\PropertyController@create |
| POST | `/owner/properties` | Owner\PropertyController@store |
| GET | `/owner/properties/{property}` | Owner\PropertyController@show |
| GET | `/owner/properties/{property}/edit` | Owner\PropertyController@edit |
| PATCH | `/owner/properties/{property}` | Owner\PropertyController@update |
| DELETE | `/owner/properties/{property}` | Owner\PropertyController@destroy |
| GET | `/owner/properties/{property}/units` | Owner\UnitController@index |
| GET | `/owner/properties/{property}/units/create` | Owner\UnitController@create |
| POST | `/owner/properties/{property}/units` | Owner\UnitController@store |
| GET | `/owner/units/{unit}/edit` | Owner\UnitController@edit |
| PATCH | `/owner/units/{unit}` | Owner\UnitController@update |
| DELETE | `/owner/units/{unit}` | Owner\UnitController@destroy |
| GET | `/owner/leases` | Owner\LeaseController@index |
| GET | `/owner/leases/{lease}` | Owner\LeaseController@show |
| POST | `/owner/leases` | Owner\LeaseController@store |
| PATCH | `/owner/leases/{lease}` | Owner\LeaseController@update |
| DELETE | `/owner/leases/{lease}` | Owner\LeaseController@destroy |
| GET | `/owner/maintenance` | Owner\MaintenanceController@index |
| PATCH | `/owner/maintenance/{request}` | Owner\MaintenanceController@update |

**Renter Routes (default auth):**
| Method | URI | Controller@action |
|--------|-----|-------------------|
| GET | `/dashboard` | Renter\DashboardController@index |
| GET | `/my-lease` | Renter\LeaseController@show |
| GET | `/payments` | Renter\PaymentController@index |
| POST | `/payments` | Renter\PaymentController@store |
| GET | `/payments/{payment}` | Renter\PaymentController@show |
| GET | `/maintenance` | Renter\MaintenanceController@index |
| GET | `/maintenance/create` | Renter\MaintenanceController@create |
| POST | `/maintenance` | Renter\MaintenanceController@store |
| GET | `/maintenance/{request}` | Renter\MaintenanceController@show |

### 4.4 Policies

- **PropertyPolicy**: Owner can only manage their own properties. Super-admin can manage all.
- **UnitPolicy**: Same as Property (units belong to properties).
- **LeasePolicy**: Owner sees leases on their properties. Renter sees only their lease.
- **PaymentPolicy**: Renter sees own payments. Owner sees payments on their properties.
- **MaintenanceRequestPolicy**: Renter sees own requests. Owner sees requests on their properties.

### 4.5 Form Requests

Each request extends `Illuminate\Foundation\Http\FormRequest` with:
- `authorize()` — defers to Policy
- `rules()` — validation rules
- `messages()` — custom error messages
- `failedValidation()` — Inertia-friendly redirect back with errors

---

## 5. Frontend Implementation

### 5.1 Directory Structure

```
resources/js/
├── components/
│   ├── layouts/
│   │   ├── admin/             (admin-specific sidebar, top nav)
│   │   ├── owner/             (owner-specific layouts)
│   │   └── renter/            (renter-specific layouts)
│   ├── ui/                    (26 existing Shadcn components — reuse)
│   ├── shared/                (shared across roles)
│   │   ├── data-table.tsx     (reusable DataTable with Shadcn Table)
│   │   ├── empty-state.tsx
│   │   ├── status-badge.tsx
│   │   ├── confirm-dialog.tsx
│   │   ├── page-header.tsx
│   │   └── card-summary.tsx
│   ├── forms/                 (reusable form components)
│   │   ├── property-form.tsx
│   │   ├── unit-form.tsx
│   │   ├── lease-form.tsx
│   │   └── maintenance-form.tsx
│   └── Can.tsx                (conditional render by role)
├── hooks/
│   ├── use-user.ts            (current user + role)
│   ├── use-can.ts             (permission check hook)
│   └── use-toast.ts           (Sonner toast wrapper)
├── layouts/
│   ├── admin-layout.tsx
│   ├── owner-layout.tsx
│   └── renter-layout.tsx
├── pages/
│   ├── auth/                  (7 existing — reuse)
│   ├── settings/              (3 existing — reuse)
│   ├── admin/
│   │   ├── users/
│   │   │   ├── index.tsx
│   │   │   ├── create.tsx
│   │   │   └── edit.tsx
│   │   ├── properties/
│   │   │   ├── index.tsx
│   │   │   ├── create.tsx
│   │   │   └── edit.tsx
│   │   └── dashboard.tsx
│   ├── owner/
│   │   ├── properties/
│   │   │   ├── index.tsx
│   │   │   ├── create.tsx
│   │   │   ├── show.tsx
│   │   │   └── edit.tsx
│   │   ├── units/
│   │   │   ├── index.tsx
│   │   │   ├── create.tsx
│   │   │   └── edit.tsx
│   │   ├── leases/
│   │   │   ├── index.tsx
│   │   │   └── show.tsx
│   │   ├── maintenance/
│   │   │   ├── index.tsx
│   │   │   └── show.tsx
│   │   └── dashboard.tsx
│   └── renter/
│       ├── lease.tsx
│       ├── payments/
│       │   ├── index.tsx
│       │   └── show.tsx
│       ├── maintenance/
│       │   ├── index.tsx
│       │   ├── create.tsx
│       │   └── show.tsx
│       └── dashboard.tsx
├── types/
│   ├── index.ts               (global types)
│   ├── user.ts
│   ├── property.ts
│   ├── unit.ts
│   ├── lease.ts
│   ├── payment.ts
│   └── maintenance.ts
└── lib/
    ├── utils.ts               (existing)
    └── permissions.ts         (role/permission helpers)
```

### 5.2 TypeScript Types

```typescript
// types/index.ts
export enum UserRole {
  SuperAdmin = 'super_admin',
  Owner = 'owner',
  Renter = 'renter',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  avatar: string | null;
  email_verified_at: string | null;
  created_at: string;
}

export interface Property {
  id: number;
  owner_id: number;
  owner?: User;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  type: PropertyType;
  status: PropertyStatus;
  total_units: number;
  units?: Unit[];
  leases_count?: number;
  created_at: string;
  deleted_at?: string | null;
}

export interface Unit {
  id: number;
  property_id: number;
  property?: Property;
  name: string;
  unit_number: string | null;
  floor: number | null;
  bedrooms: number;
  bathrooms: number;
  square_feet: number | null;
  rent_amount: number;
  security_deposit: number | null;
  status: UnitStatus;
  current_lease?: Lease;
  created_at: string;
}

// ... similar for Lease, Payment, MaintenanceRequest, Document
```

### 5.3 Shared Components

**`<Can>` Component:**
```tsx
interface CanProps {
  roles?: UserRole[];
  permission?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ roles, children, fallback = null }: CanProps) {
  const user = usePage().props.auth.user;
  if (roles && !roles.includes(user.role as UserRole)) {
    return fallback;
  }
  return children;
}
```

**`<StatusBadge>` Component:**
- Renders status with color-coded Shadcn `Badge` variants based on status
- Maps status values to `default`, `secondary`, `destructive`, `outline`, etc.

**`<DataTable>` Component:**
- Reusable table with search, sort, pagination columns
- Uses Shadcn `Table`, `Input` (search), pagination controls
- Props: columns config, data, loading state, empty state

**`<PageHeader>` Component:**
- Title + description + action buttons (create, export)

**`<EmptyState>` Component:**
- Icon + title + description + optional CTA button for empty lists

### 5.4 Layout System

**Admin Layout:**
- Sidebar with: Dashboard, Users, Properties, Reports, Settings
- Header with: global search, notifications, user menu
- Uses existing `app-sidebar-layout.tsx` with admin nav items

**Owner Layout:**
- Sidebar with: Dashboard, My Properties, Units, Leases, Maintenance, Payments
- Uses existing `app-sidebar-layout.tsx` with owner nav items

**Renter Layout:**
- Header with: Dashboard, My Lease, Payments, Maintenance, Settings
- Can reuse existing `app-header-layout.tsx` (no sidebar needed for simple nav)

### 5.5 Form Components

**`<PropertyForm>`** — Create/Edit property:
- Fields: name, type (select), address (text), city, state, postal code, country, description (textarea), status (select)
- Uses Wayfinder route actions for form submission

**`<UnitForm>`** — Create/Edit unit:
- Fields: name, unit_number, floor, bedrooms, bathrooms, square_feet, rent_amount, security_deposit, status
- Uses `input-otp` for numeric fields where appropriate

**`<LeaseForm>`** — Create/Edit lease:
- Fields: property (select → filters units), unit (select), renter (select → users with role=renter), start_date, end_date, monthly_rent, security_deposit, terms (textarea)
- Auto-populates rent from unit

**`<MaintenanceForm>`** — Create request:
- Fields: title, description (textarea), priority (select), preferred_date (date)
- Property/unit auto-set for renter

---

## 6. Routing — Full URL Map

### 6.1 Web Routes

```php
// routes/web.php

// Public (guest)
Route::inertia('/', 'welcome')->name('home');

// Auth routes — handled by Fortify (login, register, etc.)

// Authenticated + Verified
Route::middleware(['auth', 'verified'])->group(function () {
    // Redirect based on role (or use dashboard as entry point)
    Route::inertia('dashboard', 'renter/dashboard')->name('dashboard');

    // ===== RENTER ROUTES =====
    Route::prefix('my-lease')->name('renter.lease.')->group(function () {
        Route::get('/', [Renter\LeaseController::class, 'show'])->name('show');
    });

    Route::prefix('payments')->name('renter.payments.')->group(function () {
        Route::get('/', [Renter\PaymentController::class, 'index'])->name('index');
        Route::post('/', [Renter\PaymentController::class, 'store'])->name('store');
        Route::get('{payment}', [Renter\PaymentController::class, 'show'])->name('show');
    });

    Route::prefix('maintenance')->name('renter.maintenance.')->group(function () {
        Route::get('/', [Renter\MaintenanceController::class, 'index'])->name('index');
        Route::get('create', [Renter\MaintenanceController::class, 'create'])->name('create');
        Route::post('/', [Renter\MaintenanceController::class, 'store'])->name('store');
        Route::get('{request}', [Renter\MaintenanceController::class, 'show'])->name('show');
    });

    // ===== OWNER ROUTES =====
    Route::middleware('role:owner,super_admin')->prefix('owner')->name('owner.')->group(function () {
        Route::inertia('dashboard', 'owner/dashboard')->name('dashboard');

        Route::prefix('properties')->name('properties.')->group(function () {
            Route::get('/', [Owner\PropertyController::class, 'index'])->name('index');
            Route::get('create', [Owner\PropertyController::class, 'create'])->name('create');
            Route::post('/', [Owner\PropertyController::class, 'store'])->name('store');
            Route::get('{property}', [Owner\PropertyController::class, 'show'])->name('show');
            Route::get('{property}/edit', [Owner\PropertyController::class, 'edit'])->name('edit');
            Route::patch('{property}', [Owner\PropertyController::class, 'update'])->name('update');
            Route::delete('{property}', [Owner\PropertyController::class, 'destroy'])->name('destroy');

            // Nested units
            Route::prefix('{property}/units')->name('units.')->group(function () {
                Route::get('/', [Owner\UnitController::class, 'index'])->name('index');
                Route::get('create', [Owner\UnitController::class, 'create'])->name('create');
                Route::post('/', [Owner\UnitController::class, 'store'])->name('store');
            });
        });

        // Standalone unit routes (for edit/delete after creation)
        Route::prefix('units')->name('units.')->group(function () {
            Route::get('{unit}/edit', [Owner\UnitController::class, 'edit'])->name('edit');
            Route::patch('{unit}', [Owner\UnitController::class, 'update'])->name('update');
            Route::delete('{unit}', [Owner\UnitController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('leases')->name('leases.')->group(function () {
            Route::get('/', [Owner\LeaseController::class, 'index'])->name('index');
            Route::get('create', [Owner\LeaseController::class, 'create'])->name('create');
            Route::post('/', [Owner\LeaseController::class, 'store'])->name('store');
            Route::get('{lease}', [Owner\LeaseController::class, 'show'])->name('show');
            Route::get('{lease}/edit', [Owner\LeaseController::class, 'edit'])->name('edit');
            Route::patch('{lease}', [Owner\LeaseController::class, 'update'])->name('update');
            Route::delete('{lease}', [Owner\LeaseController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('maintenance')->name('maintenance.')->group(function () {
            Route::get('/', [Owner\MaintenanceController::class, 'index'])->name('index');
            Route::get('{request}', [Owner\MaintenanceController::class, 'show'])->name('show');
            Route::patch('{request}', [Owner\MaintenanceController::class, 'update'])->name('update');
        });
    });

    // ===== ADMIN ROUTES =====
    Route::middleware('role:super_admin')->prefix('admin')->name('admin.')->group(function () {
        Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');

        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [Admin\UserController::class, 'index'])->name('index');
            Route::get('create', [Admin\UserController::class, 'create'])->name('create');
            Route::post('/', [Admin\UserController::class, 'store'])->name('store');
            Route::get('{user}/edit', [Admin\UserController::class, 'edit'])->name('edit');
            Route::patch('{user}', [Admin\UserController::class, 'update'])->name('update');
            Route::delete('{user}', [Admin\UserController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('properties')->name('properties.')->group(function () {
            Route::get('/', [Admin\PropertyController::class, 'index'])->name('index');
            Route::get('create', [Admin\PropertyController::class, 'create'])->name('create');
            Route::post('/', [Admin\PropertyController::class, 'store'])->name('store');
            Route::get('{property}/edit', [Admin\PropertyController::class, 'edit'])->name('edit');
            Route::patch('{property}', [Admin\PropertyController::class, 'update'])->name('update');
            Route::delete('{property}', [Admin\PropertyController::class, 'destroy'])->name('destroy');
        });
    });
});

require __DIR__.'/settings.php';
```

### 6.2 Inertia Page Resolution (update `app.tsx`)

**Layout resolution rules:**
- `welcome`, `auth/*` — no change (existing)
- `admin/*` → `AdminLayout`
- `owner/*` → `OwnerLayout`
- `renter/*` or default → `RenterLayout`
- `settings/*` → `[AppLayout, SettingsLayout]` (existing)

---

## 7. Dashboard Views Per Role

### 7.1 Super-Admin Dashboard
- **Stats cards**: Total Users, Total Properties, Total Units, Total Revenue (month)
- **Chart**: Monthly revenue (last 12 months) — using Recharts or simple CSS bars
- **Table**: Recent 10 users registered
- **Quick actions**: Create Property, Create User, View Reports

### 7.2 Owner Dashboard
- **Stats cards**: My Properties, Total Units, Occupied Units, Monthly Revenue
- **Chart**: Revenue per property (bar chart)
- **Table**: Active leases (expiring soon highlighted)
- **Alerts**: Pending maintenance requests count
- **Quick actions**: Add Property, View Leases, Check Maintenance

### 7.3 Renter Dashboard
- **Current Lease card** — property, unit, rent amount, lease dates (with countdown)
- **Payment Status** — current month: paid/due/overdue
- **Next Payment** — amount and due date
- **Recent Activity** — last maintenance request, last payment
- **Quick actions**: Pay Rent, Submit Maintenance Request, View Lease

---

## 8. Implementation Order (Phased)

### Phase 1 — Foundation (Week 1)
1. Update `.env` with app name
2. Create `UserRole` enum
3. Create migration to add `role` column to users
4. Create `CheckRole` middleware, register in `bootstrap/app.php`
5. Update `CreateNewUser` action to accept role
6. Create `Role` and `Permission` models (if going granular)
7. Add `hasRole()` and scopes to User model
8. Run `php artisan wayfinder:generate`
9. Generate all migrations, run them
10. Create all Eloquent Models with relationships, casts, scopes
11. Create all Enums
12. Create Factories & DatabaseSeeder
13. Seed database and verify data

### Phase 2 — Core CRUD (Week 2)
1. Create Form Requests
2. Create Policies
3. Create Admin controllers + pages (users CRUD, properties CRUD)
4. Create Owner controllers + pages (properties, units, leases)
5. Create Renter controllers + pages (lease view, payments, maintenance)
6. Register all routes

### Phase 3 — Dashboard & Business Logic (Week 3)
1. Admin dashboard with analytics
2. Owner dashboard with property stats
3. Renter dashboard with personalized view
4. Payment recording & status tracking
5. Lease expiration notifications
6. Maintenance request workflow (report → approve → complete)

### Phase 4 — Polish & Testing (Week 4)
1. Write feature tests for all CRUD endpoints
2. Write policy tests for role-based access
3. Write browser/inertia tests for frontend
4. Add empty states, loading skeletons, error boundaries
5. Responsive layout testing
6. Run `vendor/bin/pint --format agent`
7. Run full test suite: `php artisan test --compact`

---

## 9. Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| RBAC approach | Custom (no Spatie) | Small scope, 3 roles, avoids heavy dependency |
| Role storage | `role` column on `users` | Single-role user (simpler, faster queries) |
| Authorization | Laravel Policies + Gates | Native, testable, integrates with `@can` |
| Soft deletes | All entities | Data recovery, audit trail |
| Payment status tracking | `payments` table | Simple, auditable, no need for accounting integration yet |
| File storage | Local (`storage/app/public/`) | SQLite project; link with `php artisan storage:link` |
| Frontend state | Inertia `usePage().props` | No need for Zustand/Redux at this scope |
| Forms | Inertia `<form>` with `useForm` | Native Inertia approach, no Formik/React Hook Form needed |
| Data fetching | Wayfinder route functions | Already set up, typed, tree-shakeable |
| CSS approach | Tailwind v4 + Shadcn primitives | Already configured, consistent |

---

## 10. Testing Strategy

### 10.1 Feature Tests (Pest)

**Auth Tests** (7 existing — reuse):
- Registration creates user with `renter` role
- Email verification
- Password reset
- 2FA

**Role Tests:**
- `test_super_admin_can_access_admin_dashboard`
- `test_owner_cannot_access_admin_dashboard`
- `test_renter_cannot_access_admin_dashboard`
- `test_owner_can_only_see_own_properties`
- `test_renter_can_only_see_own_lease`

**CRUD Tests (per model):**
- `test_can_create_property_as_owner`
- `test_cannot_create_property_as_renter`
- `test_can_update_own_property`
- `test_cannot_update_others_property`
- Similar for Units, Leases, Payments, Maintenance

**Business Logic Tests:**
- `test_lease_creation_sets_unit_status_to_occupied`
- `test_lease_expiration_triggers_notification`
- `test_maintenance_request_workflow`
- `test_payment_records_updates_balance`

### 10.2 Run Tests
```bash
php artisan test --compact --filter=RoleTest
php artisan test --compact
```

---

## 11. Files to Create/Modify — Complete List

### New Backend Files

| File | Purpose |
|------|---------|
| `app/Enums/UserRole.php` | Role enum |
| `app/Enums/PropertyStatus.php` | Property statuses |
| `app/Enums/PropertyType.php` | Property types |
| `app/Enums/UnitStatus.php` | Unit statuses |
| `app/Enums/LeaseStatus.php` | Lease statuses |
| `app/Enums/PaymentStatus.php` | Payment statuses |
| `app/Enums/PaymentMethod.php` | Payment methods |
| `app/Enums/MaintenancePriority.php` | Maintenance priority |
| `app/Enums/MaintenanceStatus.php` | Maintenance statuses |
| `app/Enums/DocumentType.php` | Document types |
| `app/Models/Property.php` | Property model |
| `app/Models/Unit.php` | Unit model |
| `app/Models/Lease.php` | Lease model |
| `app/Models/Payment.php` | Payment model |
| `app/Models/MaintenanceRequest.php` | Maintenance Request model |
| `app/Models/Document.php` | Polymorphic Document model |
| `app/Policies/PropertyPolicy.php` | Property authorization |
| `app/Policies/UnitPolicy.php` | Unit authorization |
| `app/Policies/LeasePolicy.php` | Lease authorization |
| `app/Policies/PaymentPolicy.php` | Payment authorization |
| `app/Policies/MaintenanceRequestPolicy.php` | Maintenance authorization |
| `app/Http/Middleware/CheckRole.php` | Role middleware |
| `app/Http/Controllers/Admin/UserController.php` | Admin user management |
| `app/Http/Controllers/Admin/PropertyController.php` | Admin property management |
| `app/Http/Controllers/Admin/DashboardController.php` | Admin dashboard |
| `app/Http/Controllers/Owner/PropertyController.php` | Owner property CRUD |
| `app/Http/Controllers/Owner/UnitController.php` | Owner unit CRUD |
| `app/Http/Controllers/Owner/LeaseController.php` | Owner lease management |
| `app/Http/Controllers/Owner/MaintenanceController.php` | Owner maintenance mgmt |
| `app/Http/Controllers/Owner/DashboardController.php` | Owner dashboard |
| `app/Http/Controllers/Renter/LeaseController.php` | Renter lease view |
| `app/Http/Controllers/Renter/PaymentController.php` | Renter payments |
| `app/Http/Controllers/Renter/MaintenanceController.php` | Renter maintenance |
| `app/Http/Controllers/Renter/DashboardController.php` | Renter dashboard |
| `app/Http/Requests/PropertyRequest.php` | Property validation |
| `app/Http/Requests/UnitRequest.php` | Unit validation |
| `app/Http/Requests/LeaseRequest.php` | Lease validation |
| `app/Http/Requests/PaymentRequest.php` | Payment validation |
| `app/Http/Requests/MaintenanceRequest.php` | Maintenance validation |

### New Frontend Files

| File | Purpose |
|------|---------|
| `resources/js/layouts/admin-layout.tsx` | Admin sidebar layout |
| `resources/js/layouts/owner-layout.tsx` | Owner sidebar layout |
| `resources/js/layouts/renter-layout.tsx` | Renter header-only layout |
| `resources/js/components/Can.tsx` | Role-based rendering |
| `resources/js/components/shared/data-table.tsx` | Reusable data table |
| `resources/js/components/shared/empty-state.tsx` | Empty state component |
| `resources/js/components/shared/status-badge.tsx` | Status badge component |
| `resources/js/components/shared/page-header.tsx` | Page header component |
| `resources/js/components/shared/card-summary.tsx` | Stats card |
| `resources/js/components/forms/property-form.tsx` | Property form |
| `resources/js/components/forms/unit-form.tsx` | Unit form |
| `resources/js/components/forms/lease-form.tsx` | Lease form |
| `resources/js/components/forms/maintenance-form.tsx` | Maintenance form |
| `resources/js/hooks/use-can.ts` | Permission check hook |
| `resources/js/types/property.ts` | Property types |
| `resources/js/types/unit.ts` | Unit types |
| `resources/js/types/lease.ts` | Lease types |
| `resources/js/types/payment.ts` | Payment types |
| `resources/js/types/maintenance.ts` | Maintenance types |
| `resources/js/lib/permissions.ts` | Permission helpers |
| `resources/js/pages/admin/dashboard.tsx` | Admin dashboard page |
| `resources/js/pages/admin/users/index.tsx` | Users list page |
| `resources/js/pages/admin/users/create.tsx` | Create user page |
| `resources/js/pages/admin/users/edit.tsx` | Edit user page |
| `resources/js/pages/admin/properties/index.tsx` | Properties list (admin) |
| `resources/js/pages/admin/properties/create.tsx` | Create property (admin) |
| `resources/js/pages/admin/properties/edit.tsx` | Edit property (admin) |
| `resources/js/pages/owner/dashboard.tsx` | Owner dashboard page |
| `resources/js/pages/owner/properties/index.tsx` | My properties list |
| `resources/js/pages/owner/properties/create.tsx` | Create property |
| `resources/js/pages/owner/properties/show.tsx` | Property detail |
| `resources/js/pages/owner/properties/edit.tsx` | Edit property |
| `resources/js/pages/owner/units/index.tsx` | Units list per property |
| `resources/js/pages/owner/units/create.tsx` | Create unit |
| `resources/js/pages/owner/units/edit.tsx` | Edit unit |
| `resources/js/pages/owner/leases/index.tsx` | Leases list |
| `resources/js/pages/owner/leases/show.tsx` | Lease detail |
| `resources/js/pages/owner/maintenance/index.tsx` | Maintenance requests |
| `resources/js/pages/owner/maintenance/show.tsx` | Maintenance detail |
| `resources/js/pages/renter/dashboard.tsx` | Renter dashboard |
| `resources/js/pages/renter/lease.tsx` | My lease page |
| `resources/js/pages/renter/payments/index.tsx` | My payments |
| `resources/js/pages/renter/payments/show.tsx` | Payment detail |
| `resources/js/pages/renter/maintenance/index.tsx` | My requests |
| `resources/js/pages/renter/maintenance/create.tsx` | New request |
| `resources/js/pages/renter/maintenance/show.tsx` | Request detail |

### Database Migrations (add to existing sequence)

| Migration | Content |
|-----------|---------|
| `add_role_to_users_table` | Adds `role`, `phone`, `avatar` columns to `users` |
| `create_properties_table` | Full properties schema |
| `create_units_table` | Full units schema |
| `create_leases_table` | Full leases schema |
| `create_payments_table` | Full payments schema |
| `create_maintenance_requests_table` | Full maintenance schema |
| `create_documents_table` | Polymorphic documents schema |

### Modified Files

| File | Change |
|------|--------|
| `.env` | App name, database config |
| `app/Models/User.php` | Add role casts, phone, avatar, relationships, `hasRole()` method |
| `app/Actions/Fortify/CreateNewUser.php` | Accept role field |
| `app/Providers/AppServiceProvider.php` | Register Gates, policies |
| `bootstrap/app.php` | Register CheckRole middleware alias |
| `routes/web.php` | Full route definitions (replace existing) |
| `database/seeders/DatabaseSeeder.php` | Full seed with roles, properties, units, etc. |
| `database/factories/UserFactory.php` | Add role support |
| `resources/js/app.tsx` | Add admin/owner/renter layout resolution |

---

## 12. Architecture & Conventions

### 12.1 Data Flow

```
Browser ──> Inertia ──> Laravel Route ──> Middleware (auth, verified, role)
    │                                            │
    │                                     Controller@action
    │                                            │
    │                                     FormRequest (validation)
    │                                            │
    │                                     Policy (authorization)
    │                                            │
    │                                     Model / DB query
    │                                            │
    │                                     Inertia::render('page', props)
    │                                            │
    └──────────── React renders page ◄──────────┘
```

### 12.2 Query Scopes (on Models)

```php
// User model
public function scopeOwners($query): void
{
    $query->where('role', UserRole::Owner);
}

public function scopeRenters($query): void
{
    $query->where('role', UserRole::Renter);
}

// Property model
public function scopeForOwner($query, User $user): void
{
    $query->where('owner_id', $user->id);
}

// Lease model
public function scopeActive($query): void
{
    $query->where('status', LeaseStatus::Active)
          ->whereDate('start_date', '<=', now())
          ->whereDate('end_date', '>=', now());
}

public function scopeExpiringSoon($query, int $days = 30): void
{
    $query->where('status', LeaseStatus::Active)
          ->whereDate('end_date', '>=', now())
          ->whereDate('end_date', '<=', now()->addDays($days));
}
```

### 12.3 Casts

```php
// Property model
protected function casts(): array
{
    return [
        'type' => PropertyType::class,
        'status' => PropertyStatus::class,
    ];
}

// User model - add role cast
protected function casts(): array
{
    return array_merge(parent::casts(), [
        'role' => UserRole::class,
        'email_verified_at' => 'datetime',
    ]);
}
```

### 12.4 Controller Pattern

Every controller follows this structure:

```php
class PropertyController extends Controller
{
    public function __construct()
    {
        // Authorization in FormRequest or Policy
    }

    public function index(): Response
    {
        $this->authorize('viewAny', Property::class);

        $properties = Property::query()
            ->whereOwnerId(auth()->id())
            ->withCount('units', 'leases')
            ->latest()
            ->paginate(15);

        return inertia('owner/properties/index', [
            'properties' => $properties,
        ]);
    }
}
```

---

## 13. Future Considerations (Post-MVP)

- **Notifications**: In-app (Laravel Notifications + Inertia polling) + email for payment reminders, lease expiry
- **File uploads**: Lease documents, receipts, inspection photos via Laravel Media Library or direct upload
- **Payment gateway**: Integrate Stripe/Lemon Squeezy for online rent payments
- **Reports**: Export to CSV/PDF (Laravel Excel / DomPDF)
- **Audit trail**: Spatie Activity Log for tracking changes
- **API**: Full REST API with Sanctum tokens for mobile app
- **Search**: Laravel Scout (Meilisearch/Algolia) for property search
- **Multi-language**: Laravel localization for renter-facing pages
- **Invite system**: Owner can invite renters via email
- **Recurring payments**: Schedule automatic monthly rent invoicing
