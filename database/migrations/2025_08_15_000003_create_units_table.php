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
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // e.g. "Unit 101"
            $table->string('unit_number')->nullable();
            $table->unsignedInteger('floor')->nullable();
            $table->unsignedInteger('bedrooms')->default(0);
            $table->unsignedInteger('bathrooms')->default(1);
            $table->decimal('square_feet', 8, 2)->nullable();
            $table->decimal('rent_amount', 10, 2);
            $table->decimal('security_deposit', 10, 2)->nullable();
            $table->string('status')->default('available'); // UnitStatus enum
            $table->timestamps();
            $table->softDeletes();

            $table->index('property_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
