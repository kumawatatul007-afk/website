<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoPage extends Model
{
    protected $table = 'seo_pages';

    protected $fillable = [
        'route',
        'meta_title',
        'meta_description',
        'meta_keyword',
        'canonical_url',
        'og_title',
        'og_description',
        'og_image',
        'twitter_title',
        'twitter_description',
        'twitter_image',
        'schema_markup',
    ];
}
