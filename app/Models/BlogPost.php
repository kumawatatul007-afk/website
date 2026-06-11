<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BlogPost extends Model
{
    use HasFactory;

    protected $table = 'blogs';

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'description',
        'image',
        'meta_title',
        'og_title',
        'og_description',
        'meta_keyword',
        'image_alt',
        'meta_description',
        'created_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Auto-generate slug from title if not provided.
     */
    public static function generateSlug(string $title): string
    {
        return Str::slug($title);
    }

    protected $appends = ['image_url'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function comments()
    {
        return $this->hasMany(BlogComment::class, 'blog_id');
    }

    /**
     * Get the image URL.
     */
    public function getImageUrlAttribute(): string
    {
        $image = $this->attributes['image'] ?? null;
        
        if (!$image) return '';
        if (str_starts_with($image, 'http')) return $image;
        return '/images/blogs/' . $image;
    }
}
