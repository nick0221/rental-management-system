import { usePage } from '@inertiajs/react';
import { roleLevel, type UserRole, canManageUsers, canManageAnyProperty, canOwnProperty } from '@/lib/permissions';

type Permission = 'manage_users' | 'manage_properties' | 'own_property';

const PERMISSION_MAP: Record<Permission, (role: string | null | undefined) => boolean> = {
    manage_users: canManageUsers,
    manage_properties: canManageAnyProperty,
    own_property: canOwnProperty,
};

export function useCan() {
    const user = usePage().props.auth?.user;
    const role = user?.role as string | undefined;

    function hasRole(...roles: UserRole[]): boolean {
        if (!role) return false;
        return roles.includes(role as UserRole);
    }

    function hasPermission(permission: Permission): boolean {
        if (!role) return false;
        const check = PERMISSION_MAP[permission];
        return check(role);
    }

    function isAtLeastRole(minimum: UserRole): boolean {
        if (!role) return false;
        return roleLevel(role) >= roleLevel(minimum);
    }

    function isSuperAdmin(): boolean {
        return role === 'super_admin';
    }

    function isOwner(): boolean {
        return role === 'owner';
    }

    function isRenter(): boolean {
        return role === 'renter';
    }

    return {
        role: role ?? null,
        hasRole,
        hasPermission,
        isAtLeastRole,
        isSuperAdmin,
        isOwner,
        isRenter,
    };
}
