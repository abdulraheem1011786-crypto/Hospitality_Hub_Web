<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHighTeaRequest;
use App\Http\Requests\UpdateHighTeaRequest;
use App\Http\Resources\HighTeaVenueResource;
use App\Models\HighTeaVenue;

class AdminHighTeaController extends Controller
{
    public function index()
    {
        return HighTeaVenueResource::collection(HighTeaVenue::paginate(15));
    }

    public function store(StoreHighTeaRequest $request)
    {
        $venue = HighTeaVenue::create($request->validated());
        return new HighTeaVenueResource($venue);
    }

    public function show(HighTeaVenue $highTea)
    {
        return new HighTeaVenueResource($highTea);
    }

    public function update(UpdateHighTeaRequest $request, HighTeaVenue $highTea)
    {
        $highTea->update($request->validated());
        return new HighTeaVenueResource($highTea);
    }

    public function destroy(HighTeaVenue $highTea)
    {
        $highTea->delete();
        return response()->json(['message' => 'High Tea Venue deleted successfully']);
    }
}
