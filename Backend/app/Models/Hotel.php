<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Booking;
use App\Models\Image;

class Hotel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'description',
        'price_per_night',
        'rating',
        'amenities',
        'images',
        'availability',
    ];

    protected $casts = [
        'amenities' => 'array',
        'images' => 'array',
        'availability' => 'array',
        'price_per_night' => 'decimal:2',
        'rating' => 'decimal:1',
    ];

    public function bookings()
    {
        return $this->morphMany(Booking::class, 'bookable');
    }

    /**
     * Get all images for this hotel
     */
    public function images()
    {
        return Image::forVenue('hotel', $this->id)->get();
    }

    /**
     * Get primary/featured image for this hotel
     */
    public function getPrimaryImage()
    {
        return Image::query()
            ->forVenue('hotel', $this->id)
            ->where('is_primary', true)
            ->first();
    }
}
