<?php

namespace Database\Factories;

use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Property>
 */
class PropertyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->company().' '.fake()->streetSuffix();

        return [
            'owner_id' => User::factory()->owner(),
            'name' => $name,
            'slug' => Str::slug($name.'-'.fake()->unique()->bothify('####')),
            'description' => fake()->optional(0.8)->paragraph(),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'state' => fake()->state(),
            'postal_code' => fake()->postcode(),
            'country' => 'US',
            'type' => fake()->randomElement(PropertyType::cases())->value,
            'status' => PropertyStatus::Active->value,
            'total_units' => fake()->numberBetween(3, 20),
        ];
    }

    /**
     * Indicate that the property is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PropertyStatus::Inactive->value,
        ]);
    }

    /**
     * Set a specific owner for the property.
     */
    public function ownedBy(User $owner): static
    {
        return $this->state(fn (array $attributes) => [
            'owner_id' => $owner->id,
        ]);
    }
}
