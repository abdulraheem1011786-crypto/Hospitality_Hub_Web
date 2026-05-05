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
        Schema::table('event_halls', function (Blueprint $table) {
            // Add missing columns
            if (!Schema::hasColumn('event_halls', 'amenities')) {
                $table->json('amenities')->nullable()->after('add_ons');
            }
            if (!Schema::hasColumn('event_halls', 'setup_options')) {
                $table->json('setup_options')->nullable()->after('amenities');
            }
            if (!Schema::hasColumn('event_halls', 'max_guests')) {
                $table->integer('max_guests')->nullable()->after('setup_options');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event_halls', function (Blueprint $table) {
            $table->dropColumn(['amenities', 'setup_options', 'max_guests']);
        });
    }
};
