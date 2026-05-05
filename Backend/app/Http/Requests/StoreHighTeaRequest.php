<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHighTeaRequest extends FormRequest
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
            'price_per_head' => ['required', 'numeric', 'min:0'],
            'cuisine_type' => ['nullable', 'string', 'max:255'],
            'capacity' => ['nullable', 'integer', 'min:1'],
            'amenities' => ['nullable', 'array'],
            'images' => ['nullable', 'array'],
            'time_slots' => ['nullable', 'array'],
        ];
    }
}
