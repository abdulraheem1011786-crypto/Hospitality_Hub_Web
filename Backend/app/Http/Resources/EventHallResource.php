<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventHallResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'location' => $this->location,
            'description' => $this->description,
            'capacity' => $this->capacity,
            'max_guests' => $this->max_guests,
            'price_full_day' => $this->price_full_day,
            'price_half_day' => $this->price_half_day,
            'amenities' => $this->amenities,
            'setup_options' => $this->setup_options,
            'event_types' => $this->event_types,
            'add_ons' => $this->add_ons,
            'primary_image' => $this->getPrimaryImage()?->getImageUrl(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
