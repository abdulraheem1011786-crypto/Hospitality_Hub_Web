<?php

namespace Database\Seeders;

use App\Models\EventHall;
use Illuminate\Database\Seeder;

class EventHallSeeder extends Seeder
{
    public function run(): void
    {
        $halls = [
            [
                'name' => 'Grand Ballroom Lahore',
                'location' => 'DHA Phase 5, Lahore',
                'description' => 'Spacious elegant ballroom for large weddings and corporate events. Crystal chandeliers and marble floors.',
                'price_half_day' => 50000,
                'price_full_day' => 90000,
                'capacity' => 500,
                'max_guests' => 500,
                'event_types' => json_encode(['wedding', 'corporate', 'birthday', 'conference']),
                'amenities' => json_encode(['Air Conditioning', 'Parking', 'Sound System', 'Stage', 'Lighting', 'Catering Kitchen']),
                'setup_options' => json_encode(['Theatre', 'Banquet', 'Classroom', 'Cocktail']),
                'add_ons' => json_encode(['Catering', 'Decoration', 'Sound System', 'Photography', 'Videography']),
                'images' => json_encode(['ballroom1.jpg', 'ballroom2.jpg']),
            ],
            [
                'name' => 'Royal Event Hall',
                'location' => 'Gulberg III, Lahore',
                'description' => 'Elegant mid-size venue with modern decor. Perfect for weddings, receptions, and corporate events.',
                'price_half_day' => 40000,
                'price_full_day' => 75000,
                'capacity' => 300,
                'max_guests' => 300,
                'event_types' => json_encode(['wedding', 'reception', 'conference', 'birthday']),
                'amenities' => json_encode(['AC', 'Parking', 'Sound System', 'Lighting', 'Green Room']),
                'setup_options' => json_encode(['Banquet', 'Theatre', 'Classroom']),
                'add_ons' => json_encode(['Catering', 'Photography', 'Decoration', 'Flower Arrangements']),
                'images' => json_encode(['royal1.jpg', 'royal2.jpg']),
            ],
            [
                'name' => 'Pearl Continental Conference Hall',
                'location' => 'Mall Road, Lahore',
                'description' => 'Professional conference and business meeting hall. Modern facilities with high-speed internet and AV equipment.',
                'price_half_day' => 35000,
                'price_full_day' => 65000,
                'capacity' => 200,
                'max_guests' => 200,
                'event_types' => json_encode(['conference', 'seminar', 'meeting', 'corporate training']),
                'amenities' => json_encode(['WiFi', 'Projector', 'Screen', 'Sound System', 'AC', 'Catering Service']),
                'setup_options' => json_encode(['Classroom', 'Theatre', 'U-Shape', 'Boardroom']),
                'add_ons' => json_encode(['Catering', 'AV Equipment', 'Parking']),
                'images' => json_encode(['pearl_conf1.jpg', 'pearl_conf2.jpg']),
            ],
            [
                'name' => 'Garden Pavilion Events',
                'location' => 'Model Town, Lahore',
                'description' => 'Beautiful outdoor-indoor hybrid venue with garden ambiance. Ideal for garden parties and intimate celebrations.',
                'price_half_day' => 30000,
                'price_full_day' => 55000,
                'capacity' => 150,
                'max_guests' => 150,
                'event_types' => json_encode(['birthday', 'anniversary', 'corporate gathering', 'engagement']),
                'amenities' => json_encode(['Natural Lighting', 'Garden Setting', 'Parking', 'AC Indoor Area', 'Bar']),
                'setup_options' => json_encode(['Garden Setup', 'Cocktail', 'Banquet']),
                'add_ons' => json_encode(['Decoration', 'Catering', 'Lighting', 'Tent Setup']),
                'images' => json_encode(['pavilion1.jpg', 'pavilion2.jpg']),
            ],
            [
                'name' => 'Heritage Hall Historic Venue',
                'location' => 'Old City, Lahore',
                'description' => 'Historic venue with traditional Mughal architecture. Perfect for weddings and cultural events with authentic charm.',
                'price_half_day' => 45000,
                'price_full_day' => 80000,
                'capacity' => 250,
                'max_guests' => 250,
                'event_types' => json_encode(['wedding', 'cultural event', 'traditional ceremony', 'reception']),
                'amenities' => json_encode(['Heritage Decor', 'Traditional Seating', 'Parking', 'Prayer Room']),
                'setup_options' => json_encode(['Banquet', 'Cocktail', 'Traditional Setup']),
                'add_ons' => json_encode(['Traditional Decoration', 'Catering', 'Live Music', 'Photography']),
                'images' => json_encode(['heritage1.jpg', 'heritage2.jpg']),
            ],
            [
                'name' => 'Modern Plaza Convention Center',
                'location' => 'Johar Town, Lahore',
                'description' => 'State-of-the-art convention center with latest technology. Suitable for large corporate events and conferences.',
                'price_half_day' => 55000,
                'price_full_day' => 95000,
                'capacity' => 400,
                'max_guests' => 400,
                'event_types' => json_encode(['conference', 'exhibition', 'corporate event', 'workshop']),
                'amenities' => json_encode(['WiFi', 'Projectors', 'Video Wall', 'Sound System', 'AC', 'Multiple Breakout Rooms']),
                'setup_options' => json_encode(['Theatre', 'Classroom', 'Banquet', 'Boardroom']),
                'add_ons' => json_encode(['Catering', 'AV Services', 'IT Support', 'Printing Services']),
                'images' => json_encode(['modern1.jpg', 'modern2.jpg']),
            ],
        ];

        foreach ($halls as $hall) {
            EventHall::create($hall);
        }
    }
}
