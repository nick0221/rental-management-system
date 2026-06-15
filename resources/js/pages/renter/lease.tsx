import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import type { Lease } from '@/types/lease';

export default function MyLease({ lease, message, paymentStatus }: { lease: Lease | null; message?: string; paymentStatus?: { id: number; amount: number; due_date: string; status: string } }) {
    if (!lease) {
        return (
            <>
                <Head title="My Lease" />
                <div className="p-6">
                    <Card>
                        <CardContent className="p-8 text-center">
                            <p className="text-lg font-medium text-muted-foreground">{message || 'No lease found.'}</p>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    const totalPaid = lease.payments?.filter((p) => typeof p === 'object' && p.status === 'paid').reduce((sum, p) => sum + (typeof p === 'object' ? p.amount : 0), 0) ?? 0;

    return (
        <>
            <Head title="My Lease" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">My Lease</h1>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Property Details</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Property</p>
                                <p className="font-medium">{lease.property?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Address</p>
                                <p className="font-medium">
                                    {lease.property?.address}
                                    <br />{lease.property?.city}, {lease.property?.state}
                                </p>
                            </div>
                            {lease.property?.description && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Description</p>
                                    <p className="text-sm">{lease.property?.description}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Unit Details</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Unit</p>
                                <p className="font-medium">{lease.unit?.name}</p>
                            </div>
                            {'bedrooms' in (lease.unit ?? {}) && (
                                <>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Bedrooms / Bathrooms</p>
                                        <p className="font-medium">
                                            {'bedrooms' in (lease.unit ?? {}) ? (lease.unit as any).bedrooms : '—'}bd /
                                            {'bathrooms' in (lease.unit ?? {}) ? (lease.unit as any).bathrooms : '—'}ba
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Square Feet</p>
                                        <p className="font-medium">{(lease.unit as any).square_feet ? `${(lease.unit as any).square_feet} sqft` : '—'}</p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Lease Terms</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Monthly Rent</span>
                                <span className="text-lg font-bold">${lease.monthly_rent.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Security Deposit</span>
                                <span className="font-medium">${lease.security_deposit?.toLocaleString() ?? '—'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Start Date</span>
                                <span className="font-medium">{new Date(lease.start_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">End Date</span>
                                <span className="font-medium">{new Date(lease.end_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <StatusBadge status={lease.status} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total Paid</span>
                                <span className="font-medium">${totalPaid.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {lease.terms && (
                        <Card>
                            <CardHeader><CardTitle>Terms & Conditions</CardTitle></CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{lease.terms}</p>
                            </CardContent>
                        </Card>
                    )}

                    {paymentStatus && (
                        <Card>
                            <CardHeader><CardTitle>Current Payment Status</CardTitle></CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-bold">${paymentStatus.amount.toLocaleString()}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Due {new Date(paymentStatus.due_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <StatusBadge status={paymentStatus.status} />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
