<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Booking;
use App\Models\Image;

class EventHall extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'description',
        'price_half_day',
        'price_full_day',
        'capacity',
        'max_guests',
        'amenities',
        'setup_options',
        'event_types',
        'add_ons',
        'images',
    ];

    protected $casts = [
        'event_types' => 'array',
        'add_ons' => 'array',
        'images' => 'array',
        'amenities' => 'array',
        'setup_options' => 'array',
        'price_half_day' => 'decimal:2',
        'price_full_day' => 'decimal:2',
    ];

    public function bookings()
    {
        return $this->morphMany(Booking::class, 'bookable');
    }

    /**
     * Get all images for this event hall
     */
    public function images()
    {
        return Image::forVenue('event_hall', $this->id)->get();
    }

    /**
     * Get primary/featured image for this event hall
     */
    public function getPrimaryImage()
    {
        return Image::query()
            ->forVenue('event_hall', $this->id)
            ->where('is_primary', true)
            ->first();
    }
}
