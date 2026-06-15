<?php

namespace App\Models;

use App\Enums\MaintenancePriority;
use App\Enums\MaintenanceStatus;
use Database\Factories\MaintenanceRequestFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $property_id
 * @property int $unit_id
 * @property int $reporter_id
 * @property int|null $assignee_id
 * @property string $title
 * @property string $description
 * @property MaintenancePriority $priority
 * @property MaintenanceStatus $status
 * @property string|null $scheduled_at
 * @property string|null $completed_at
 * @property float|null $cost
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Property $property
 * @property-read Unit $unit
 * @property-read User $reporter
 * @property-read User|null $assignee
 */
class MaintenanceRequest extends Model
{
    /** @use HasFactory<MaintenanceRequestFactory> */
    use HasFactory, SoftDeletes;

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'priority' => MaintenancePriority::class,
            'status' => MaintenanceStatus::class,
            'cost' => 'decimal:2',
            'scheduled_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * Get the property that the maintenance request belongs to.
     *
     * @return BelongsTo<Property, $this>
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the unit that the maintenance request belongs to.
     *
     * @return BelongsTo<Unit, $this>
     */
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    /**
     * Get the user who reported the maintenance request.
     *
     * @return BelongsTo<User, $this>
     */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    /**
     * Get the user assigned to the maintenance request.
     *
     * @return BelongsTo<User, $this>
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    /**
     * Scope a query to only include requests with a given priority.
     */
    public function scopeWithPriority(Builder $query, MaintenancePriority $priority): void
    {
        $query->where('priority', $priority);
    }

    /**
     * Scope a query to only include requests with a given status.
     */
    public function scopeWithStatus(Builder $query, MaintenanceStatus $status): void
    {
        $query->where('status', $status);
    }

    /**
     * Scope a query to only include open requests (reported, approved, in_progress).
     */
    public function scopeOpen(Builder $query): void
    {
        $query->whereIn('status', [
            MaintenanceStatus::Reported,
            MaintenanceStatus::Approved,
            MaintenanceStatus::InProgress,
        ]);
    }
}
