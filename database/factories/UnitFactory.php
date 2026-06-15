<?php

namespace Database\Factories;

use App\Enums\UnitStatus;
use App\Models\Property;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Unit>
 */
class UnitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'property_id' => Property::factory(),
            'name' => 'Unit '.fake()->unique()->numberBetween(1, 999),
            'unit_number' => (string) fake()->numberBetween(1, 999),
            'floor' => fake()->optional(0.6)->numberBetween(1, 10),
            'bedrooms' => fake()->numberBetween(0, 4),
            'bathrooms' => fake()->numberBetween(1, 3),
            'square_feet' => fake()->optional(0.8)->randomNumber(4, true),
            'rent_amount' => fake()->randomFloat(2, 500, 5000),
            'security_deposit' => fake()->optional(0.7)->randomFloat(2, 500, 5000),
            'status' => UnitStatus::Available->value,
        ];
    }

    /**
     * Indicate that the unit is occupied.
     */
    public function occupied(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => UnitStatus::Occupied->value,
        ]);
    }

    /**
     * Set a specific property for the unit.
     */
    public function forProperty(Property $property): static
    {
        return $this->state(fn (array $attributes) => [
            'property_id' => $property->id,
        ]);
    }
}
