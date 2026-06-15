<?php

namespace Database\Factories;

use App\Enums\LeaseStatus;
use App\Models\Lease;
use App\Models\Property;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lease>
 */
class LeaseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-2 years', '-1 month');

        return [
            'property_id' => Property::factory(),
            'unit_id' => Unit::factory(),
            'renter_id' => User::factory()->renter(),
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => fake()->dateTimeBetween('+1 month', '+2 years')->format('Y-m-d'),
            'monthly_rent' => fake()->randomFloat(2, 500, 5000),
            'security_deposit' => fake()->optional(0.8)->randomFloat(2, 500, 5000),
            'status' => LeaseStatus::Active->value,
            'terms' => fake()->optional(0.5)->paragraph(),
            'signed_at' => fake()->optional(0.9)->dateTimeBetween('-2 years', 'now'),
            'terminated_at' => null,
        ];
    }

    /**
     * Indicate that the lease is expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => LeaseStatus::Expired->value,
            'end_date' => fake()->dateTimeBetween('-1 year', '-1 day')->format('Y-m-d'),
        ]);
    }

    /**
     * Indicate that the lease is terminated.
     */
    public function terminated(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => LeaseStatus::Terminated->value,
            'terminated_at' => fake()->dateTimeBetween('-1 year', '-1 day'),
        ]);
    }

    /**
     * Set a specific renter for the lease.
     */
    public function forRenter(User $renter): static
    {
        return $this->state(fn (array $attributes) => [
            'renter_id' => $renter->id,
        ]);
    }

    /**
     * Set a specific unit for the lease.
     */
    public function forUnit(Unit $unit): static
    {
        return $this->state(fn (array $attributes) => [
            'unit_id' => $unit->id,
            'property_id' => $unit->property_id,
        ]);
    }
}
