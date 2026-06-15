import { Head, Link } from '@inertiajs/react';
import { Home, DollarSign, Wrench, Calendar, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { CardSummary } from '@/components/shared/card-summary';
import { EmptyState } from '@/components/shared/empty-state';
import { dashboard } from '@/routes/renter/dashboard';
import { show as myLease } from '@/routes/renter/lease/show';
import { index as payments } from '@/routes/renter/payments/index';
import { create as paymentsCreate } from '@/routes/renter/payments/create';
import { index as maintenance } from '@/routes/renter/maintenance/index';
import { create as maintenanceCreate } from '@/routes/renter/maintenance/create';
import type { Lease } from '@/types/lease';

export default function RenterDashboard({
    activeLease,
    stats,
    recentPayments,
    recentMaintenance,
}: {
    activeLease: Lease | null;
    stats: {
        hasActiveLease: boolean;
        leaseEndDate: string | null;
        daysUntilLeaseEnd: number;
        currentMonthPaymentStatus: string;
        currentMonthAmount: number;
        totalPaid: number;
    };
    recentPayments: { id: number; amount: number; due_date: string; status: string; paid_at: string | null }[];
    recentMaintenance: { id: number; title: string; status: string; priority: string; created_at: string }[];
}) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">My Dashboard</h1>

                {!stats.hasActiveLease ? (
                    <Card className="mb-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="h-6 w-6 text-amber-600" />
                                <div>
                                    <p className="font-semibold">No Active Lease</p>
                                    <p className="text-sm text-muted-foreground">You don't currently have an active lease. Contact your property manager for assistance.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <CardSummary
                                title="My Home"
                                value={activeLease?.property?.name ?? '—'}
                                description={`${activeLease?.unit?.name} · ${activeLease?.property?.city}, ${activeLease?.property?.state}`}
                                icon={<Home className="h-5 w-5" />}
                            />
                            <CardSummary
                                title="Monthly Rent"
                                value={`$${stats.currentMonthAmount.toLocaleString()}`}
                                description={`Lease ends ${new Date(stats.leaseEndDate ?? '').toLocaleDateString()}`}
                                icon={<DollarSign className="h-5 w-5" />}
                            />
                            <CardSummary
                                title="Payment Status"
                                value={stats.currentMonthPaymentStatus === 'paid' ? 'Paid' : stats.currentMonthPaymentStatus === 'pending' ? 'Due' : stats.currentMonthPaymentStatus === 'overdue' ? 'Overdue' : 'No Lease'}
                                icon={<Calendar className="h-5 w-5" />}
                                trend={
                                    stats.currentMonthPaymentStatus === 'paid'
                                        ? { direction: 'up', value: 'Current month' }
                                        : stats.currentMonthPaymentStatus === 'overdue'
                                            ? { direction: 'down', value: 'Overdue' }
                                            : undefined
                                }
                            />
                            <CardSummary
                                title="Total Paid"
                                value={`$${stats.totalPaid.toLocaleString()}`}
                                icon={<DollarSign className="h-5 w-5" />}
                            />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Active Lease Card */}
                            {activeLease && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            My Lease
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={myLease()}>View Details</Link>
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Property</span>
                                            <span className="text-sm font-medium">{activeLease.property?.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Unit</span>
                                            <span className="text-sm font-medium">{activeLease.unit?.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Monthly Rent</span>
                                            <span className="text-sm font-medium">${activeLease.monthly_rent.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Lease Ends</span>
                                            <span className="text-sm font-medium">
                                                {new Date(activeLease.end_date).toLocaleDateString()}
                                                {stats.daysUntilLeaseEnd > 0 && stats.daysUntilLeaseEnd <= 30 && (
                                                    <Badge variant="destructive" className="ml-2">
                                                        {stats.daysUntilLeaseEnd} days
                                                    </Badge>
                                                )}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-3">
                                        <Button size="sm" asChild>
                                            <Link href={paymentsCreate()}>
                                                <DollarSign className="mr-2 h-4 w-4" />Pay Rent
                                            </Link>
                                        </Button>
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={maintenanceCreate()}>
                                                <Wrench className="mr-2 h-4 w-4" />Report Issue
                                            </Link>
                                        </Button>
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={myLease()}>
                                                <FileText className="mr-2 h-4 w-4" />View Lease
                                            </Link>
                                        </Button>
                                        <Button size="sm" variant="ghost" asChild>
                                            <Link href={payments()}>
                                                Payment History
                                            </Link>
                                        </Button>
                                        <Button size="sm" variant="ghost" asChild>
                                            <Link href={maintenance()}>
                                                My Requests
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity */}
                        <div className="mt-6 grid gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Payments</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {recentPayments.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No payment history.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {recentPayments.slice(0, 5).map((payment) => (
                                                <div key={payment.id} className="flex items-center justify-between rounded-md border p-3">
                                                    <div>
                                                        <p className="text-sm font-medium">${payment.amount.toLocaleString()}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Due {new Date(payment.due_date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <StatusBadge status={payment.status} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Maintenance Requests</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {recentMaintenance.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No maintenance requests.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {recentMaintenance.slice(0, 5).map((req) => (
                                                <div key={req.id} className="flex items-center justify-between rounded-md border p-3">
                                                    <div>
                                                        <p className="text-sm font-medium">{req.title}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(req.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <StatusBadge status={req.status} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
