<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventHallResource;
use App\Http\Resources\HighTeaVenueResource;
use App\Http\Resources\HotelResource;
use App\Services\VenueSearchService;
use Illuminate\Http\Request;

class VenueController extends Controller
{
    /**
     * @var VenueSearchService
     */
    private $searchService;

    public function __construct(VenueSearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    /**
     * Get paginated hotels with filters
     */
    public function hotels(Request $request)
    {
        $query = $this->searchService->filterHotels($request);
        return HotelResource::collection($query->paginate(15));
    }

    /**
     * Get paginated high tea venues with filters
     */
    public function highTea(Request $request)
    {
        $query = $this->searchService->filterHighTea($request);
        return HighTeaVenueResource::collection($query->paginate(15));
    }

    /**
     * Get paginated event halls with filters
     */
    public function eventHalls(Request $request)
    {
        $query = $this->searchService->filterEventHalls($request);
        return EventHallResource::collection($query->paginate(15));
    }

    /**
     * Unified search across all venue types
     */
    public function search(Request $request)
    {
        $term = $request->input('q', '');
        $results = $this->searchService->search($term);

        return response()->json([
            'hotels' => HotelResource::collection($results['hotels']),
            'high_tea' => HighTeaVenueResource::collection($results['high_tea']),
            'event_halls' => EventHallResource::collection($results['event_halls']),
        ]);
    }
}