<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventHallRequest;
use App\Http\Requests\UpdateEventHallRequest;
use App\Http\Resources\EventHallResource;
use App\Models\EventHall;

class AdminEventHallController extends Controller
{
    public function index()
    {
        return EventHallResource::collection(EventHall::paginate(15));
    }

    public function store(StoreEventHallRequest $request)
    {
        $hall = EventHall::create($request->validated());
        return new EventHallResource($hall);
    }

    public function show(EventHall $eventHall)
    {
        return new EventHallResource($eventHall);
    }

    public function update(UpdateEventHallRequest $request, EventHall $eventHall)
    {
        $eventHall->update($request->validated());
        return new EventHallResource($eventHall);
    }

    public function destroy(EventHall $eventHall)
    {
        $eventHall->delete();
        return response()->json(['message' => 'Event Hall deleted successfully']);
    }
}
