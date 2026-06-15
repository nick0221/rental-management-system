<?php

namespace Database\Factories;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Lease;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $dueDate = fake()->dateTimeBetween('-6 months', '+1 month');

        return [
            'lease_id' => Lease::factory(),
            'user_id' => User::factory(),
            'amount' => fake()->randomFloat(2, 500, 5000),
            'due_date' => $dueDate->format('Y-m-d'),
            'status' => PaymentStatus::Pending->value,
            'payment_method' => null,
            'reference_number' => null,
            'notes' => fake()->optional(0.3)->sentence(),
            'paid_at' => null,
            'receipt' => null,
        ];
    }

    /**
     * Indicate that the payment is paid.
     */
    public function paid(): static
    {
        $paidAt = fake()->dateTimeBetween('-6 months', 'now');

        return $this->state(fn (array $attributes) => [
            'status' => PaymentStatus::Paid->value,
            'paid_at' => $paidAt,
            'payment_method' => fake()->randomElement([PaymentMethod::BankTransfer, PaymentMethod::CreditCard, PaymentMethod::Online])->value,
            'reference_number' => 'PAY-'.strtoupper(fake()->bothify('####-????')),
        ]);
    }

    /**
     * Indicate that the payment is overdue.
     */
    public function overdue(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PaymentStatus::Overdue->value,
            'due_date' => fake()->dateTimeBetween('-3 months', '-1 day')->format('Y-m-d'),
        ]);
    }

    /**
     * Set a specific lease for the payment.
     */
    public function forLease(Lease $lease): static
    {
        return $this->state(fn (array $attributes) => [
            'lease_id' => $lease->id,
        ]);
    }
}
