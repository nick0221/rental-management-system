import { LayoutDashboard, Building2, Users } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, NavItem } from '@/types';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as adminUsers } from '@/routes/admin/users';
import { index as adminProperties } from '@/routes/admin/properties';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: adminDashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Users',
        href: adminUsers(),
        icon: Users,
    },
    {
        title: 'Properties',
        href: adminProperties(),
        icon: Building2,
    },
];

export default function AdminLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} sidebarItems={adminNavItems}>
            {children}
        </AppLayout>
    );
}
