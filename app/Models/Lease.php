<?php

namespace App\Models;

use App\Enums\LeaseStatus;
use Database\Factories\LeaseFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $property_id
 * @property int $unit_id
 * @property int $renter_id
 * @property string $start_date
 * @property string $end_date
 * @property float $monthly_rent
 * @property float|null $security_deposit
 * @property LeaseStatus $status
 * @property string|null $terms
 * @property string|null $signed_at
 * @property string|null $terminated_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Property $property
 * @property-read Unit $unit
 * @property-read User $renter
 * @property-read Payment[] $payments
 */
class Lease extends Model
{
    /** @use HasFactory<LeaseFactory> */
    use HasFactory, SoftDeletes;

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => LeaseStatus::class,
            'monthly_rent' => 'decimal:2',
            'security_deposit' => 'decimal:2',
            'start_date' => 'date',
            'end_date' => 'date',
            'signed_at' => 'datetime',
            'terminated_at' => 'datetime',
        ];
    }

    /**
     * Get the property that the lease belongs to.
     *
     * @return BelongsTo<Property, $this>
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the unit that the lease belongs to.
     *
     * @return BelongsTo<Unit, $this>
     */
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    /**
     * Get the renter for the lease.
     *
     * @return BelongsTo<User, $this>
     */
    public function renter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'renter_id');
    }

    /**
     * Get the payments for the lease.
     *
     * @return HasMany<Payment, $this>
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Scope a query to only include active leases.
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('status', LeaseStatus::Active)
            ->whereDate('start_date', '<=', now())
            ->whereDate('end_date', '>=', now());
    }

    /**
     * Scope a query to only include leases expiring within a given number of days.
     */
    public function scopeExpiringSoon(Builder $query, int $days = 30): void
    {
        $query->where('status', LeaseStatus::Active)
            ->whereDate('end_date', '>=', now())
            ->whereDate('end_date', '<=', now()->addDays($days));
    }

    /**
     * Scope a query to only include leases for a specific renter.
     */
    public function scopeForRenter(Builder $query, User $user): void
    {
        $query->where('renter_id', $user->id);
    }
}
