<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
            'role' => UserRole::Renter->value,
            'phone' => fake()->optional(0.7)->phoneNumber(),
            'avatar' => null,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the model has two-factor authentication configured.
     */
    public function withTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => encrypt(json_encode(['recovery-code-1'])),
            'two_factor_confirmed_at' => now(),
        ]);
    }

    /**
     * Set the user's role.
     */
    public function withRole(UserRole $role): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => $role->value,
        ]);
    }

    /**
     * Indicate that the user is a super admin.
     */
    public function superAdmin(): static
    {
        return $this->withRole(UserRole::SuperAdmin);
    }

    /**
     * Indicate that the user is an owner.
     */
    public function owner(): static
    {
        return $this->withRole(UserRole::Owner);
    }

    /**
     * Indicate that the user is a renter.
     */
    public function renter(): static
    {
        return $this->withRole(UserRole::Renter);
    }
}
