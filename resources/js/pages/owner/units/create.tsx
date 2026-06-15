import { Head, Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
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
                    <Form
                        action={`/owner/properties/${property.id}/units`}
                        method="post"
                        resetOnSuccess
                        setDefaultsOnSuccess
                    >
                        {({ errors, processing }) => (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="name">Unit Name</Label>
                                    <Input id="name" name="name" required placeholder="e.g. Unit 101" />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit_number">Unit Number</Label>
                                    <Input id="unit_number" name="unit_number" placeholder="101" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="floor">Floor</Label>
                                    <Input id="floor" name="floor" type="number" placeholder="1" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bedrooms">Bedrooms</Label>
                                    <Input id="bedrooms" name="bedrooms" type="number" defaultValue="1" required />
                                    {errors.bedrooms && <p className="text-sm text-destructive">{errors.bedrooms}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bathrooms">Bathrooms</Label>
                                    <Input id="bathrooms" name="bathrooms" type="number" defaultValue="1" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="square_feet">Square Feet</Label>
                                    <Input id="square_feet" name="square_feet" type="number" placeholder="750" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rent_amount">Rent Amount ($)</Label>
                                    <Input id="rent_amount" name="rent_amount" type="number" step="0.01" required />
                                    {errors.rent_amount && <p className="text-sm text-destructive">{errors.rent_amount}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="security_deposit">Security Deposit ($)</Label>
                                    <Input id="security_deposit" name="security_deposit" type="number" step="0.01" />
                                </div>

                                <div className="col-span-2">
                                    <Button type="submit" disabled={processing}>Create Unit</Button>
                                </div>
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}
