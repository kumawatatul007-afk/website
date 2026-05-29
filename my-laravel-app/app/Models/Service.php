<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'slug',
        'price_range',
        'description',
        'features',
        'cta_text',
        'sort_order',
        'is_active',
        // legacy columns (kept for compatibility)
        'category_id',
        'tags',
        'image',
        'designation',
        'is_location',
        'meta_title',
        'meta_keyword',
        'image_alt',
        'meta_description',
    ];

    protected $casts = [
        'features'  => 'array',
        'is_active' => 'boolean',
    ];
}
