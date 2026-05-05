<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminHotelController;
use App\Http\Controllers\Api\AdminHighTeaController;
use App\Http\Controllers\Api\AdminEventHallController;
use App\Http\Controllers\Api\ImageController;

Route::middleware(['auth:sanctum', 'role:admin,vendor'])->prefix('admin')->group(function () {
    // Hotel Management
    Route::apiResource('hotels', AdminHotelController::class);

    // High Tea Venue Management
    Route::apiResource('high-tea', AdminHighTeaController::class);

    // Event Hall Management
    Route::apiResource('event-halls', AdminEventHallController::class);

    // Image Management
    Route::prefix('images')->group(function () {
        Route::post('/upload', [ImageController::class, 'upload']);
        Route::get('/venue/{venueType}/{venueId}', [ImageController::class, 'getVenueImages']);
        Route::patch('/{id}', [ImageController::class, 'update']);
        Route::patch('/{id}/set-primary', [ImageController::class, 'setPrimary']);
        Route::delete('/{id}', [ImageController::class, 'delete']);
    });
});
