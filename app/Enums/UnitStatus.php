<?php

namespace App\Enums;

enum UnitStatus: string
{
    case Available = 'available';
    case Occupied = 'occupied';
    case Maintenance = 'maintenance';
    case Reserved = 'reserved';

    public function label(): string
    {
        return match ($this) {
            self::Available => 'Available',
            self::Occupied => 'Occupied',
            self::Maintenance => 'Maintenance',
            self::Reserved => 'Reserved',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Available => 'success',
            self::Occupied => 'default',
            self::Maintenance => 'warning',
            self::Reserved => 'secondary',
        };
    }
}
