<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Booking;
use App\Models\Image;

class HighTeaVenue extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'description',
        'price_per_head',
        'cuisine_type',
        'capacity',
        'amenities',
        'images',
        'time_slots',
        'menu',
        'ambiance_images',
    ];

    protected $casts = [
        'time_slots' => 'array',
        'menu' => 'array',
        'ambiance_images' => 'array',
        'amenities' => 'array',
        'images' => 'array',
        'price_per_head' => 'decimal:2',
    ];

    public function bookings()
    {
        return $this->morphMany(Booking::class, 'bookable');
    }

    /**
     * Get all images for this venue
     */
    public function images()
    {
        return Image::forVenue('high_tea_venue', $this->id)->get();
    }

    /**
     * Get primary/featured image for this venue
     */
    public function getPrimaryImage()
    {
        return Image::query()
            ->forVenue('high_tea_venue', $this->id)
            ->where('is_primary', true)
            ->first();
    }
}
