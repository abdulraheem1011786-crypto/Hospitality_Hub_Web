<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BookingController;

Route::middleware(['auth:sanctum'])->prefix('bookings')->group(function () {
    Route::get('/', [BookingController::class, 'index']);
    Route::post('/', [BookingController::class, 'store']);
});
