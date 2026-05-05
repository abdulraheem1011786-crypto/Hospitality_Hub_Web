<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Hotel;
use App\Models\HighTeaVenue;
use App\Models\EventHall;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'bookable_type' => ['required', Rule::in([Hotel::class, HighTeaVenue::class, EventHall::class])],
            'bookable_id' => ['required', 'integer'],
            'booking_date' => ['required', 'date'],
            'details' => ['nullable', 'array'],
            'total_price' => ['required', 'numeric', 'min:0'],
        ];
    }
}
