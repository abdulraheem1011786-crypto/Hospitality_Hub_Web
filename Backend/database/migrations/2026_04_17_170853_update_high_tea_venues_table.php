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
        Schema::table('high_tea_venues', function (Blueprint $table) {
            // Add missing columns
            if (!Schema::hasColumn('high_tea_venues', 'cuisine_type')) {
                $table->string('cuisine_type')->nullable()->after('location');
            }
            if (!Schema::hasColumn('high_tea_venues', 'capacity')) {
                $table->integer('capacity')->nullable()->after('cuisine_type');
            }
            if (!Schema::hasColumn('high_tea_venues', 'amenities')) {
                $table->json('amenities')->nullable()->after('capacity');
            }
            if (!Schema::hasColumn('high_tea_venues', 'images')) {
                $table->json('images')->nullable()->after('amenities');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('high_tea_venues', function (Blueprint $table) {
            $table->dropColumn(['cuisine_type', 'capacity', 'amenities', 'images']);
        });
    }
};
