<?php

namespace App\Http\Requests;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Payment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if ($this->isMethod('POST')) {
            return $this->user()->can('create', Payment::class);
        }

        return $this->user()->can('update', $this->route('payment'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'lease_id' => ['required', 'exists:leases,id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'due_date' => ['required', 'date'],
            'paid_at' => ['nullable', 'date'],
            'status' => ['sometimes', 'string', Rule::in(collect(PaymentStatus::cases())->pluck('value'))],
            'payment_method' => ['nullable', 'string', Rule::in(collect(PaymentMethod::cases())->pluck('value'))],
            'reference_number' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
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
            'amount.required' => __('The payment amount is required.'),
            'lease_id.exists' => __('Please select a valid lease.'),
        ];
    }
}
