import { Head, Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/shared/page-header';
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
                    <Form action={store()} method="post" resetOnSuccess setDefaultsOnSuccess>
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
                                        <Select name="type" defaultValue="apartment_building">
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
                                        <Select name="status" defaultValue="active">
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
                                    <Label htmlFor="description">Description (optional)</Label>
                                    <Textarea id="description" name="description" rows={4} />
                                </div>

                                <Button type="submit" disabled={processing}>Create Property</Button>
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}
