import { Head, Link, usePage } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/shared/page-header';
import { store, index } from '@/routes/renter/maintenance';
import type { Lease } from '@/types/lease';

interface PageProps {
    lease: Lease & { property: { id: number; name: string }; unit: { id: number; name: string; unit_number: string | null } };
    [key: string]: unknown;
}

export default function CreateMaintenance() {
    const page = usePage<PageProps>();
    const { lease } = page.props;

    return (
        <>
            <Head title="New Maintenance Request" />
            <div className="p-6">
                <PageHeader
                    title="Submit Maintenance Request"
                    description={`${lease.property?.name} · ${lease.unit?.name}`}
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
                                <input type="hidden" name="property_id" value={lease.property_id} />
                                <input type="hidden" name="unit_id" value={lease.unit_id} />

                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" name="title" required placeholder="e.g. Leaking faucet" />
                                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        rows={5}
                                        required
                                        placeholder="Please describe the issue in detail..."
                                    />
                                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select name="priority" defaultValue="medium">
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

                                <Button type="submit" disabled={processing}>Submit Request</Button>
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}
