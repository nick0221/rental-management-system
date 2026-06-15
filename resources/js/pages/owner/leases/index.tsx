import { Head, Link } from '@inertiajs/react';
import { Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import type { Lease } from '@/types/lease';
import { create } from '@/routes/owner/leases';

interface PaginatedLeases {
    data: Lease[];
    meta: { current_page: number; last_page: number; total: number; from: number; to: number };
}

export default function LeasesIndex({ leases, filters }: { leases: PaginatedLeases; filters: { search?: string; status?: string } }) {
    const columns = [
        {
            key: 'renter',
            label: 'Renter',
            render: (l: Lease) => (
                <div>
                    <p className="font-medium">{l.renter?.name}</p>
                    <p className="text-xs text-muted-foreground">{l.renter?.email}</p>
                </div>
            ),
        },
        {
            key: 'unit',
            label: 'Unit',
            hideOnMobile: true,
            render: (l: Lease) => <span>{l.unit?.name}</span>,
        },
        {
            key: 'property',
            label: 'Property',
            hideOnMobile: true,
            render: (l: Lease) => <span>{l.property?.name}</span>,
        },
        {
            key: 'monthly_rent',
            label: 'Rent',
            render: (l: Lease) => `$${l.monthly_rent.toLocaleString()}`,
        },
        {
            key: 'period',
            label: 'Period',
            hideOnMobile: true,
            render: (l: Lease) => (
                <span className="text-xs">
                    {new Date(l.start_date).toLocaleDateString()} - {new Date(l.end_date).toLocaleDateString()}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (l: Lease) => <StatusBadge status={l.status} />,
        },
        {
            key: 'actions',
            label: '',
            className: 'w-12',
            render: (l: Lease) => (
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/owner/leases/${l.id}`}>
                        <Eye className="h-4 w-4" />
                    </Link>
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Leases" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Leases</h1>
                <DataTable
                    columns={columns}
                    data={leases.data}
                    meta={leases.meta}
                    search={filters.search}
                    searchPlaceholder="Search by renter name..."
                    createRoute={create().url}
                    createLabel="Create Lease"
                />
            </div>
        </>
    );
}
