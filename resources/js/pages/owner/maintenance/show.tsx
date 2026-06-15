import { Head, Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/status-badge';
import type { MaintenanceRequest } from '@/types/maintenance';
import { show, update } from '@/routes/owner/maintenance/show';

export default function ShowMaintenance({ request }: { request: MaintenanceRequest }) {
    return (
        <>
            <Head title={request.title} />
            <div className="p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">{request.title}</h1>
                        <StatusBadge status={request.status} />
                        <Badge variant="outline">{request.priority}</Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground">
                        {request.property?.name} · {request.unit?.name}
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium">Description</p>
                                <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{request.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium">Reported By</p>
                                    <p className="text-sm text-muted-foreground">{request.reporter?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Reported On</p>
                                    <p className="text-sm text-muted-foreground">{new Date(request.created_at).toLocaleDateString()}</p>
                                </div>
                                {request.assignee && (
                                    <div>
                                        <p className="text-sm font-medium">Assigned To</p>
                                        <p className="text-sm text-muted-foreground">{request.assignee?.name}</p>
                                    </div>
                                )}
                                {request.completed_at && (
                                    <div>
                                        <p className="text-sm font-medium">Completed</p>
                                        <p className="text-sm text-muted-foreground">{new Date(request.completed_at).toLocaleDateString()}</p>
                                    </div>
                                )}
                                {request.cost && (
                                    <div>
                                        <p className="text-sm font-medium">Cost</p>
                                        <p className="text-sm text-muted-foreground">${request.cost.toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Update Status</CardTitle></CardHeader>
                        <CardContent>
                            <Form
                                action={update(request.id)}
                                method="patch"
                                defaults={{
                                    status: request.status,
                                    assignee_id: request.assignee_id?.toString() ?? '',
                                    scheduled_at: request.scheduled_at ? new Date(request.scheduled_at).toISOString().split('T')[0] : '',
                                    cost: request.cost?.toString() ?? '',
                                }}
                            >
                                {({ errors, processing }) => (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select name="status" defaultValue={request.status}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="approved">Approve</SelectItem>
                                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="scheduled_at">Scheduled Date</Label>
                                            <Input id="scheduled_at" name="scheduled_at" type="date" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="cost">Cost ($)</Label>
                                            <Input id="cost" name="cost" type="number" step="0.01" />
                                        </div>

                                        <Button type="submit" disabled={processing}>Update</Button>
                                    </div>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
