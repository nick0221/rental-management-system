import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { PropertyForm } from '@/components/forms/property-form';
import { store, index } from '@/routes/owner/properties';

export default function CreateProperty() {
    return (
        <>
            <Head title="Add Property" />
            <div className="p-6">
                <PageHeader
                    title="Add Property"
                    description="Register a new property in your portfolio."
                    actions={
                        <Button variant="outline" asChild>
                            <Link href={index().url}>Cancel</Link>
                        </Button>
                    }
                />

                <div className="max-w-lg">
                    <PropertyForm action={store()} />
                </div>
            </div>
        </>
    );
}
