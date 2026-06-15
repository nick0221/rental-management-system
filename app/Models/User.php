<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property UserRole $role
 * @property string|null $phone
 * @property string|null $avatar
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Property[] $properties
 * @property-read Lease[] $leases
 * @property-read MaintenanceRequest[] $maintenanceRequests
 */
#[Fillable(['name', 'email', 'password', 'role', 'phone', 'avatar'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'role' => UserRole::class,
        ];
    }

    /**
     * Check if the user has a specific role.
     */
    public function hasRole(UserRole $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if the user has one of the given roles.
     */
    public function hasAnyRole(UserRole ...$roles): bool
    {
        return in_array($this->role, $roles);
    }

    /**
     * Check if the user is a super admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === UserRole::SuperAdmin;
    }

    /**
     * Check if the user is an owner.
     */
    public function isOwner(): bool
    {
        return $this->role === UserRole::Owner;
    }

    /**
     * Check if the user is a renter.
     */
    public function isRenter(): bool
    {
        return $this->role === UserRole::Renter;
    }

    /**
     * Get the properties owned by the user.
     *
     * @return HasMany<Property, $this>
     */
    public function properties(): HasMany
    {
        return $this->hasMany(Property::class, 'owner_id');
    }

    /**
     * Get the leases where the user is a renter.
     *
     * @return HasMany<Lease, $this>
     */
    public function leases(): HasMany
    {
        return $this->hasMany(Lease::class, 'renter_id');
    }

    /**
     * Get the maintenance requests reported by the user.
     *
     * @return HasMany<MaintenanceRequest, $this>
     */
    public function maintenanceRequests(): HasMany
    {
        return $this->hasMany(MaintenanceRequest::class, 'reporter_id');
    }

    /**
     * Get the maintenance requests assigned to the user.
     *
     * @return HasMany<MaintenanceRequest, $this>
     */
    public function assignedMaintenanceRequests(): HasMany
    {
        return $this->hasMany(MaintenanceRequest::class, 'assignee_id');
    }

    /**
     * Scope a query to only include owners.
     */
    public function scopeOwners(Builder $query): void
    {
        $query->where('role', UserRole::Owner);
    }

    /**
     * Scope a query to only include renters.
     */
    public function scopeRenters(Builder $query): void
    {
        $query->where('role', UserRole::Renter);
    }

    /**
     * Scope a query to only include super admins.
     */
    public function scopeSuperAdmins(Builder $query): void
    {
        $query->where('role', UserRole::SuperAdmin);
    }
}
