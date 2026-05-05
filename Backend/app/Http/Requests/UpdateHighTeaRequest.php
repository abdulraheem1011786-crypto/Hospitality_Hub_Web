<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHighTeaRequest extends FormRequest
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
            'price_per_head' => ['sometimes', 'numeric', 'min:0'],
            'cuisine_type' => ['nullable', 'string', 'max:255'],
            'capacity' => ['nullable', 'integer', 'min:1'],
            'amenities' => ['nullable', 'array'],
            'images' => ['nullable', 'array'],
        ];
    }
}
