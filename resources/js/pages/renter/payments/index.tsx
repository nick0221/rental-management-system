import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import type { Payment } from '@/types/payment';
import { index, create } from '@/routes/renter/payments/index';

interface PaginatedPayments {
    data: Payment[];
    meta: { current_page: number; last_page: number; total: number; from: number; to: number };
}

export default function PaymentsIndex({ payments }: { payments: PaginatedPayments }) {
    const columns = [
        {
            key: 'amount',
            label: 'Amount',
            render: (p: Payment) => <span className="font-medium">${p.amount.toLocaleString()}</span>,
        },
        {
            key: 'due_date',
            label: 'Due Date',
            render: (p: Payment) => new Date(p.due_date).toLocaleDateString(),
        },
        {
            key: 'status',
            label: 'Status',
            render: (p: Payment) => <StatusBadge status={p.status} />,
        },
        {
            key: 'payment_method',
            label: 'Method',
            hideOnMobile: true,
            render: (p: Payment) => p.payment_method ? p.payment_method.replace(/_/g, ' ') : '—',
        },
        {
            key: 'paid_at',
            label: 'Paid At',
            hideOnMobile: true,
            render: (p: Payment) => p.paid_at ? new Date(p.paid_at).toLocaleDateString() : '—',
        },
        {
            key: 'reference_number',
            label: 'Reference',
            hideOnMobile: true,
            render: (p: Payment) => p.reference_number || '—',
        },
    ] as const;

    return (
        <>
            <Head title="Payments" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">My Payments</h1>
                <DataTable
                    columns={columns}
                    data={payments.data}
                    meta={payments.meta}
                    searchPlaceholder="Search payments..."
                    createRoute={create().url}
                    createLabel="Make a Payment"
                />
            </div>
        </>
    );
}
