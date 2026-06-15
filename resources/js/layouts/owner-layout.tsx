import { LayoutDashboard, Building2, FileText, Wrench } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, NavItem } from '@/types';
import { dashboard as ownerDashboard } from '@/routes/owner';
import { index as ownerProperties } from '@/routes/owner/properties';
import { index as ownerLeases } from '@/routes/owner/leases';
import { index as ownerMaintenance } from '@/routes/owner/maintenance';

const ownerNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: ownerDashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'My Properties',
        href: ownerProperties(),
        icon: Building2,
    },
    {
        title: 'Leases',
        href: ownerLeases(),
        icon: FileText,
    },
    {
        title: 'Maintenance',
        href: ownerMaintenance(),
        icon: Wrench,
    },
];

export default function OwnerLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} sidebarItems={ownerNavItems}>
            {children}
        </AppLayout>
    );
}
