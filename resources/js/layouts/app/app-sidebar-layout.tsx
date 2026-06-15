import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';
import type { NavItem } from '@/types/navigation';

interface AppSidebarLayoutProps extends AppLayoutProps {
    sidebarItems?: NavItem[];
}

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
    sidebarItems,
}: AppSidebarLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar items={sidebarItems} />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
