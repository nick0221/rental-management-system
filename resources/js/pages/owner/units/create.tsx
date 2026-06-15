import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { UnitForm } from '@/components/forms/unit-form';
import type { Property } from '@/types/property';

export default function CreateUnit({ property }: { property: Property }) {
    return (
        <>
            <Head title={`Add Unit - ${property.name}`} />
            <div className="p-6">
                <PageHeader
                    title={`Add Unit to ${property.name}`}
                    actions={
                        <Button variant="outline" asChild>
                            <Link href={`/owner/properties/${property.id}/units`}>Cancel</Link>
                        </Button>
                    }
                />

                <div className="max-w-lg">
                    <UnitForm action={`/owner/properties/${property.id}/units`} />
                </div>
            </div>
        </>
    );
}
