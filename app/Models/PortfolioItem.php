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
        'image',
        'clint_name',
        'status',
        'date',
        'website_link',
        'short_description',
        'description',
        'meta_keyword',
        'meta_description',
        'is_publish',
    ];

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
        if (!$this->image) return '';
        if (str_starts_with($this->image, 'http')) return $this->image;
        return '/images/portfolio/' . $this->image;
    }

    /**
     * Scope: only published items.
     */
    public function scopePublished($query)
    {
        return $query->where('is_publish', 1);
    }
}
