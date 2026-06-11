<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Models\BlogPost;
use App\Models\PortfolioItem;
use App\Models\BlogComment;

// ─── Blog API ────────────────────────────────────────────────────────────────

// Get all blog posts (for public listing)
Route::get('/blog', function () {
    $posts = BlogPost::latest()->get();

    $posts = $posts->map(function ($p) {
        $imgUrl = $p->image
            ? (str_starts_with($p->image, 'http') ? $p->image : '/images/blogs/' . $p->image)
            : null;
        return [
            'id'               => $p->id,
            'title'            => $p->title ?? '',
            'slug'             => $p->slug ?? '',
            'description'      => $p->description ?? '',
            'excerpt'          => $p->meta_description ?: ($p->description ? \Illuminate\Support\Str::limit(strip_tags($p->description), 160) : ''),
            'image_url'        => $imgUrl,
            'image'            => $p->image ?? '',
            'meta_description' => $p->meta_description ?? '',
            'meta_title'       => $p->meta_title ?? '',
            'meta_keyword'     => $p->meta_keyword ?? '',
            'author'           => 'Nikhil Sharma',
            'category_id'      => $p->category_id,
            'published_at'     => $p->created_at,
            'created_at'       => $p->created_at,
            'updated_at'       => $p->updated_at,
        ];
    });

    return response()->json($posts);
});

// Get single blog post by slug
Route::get('/blog/{slug}', function ($slug) {
    $post = BlogPost::where('slug', $slug)->firstOrFail();

    $comments = DB::table('blog_comments')
        ->where('blog_id', $post->id)
        ->orderBy('created_at', 'asc')
        ->get(['id', 'name', 'email', 'description as comment', 'created_at']);

    $prev = BlogPost::where('id', '<', $post->id)
        ->orderBy('id', 'desc')
        ->first(['id', 'title', 'slug', 'image']);
        
    $next = BlogPost::where('id', '>', $post->id)
        ->orderBy('id', 'asc')
        ->first(['id', 'title', 'slug', 'image']);

    $imgUrl = $post->image
        ? (str_starts_with($post->image, 'http') ? $post->image : '/images/blogs/' . $post->image)
        : null;

    $prevImgUrl = $prev && $prev->image
        ? (str_starts_with($prev->image, 'http') ? $prev->image : '/images/blogs/' . $prev->image)
        : null;

    $nextImgUrl = $next && $next->image
        ? (str_starts_with($next->image, 'http') ? $next->image : '/images/blogs/' . $next->image)
        : null;

    return response()->json([
        'id'               => $post->id,
        'title'            => $post->title ?? '',
        'slug'             => $post->slug ?? '',
        'excerpt'          => $post->meta_description ?? '',
        'description'      => $post->description ?? '',
        'image_url'        => $imgUrl,
        'image'            => $post->image ?? '',
        'meta_description' => $post->meta_description ?? '',
        'meta_title'       => $post->meta_title ?? '',
        'meta_keyword'     => $post->meta_keyword ?? '',
        'author'           => 'Nikhil Sharma',
        'category_id'      => $post->category_id,
        'published_at'     => $post->created_at,
        'created_at'       => $post->created_at,
        'updated_at'       => $post->updated_at,
        'comments'         => $comments,
        'prev_post'        => $prev ? ['id' => $prev->id, 'slug' => $prev->slug, 'title' => $prev->title, 'image_url' => $prevImgUrl, 'image' => $prev->image] : null,
        'next_post'        => $next ? ['id' => $next->id, 'slug' => $next->slug, 'title' => $next->title, 'image_url' => $nextImgUrl, 'image' => $next->image] : null,
    ]);
});

// ─── Portfolio API ────────────────────────────────────────────────────────────

// Get all portfolio items (for public listing)
Route::get('/portfolio', function () {
    $items = PortfolioItem::where('is_publish', 1)->latest()->get();

    $items = $items->map(function ($item) {
        return [
            'id'                => $item->id,
            'title'             => $item->title,
            'slug'              => $item->slug,
            'category_id'       => $item->category_id,
            'short_description' => $item->short_description,
            'description'       => $item->description,
            'image_url'         => $item->image_url,
            'image'             => $item->image,
            'website_link'      => $item->website_link,
            'clint_name'        => $item->clint_name,
            'status'            => $item->status,
            'is_publish'        => $item->is_publish,
            'date'              => $item->date,
            'created_at'        => $item->created_at,
        ];
    });

    return response()->json($items);
});

// Get single portfolio item by slug (or ID for fallback)
Route::get('/portfolio/{slug}', function ($slug) {
    $item = is_numeric($slug)
        ? PortfolioItem::findOrFail($slug)
        : PortfolioItem::where('slug', $slug)->firstOrFail();

    $prev = PortfolioItem::where('id', '<', $item->id)->orderBy('id', 'desc')->first(['id', 'title', 'image', 'slug']);
    $next = PortfolioItem::where('id', '>', $item->id)->orderBy('id', 'asc')->first(['id', 'title', 'image', 'slug']);

    return response()->json([
        'item' => [
            'id'                => $item->id,
            'title'             => $item->title,
            'slug'              => $item->slug,
            'category_id'       => $item->category_id,
            'short_description' => $item->short_description,
            'description'       => $item->description,
            'image_url'         => $item->image_url,
            'image'             => $item->image,
            'website_link'      => $item->website_link,
            'clint_name'        => $item->clint_name,
            'status'            => $item->status,
            'is_publish'        => $item->is_publish,
            'date'              => $item->date,
            'created_at'        => $item->created_at,
        ],
        'prev_item' => $prev ? ['id' => $prev->id, 'title' => $prev->title, 'image_url' => $prev->image_url, 'slug' => $prev->slug] : null,
        'next_item' => $next ? ['id' => $next->id, 'title' => $next->title, 'image_url' => $next->image_url, 'slug' => $next->slug] : null,
    ]);
});

// ─── Testimonials API ─────────────────────────────────────────────────────────

Route::get('/testimonials', function () {
    try {
        $rows = DB::table('testimonials')
            ->where('is_publish', 1)
            ->get(['id', 'name', 'designation', 'description', 'image']);
    } catch (\Exception $e) {
        // Fallback if is_publish column doesn't exist
        $rows = DB::table('testimonials')
            ->get(['id', 'name', 'designation', 'description', 'image']);
    }

    $rows = $rows->map(function ($r) {
        return [
            'id'       => $r->id,
            'name'     => $r->name,
            'position' => $r->designation ?? '',
            'text'     => html_entity_decode(strip_tags($r->description ?? ''), ENT_QUOTES | ENT_HTML5, 'UTF-8'),
            'image'    => $r->image ? url('storage/' . $r->image) : null,
        ];
    });

    return response()->json($rows);
});
