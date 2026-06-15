import { Head, Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import type { MaintenanceRequest } from '@/types/maintenance';

interface PaginatedData {
    data: MaintenanceRequest[];
    meta: { current_page: number; last_page: number; total: number; from: number; to: number };
}

export default function MaintenanceIndex({ requests, filters }: { requests: PaginatedData; filters: { status?: string; priority?: string } }) {
    const columns = [
        {
            key: 'title',
            label: 'Request',
            render: (r: MaintenanceRequest) => (
                <div>
                    <Link href={`/owner/maintenance/${r.id}`} className="font-medium hover:underline">
                        {r.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{r.property?.name} · {r.unit?.name}</p>
                </div>
            ),
        },
        {
            key: 'reporter',
            label: 'Reported By',
            hideOnMobile: true,
            render: (r: MaintenanceRequest) => r.reporter?.name || '—',
        },
        {
            key: 'priority',
            label: 'Priority',
            render: (r: MaintenanceRequest) => <StatusBadge status={r.priority} />,
        },
        {
            key: 'status',
            label: 'Status',
            render: (r: MaintenanceRequest) => <StatusBadge status={r.status} />,
        },
        {
            key: 'created_at',
            label: 'Date',
            hideOnMobile: true,
            render: (r: MaintenanceRequest) => new Date(r.created_at).toLocaleDateString(),
        },
        {
            key: 'actions',
            label: '',
            className: 'w-12',
            render: (r: MaintenanceRequest) => (
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/owner/maintenance/${r.id}`}>
                        <Eye className="h-4 w-4" />
                    </Link>
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Maintenance Requests" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Maintenance Requests</h1>
                <DataTable
                    columns={columns}
                    data={requests.data}
                    meta={requests.meta}
                    searchPlaceholder="Search requests..."
                />
            </div>
        </>
    );
}
