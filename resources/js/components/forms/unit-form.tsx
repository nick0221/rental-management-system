import { type ReactNode } from 'react';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UnitStatus } from '@/types/unit';

export interface UnitFormData {
    name: string;
    unit_number?: string;
    floor?: string;
    bedrooms: string;
    bathrooms: string;
    square_feet?: string;
    rent_amount: string;
    security_deposit?: string;
    status: UnitStatus;
}

export function UnitForm({
    action,
    method = 'post',
    initialData,
    children,
}: {
    action: string | ((options?: any) => any);
    method?: 'post' | 'patch';
    initialData?: Partial<UnitFormData>;
    children?: ReactNode;
}) {
    return (
        <Form action={action} method={method} resetOnSuccess setDefaultsOnSuccess>
            {({ errors, processing }) => (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="name">Unit Name</Label>
                        <Input id="name" name="name" defaultValue={initialData?.name} required placeholder="e.g. Unit 101" />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="unit_number">Unit Number</Label>
                        <Input id="unit_number" name="unit_number" defaultValue={initialData?.unit_number ?? ''} placeholder="101" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="floor">Floor</Label>
                        <Input id="floor" name="floor" type="number" defaultValue={initialData?.floor ?? ''} placeholder="1" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input id="bedrooms" name="bedrooms" type="number" defaultValue={initialData?.bedrooms ?? '1'} required />
                        {errors.bedrooms && <p className="text-sm text-destructive">{errors.bedrooms}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input id="bathrooms" name="bathrooms" type="number" defaultValue={initialData?.bathrooms ?? '1'} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="square_feet">Square Feet</Label>
                        <Input id="square_feet" name="square_feet" type="number" defaultValue={initialData?.square_feet ?? ''} placeholder="750" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rent_amount">Rent Amount ($)</Label>
                        <Input id="rent_amount" name="rent_amount" type="number" step="0.01" defaultValue={initialData?.rent_amount} required />
                        {errors.rent_amount && <p className="text-sm text-destructive">{errors.rent_amount}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="security_deposit">Security Deposit ($)</Label>
                        <Input id="security_deposit" name="security_deposit" type="number" step="0.01" defaultValue={initialData?.security_deposit ?? ''} />
                    </div>

                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={initialData?.status ?? 'available'}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="occupied">Occupied</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                <SelectItem value="reserved">Reserved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {children}

                    <div className="col-span-2">
                        <Button type="submit" disabled={processing}>
                            {initialData ? 'Update Unit' : 'Create Unit'}
                        </Button>
                    </div>
                </div>
            )}
        </Form>
    );
}
