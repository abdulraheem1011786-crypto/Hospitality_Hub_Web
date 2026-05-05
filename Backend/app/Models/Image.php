<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;

    protected $fillable = [
        'venue_type',
        'venue_id',
        'image_path',
        'file_name',
        'mime_type',
        'file_size',
        'sort_order',
        'is_primary',
        'alt_text',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'sort_order' => 'integer',
        'is_primary' => 'boolean',
    ];

    /**
     * Get the full URL for this image
     */
    public function getImageUrl()
    {
        return url('storage/uploads/venues/' . $this->image_path);
    }

    /**
     * Scope: Get images for a specific venue
     */
    public function scopeForVenue($query, $venueType, $venueId)
    {
        return $query->where('venue_type', $venueType)
                    ->where('venue_id', $venueId)
                    ->orderBy('is_primary', 'desc')
                    ->orderBy('sort_order', 'asc');
    }

    /**
     * Scope: Get primary image for a venue
     */
    public function scopePrimary($query, $venueType, $venueId)
    {
        return $query->where('venue_type', $venueType)
                    ->where('venue_id', $venueId)
                    ->where('is_primary', true)
                    ->first();
    }
}
