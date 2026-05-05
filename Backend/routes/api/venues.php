<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VenueController;

Route::get('/hotels', [VenueController::class, 'hotels']);
Route::get('/high-tea', [VenueController::class, 'highTea']);
Route::get('/event-halls', [VenueController::class, 'eventHalls']);
Route::get('/search', [VenueController::class, 'search']);
