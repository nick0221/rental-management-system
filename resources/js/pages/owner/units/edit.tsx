import { Head, Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/shared/page-header';
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
                    <Form
                        action={`/owner/units/${unit.id}`}
                        method="patch"
                        defaults={{
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
                    >
                        {({ errors, processing }) => (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="name">Unit Name</Label>
                                    <Input id="name" name="name" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit_number">Unit Number</Label>
                                    <Input id="unit_number" name="unit_number" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="floor">Floor</Label>
                                    <Input id="floor" name="floor" type="number" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bedrooms">Bedrooms</Label>
                                    <Input id="bedrooms" name="bedrooms" type="number" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bathrooms">Bathrooms</Label>
                                    <Input id="bathrooms" name="bathrooms" type="number" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="square_feet">Square Feet</Label>
                                    <Input id="square_feet" name="square_feet" type="number" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rent_amount">Rent Amount ($)</Label>
                                    <Input id="rent_amount" name="rent_amount" type="number" step="0.01" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="security_deposit">Security Deposit ($)</Label>
                                    <Input id="security_deposit" name="security_deposit" type="number" step="0.01" />
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select name="status" defaultValue={unit.status}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="occupied">Occupied</SelectItem>
                                            <SelectItem value="maintenance">Maintenance</SelectItem>
                                            <SelectItem value="reserved">Reserved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="col-span-2">
                                    <Button type="submit" disabled={processing}>Update Unit</Button>
                                </div>
                            </div>
                        )}
                    </Form>

                    <div className="border-t pt-6">
                        <Form
                            action={`/owner/units/${unit.id}`}
                            method="delete"
                            onSubmit={(e) => {
                                if (!confirm('Delete this unit?')) e.preventDefault();
                            }}
                        >
                            <Button variant="destructive" type="submit">Delete Unit</Button>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
