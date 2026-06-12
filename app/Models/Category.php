<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';

    protected $fillable = [
        'id',
        'text_for',
        'name',
        'slug',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        //
    ];

    protected $appends = [
        'text_for',
    ];

    public function getTextForAttribute($value)
    {
        return strtolower($this->attributes['text_for'] ?? 'blog');
    }

    public function setTextForAttribute($value)
    {
        $this->attributes['text_for'] = strtolower($value ?: 'blog');
    }

    public function blogs()
    {
        return $this->hasMany(BlogPost::class, 'category_id');
    }
}
