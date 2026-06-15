import { type ReactNode } from 'react';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PropertyType, PropertyStatus } from '@/types/property';

export interface PropertyFormData {
    name: string;
    type: PropertyType;
    status: PropertyStatus;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    description?: string;
}

export function PropertyForm({
    action,
    method = 'post',
    initialData,
    children,
}: {
    action: string | ((options?: any) => any);
    method?: 'post' | 'patch';
    initialData?: Partial<PropertyFormData>;
    children?: ReactNode;
}) {
    return (
        <Form action={action} method={method} resetOnSuccess setDefaultsOnSuccess>
            {({ errors, processing }) => (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Property Name</Label>
                        <Input id="name" name="name" defaultValue={initialData?.name} required />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select name="type" defaultValue={initialData?.type ?? 'apartment_building'}>
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
                            <Select name="status" defaultValue={initialData?.status ?? 'active'}>
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
                        <Input id="address" name="address" defaultValue={initialData?.address} required />
                        {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" defaultValue={initialData?.city} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" name="state" defaultValue={initialData?.state} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="postal_code">Postal Code</Label>
                            <Input id="postal_code" name="postal_code" defaultValue={initialData?.postal_code} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description {initialData ? '' : '(optional)'}</Label>
                        <Textarea id="description" name="description" defaultValue={initialData?.description ?? ''} rows={4} />
                    </div>

                    {children}

                    <Button type="submit" disabled={processing}>
                        {initialData ? 'Update Property' : 'Create Property'}
                    </Button>
                </div>
            )}
        </Form>
    );
}
