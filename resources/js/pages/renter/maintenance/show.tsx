import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/status-badge';
import type { MaintenanceRequest } from '@/types/maintenance';
import { index } from '@/routes/renter/maintenance/index';

export default function ShowMaintenance({ request }: { request: MaintenanceRequest }) {
    return (
        <>
            <Head title={request.title} />
            <div className="p-6">
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold">{request.title}</h1>
                            <StatusBadge status={request.status} />
                            <Badge variant="outline">{request.priority}</Badge>
                        </div>
                        <p className="mt-1 text-muted-foreground">
                            {request.property?.name} · {request.unit?.name}
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={index().url}>Back</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap text-sm text-muted-foreground">{request.description}</p>
                    </CardContent>
                </Card>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Status Timeline</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Reported</span>
                                <span className="text-sm">{new Date(request.created_at).toLocaleDateString()}</span>
                            </div>
                            {request.scheduled_at && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Scheduled</span>
                                    <span className="text-sm">{new Date(request.scheduled_at).toLocaleDateString()}</span>
                                </div>
                            )}
                            {request.completed_at && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Completed</span>
                                    <span className="text-sm">{new Date(request.completed_at).toLocaleDateString()}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Current Status</span>
                                <StatusBadge status={request.status} />
                            </div>
                        </CardContent>
                    </Card>

                    {request.assignee && (
                        <Card>
                            <CardHeader><CardTitle>Assigned To</CardTitle></CardHeader>
                            <CardContent>
                                <p className="font-medium">{request.assignee.name}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
