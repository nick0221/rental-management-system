<?php

namespace App\Http\Requests;

use App\Enums\MaintenancePriority;
use App\Enums\MaintenanceStatus;
use App\Models\MaintenanceRequest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MaintenanceRequestForm extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if ($this->isMethod('POST')) {
            return $this->user()->can('create', MaintenanceRequest::class);
        }

        return $this->user()->can('update', $this->route('request'));
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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'priority' => ['required', 'string', Rule::in(collect(MaintenancePriority::cases())->pluck('value'))],
            'scheduled_at' => ['nullable', 'date'],
            'status' => ['sometimes', 'string', Rule::in(collect(MaintenanceStatus::cases())->pluck('value'))],
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
            'title.required' => __('A title for the maintenance request is required.'),
            'description.required' => __('Please describe the maintenance issue.'),
        ];
    }
}
