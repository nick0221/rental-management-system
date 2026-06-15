import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { PropertyForm } from '@/components/forms/property-form';
import { index } from '@/routes/admin/properties';
import type { Property } from '@/types/property';

export default function EditProperty({ property }: { property: Property }) {
    return (
        <>
            <Head title={`Edit ${property.name}`} />
            <div className="p-6">
                <PageHeader
                    title={`Edit ${property.name}`}
                    description="Update property details."
                    actions={
                        <Button variant="outline" asChild>
                            <Link href={index().url}>Back to Properties</Link>
                        </Button>
                    }
                />

                <div className="max-w-lg space-y-8">
                    <PropertyForm
                        action={`/admin/properties/${property.id}`}
                        method="patch"
                        initialData={{
                            name: property.name,
                            type: property.type,
                            status: property.status,
                            address: property.address,
                            city: property.city,
                            state: property.state,
                            postal_code: property.postal_code,
                            description: property.description ?? '',
                        }}
                    />

                    <div className="border-t pt-6">
                        <form action={`/admin/properties/${property.id}`} method="POST">
                            <input type="hidden" name="_method" value="DELETE" />
                            <Button variant="destructive" type="submit"
                                onClick={(e) => {
                                    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                Delete Property
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
