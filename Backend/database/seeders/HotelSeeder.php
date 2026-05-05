<?php

namespace Database\Seeders;

use App\Models\Hotel;
use Illuminate\Database\Seeder;

class HotelSeeder extends Seeder
{
    public function run(): void
    {
        $hotels = [
            [
                'name' => 'Avari Lahore',
                'location' => 'Mall Road, Lahore',
                'description' => 'Luxury 5-star hotel in the heart of Lahore with modern amenities and world-class service.',
                'price_per_night' => 15000,
                'rating' => 4.5,
                'amenities' => json_encode(['WiFi', 'Swimming Pool', 'Gym', 'Restaurant', 'Bar', 'Business Center']),
                'images' => json_encode(['avari1.jpg', 'avari2.jpg']),
                'availability' => json_encode(['2024-04-01' => true, '2024-04-02' => true]),
            ],
            [
                'name' => 'Pearl Continental Lahore',
                'location' => 'Mall Road, Lahore',
                'description' => 'Historic 5-star hotel with colonial architecture and contemporary luxury. Perfect for special occasions.',
                'price_per_night' => 18000,
                'rating' => 4.7,
                'amenities' => json_encode(['WiFi', 'Swimming Pool', 'Spa', 'Multiple Restaurants', 'Banquet Hall', 'Concierge']),
                'images' => json_encode(['pearl1.jpg', 'pearl2.jpg']),
                'availability' => json_encode(['2024-04-01' => true, '2024-04-03' => true]),
            ],
            [
                'name' => 'Hilton Lahore',
                'location' => 'Egerton Road, Lahore',
                'description' => 'International 5-star hotel with premium business facilities and excellent customer service.',
                'price_per_night' => 20000,
                'rating' => 4.6,
                'amenities' => json_encode(['WiFi', 'Business Center', 'Gym', 'Swimming Pool', 'Conference Rooms', 'Room Service']),
                'images' => json_encode(['hilton1.jpg', 'hilton2.jpg']),
                'availability' => json_encode(['2024-04-02' => true, '2024-04-04' => true]),
            ],
            [
                'name' => 'The Nishat Hotel',
                'location' => 'DHA Phase 5, Lahore',
                'description' => 'Ultra-luxury 5-star hotel in an exclusive location with premium personalized services.',
                'price_per_night' => 22000,
                'rating' => 4.8,
                'amenities' => json_encode(['WiFi', 'Swimming Pool', 'Spa & Wellness', 'Gym', 'Fine Dining', 'Butler Service']),
                'images' => json_encode(['nishat1.jpg', 'nishat2.jpg']),
                'availability' => json_encode(['2024-04-01' => true, '2024-04-05' => true]),
            ],
            [
                'name' => 'Lahore Marriott Hotel',
                'location' => 'Shahrah-e-Quaid-e-Azam, Lahore',
                'description' => 'Full-service international hotel with conference facilities and modern accommodations.',
                'price_per_night' => 19000,
                'rating' => 4.4,
                'amenities' => json_encode(['WiFi', 'Conference Rooms', 'Swimming Pool', 'Restaurant', 'Gym', 'Business Lounge']),
                'images' => json_encode(['marriott1.jpg', 'marriott2.jpg']),
                'availability' => json_encode(['2024-04-03' => true, '2024-04-06' => true]),
            ],
            [
                'name' => 'Ramada by Wyndham Lahore',
                'location' => 'Allama Iqbal Town, Lahore',
                'description' => 'Modern 4-star hotel offering comfortable rooms, great dining, and excellent service.',
                'price_per_night' => 12000,
                'rating' => 4.2,
                'amenities' => json_encode(['WiFi', 'Restaurant', 'Parking', 'Gym', 'Room Service', 'Front Desk 24/7']),
                'images' => json_encode(['ramada1.jpg', 'ramada2.jpg']),
                'availability' => json_encode(['2024-04-02' => true, '2024-04-04' => true]),
            ],
        ];

        foreach ($hotels as $hotel) {
            Hotel::create($hotel);
        }
    }
}
