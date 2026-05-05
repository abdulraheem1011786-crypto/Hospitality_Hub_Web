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
        Schema::create('event_halls', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location');
            $table->text('description');
            $table->decimal('price_half_day', 8, 2);
            $table->decimal('price_full_day', 8, 2);
            $table->integer('capacity');
            $table->json('event_types')->nullable(); // ['wedding', 'corporate', etc.]
            $table->json('add_ons')->nullable(); // catering, decoration options
            $table->json('images')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_halls');
    }
};
