import { LayoutDashboard, Building2, DoorOpen, FileText, Wrench } from 'lucide-react';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem, NavItem } from '@/types';
import { dashboard as ownerDashboard } from '@/routes/owner/dashboard';
import { index as ownerProperties } from '@/routes/owner/properties/index';
import { index as ownerLeases } from '@/routes/owner/leases/index';
import { index as ownerMaintenance } from '@/routes/owner/maintenance/index';

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
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            <div className="flex h-full">
                {/* Owner sidebar nav */}
                <nav className="hidden w-56 shrink-0 border-r bg-sidebar p-4 lg:block">
                    <div className="mb-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Owner Panel
                    </div>
                    <div className="flex flex-col gap-1">
                        {ownerNavItems.map((item) => (
                            <a
                                key={item.title}
                                href={item.href}
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                            >
                                {item.icon && <item.icon className="h-4 w-4" />}
                                {item.title}
                            </a>
                        ))}
                    </div>
                </nav>
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </div>
        </AppLayoutTemplate>
    );
}
