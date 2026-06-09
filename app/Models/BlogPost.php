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
        'serial_number',
        'meta_title',
        'meta_keywords',
        'meta_keyword',
        'meta_description',
        'og_title',
        'og_description',
        'image_alt',
        'type',
        'tags',
        'main_image',
        'description',
        'content',
        'created_by',
        'status',
    ];

    protected $casts = [
        'content'    => 'string',
        'type'       => 'integer',
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

    /**
     * Get meta_keywords as a plain comma-separated string.
     * The DB stores them as JSON array: [{"value":"website"},...]
     */
    public function getMetaKeywordsPlainAttribute(): string
    {
        if (!$this->meta_keywords) return '';
        $decoded = json_decode($this->meta_keywords, true);
        if (is_array($decoded)) {
            return implode(', ', array_column($decoded, 'value'));
        }
        return $this->meta_keywords;
    }

    protected $appends = [];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function comments()
    {
        return $this->hasMany(BlogComment::class, 'blog_id');
    }

    public function getContentAttribute($value)
    {
        if ($value !== null) {
            return $value;
        }

        return $this->attributes['description'] ?? '';
    }

    /**
     * Get the main image URL.
     */
    public function getImageUrlAttribute(): string
    {
        // Prevent infinite loop - check raw attribute directly
        $mainImage = $this->attributes['main_image'] ?? null;
        
        if (!$mainImage) return '';
        if (str_starts_with($mainImage, 'http')) return $mainImage;
        return '/images/blogs/' . $mainImage;
    }
    
    /**
     * Get description attribute (fallback to content if not set).
     */
    public function getDescriptionAttribute(): string
    {
        // Check if description column exists in attributes
        if (array_key_exists('description', $this->attributes)) {
            return $this->attributes['description'] ?? '';
        }
        // Fallback to content
        return $this->attributes['content'] ?? '';
    }
}
