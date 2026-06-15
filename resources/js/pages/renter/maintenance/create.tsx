import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { MaintenanceForm } from '@/components/forms/maintenance-form';
import { store, index } from '@/routes/renter/maintenance';
import type { Lease } from '@/types/lease';

interface PageProps {
    lease: Lease & { property: { id: number; name: string }; unit: { id: number; name: string; unit_number: string | null } };
    [key: string]: unknown;
}

export default function CreateMaintenance() {
    const page = usePage<PageProps>();
    const { lease } = page.props;

    return (
        <>
            <Head title="New Maintenance Request" />
            <div className="p-6">
                <PageHeader
                    title="Submit Maintenance Request"
                    description={`${lease.property?.name} · ${lease.unit?.name}`}
                    actions={
                        <Button variant="outline" asChild>
                            <Link href={index().url}>Cancel</Link>
                        </Button>
                    }
                />

                <div className="max-w-lg">
                    <MaintenanceForm
                        action={store()}
                        hideLocation
                        lease={{
                            property_id: lease.property_id,
                            unit_id: lease.unit_id,
                        }}
                    />
                </div>
            </div>
        </>
    );
}
