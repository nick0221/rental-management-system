<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Cash = 'cash';
    case BankTransfer = 'bank_transfer';
    case CreditCard = 'credit_card';
    case Online = 'online';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Cash => 'Cash',
            self::BankTransfer => 'Bank Transfer',
            self::CreditCard => 'Credit Card',
            self::Online => 'Online',
            self::Other => 'Other',
        };
    }
}
