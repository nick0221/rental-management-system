import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import type { NavItem } from '@/types/navigation';

interface AppLayoutProps {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
    sidebarItems?: NavItem[];
}

export default function AppLayout({
    breadcrumbs = [],
    children,
    sidebarItems,
}: AppLayoutProps) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} sidebarItems={sidebarItems}>
            {children}
        </AppLayoutTemplate>
    );
}
