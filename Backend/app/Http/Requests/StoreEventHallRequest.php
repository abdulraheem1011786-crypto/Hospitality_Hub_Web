<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventHallRequest extends FormRequest
{
    public function authorize(): bool
    {
        return in_array($this->user()?->role, ['admin', 'vendor']);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'capacity' => ['required', 'integer', 'min:1'],
            'price_full_day' => ['required', 'numeric', 'min:0'],
            'price_half_day' => ['nullable', 'numeric', 'min:0'],
            'amenities' => ['nullable', 'array'],
            'images' => ['nullable', 'array'],
            'max_guests' => ['nullable', 'integer', 'min:1'],
            'setup_options' => ['nullable', 'array'],
        ];
    }
}
