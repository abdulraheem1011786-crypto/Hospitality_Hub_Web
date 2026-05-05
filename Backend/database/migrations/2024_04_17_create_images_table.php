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
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            $table->string('venue_type'); // 'hotel', 'high_tea_venue', 'event_hall'
            $table->unsignedBigInteger('venue_id');
            $table->string('image_path'); // path to image file
            $table->string('file_name'); // original filename
            $table->string('mime_type')->default('image/jpeg'); // image type
            $table->unsignedBigInteger('file_size'); // size in bytes
            $table->integer('sort_order')->default(0); // for ordering images
            $table->boolean('is_primary')->default(false); // flag primary/featured image
            $table->text('alt_text')->nullable(); // for accessibility
            $table->timestamps();

            // Indexes for common queries
            $table->index(['venue_type', 'venue_id']);
            $table->index('venue_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('images');
    }
};
