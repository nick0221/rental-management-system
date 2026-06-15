<?php

namespace App\Enums;

enum MaintenanceStatus: string
{
    case Reported = 'reported';
    case Approved = 'approved';
    case InProgress = 'in_progress';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Reported => 'Reported',
            self::Approved => 'Approved',
            self::InProgress => 'In Progress',
            self::Completed => 'Completed',
            self::Cancelled => 'Cancelled',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Reported => 'warning',
            self::Approved => 'default',
            self::InProgress => 'default',
            self::Completed => 'success',
            self::Cancelled => 'secondary',
        };
    }
}
