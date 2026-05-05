<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $bookings = Booking::where('user_id', $request->user()->id)
            ->with('bookable')
            ->orderByDesc('created_at')
            ->paginate(15);

        return BookingResource::collection($bookings);
    }

    public function store(StoreBookingRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        $booking = Booking::create($data);
        return new BookingResource($booking->load('bookable'));
    }
}
