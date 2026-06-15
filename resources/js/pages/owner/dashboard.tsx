import { Head, Link } from '@inertiajs/react';
import { Building2, DoorOpen, DollarSign, Wrench, UserCheck, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CardSummary } from '@/components/shared/card-summary';
import { StatusBadge } from '@/components/shared/status-badge';
import { dashboard } from '@/routes/owner/dashboard';
import { create } from '@/routes/owner/properties/create';
import { index as propertiesIndex } from '@/routes/owner/properties/index';
import { index as leasesIndex } from '@/routes/owner/leases/index';
import { index as maintenanceIndex } from '@/routes/owner/maintenance/index';

interface DashboardStats {
    totalProperties: number;
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    activeLeases: number;
    monthlyRevenue: number;
    pendingMaintenance: number;
}

export default function OwnerDashboard({
    stats,
    properties,
    expiringLeases,
    revenuePerProperty,
}: {
    stats: DashboardStats;
    properties: { id: number; name: string; units_count: number }[];
    expiringLeases: { id: number; end_date: string; unit: { name: string }; renter: { name: string } }[];
    revenuePerProperty: { id: number; name: string; units_count: number; active_leases: number }[];
}) {
    const occupancyRate = stats.totalUnits > 0 ? Math.round((stats.occupiedUnits / stats.totalUnits) * 100) : 0;

    return (
        <>
            <Head title="Owner Dashboard" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">My Dashboard</h1>

                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <CardSummary title="My Properties" value={stats.totalProperties} icon={<Building2 className="h-5 w-5" />} />
                    <CardSummary
                        title="Occupancy"
                        value={`${occupancyRate}%`}
                        description={`${stats.occupiedUnits} of ${stats.totalUnits} units`}
                        icon={<DoorOpen className="h-5 w-5" />}
                    />
                    <CardSummary
                        title="Monthly Revenue"
                        value={`$${stats.monthlyRevenue.toLocaleString()}`}
                        description={`${stats.activeLeases} active leases`}
                        icon={<DollarSign className="h-5 w-5" />}
                    />
                    <CardSummary
                        title="Pending Maintenance"
                        value={stats.pendingMaintenance}
                        icon={<Wrench className="h-5 w-5" />}
                        trend={stats.pendingMaintenance > 0 ? { direction: 'up', value: 'Needs attention' } : undefined}
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                <Button asChild>
                                    <Link href={create().url}>
                                        <Building2 className="mr-2 h-4 w-4" />Add Property
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={leasesIndex({ status: 'active' }).url}>
                                        <UserCheck className="mr-2 h-4 w-4" />Active Leases
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={maintenanceIndex({ status: 'reported' }).url}>
                                        <Wrench className="mr-2 h-4 w-4" />Maintenance
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Expiring Leases */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                Expiring Leases (30 days)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {expiringLeases.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No leases expiring soon.</p>
                            ) : (
                                <div className="space-y-3">
                                    {expiringLeases.map((lease) => (
                                        <div key={lease.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium">{lease.renter.name}</p>
                                                <p className="text-xs text-muted-foreground">{lease.unit?.name}</p>
                                            </div>
                                            <span className="text-xs text-amber-600">
                                                Expires {new Date(lease.end_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Revenue Per Property */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Revenue Per Property</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {revenuePerProperty.map((p) => (
                                <div key={p.id} className="flex items-center justify-between">
                                    <div>
                                        <Link href={propertiesIndex.url({ property: p.id })} className="text-sm font-medium hover:underline">
                                            {p.name}
                                        </Link>
                                        <p className="text-xs text-muted-foreground">{p.units_count} units · {p.active_leases} leases</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
