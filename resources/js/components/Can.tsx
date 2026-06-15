import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import type { UserRole } from '@/types/auth';

interface CanProps {
    roles?: string[];
    permission?: string;
    children: ReactNode;
    fallback?: ReactNode;
}

export function Can({ roles, children, fallback = null }: CanProps) {
    // Use the auth user from Inertia page props
    const page = usePage();
    const user = (page.props.auth as { user?: { role?: string } } | undefined)?.user;

    if (!user) {
        return fallback;
    }

    if (roles && !roles.includes(user.role ?? '')) {
        return fallback;
    }

    return <>{children}</>;
}
