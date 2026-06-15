<?php

namespace Database\Factories;

use App\Enums\MaintenancePriority;
use App\Enums\MaintenanceStatus;
use App\Models\MaintenanceRequest;
use App\Models\Property;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MaintenanceRequest>
 */
class MaintenanceRequestFactory extends Factory
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
            'unit_id' => Unit::factory(),
            'reporter_id' => User::factory(),
            'assignee_id' => null,
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'priority' => fake()->randomElement(MaintenancePriority::cases())->value,
            'status' => MaintenanceStatus::Reported->value,
            'scheduled_at' => null,
            'completed_at' => null,
            'cost' => null,
        ];
    }

    /**
     * Indicate that the request is in progress.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => MaintenanceStatus::InProgress->value,
            'scheduled_at' => fake()->dateTimeBetween('now', '+2 weeks'),
        ]);
    }

    /**
     * Indicate that the request is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => MaintenanceStatus::Completed->value,
            'completed_at' => fake()->dateTimeBetween('-2 weeks', 'now'),
            'cost' => fake()->randomFloat(2, 50, 2000),
        ]);
    }

    /**
     * Indicate an emergency priority request.
     */
    public function emergency(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => MaintenancePriority::Emergency->value,
        ]);
    }
}
