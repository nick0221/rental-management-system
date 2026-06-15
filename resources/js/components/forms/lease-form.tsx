import { type ReactNode, useState } from 'react';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Property } from '@/types/property';
import type { Unit } from '@/types/unit';

export interface LeaseFormData {
    property_id: string;
    unit_id: string;
    renter_id: string;
    start_date: string;
    end_date: string;
    monthly_rent: string;
    security_deposit?: string;
    terms?: string;
}

export function LeaseForm({
    action,
    method = 'post',
    initialData,
    properties,
    renters,
    children,
}: {
    action: string | ((options?: any) => any);
    method?: 'post' | 'patch';
    initialData?: Partial<LeaseFormData>;
    properties: (Property & { units: Unit[] })[];
    renters: { id: number; name: string; email: string }[];
    children?: ReactNode;
}) {
    const [selectedPropertyId, setSelectedPropertyId] = useState<string>(initialData?.property_id ?? '');
    const selectedProperty = properties.find((p) => p.id.toString() === selectedPropertyId);
    const availableUnits = selectedProperty?.units ?? [];

    return (
        <Form action={action} method={method} resetOnSuccess setDefaultsOnSuccess>
            {({ errors, processing }) => (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="property_id">Property</Label>
                        <Select
                            name="property_id"
                            defaultValue={initialData?.property_id ?? ''}
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
                        <Select name="unit_id" defaultValue={initialData?.unit_id ?? ''} disabled={!selectedProperty && !initialData}>
                            <SelectTrigger>
                                <SelectValue placeholder={selectedProperty || initialData ? 'Select unit' : 'Select a property first'} />
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
                        <Select name="renter_id" defaultValue={initialData?.renter_id ?? ''}>
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
                            <Input id="start_date" name="start_date" type="date" defaultValue={initialData?.start_date} required />
                            {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end_date">End Date</Label>
                            <Input id="end_date" name="end_date" type="date" defaultValue={initialData?.end_date} required />
                            {errors.end_date && <p className="text-sm text-destructive">{errors.end_date}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="monthly_rent">Monthly Rent ($)</Label>
                            <Input id="monthly_rent" name="monthly_rent" type="number" step="0.01" defaultValue={initialData?.monthly_rent} required />
                            {errors.monthly_rent && <p className="text-sm text-destructive">{errors.monthly_rent}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="security_deposit">Security Deposit ($)</Label>
                            <Input id="security_deposit" name="security_deposit" type="number" step="0.01" defaultValue={initialData?.security_deposit ?? ''} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="terms">Terms & Conditions (optional)</Label>
                        <Textarea id="terms" name="terms" defaultValue={initialData?.terms ?? ''} rows={4} />
                    </div>

                    {children}

                    <Button type="submit" disabled={processing}>
                        {initialData ? 'Update Lease' : 'Create Lease'}
                    </Button>
                </div>
            )}
        </Form>
    );
}
