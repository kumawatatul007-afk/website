<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $table = 'settings';

    protected $fillable = [
        'title',
        'website_title',
        'strating_keyword',
        'locations',
        'email',
        'phone',
        'phonenumber',
        'address',
        'preloader',
        'timing',
        'logo',
        'favicon',
        'social_links',
    ];

    protected $casts = [
        'social_links' => 'array',
        'preloader'    => 'boolean',
    ];
}
