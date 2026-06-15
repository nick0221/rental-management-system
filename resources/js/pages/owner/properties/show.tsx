import { Head, Link } from '@inertiajs/react';
import { Building2, DoorOpen, Plus, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/status-badge';
import type { Property } from '@/types/property';
import type { Unit } from '@/types/unit';
import { create as propertiesCreate } from '@/routes/owner/properties';

interface ActiveLease {
    id: number;
    unit: { name: string };
    renter: { id: number; name: string; email: string; phone: string | null };
    end_date: string;
}

interface PendingMaintenance {
    id: number;
    title: string;
    unit: { name: string };
    reporter: { name: string };
    status: string;
    priority: string;
}

export default function ShowProperty({
    property,
    activeLeases,
    pendingMaintenance,
}: {
    property: Property & { units: (Unit & { leases_count: number })[] };
    activeLeases: ActiveLease[];
    pendingMaintenance: PendingMaintenance[];
}) {
    const unitsUrl = `/owner/properties/${property.id}/units`;

    return (
        <>
            <Head title={property.name} />
            <div className="p-6">
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold">{property.name}</h1>
                            <StatusBadge status={property.status} />
                        </div>
                        <p className="mt-1 text-muted-foreground">{property.address}, {property.city}, {property.state}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/owner/properties/${property.id}/edit`}>Edit</Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/owner/properties/${property.id}/units/create`}>
                                <Plus className="mr-2 h-4 w-4" />Add Unit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <DoorOpen className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                            <p className="text-2xl font-bold">{property.units?.length ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Total Units</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <Building2 className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                            <p className="text-2xl font-bold">{activeLeases.length}</p>
                            <p className="text-xs text-muted-foreground">Active Leases</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <span className="text-2xl font-bold capitalize">{property.type.replace(/_/g, ' ')}</span>
                            <p className="text-xs text-muted-foreground">Property Type</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <Wrench className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                            <p className="text-2xl font-bold">{pendingMaintenance.length}</p>
                            <p className="text-xs text-muted-foreground">Open Requests</p>
                        </CardContent>
                    </Card>
                </div>

                {property.description && (
                    <Card className="mb-6">
                        <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{property.description}</p>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Units</CardTitle>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={unitsUrl}>View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {property.units && property.units.length > 0 ? (
                                <div className="space-y-2">
                                    {property.units.slice(0, 10).map((unit) => (
                                        <div key={unit.id} className="flex items-center justify-between rounded-md border p-3">
                                            <div>
                                                <p className="text-sm font-medium">{unit.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {unit.bedrooms}bd · {unit.bathrooms}ba · ${unit.rent_amount.toLocaleString()}/mo
                                                </p>
                                            </div>
                                            <StatusBadge status={unit.status} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No units yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Active Leases</CardTitle></CardHeader>
                        <CardContent>
                            {activeLeases.length > 0 ? (
                                <div className="space-y-2">
                                    {activeLeases.map((lease) => (
                                        <div key={lease.id} className="flex items-center justify-between rounded-md border p-3">
                                            <div>
                                                <p className="text-sm font-medium">{lease.renter.name}</p>
                                                <p className="text-xs text-muted-foreground">{lease.unit?.name}</p>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                Expires {new Date(lease.end_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No active leases.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {pendingMaintenance.length > 0 && (
                    <Card className="mt-6">
                        <CardHeader><CardTitle>Open Maintenance Requests</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {pendingMaintenance.map((req) => (
                                    <div key={req.id} className="flex items-center justify-between rounded-md border p-3">
                                        <div>
                                            <p className="text-sm font-medium">{req.title}</p>
                                            <p className="text-xs text-muted-foreground">{req.unit?.name} · {req.reporter.name}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Badge variant="outline">{req.priority}</Badge>
                                            <StatusBadge status={req.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
