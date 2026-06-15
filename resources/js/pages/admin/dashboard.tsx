import { Head } from '@inertiajs/react';
import { Building2, DollarSign, Users, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CardSummary } from '@/components/shared/card-summary';
import { dashboard } from '@/routes/admin';

interface Stats {
    totalUsers: number;
    totalOwners: number;
    totalRenters: number;
    totalProperties: number;
    totalUnits: number;
    totalActiveLeases: number;
    monthlyRevenue: number;
    pendingMaintenance: number;
}

interface MonthlyRevenue {
    month: string;
    revenue: number;
}

interface RecentUser {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

export default function AdminDashboard({
    stats,
    recentUsers,
    monthlyRevenue,
}: {
    stats: Stats;
    recentUsers: RecentUser[];
    monthlyRevenue: MonthlyRevenue[];
}) {
    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>

                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <CardSummary
                        title="Total Users"
                        value={stats.totalUsers}
                        description={`${stats.totalOwners} owners · ${stats.totalRenters} renters`}
                        icon={<Users className="h-5 w-5" />}
                    />
                    <CardSummary
                        title="Properties"
                        value={stats.totalProperties}
                        description={`${stats.totalUnits} total units`}
                        icon={<Building2 className="h-5 w-5" />}
                    />
                    <CardSummary
                        title="Monthly Revenue"
                        value={`$${Number(stats.monthlyRevenue).toLocaleString()}`}
                        description={`${stats.totalActiveLeases} active leases`}
                        icon={<DollarSign className="h-5 w-5" />}
                    />
                    <CardSummary
                        title="Pending Maintenance"
                        value={stats.pendingMaintenance}
                        description="Requests needing attention"
                        icon={<Wrench className="h-5 w-5" />}
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Revenue (12 months)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {monthlyRevenue.map((item) => (
                                    <div key={item.month} className="flex items-center gap-4">
                                        <span className="w-20 text-sm text-muted-foreground">{item.month}</span>
                                        <div className="flex-1">
                                            <div className="h-5 rounded bg-primary/20">
                                                <div
                                                    className="h-5 rounded bg-primary"
                                                    style={{
                                                        width: `${Math.min((item.revenue / Math.max(...monthlyRevenue.map((r) => r.revenue), 1)) * 100, 100)}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <span className="w-24 text-right text-sm font-medium">
                                            ${Number(item.revenue).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs capitalize text-muted-foreground">
                                                {user.role.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
