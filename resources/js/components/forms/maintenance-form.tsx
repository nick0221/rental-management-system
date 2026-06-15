import { type ReactNode } from 'react';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface MaintenanceFormData {
    title: string;
    description: string;
    priority: string;
    property_id?: number;
    unit_id?: number;
}

export function MaintenanceForm({
    action,
    method = 'post',
    initialData,
    hideLocation = false,
    lease,
    children,
}: {
    action: string | ((options?: any) => any);
    method?: 'post' | 'patch';
    initialData?: Partial<MaintenanceFormData>;
    hideLocation?: boolean;
    lease?: { property_id: number; unit_id: number };
    children?: ReactNode;
}) {
    return (
        <Form action={action} method={method} resetOnSuccess setDefaultsOnSuccess>
            {({ errors, processing }) => (
                <div className="space-y-6">
                    {hideLocation && lease && (
                        <>
                            <input type="hidden" name="property_id" value={lease.property_id} />
                            <input type="hidden" name="unit_id" value={lease.unit_id} />
                        </>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" defaultValue={initialData?.title} required placeholder="e.g. Leaking faucet" />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={initialData?.description}
                            rows={5}
                            required
                            placeholder="Please describe the issue in detail..."
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select name="priority" defaultValue={initialData?.priority ?? 'medium'}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="emergency">Emergency</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.priority && <p className="text-sm text-destructive">{errors.priority}</p>}
                    </div>

                    {children}

                    <Button type="submit" disabled={processing}>
                        {initialData ? 'Update Request' : 'Submit Request'}
                    </Button>
                </div>
            )}
        </Form>
    );
}
