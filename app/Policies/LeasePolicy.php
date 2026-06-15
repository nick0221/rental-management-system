<?php

namespace App\Policies;

use App\Models\Lease;
use App\Models\User;

class LeasePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Lease $lease): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($user->isOwner()) {
            return $user->id === $lease->property->owner_id;
        }

        return $user->id === $lease->renter_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isOwner() || $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Lease $lease): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->id === $lease->property->owner_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Lease $lease): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->id === $lease->property->owner_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Lease $lease): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Lease $lease): bool
    {
        return $user->isSuperAdmin();
    }
}
