import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import type { Lease } from '@/types/lease';

export default function ShowLease({ lease }: { lease: Lease }) {
    const totalPaid = lease.payments?.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) ?? 0;
    const paymentCount = lease.payments?.length ?? 0;

    return (
        <>
            <Head title={`Lease - ${lease.renter?.name}`} />
            <div className="p-6">
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold">{lease.renter?.name}</h1>
                            <StatusBadge status={lease.status} />
                        </div>
                        <p className="mt-1 text-muted-foreground">
                            {lease.property?.name} · {lease.unit?.name}
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={`/owner/leases/${lease.id}/edit`}>Edit</Link>
                    </Button>
                </div>

                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold">${lease.monthly_rent.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Monthly Rent</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold">${totalPaid.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Total Paid ({paymentCount} payments)</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold">{new Date(lease.start_date).toLocaleDateString()}</p>
                            <p className="text-xs text-muted-foreground">Start Date</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold">{new Date(lease.end_date).toLocaleDateString()}</p>
                            <p className="text-xs text-muted-foreground">End Date</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Renter Details</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm"><span className="font-medium">Name:</span> {lease.renter?.name}</p>
                            <p className="text-sm"><span className="font-medium">Email:</span> {lease.renter?.email}</p>
                            {lease.renter?.phone && (
                                <p className="text-sm"><span className="font-medium">Phone:</span> {lease.renter?.phone}</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Security Deposit</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                ${lease.security_deposit?.toLocaleString() ?? '—'}
                            </p>
                            {lease.signed_at && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Signed on {new Date(lease.signed_at).toLocaleDateString()}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {lease.terms && (
                    <Card className="mt-6">
                        <CardHeader><CardTitle>Lease Terms</CardTitle></CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{lease.terms}</p>
                        </CardContent>
                    </Card>
                )}

                {lease.payments && lease.payments.length > 0 && (
                    <Card className="mt-6">
                        <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {lease.payments.slice(0, 12).reverse().map((payment: { id: number; amount: number; due_date: string; status: string; paid_at: string | null }) => (
                                    <div key={payment.id} className="flex items-center justify-between rounded-md border p-3">
                                        <div>
                                            <p className="text-sm font-medium">
                                                ${payment.amount.toLocaleString()} — Due {new Date(payment.due_date).toLocaleDateString()}
                                            </p>
                                            {payment.paid_at && (
                                                <p className="text-xs text-muted-foreground">
                                                    Paid {new Date(payment.paid_at).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                        <StatusBadge status={payment.status} />
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
