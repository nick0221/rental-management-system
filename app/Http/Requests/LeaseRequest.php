<?php

namespace App\Http\Requests;

use App\Enums\LeaseStatus;
use App\Models\Lease;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LeaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if ($this->isMethod('POST')) {
            return $this->user()->can('create', Lease::class);
        }

        return $this->user()->can('update', $this->route('lease'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'property_id' => ['required', 'exists:properties,id'],
            'unit_id' => ['required', 'exists:units,id'],
            'renter_id' => ['required', 'exists:users,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'monthly_rent' => ['required', 'numeric', 'min:0'],
            'security_deposit' => ['nullable', 'numeric', 'min:0'],
            'status' => ['sometimes', 'string', Rule::in(collect(LeaseStatus::cases())->pluck('value'))],
            'terms' => ['nullable', 'string', 'max:10000'],
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
            'end_date.after' => __('The end date must be after the start date.'),
            'renter_id.exists' => __('Please select a valid renter.'),
        ];
    }
}
