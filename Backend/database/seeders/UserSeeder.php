<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User
        User::updateOrCreate(
            ['email' => 'admin@hospitalityhub.pk'],
            [
                'name' => 'Admin User',
                'email' => 'admin@hospitalityhub.pk',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        // Vendor Users
        User::updateOrCreate(
            ['email' => 'vendor1@hospitalityhub.pk'],
            [
                'name' => 'Vendor One',
                'email' => 'vendor1@hospitalityhub.pk',
                'password' => Hash::make('vendor123'),
                'role' => 'vendor',
            ]
        );

        User::updateOrCreate(
            ['email' => 'vendor2@hospitalityhub.pk'],
            [
                'name' => 'Vendor Two',
                'email' => 'vendor2@hospitalityhub.pk',
                'password' => Hash::make('vendor123'),
                'role' => 'vendor',
            ]
        );

        // Test Customer User
        User::updateOrCreate(
            ['email' => 'customer@hospitalityhub.pk'],
            [
                'name' => 'Test Customer',
                'email' => 'customer@hospitalityhub.pk',
                'password' => Hash::make('customer123'),
                'role' => 'customer',
            ]
        );

        // Demo Admin Account (for testing purposes)
        User::updateOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Demo Admin',
                'email' => 'admin@test.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );
    }
}
