<?php

namespace Database\Seeders;

use App\Models\HighTeaVenue;
use Illuminate\Database\Seeder;

class HighTeaVenueSeeder extends Seeder
{
    public function run(): void
    {
        $venues = [
            [
                'name' => 'Monal Restaurant & Garden',
                'location' => 'Lawrence Gardens, Lahore',
                'description' => 'Traditional high tea with scenic views of the gardens. Famous for its serene ambiance and premium tea selection.',
                'price_per_head' => 2500,
                'cuisine_type' => 'Continental & Pakistani',
                'capacity' => 80,
                'amenities' => json_encode(['WiFi', 'Outdoor Seating', 'Parking', 'Live Music']),
                'images' => json_encode(['monal1.jpg', 'monal2.jpg']),
                'time_slots' => json_encode(['morning', 'evening']),
                'menu' => json_encode(['Sandwiches', 'Scones', 'Tea', 'Pastries', 'Pakistani Snacks']),
                'ambiance_images' => json_encode(['monal1.jpg', 'monal3.jpg']),
            ],
            [
                'name' => 'Cooco\'s Den Cafe',
                'location' => 'Gulberg, Lahore',
                'description' => 'Modern cafe with creative high tea options and artistic ambiance. Perfect for casual meetups and gatherings.',
                'price_per_head' => 2000,
                'cuisine_type' => 'Fusion Cafe',
                'capacity' => 45,
                'amenities' => json_encode(['WiFi', 'Indoor Seating', 'Art Gallery', 'Parking']),
                'images' => json_encode(['coocos1.jpg', 'coocos2.jpg']),
                'time_slots' => json_encode(['afternoon', 'evening']),
                'menu' => json_encode(['Finger Sandwiches', 'Muffins', 'Coffee', 'Tea', 'Cakes']),
                'ambiance_images' => json_encode(['coocos1.jpg', 'coocos2.jpg']),
            ],
            [
                'name' => 'Avari Lahore High Tea',
                'location' => 'Mall Road, Lahore',
                'description' => 'Luxury high tea experience at a 5-star hotel with impeccable service and gourmet delicacies.',
                'price_per_head' => 3500,
                'cuisine_type' => 'International Fine Dining',
                'capacity' => 120,
                'amenities' => json_encode(['WiFi', 'Valet Parking', 'Premium Service', 'Indoor/Outdoor Seating']),
                'images' => json_encode(['avari_tea1.jpg', 'avari_tea2.jpg']),
                'time_slots' => json_encode(['afternoon']),
                'menu' => json_encode(['Assorted Sandwiches', 'Desserts', 'Tea Selection', 'Fresh Juices']),
                'ambiance_images' => json_encode(['avari_tea1.jpg', 'avari_tea2.jpg']),
            ],
            [
                'name' => 'Toscanini Italian Cafe',
                'location' => 'Liberty Market, Lahore',
                'description' => 'Italian-inspired high tea with authentic European flavors in the heart of Gulberg. Cozy and romantic setting.',
                'price_per_head' => 2800,
                'cuisine_type' => 'Italian',
                'capacity' => 60,
                'amenities' => json_encode(['WiFi', 'Authentic Italian Ambiance', 'Parking', 'Intimate Setting']),
                'images' => json_encode(['toscanini1.jpg', 'toscanini2.jpg']),
                'time_slots' => json_encode(['morning', 'afternoon']),
                'menu' => json_encode(['Pastries', 'Espresso', 'Italian Tea', 'Tiramisu', 'Bruschetta']),
                'ambiance_images' => json_encode(['toscanini1.jpg', 'toscanini2.jpg']),
            ],
            [
                'name' => 'The Lounge at Pearl Continental',
                'location' => 'Mall Road, Lahore',
                'description' => 'Elegant high tea setting in a historic hotel with colonial charm and premium hospitality. Live piano music.',
                'price_per_head' => 3200,
                'cuisine_type' => 'Continental & Local',
                'capacity' => 100,
                'amenities' => json_encode(['WiFi', 'Valet Parking', 'Live Piano', 'Heritage Ambiance', 'Bar Service']),
                'images' => json_encode(['pearl_lounge1.jpg', 'pearl_lounge2.jpg']),
                'time_slots' => json_encode(['afternoon', 'evening']),
                'menu' => json_encode(['Tea Sandwiches', 'Scones', 'Cakes', 'Pakistani Delicacies', 'Premium Teas']),
                'ambiance_images' => json_encode(['pearl_lounge1.jpg', 'pearl_lounge2.jpg']),
            ],
            [
                'name' => 'Andaaz Restaurant & Rooftop',
                'location' => 'Old City, Lahore (Near Badshahi Mosque)',
                'description' => 'Traditional rooftop high tea with panoramic views of Mughal architecture. Authentic Lahori experience with live Qawwali.',
                'price_per_head' => 1800,
                'cuisine_type' => 'Traditional Pakistani',
                'capacity' => 70,
                'amenities' => json_encode(['Rooftop View', 'Heritage Ambiance', 'Traditional Seating', 'Live Qawwali']),
                'images' => json_encode(['andaaz1.jpg', 'andaaz2.jpg']),
                'time_slots' => json_encode(['evening']),
                'menu' => json_encode(['Pakistani Snacks', 'Kashmiri Tea', 'Samosas', 'Jalebi', 'Traditional Sweets']),
                'ambiance_images' => json_encode(['andaaz1.jpg', 'andaaz2.jpg']),
            ],
        ];

        foreach ($venues as $venue) {
            HighTeaVenue::create($venue);
        }
    }
}
