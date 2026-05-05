<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// Route Modular Includes - These organize endpoints into logical groups
require __DIR__.'/api/auth.php';
require __DIR__.'/api/venues.php';
require __DIR__.'/api/bookings.php';
require __DIR__.'/api/admin.php';

// Get authenticated user
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
