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
        'meta_keywords',
        'meta_description',
        'type',
        'tags',
        'main_image',
        'content',
        'status',
    ];

    protected $casts = [
        'content'    => 'string',
        'status'     => 'integer',
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

    /**
     * Get the main image URL.
     */
    public function getImageUrlAttribute(): string
    {
        if (!$this->main_image) return '';
        if (str_starts_with($this->main_image, 'http')) return $this->main_image;
        return '/images/blogs/' . $this->main_image;
    }
}
