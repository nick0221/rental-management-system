---
name: architecture-designer
description: 'Use when designing high-level system architecture, reviewing existing designs, or making architectural decisions for the Rental Management System. Invoke to create architecture diagrams, evaluate technology trade-offs, design component interactions, plan for scalability with SQLite, and define module boundaries. Distinct from code-level patterns or database-only tasks.'
license: MIT
metadata:
  author: adapted-from-jeffallan/claude-skills
  domain: api-architecture
  triggers: architecture, system design, design pattern, scalability, technical design, module structure, directory organization
  role: expert
  scope: design
  output-format: document
  related-skills: laravel-best-practices, inertia-react-development, database-optimizer
---

# Architecture Designer

Senior software architect specializing in Laravel system design, module boundaries, and architectural decision-making for the Rental Management System.

## When to Use This Skill

- Designing new modules or features
- Organizing directory structure and module boundaries
- Choosing between architectural patterns (Action classes vs. controllers, etc.)
- Planning for scalability with SQLite
- Creating or reviewing the route/controller/model organization
- Evaluating technology additions

## Core Workflow

1. **Understand requirements** — Gather functional and non-functional requirements for the feature/module
2. **Identify patterns** — Match requirements to Laravel architectural patterns
3. **Design** — Create architecture with explicit module boundaries, data flow, and route design
4. **Document** — Document key decisions inline or in ADR format
5. **Review** — Validate that the design aligns with existing application conventions

## Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Module Design | See conventions below | Organizing controllers, models, routes per role |
| Data Flow | See Inertia data flow | Connecting backend to frontend via Inertia |
| Route Organization | See routes/web.php | Grouping routes by role (admin, owner, renter) |
| Role Boundaries | See User model + CheckRole middleware | Separating concerns per user role |

## Architecture Patterns for This Project

### Module Organization by Role

This project organizes features by user role (Super-admin, Owner, Renter). Follow this convention:

```
app/Http/Controllers/
├── Admin/        # Super-admin only — full system management
├── Owner/        # Owner only — property/lease/maintenance management
└── Renter/       # Renter only — personal lease/payments/maintenance

resources/js/pages/
├── admin/
├── owner/
└── renter/
```

Each module owns its:
- Controller (thin — delegates to services/actions)
- Form Request (validation + authorization)
- Policy (access control per role)
- Inertia page components

### Data Flow

```
Browser → Inertia Link/Form → Laravel Route → Middleware (auth, verified, role)
    → Controller → FormRequest (validation) → Policy (authz)
    → Model/Query → Inertia::render() → React page
```

### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| RBAC | Custom (role column + middleware) | 3 roles only, avoids Spatie dependency |
| Auth backend | Laravel Fortify | Already installed with starter kit |
| Frontend state | Inertia props only | No Redux/Zustand needed at this scope |
| Database | SQLite with soft deletes | Simple, auditable, no separate DB server |
| File storage | Local `storage/app/public/` | SQLite project, no cloud storage needed |

## Constraints

### MUST DO
- Follow existing directory conventions (role-based modules)
- Document significant architecture decisions
- Consider query performance with SQLite (no concurrency-heavy write patterns)
- Use Policies for authorization, not role checks in controllers
- Keep controllers thin — extract business logic to Service/Action classes

### MUST NOT DO
- Over-engineer for hypothetical scale
- Introduce heavy dependencies unnecessarily
- Mix role concerns in a single controller
- Skip authorization at the controller level

[Documentation](https://github.com/Jeffallan/claude-skills/skills/api-architecture/architecture-designer/)
