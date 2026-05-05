<?php

namespace App\Services;

use App\Models\EventHall;
use App\Models\HighTeaVenue;
use App\Models\Hotel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/**
 * Service for handling venue search and filtering logic
 * Eliminates code duplication across venue types
 */
class VenueSearchService
{
    /**
     * Filter hotels based on request parameters
     * 
     * @param Request $request
     * @return Builder
     */
    public function filterHotels(Request $request): Builder
    {
        $query = Hotel::query();

        // Location filter
        if ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        // Search filter (searches multiple fields)
        if ($request->filled('q')) {
            $query->where(function (Builder $sub) use ($request) {
                $sub->where('name', 'like', "%{$request->q}%")
                    ->orWhere('location', 'like', "%{$request->q}%")
                    ->orWhere('description', 'like', "%{$request->q}%");
            });
        }

        // Price range filter
        if ($request->filled('min_price')) {
            $query->where('price_per_night', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price_per_night', '<=', $request->max_price);
        }

        // Rating filter
        if ($request->filled('rating')) {
            $query->where('rating', '>=', $request->rating);
        }

        return $query;
    }

    /**
     * Filter high tea venues based on request parameters
     * 
     * @param Request $request
     * @return Builder
     */
    public function filterHighTea(Request $request): Builder
    {
        $query = HighTeaVenue::query();

        // Location filter
        if ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        // Search filter (searches multiple fields)
        if ($request->filled('q')) {
            $query->where(function (Builder $sub) use ($request) {
                $sub->where('name', 'like', "%{$request->q}%")
                    ->orWhere('location', 'like', "%{$request->q}%")
                    ->orWhere('description', 'like', "%{$request->q}%");
            });
        }

        // Price filter
        if ($request->filled('max_price')) {
            $query->where('price_per_head', '<=', $request->max_price);
        }

        return $query;
    }

    /**
     * Filter event halls based on request parameters
     * 
     * @param Request $request
     * @return Builder
     */
    public function filterEventHalls(Request $request): Builder
    {
        $query = EventHall::query();

        // Location filter
        if ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        // Search filter (searches multiple fields)
        if ($request->filled('q')) {
            $query->where(function (Builder $sub) use ($request) {
                $sub->where('name', 'like', "%{$request->q}%")
                    ->orWhere('location', 'like', "%{$request->q}%")
                    ->orWhere('description', 'like', "%{$request->q}%");
            });
        }

        // Capacity filter
        if ($request->filled('capacity')) {
            $query->where('capacity', '>=', $request->capacity);
        }

        // Price filter
        if ($request->filled('max_price')) {
            $query->where('price_full_day', '<=', $request->max_price);
        }

        return $query;
    }

    /**
     * Perform unified search across all venue types
     * 
     * @param string $term
     * @return array
     */
    public function search(string $term): array
    {
        return [
            'hotels' => $this->searchByTerm(Hotel::class, $term),
            'high_tea' => $this->searchByTerm(HighTeaVenue::class, $term),
            'event_halls' => $this->searchByTerm(EventHall::class, $term),
        ];
    }

    /**
     * Helper method to search a model by term
     * 
     * @param string $model
     * @param string $term
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function searchByTerm(string $model, string $term)
    {
        return $model::where('name', 'like', "%{$term}%")
            ->orWhere('location', 'like', "%{$term}%")
            ->get();
    }
}
