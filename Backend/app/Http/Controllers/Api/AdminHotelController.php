<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHotelRequest;
use App\Http\Requests\UpdateHotelRequest;
use App\Http\Resources\HotelResource;
use App\Models\Hotel;

class AdminHotelController extends Controller
{
    public function index()
    {
        return HotelResource::collection(Hotel::paginate(15));
    }

    public function store(StoreHotelRequest $request)
    {
        $hotel = Hotel::create($request->validated());
        return new HotelResource($hotel);
    }

    public function show(Hotel $hotel)
    {
        return new HotelResource($hotel);
    }

    public function update(UpdateHotelRequest $request, Hotel $hotel)
    {
        $hotel->update($request->validated());
        return new HotelResource($hotel);
    }

    public function destroy(Hotel $hotel)
    {
        $hotel->delete();
        return response()->json(['message' => 'Hotel deleted successfully']);
    }
}
