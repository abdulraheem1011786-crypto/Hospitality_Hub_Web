<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'bookable_type',
        'bookable_id',
        'booking_date',
        'details',
        'total_price',
        'status',
    ];

    protected $casts = [
        'details' => 'array',
        'total_price' => 'decimal:2',
        'booking_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bookable()
    {
        return $this->morphTo();
    }
}
