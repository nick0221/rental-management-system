---
name: react-expert
description: 'Use when building React components or features outside Inertia patterns, implementing complex state logic, writing custom hooks, or optimizing React performance. Complements inertia-react-development skill — activate this for general React patterns (hooks, context, performance, TypeScript types) and inertia-react-development for Inertia-specific features (Form, useForm, router, deferred props).'
license: MIT
metadata:
  author: adapted-from-jeffallan/claude-skills
  domain: frontend
  triggers: React, JSX, hooks, useState, useEffect, useContext, component, TypeScript types, performance, memoization
  role: specialist
  scope: implementation
  output-format: code
  related-skills: inertia-react-development, tailwindcss-development
---

# React Expert

Senior React specialist with expertise in React 19, TypeScript, and production-grade component architecture for the Rental Management System.

## When to Use This Skill

- Creating reusable UI components (tables, forms, cards, dialogs)
- Implementing custom hooks for shared logic
- Defining TypeScript types/interfaces for domain models
- Optimizing component performance (memoization, lazy loading)
- Working with complex state or side effects
- Creating shared layout components

## Core Workflow

1. **Identify component needs** — Review requirements, check existing Shadcn components for reuse
2. **Define types** — Create TypeScript interfaces for props and data
3. **Implement** — Write component with proper TypeScript types
4. **Handle states** — Cover loading, empty, error, and success states
5. **Optimize** — Memoize if needed, check for unnecessary re-renders

## Key Patterns for This Project

### Component Structure (TypeScript)

```tsx
import { type ReactNode } from 'react'
import { type User } from '@/types'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  )
}
```

### Custom Hook Pattern

```tsx
import { useState, useCallback } from 'react'

interface UsePaginationProps {
  initialPage?: number
  perPage?: number
}

export function usePagination({ initialPage = 1, perPage = 15 }: UsePaginationProps = {}) {
  const [page, setPage] = useState(initialPage)

  const nextPage = useCallback(() => setPage(p => p + 1), [])
  const prevPage = useCallback(() => setPage(p => Math.max(1, p - 1)), [])
  const goToPage = useCallback((p: number) => setPage(p), [])

  return { page, perPage, nextPage, prevPage, goToPage }
}
```

### Status Badge Pattern (with Shadcn)

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { Badge } from '@/components/ui/badge'

const statusVariants = cva('', {
  variants: {
    status: {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
    },
  },
})

interface StatusBadgeProps extends VariantProps<typeof statusVariants> {
  label: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={statusVariants({ status })}>
      {label}
    </Badge>
  )
}
```

## Constraints

### MUST DO
- Use TypeScript with strict types for all props and state
- Check existing Shadcn UI components (`@/components/ui/`) before building custom ones
- Handle loading, empty, error, and success states in every data-driven component
- Use `key` props with stable, unique identifiers
- Clean up side effects in `useEffect` return functions

### MUST NOT DO
- Mutate state directly
- Use array index as `key` for dynamic lists
- Create new functions/objects inline in JSX passed to memoized children
- Forget cleanup in effects (creates memory leaks)
- Skip TypeScript types on component props

## Existing Shadcn Components (reuse these)

Button, Input, Label, Select, Card, Badge, Dialog, Table, Tabs, Alert, Avatar, Skeleton, DropdownMenu, Sheet, Tooltip, Separator, Checkbox, Toggle, Breadcrumb, Collapsible, NavigationMenu, Sonner (toasts)

[Documentation](https://github.com/Jeffallan/claude-skills/skills/frontend/react-expert/)
