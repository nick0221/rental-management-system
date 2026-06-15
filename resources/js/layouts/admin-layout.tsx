import { LayoutDashboard, Building2, Users } from 'lucide-react';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem, NavItem } from '@/types';
import { dashboard as adminDashboard } from '@/routes/admin/dashboard';
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
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            <div className="flex h-full">
                {/* Admin sidebar nav */}
                <nav className="hidden w-56 shrink-0 border-r bg-sidebar p-4 lg:block">
                    <div className="mb-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Admin Panel
                    </div>
                    <div className="flex flex-col gap-1">
                        {adminNavItems.map((item) => (
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
