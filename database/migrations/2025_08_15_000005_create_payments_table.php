<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lease_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // payer
            $table->decimal('amount', 10, 2);
            $table->timestamp('paid_at')->nullable();
            $table->date('due_date');
            $table->string('status')->default('pending'); // PaymentStatus enum
            $table->string('payment_method')->nullable(); // PaymentMethod enum
            $table->string('reference_number')->nullable();
            $table->text('notes')->nullable();
            $table->string('receipt')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('lease_id');
            $table->index('user_id');
            $table->index('status');
            $table->index('due_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
