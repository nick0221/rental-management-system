<?php

namespace App\Http\Requests;

use App\Enums\UnitStatus;
use App\Models\Unit;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UnitRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if ($this->isMethod('POST')) {
            return $this->user()->can('create', Unit::class);
        }

        return $this->user()->can('update', $this->route('unit'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'property_id' => ['sometimes', 'exists:properties,id'],
            'name' => ['required', 'string', 'max:255'],
            'unit_number' => ['nullable', 'string', 'max:50'],
            'floor' => ['nullable', 'integer', 'min:0'],
            'bedrooms' => ['required', 'integer', 'min:0', 'max:20'],
            'bathrooms' => ['required', 'integer', 'min:0', 'max:20'],
            'square_feet' => ['nullable', 'numeric', 'min:0'],
            'rent_amount' => ['required', 'numeric', 'min:0'],
            'security_deposit' => ['nullable', 'numeric', 'min:0'],
            'status' => ['sometimes', 'string', Rule::in(collect(UnitStatus::cases())->pluck('value'))],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => __('The unit name is required.'),
            'rent_amount.required' => __('The monthly rent amount is required.'),
        ];
    }
}
