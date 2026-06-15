import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import type { MaintenanceRequest } from '@/types/maintenance';
import { index, create } from '@/routes/renter/maintenance/index';

interface PaginatedRequests {
    data: MaintenanceRequest[];
    meta: { current_page: number; last_page: number; total: number; from: number; to: number };
}

export default function MaintenanceIndex({ requests }: { requests: PaginatedRequests }) {
    const columns = [
        {
            key: 'title',
            label: 'Request',
            sortable: true,
            render: (r: MaintenanceRequest) => (
                <Link href={index.url({ maintenanceRequest: r.id })} className="font-medium hover:underline">
                    {r.title}
                </Link>
            ),
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
            label: 'Submitted',
            hideOnMobile: true,
            render: (r: MaintenanceRequest) => new Date(r.created_at).toLocaleDateString(),
        },
        {
            key: 'scheduled_at',
            label: 'Scheduled',
            hideOnMobile: true,
            render: (r: MaintenanceRequest) => r.scheduled_at ? new Date(r.scheduled_at).toLocaleDateString() : '—',
        },
    ] as const;

    return (
        <>
            <Head title="Maintenance Requests" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">My Maintenance Requests</h1>
                <DataTable
                    columns={columns}
                    data={requests.data}
                    meta={requests.meta}
                    searchPlaceholder="Search requests..."
                    createRoute={create().url}
                    createLabel="New Request"
                />
            </div>
        </>
    );
}
