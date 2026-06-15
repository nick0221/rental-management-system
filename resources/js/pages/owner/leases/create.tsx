import { Head, Link, usePage } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/shared/page-header';
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

    const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
    const selectedProperty = properties.find((p) => p.id.toString() === selectedPropertyId);
    const availableUnits = selectedProperty?.units ?? [];

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
                    <Form action={store()} method="post" resetOnSuccess setDefaultsOnSuccess>
                        {({ errors, processing }) => (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="property_id">Property</Label>
                                    <Select
                                        name="property_id"
                                        defaultValue=""
                                        onValueChange={(v) => setSelectedPropertyId(v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select property" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {properties.map((p) => (
                                                <SelectItem key={p.id} value={p.id.toString()}>
                                                    {p.name} ({p.units.length} units available)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.property_id && <p className="text-sm text-destructive">{errors.property_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit_id">Unit</Label>
                                    <Select name="unit_id" defaultValue="" disabled={!selectedProperty}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={selectedProperty ? 'Select unit' : 'Select a property first'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableUnits.map((u) => (
                                                <SelectItem key={u.id} value={u.id.toString()}>
                                                    {u.name} — ${u.rent_amount}/mo ({u.bedrooms}bd/{u.bathrooms}ba)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.unit_id && <p className="text-sm text-destructive">{errors.unit_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="renter_id">Renter</Label>
                                    <Select name="renter_id" defaultValue="">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select renter" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {renters.map((r) => (
                                                <SelectItem key={r.id} value={r.id.toString()}>
                                                    {r.name} ({r.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.renter_id && <p className="text-sm text-destructive">{errors.renter_id}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">Start Date</Label>
                                        <Input id="start_date" name="start_date" type="date" required />
                                        {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">End Date</Label>
                                        <Input id="end_date" name="end_date" type="date" required />
                                        {errors.end_date && <p className="text-sm text-destructive">{errors.end_date}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="monthly_rent">Monthly Rent ($)</Label>
                                        <Input id="monthly_rent" name="monthly_rent" type="number" step="0.01" required />
                                        {errors.monthly_rent && <p className="text-sm text-destructive">{errors.monthly_rent}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="security_deposit">Security Deposit ($)</Label>
                                        <Input id="security_deposit" name="security_deposit" type="number" step="0.01" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="terms">Terms & Conditions (optional)</Label>
                                    <Textarea id="terms" name="terms" rows={4} />
                                </div>

                                <Button type="submit" disabled={processing}>Create Lease</Button>
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}
