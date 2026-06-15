<?php

namespace App\Models;

use App\Enums\UnitStatus;
use Database\Factories\UnitFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $property_id
 * @property string $name
 * @property string|null $unit_number
 * @property int|null $floor
 * @property int $bedrooms
 * @property int $bathrooms
 * @property float|null $square_feet
 * @property float $rent_amount
 * @property float|null $security_deposit
 * @property UnitStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Property $property
 * @property-read Lease[] $leases
 * @property-read MaintenanceRequest[] $maintenanceRequests
 * @property-read Lease|null $currentLease
 */
class Unit extends Model
{
    /** @use HasFactory<UnitFactory> */
    use HasFactory, SoftDeletes;

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => UnitStatus::class,
            'bedrooms' => 'integer',
            'bathrooms' => 'integer',
            'square_feet' => 'decimal:2',
            'rent_amount' => 'decimal:2',
            'security_deposit' => 'decimal:2',
        ];
    }

    /**
     * Get the property that owns the unit.
     *
     * @return BelongsTo<Property, $this>
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the leases for the unit.
     *
     * @return HasMany<Lease, $this>
     */
    public function leases(): HasMany
    {
        return $this->hasMany(Lease::class);
    }

    /**
     * Get the maintenance requests for the unit.
     *
     * @return HasMany<MaintenanceRequest, $this>
     */
    public function maintenanceRequests(): HasMany
    {
        return $this->hasMany(MaintenanceRequest::class);
    }

    /**
     * Get the current active lease for the unit.
     *
     * @return HasMany<Lease, $this>
     */
    public function currentLease(): HasMany
    {
        return $this->hasMany(Lease::class)->where('status', 'active')
            ->whereDate('start_date', '<=', now())
            ->whereDate('end_date', '>=', now());
    }

    /**
     * Scope a query to only include available units.
     */
    public function scopeAvailable(Builder $query): void
    {
        $query->where('status', UnitStatus::Available);
    }

    /**
     * Scope a query to only include occupied units.
     */
    public function scopeOccupied(Builder $query): void
    {
        $query->where('status', UnitStatus::Occupied);
    }
}
