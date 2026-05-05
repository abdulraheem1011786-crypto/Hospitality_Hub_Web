<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHotelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return in_array($this->user()?->role, ['admin', 'vendor']);
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'location' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'price_per_night' => ['sometimes', 'numeric', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'amenities' => ['nullable', 'array'],
            'images' => ['nullable', 'array'],
            'availability' => ['nullable', 'array'],
        ];
    }
}
