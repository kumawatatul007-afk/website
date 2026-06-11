<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Footer extends Model
{
    protected $table = 'footer';

    protected $fillable = [
        'facebook',
        'twitter',
        'linkedin',
        'youtube',
        'instagram',
        'footer_text',
        'terms_condition',
        'impressum',
        'privacy_policy',
    ];
}
