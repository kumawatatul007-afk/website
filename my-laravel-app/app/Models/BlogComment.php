<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogComment extends Model
{
    protected $table = 'blog_comments';

    protected $fillable = [
        'blog_id',
        'name',
        'email',
        'website',
        'description',
        'is_check',
        'is_publish',
    ];

    public function blog()
    {
        return $this->belongsTo(BlogPost::class, 'blog_id');
    }
}
