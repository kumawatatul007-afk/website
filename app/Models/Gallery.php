<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Gallery extends Model
{
    protected $table = 'gallery';

    protected $fillable = [
        'image',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if (!$this->image) return null;

        if (str_starts_with($this->image, 'http')) {
            return $this->image;
        }

        if (Storage::disk('public')->exists('gallery/' . $this->image)) {
            return asset('storage/gallery/' . $this->image);
        }

        return 'https://thenikhilsharma.in/public/uploads/gallery/' . $this->image;
    }
}
