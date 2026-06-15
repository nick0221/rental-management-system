import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import type { Payment } from '@/types/payment';
import { index } from '@/routes/renter/payments/index';

export default function ShowPayment({ payment }: { payment: Payment }) {
    return (
        <>
            <Head title={`Payment #${payment.id}`} />
            <div className="p-6">
                <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">Payment #{payment.id}</h1>
                        <StatusBadge status={payment.status} />
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={index().url}>Back to Payments</Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Payment Details</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Amount</span>
                                <span className="text-2xl font-bold">${payment.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Due Date</span>
                                <span className="font-medium">{new Date(payment.due_date).toLocaleDateString()}</span>
                            </div>
                            {payment.paid_at && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Paid On</span>
                                    <span className="font-medium">{new Date(payment.paid_at).toLocaleDateString()}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Payment Method</span>
                                <span className="font-medium capitalize">{payment.payment_method?.replace(/_/g, ' ') || '—'}</span>
                            </div>
                            {payment.reference_number && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Reference</span>
                                    <span className="font-medium">{payment.reference_number}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Lease Details</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Property</p>
                                <p className="font-medium">{payment.lease?.property?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Unit</p>
                                <p className="font-medium">{payment.lease?.unit?.name}</p>
                            </div>
                            {payment.notes && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Notes</p>
                                    <p className="text-sm">{payment.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
