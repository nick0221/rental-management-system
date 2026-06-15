import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { UnitForm } from '@/components/forms/unit-form';
import type { Unit } from '@/types/unit';

export default function EditUnit({ unit }: { unit: Unit & { property: { id: number; name: string } } }) {
    return (
        <>
            <Head title={`Edit ${unit.name}`} />
            <div className="p-6">
                <PageHeader
                    title={`Edit ${unit.name}`}
                    description={`Property: ${unit.property?.name}`}
                    actions={
                        <Button variant="outline" asChild>
                            <Link href={`/owner/properties/${unit.property_id}`}>Back to Property</Link>
                        </Button>
                    }
                />

                <div className="max-w-lg space-y-8">
                    <UnitForm
                        action={`/owner/units/${unit.id}`}
                        method="patch"
                        initialData={{
                            name: unit.name,
                            unit_number: unit.unit_number ?? '',
                            floor: unit.floor?.toString() ?? '',
                            bedrooms: unit.bedrooms.toString(),
                            bathrooms: unit.bathrooms.toString(),
                            square_feet: unit.square_feet?.toString() ?? '',
                            rent_amount: unit.rent_amount.toString(),
                            security_deposit: unit.security_deposit?.toString() ?? '',
                            status: unit.status,
                        }}
                    />

                    <div className="border-t pt-6">
                        <form action={`/owner/units/${unit.id}`} method="POST">
                            <input type="hidden" name="_method" value="DELETE" />
                            <Button variant="destructive" type="submit"
                                onClick={(e) => {
                                    if (!confirm('Delete this unit?')) e.preventDefault();
                                }}
                            >
                                Delete Unit
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
