import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import type { Property } from '@/types/property';
import { index, create } from '@/routes/admin/properties';

interface PaginatedProperties {
    data: Property[];
    meta: { current_page: number; last_page: number; total: number; from: number; to: number };
}

export default function PropertiesIndex({ properties, filters }: { properties: PaginatedProperties; filters: { search?: string } }) {
    const columns = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (p: Property) => (
                <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.city}, {p.state}</p>
                </div>
            ),
        },
        {
            key: 'owner',
            label: 'Owner',
            hideOnMobile: true,
            render: (p: Property) => p.owner?.name || '—',
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
            render: (p: Property) => p.units_count ?? '—',
        },
        {
            key: 'actions',
            label: '',
            className: 'w-12',
            render: (p: Property) => (
                <Button variant="ghost" size="icon" asChild>
                    <Link href={index.url({ property: p.id })}>
                        <Pencil className="h-4 w-4" />
                    </Link>
                </Button>
            ),
        },
    ] as const;

    return (
        <>
            <Head title="Properties" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Properties</h1>
                <DataTable
                    columns={columns}
                    data={properties.data}
                    meta={properties.meta}
                    search={filters.search}
                    searchPlaceholder="Search properties..."
                    createRoute={create().url}
                    createLabel="Create Property"
                />
            </div>
        </>
    );
}
