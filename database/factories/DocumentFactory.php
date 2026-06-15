<?php

namespace Database\Factories;

use App\Enums\DocumentType;
use App\Models\Document;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Document>
 */
class DocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true).'.pdf',
            'path' => 'documents/'.fake()->uuid().'.pdf',
            'type' => fake()->randomElement(DocumentType::cases())->value,
            'notes' => fake()->optional(0.5)->sentence(),
            'uploaded_by' => User::factory(),
        ];
    }

    /**
     * Set the document type.
     */
    public function ofType(DocumentType $type): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => $type->value,
        ]);
    }
}
