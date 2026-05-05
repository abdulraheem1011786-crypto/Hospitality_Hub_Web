<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HotelResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'location' => $this->location,
            'description' => $this->description,
            'price_per_night' => $this->price_per_night,
            'rating' => $this->rating,
            'amenities' => $this->amenities,
            'images' => $this->images,
            'availability' => $this->availability,
            'primary_image' => $this->getPrimaryImage()?->getImageUrl(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
