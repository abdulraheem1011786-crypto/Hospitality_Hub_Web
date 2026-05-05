<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HighTeaVenueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'location' => $this->location,
            'description' => $this->description,
            'price_per_head' => $this->price_per_head,
            'cuisine_type' => $this->cuisine_type,
            'capacity' => $this->capacity,
            'amenities' => $this->amenities,
            'images' => $this->images,
            'time_slots' => $this->time_slots,
            'menu' => $this->menu,
            'ambiance_images' => $this->ambiance_images,
            'primary_image' => $this->getPrimaryImage()?->getImageUrl(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
