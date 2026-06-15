<?php

namespace App\Models;

use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use Database\Factories\PropertyFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $owner_id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string $address
 * @property string $city
 * @property string $state
 * @property string $postal_code
 * @property string $country
 * @property PropertyType $type
 * @property PropertyStatus $status
 * @property int $total_units
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read User $owner
 * @property-read Unit[] $units
 * @property-read Lease[] $leases
 * @property-read MaintenanceRequest[] $maintenanceRequests
 */
class Property extends Model
{
    /** @use HasFactory<PropertyFactory> */
    use HasFactory, SoftDeletes;

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => PropertyType::class,
            'status' => PropertyStatus::class,
            'total_units' => 'integer',
        ];
    }

    /**
     * Boot the model and register event handlers.
     */
    protected static function booted(): void
    {
        static::creating(function (Property $property): void {
            if (empty($property->slug)) {
                $property->slug = Str::slug($property->name);
            }
        });
    }

    /**
     * Get the owner of the property.
     *
     * @return BelongsTo<User, $this>
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get the units for the property.
     *
     * @return HasMany<Unit, $this>
     */
    public function units(): HasMany
    {
        return $this->hasMany(Unit::class);
    }

    /**
     * Get the leases for the property.
     *
     * @return HasMany<Lease, $this>
     */
    public function leases(): HasMany
    {
        return $this->hasMany(Lease::class);
    }

    /**
     * Get the maintenance requests for the property.
     *
     * @return HasMany<MaintenanceRequest, $this>
     */
    public function maintenanceRequests(): HasMany
    {
        return $this->hasMany(MaintenanceRequest::class);
    }

    /**
     * Scope a query to only include properties for a specific owner.
     */
    public function scopeForOwner(Builder $query, User $user): void
    {
        $query->where('owner_id', $user->id);
    }

    /**
     * Scope a query to only include active properties.
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('status', PropertyStatus::Active);
    }
}
