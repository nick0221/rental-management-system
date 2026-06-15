import { Head, Link } from '@inertiajs/react';
import { Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import type { Property } from '@/types/property';
import { create } from '@/routes/owner/properties';

interface PaginatedData {
    data: Property[];
    meta: { current_page: number; last_page: number; total: number; from: number; to: number };
}

export default function PropertiesIndex({ properties, filters }: { properties: PaginatedData; filters: { search?: string } }) {
    const columns = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (p: Property) => (
                <div>
                    <Link href={`/owner/properties/${p.id}`} className="font-medium hover:underline">
                        {p.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{p.city}, {p.state}</p>
                </div>
            ),
        },
        {
            key: 'type',
            label: 'Type',
            hideOnMobile: true,
            render: (p: Property) => <span className="capitalize">{p.type.replace(/_/g, ' ')}</span>,
        },
        {
            key: 'status',
            label: 'Status',
            render: (p: Property) => <StatusBadge status={p.status} />,
        },
        {
            key: 'units_count',
            label: 'Units',
            className: 'text-center',
            render: (p: Property & { units_count?: number }) => p.units_count ?? '—',
        },
        {
            key: 'leases_count',
            label: 'Active Leases',
            className: 'text-center hidden md:table-cell',
            render: (p: Property & { leases_count?: number }) => p.leases_count ?? 0,
        },
        {
            key: 'actions',
            label: '',
            className: 'w-20',
            render: (p: Property) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/owner/properties/${p.id}`}>
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/owner/properties/${p.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="My Properties" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">My Properties</h1>
                <DataTable
                    columns={columns}
                    data={properties.data}
                    meta={properties.meta}
                    search={filters.search}
                    searchPlaceholder="Search properties..."
                    createRoute={create().url}
                    createLabel="Add Property"
                />
            </div>
        </>
    );
}
