export enum PaymentStatus {
    Pending = 'pending',
    Paid = 'paid',
    Overdue = 'overdue',
    Refunded = 'refunded',
    PartiallyPaid = 'partially_paid',
}

export enum PaymentMethod {
    Cash = 'cash',
    BankTransfer = 'bank_transfer',
    CreditCard = 'credit_card',
    Online = 'online',
    Other = 'other',
}

export interface Payment {
    id: number;
    lease_id: number;
    user_id: number;
    amount: number;
    paid_at: string | null;
    due_date: string;
    status: PaymentStatus;
    payment_method: string | null;
    reference_number: string | null;
    notes: string | null;
    receipt: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    lease?: { id: number; property_id: number; unit_id: number; start_date?: string; end_date?: string; monthly_rent?: number; property?: { id: number; name: string; address?: string }; unit?: { id: number; name: string; unit_number?: string | null } };
}
