<?php

namespace App\Enums;

enum LeaseStatus: string
{
    case Active = 'active';
    case Expired = 'expired';
    case Terminated = 'terminated';
    case Renewed = 'renewed';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Active',
            self::Expired => 'Expired',
            self::Terminated => 'Terminated',
            self::Renewed => 'Renewed',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Active => 'success',
            self::Expired => 'secondary',
            self::Terminated => 'destructive',
            self::Renewed => 'default',
        };
    }
}
