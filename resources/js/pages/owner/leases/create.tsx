import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { LeaseForm } from '@/components/forms/lease-form';
import { store, index } from '@/routes/owner/leases';
import type { Property } from '@/types/property';
import type { Unit } from '@/types/unit';

interface PageProps {
    properties: (Property & { units: Unit[] })[];
    renters: { id: number; name: string; email: string }[];
    [key: string]: unknown;
}

export default function CreateLease() {
    const page = usePage<PageProps>();
    const { properties, renters } = page.props;

    return (
        <>
            <Head title="Create Lease" />
            <div className="p-6">
                <PageHeader
                    title="Create Lease"
                    description="Create a new lease agreement."
                    actions={
                        <Button variant="outline" asChild>
                            <Link href={index().url}>Cancel</Link>
                        </Button>
                    }
                />

                <div className="max-w-lg">
                    <LeaseForm
                        action={store()}
                        properties={properties}
                        renters={renters}
                    />
                </div>
            </div>
        </>
    );
}
