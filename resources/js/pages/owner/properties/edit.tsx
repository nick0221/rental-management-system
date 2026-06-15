import { Head, Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/shared/page-header';
import { update, destroy } from '@/routes/owner/properties/update';
import { index } from '@/routes/owner/properties/index';
import type { Property } from '@/types/property';

export default function EditProperty({ property }: { property: Property }) {
    return (
        <>
            <Head title={`Edit ${property.name}`} />
            <div className="p-6">
                <PageHeader
                    title={`Edit ${property.name}`}
                    actions={
                        <Button variant="outline" asChild>
                            <Link href={`/owner/properties/${property.id}`}>Cancel</Link>
                        </Button>
                    }
                />

                <div className="max-w-lg space-y-8">
                    <Form
                        action={update(property.id)}
                        method="patch"
                        defaults={{
                            name: property.name,
                            type: property.type,
                            status: property.status,
                            address: property.address,
                            city: property.city,
                            state: property.state,
                            postal_code: property.postal_code,
                            description: property.description ?? '',
                        }}
                    >
                        {({ errors, processing }) => (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Property Name</Label>
                                    <Input id="name" name="name" required />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Type</Label>
                                        <Select name="type" defaultValue={property.type}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="apartment_building">Apartment Building</SelectItem>
                                                <SelectItem value="house">House</SelectItem>
                                                <SelectItem value="commercial">Commercial</SelectItem>
                                                <SelectItem value="mixed_use">Mixed Use</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select name="status" defaultValue={property.status}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" name="address" required />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" name="city" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" name="state" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="postal_code">Postal Code</Label>
                                        <Input id="postal_code" name="postal_code" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" rows={4} />
                                </div>

                                <Button type="submit" disabled={processing}>Update Property</Button>
                            </div>
                        )}
                    </Form>

                    <div className="border-t pt-6">
                        <Form
                            action={destroy(property.id)}
                            method="delete"
                            onSubmit={(e) => {
                                if (!confirm('Are you sure you want to delete this property?')) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            <Button variant="destructive" type="submit">Delete Property</Button>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
