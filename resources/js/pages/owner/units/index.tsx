import { Head, Link } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import type { Property } from '@/types/property';
import type { Unit } from '@/types/unit';

interface PaginatedUnits {
    data: Unit[];
    meta: { current_page: number; last_page: number; total: number; from: number; to: number };
}

export default function UnitsIndex({ property, units }: { property: Property; units: PaginatedUnits }) {
    const columns = [
        { key: 'name', label: 'Name', sortable: true, render: (u: Unit) => <span className="font-medium">{u.name}</span> },
        {
            key: 'details',
            label: 'Details',
            hideOnMobile: true,
            render: (u: Unit) => (
                <span className="text-sm text-muted-foreground">
                    {u.bedrooms}bd · {u.bathrooms}ba
                    {u.square_feet ? ` · ${u.square_feet} sqft` : ''}
                </span>
            ),
        },
        {
            key: 'rent_amount',
            label: 'Rent',
            render: (u: Unit) => `$${u.rent_amount.toLocaleString()}`,
        },
        {
            key: 'status',
            label: 'Status',
            render: (u: Unit) => <StatusBadge status={u.status} />,
        },
        {
            key: 'leases_count',
            label: 'Active Lease',
            className: 'text-center',
            render: (u: Unit & { leases_count?: number }) => (u.leases_count && u.leases_count > 0 ? 'Yes' : '—'),
        },
        {
            key: 'actions',
            label: '',
            className: 'w-12',
            render: (u: Unit) => (
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/owner/units/${u.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                    </Link>
                </Button>
            ),
        },
    ] as const;

    return (
        <>
            <Head title={`Units - ${property.name}`} />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{property.name} - Units</h1>
                        <p className="text-sm text-muted-foreground">{property.units_count} total units</p>
                    </div>
                    <Button asChild>
                        <Link href={`/owner/properties/${property.id}/units/create`}>
                            <Plus className="mr-2 h-4 w-4" />Add Unit
                        </Link>
                    </Button>
                </div>

                <DataTable columns={columns} data={units.data} meta={units.meta} searchPlaceholder="Search units..." />
            </div>
        </>
    );
}
