<?php

namespace App\Models;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Database\Factories\PaymentFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $lease_id
 * @property int $user_id
 * @property float $amount
 * @property string|null $paid_at
 * @property string $due_date
 * @property PaymentStatus $status
 * @property PaymentMethod|null $payment_method
 * @property string|null $reference_number
 * @property string|null $notes
 * @property string|null $receipt
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Lease $lease
 * @property-read User $user
 */
class Payment extends Model
{
    /** @use HasFactory<PaymentFactory> */
    use HasFactory, SoftDeletes;

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => PaymentStatus::class,
            'payment_method' => PaymentMethod::class,
            'amount' => 'decimal:2',
            'due_date' => 'date',
            'paid_at' => 'datetime',
        ];
    }

    /**
     * Get the lease that the payment belongs to.
     *
     * @return BelongsTo<Lease, $this>
     */
    public function lease(): BelongsTo
    {
        return $this->belongsTo(Lease::class);
    }

    /**
     * Get the user (payer) for the payment.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include pending payments.
     */
    public function scopePending(Builder $query): void
    {
        $query->where('status', PaymentStatus::Pending);
    }

    /**
     * Scope a query to only include overdue payments.
     */
    public function scopeOverdue(Builder $query): void
    {
        $query->where('status', PaymentStatus::Overdue);
    }

    /**
     * Scope a query to only include paid payments.
     */
    public function scopePaid(Builder $query): void
    {
        $query->where('status', PaymentStatus::Paid);
    }
}
