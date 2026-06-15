<?php

namespace App\Enums;

enum PropertyStatus: string
{
    case Active = 'active';
    case Inactive = 'inactive';
    case UnderMaintenance = 'under_maintenance';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Active',
            self::Inactive => 'Inactive',
            self::UnderMaintenance => 'Under Maintenance',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Active => 'success',
            self::Inactive => 'secondary',
            self::UnderMaintenance => 'warning',
        };
    }
}
