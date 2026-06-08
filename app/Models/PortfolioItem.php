<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortfolioItem extends Model
{
    use HasFactory;

    // Actual table name in the database
    protected $table = 'portfolio';

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'year',
        'client',
        'services',
        'project',
        'image',
        'clint_name',
        'status',
        'date',
        'website_link',
        'short_description',
        'description',
        'summary',
        'meta_title',
        'og_title',
        'meta_keyword',
        'image_alt',
        'meta_description',
        'og_description',
        'is_publish',
    ];

    protected $appends = ['image_url'];

    protected $casts = [
        'is_publish'  => 'integer',
        'category_id' => 'integer',
        'date'        => 'date',
        'created_at'  => 'datetime',
        'updated_at'  => 'datetime',
    ];

    /**
     * Get the full image URL.
     */
    public function getImageUrlAttribute(): string
    {
        $image = $this->image ?? '';
        
        if (!$image) return '';
        if (str_starts_with($image, 'http')) return $image;
        
        // Return proper path
        return '/uploads/portfolio/' . $image;
    }

    /**
     * Scope: only published items.
     */
    public function scopePublished($query)
    {
        return $query->where('is_publish', 1);
    }
}
