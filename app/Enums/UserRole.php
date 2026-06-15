<?php

namespace App\Enums;

enum UserRole: string
{
    case SuperAdmin = 'super_admin';
    case Owner = 'owner';
    case Renter = 'renter';

    public function label(): string
    {
        return match ($this) {
            self::SuperAdmin => 'Super Admin',
            self::Owner => 'Owner',
            self::Renter => 'Renter',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::SuperAdmin => 'destructive',
            self::Owner => 'warning',
            self::Renter => 'default',
        };
    }
}
