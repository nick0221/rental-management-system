import { Head, Link, usePage } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/shared/page-header';
import { store } from '@/routes/renter/payments/store';
import { index } from '@/routes/renter/payments/index';
import type { Lease } from '@/types/lease';

export default function CreatePayment() {
    const { lease, suggestedAmount } = usePage().props as {
        lease: Lease & { property: { id: number; name: string }; unit: { id: number; name: string } };
        suggestedAmount: number;
    };

    return (
        <>
            <Head title="Make a Payment" />
            <div className="p-6">
                <PageHeader
                    title="Make a Payment"
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
                                <input type="hidden" name="lease_id" value={lease.id} />

                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount ($)</Label>
                                    <Input
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        step="0.01"
                                        defaultValue={suggestedAmount}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Suggested: ${suggestedAmount.toLocaleString()} (monthly rent)
                                    </p>
                                    {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="due_date">Payment For Period</Label>
                                    <Input id="due_date" name="due_date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                                    {errors.due_date && <p className="text-sm text-destructive">{errors.due_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="payment_method">Payment Method</Label>
                                    <Select name="payment_method" defaultValue="">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                            <SelectItem value="credit_card">Credit Card</SelectItem>
                                            <SelectItem value="cash">Cash</SelectItem>
                                            <SelectItem value="online">Online</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.payment_method && <p className="text-sm text-destructive">{errors.payment_method}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes (optional)</Label>
                                    <Textarea id="notes" name="notes" rows={3} />
                                </div>

                                <Button type="submit" disabled={processing}>Record Payment</Button>
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}
