<?php

namespace App\Enums;

enum PropertyType: string
{
    case ApartmentBuilding = 'apartment_building';
    case House = 'house';
    case Commercial = 'commercial';
    case MixedUse = 'mixed_use';

    public function label(): string
    {
        return match ($this) {
            self::ApartmentBuilding => 'Apartment Building',
            self::House => 'House',
            self::Commercial => 'Commercial',
            self::MixedUse => 'Mixed Use',
        };
    }
}
