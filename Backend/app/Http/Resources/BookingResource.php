<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => new UserResource($this->whenLoaded('user')),
            'bookable_type' => $this->bookable_type,
            'bookable' => $this->whenLoaded('bookable', function () {
                return match($this->bookable_type) {
                    'App\Models\Hotel' => new HotelResource($this->bookable),
                    'App\Models\HighTeaVenue' => new HighTeaVenueResource($this->bookable),
                    'App\Models\EventHall' => new EventHallResource($this->bookable),
                    default => $this->bookable,
                };
            }),
            'booking_date' => $this->booking_date,
            'details' => $this->details,
            'total_price' => $this->total_price,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
