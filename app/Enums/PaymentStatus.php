<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Overdue = 'overdue';
    case Refunded = 'refunded';
    case PartiallyPaid = 'partially_paid';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Paid => 'Paid',
            self::Overdue => 'Overdue',
            self::Refunded => 'Refunded',
            self::PartiallyPaid => 'Partially Paid',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Pending => 'warning',
            self::Paid => 'success',
            self::Overdue => 'destructive',
            self::Refunded => 'secondary',
            self::PartiallyPaid => 'default',
        };
    }
}
