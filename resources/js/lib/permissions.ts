export const ROLE_HIERARCHY = {
    super_admin: 3,
    owner: 2,
    renter: 1,
} as const;

export type UserRole = keyof typeof ROLE_HIERARCHY;

export function roleLevel(role: string | null | undefined): number {
    if (!role) return 0;
    return ROLE_HIERARCHY[role as UserRole] ?? 0;
}

export function isSuperAdmin(role: string | null | undefined): boolean {
    return role === 'super_admin';
}

export function isOwner(role: string | null | undefined): boolean {
    return role === 'owner';
}

export function isRenter(role: string | null | undefined): boolean {
    return role === 'renter';
}

export function isAtLeast(role: string | null | undefined, minimum: UserRole): boolean {
    return roleLevel(role) >= roleLevel(minimum);
}

export function canManageUsers(role: string | null | undefined): boolean {
    return isSuperAdmin(role);
}

export function canManageAnyProperty(role: string | null | undefined): boolean {
    return isSuperAdmin(role);
}

export function canOwnProperty(role: string | null | undefined): boolean {
    return isSuperAdmin(role) || isOwner(role);
}

export function roleLabel(role: string | null | undefined): string {
    switch (role) {
        case 'super_admin':
            return 'Super Admin';
        case 'owner':
            return 'Owner';
        case 'renter':
            return 'Renter';
        default:
            return 'Unknown';
    }
}

export const ROLE_OPTIONS = [
    { value: 'renter', label: 'Renter' },
    { value: 'owner', label: 'Owner' },
    { value: 'super_admin', label: 'Super Admin' },
] as const;
