<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventHallRequest extends FormRequest
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
            'capacity' => ['sometimes', 'integer', 'min:1'],
            'price_full_day' => ['sometimes', 'numeric', 'min:0'],
            'price_half_day' => ['nullable', 'numeric', 'min:0'],
            'amenities' => ['nullable', 'array'],
            'images' => ['nullable', 'array'],
            'max_guests' => ['nullable', 'integer', 'min:1'],
            'setup_options' => ['nullable', 'array'],
        ];
    }
}
