<?php

namespace App\Enums;

enum DocumentType: string
{
    case Lease = 'lease';
    case Receipt = 'receipt';
    case Inspection = 'inspection';
    case Maintenance = 'maintenance';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Lease => 'Lease',
            self::Receipt => 'Receipt',
            self::Inspection => 'Inspection',
            self::Maintenance => 'Maintenance',
            self::Other => 'Other',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Lease => 'default',
            self::Receipt => 'success',
            self::Inspection => 'warning',
            self::Maintenance => 'destructive',
            self::Other => 'secondary',
        };
    }
}
