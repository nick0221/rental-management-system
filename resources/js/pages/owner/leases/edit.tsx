import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { LeaseForm } from '@/components/forms/lease-form';
import { index } from '@/routes/owner/leases';
import type { Property } from '@/types/property';
import type { Unit } from '@/types/unit';
import type { Lease } from '@/types/lease';

interface PageProps {
    lease: Lease & { property: { id: number; name: string }; unit: { id: number; name: string }; renter: { id: number; name: string; email: string } };
    properties: (Property & { units: Unit[] })[];
    renters: { id: number; name: string; email: string }[];
}

export default function EditLease({ lease, properties, renters }: PageProps) {
    return (
        <>
            <Head title={`Edit Lease - ${lease.property?.name}`} />
            <div className="p-6">
                <PageHeader
                    title="Edit Lease"
                    description={`${lease.property?.name} · ${lease.unit?.name} · ${lease.renter?.name}`}
                    actions={
                        <Button variant="outline" asChild>
                            <Link href={index().url}>Cancel</Link>
                        </Button>
                    }
                />

                <div className="max-w-lg">
                    <LeaseForm
                        action={`/owner/leases/${lease.id}`}
                        method="patch"
                        initialData={{
                            property_id: lease.property_id.toString(),
                            unit_id: lease.unit_id.toString(),
                            renter_id: lease.renter_id.toString(),
                            start_date: lease.start_date,
                            end_date: lease.end_date,
                            monthly_rent: lease.monthly_rent.toString(),
                            security_deposit: lease.security_deposit?.toString(),
                            terms: lease.terms ?? '',
                        }}
                        properties={properties}
                        renters={renters}
                    />
                </div>

                <div className="max-w-lg border-t pt-6 mt-6">
                    <h3 className="text-sm font-medium text-destructive mb-2">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Once you delete a lease, this action cannot be undone. The unit will be marked as available.
                    </p>
                    <form action={`/owner/leases/${lease.id}`} method="POST">
                        <input type="hidden" name="_method" value="DELETE" />
                        <Button variant="destructive" type="submit"
                            onClick={(e) => {
                                if (!confirm('Are you sure you want to delete this lease?')) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            Delete Lease
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
