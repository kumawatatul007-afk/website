<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Models\BlogPost;
use App\Models\PortfolioItem;
use App\Models\BlogComment;

// ─── Blog API ────────────────────────────────────────────────────────────────

// Get all blog posts (for public listing)
Route::get('/blog', function () {
    $posts = BlogPost::where('status', 1)
        ->latest()
        ->get(['id', 'title', 'slug', 'content', 'main_image', 'meta_description', 'category_id', 'tags', 'created_at']);

    $posts = $posts->map(function ($p) {
        $imgUrl = $p->main_image
            ? (str_starts_with($p->main_image, 'http') ? $p->main_image : '/images/blogs/' . $p->main_image)
            : null;
        return [
            'id'           => $p->id,
            'title'        => $p->title,
            'slug'         => $p->slug,
            'excerpt'      => $p->meta_description ?: ($p->content ? \Illuminate\Support\Str::limit(strip_tags($p->content), 160) : null),
            'image_url'    => $imgUrl,
            'main_image'   => $p->main_image,
            'author'       => 'Nikhil Sharma',
            'category_id'  => $p->category_id,
            'tags'         => $p->tags,
            'published_at' => $p->created_at,
            'created_at'   => $p->created_at,
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

    $prev = BlogPost::where('id', '<', $post->id)->orderBy('id', 'desc')->first(['id', 'title', 'slug', 'main_image']);
    $next = BlogPost::where('id', '>', $post->id)->orderBy('id', 'asc')->first(['id', 'title', 'slug', 'main_image']);

    $imgUrl = $post->main_image
        ? (str_starts_with($post->main_image, 'http') ? $post->main_image : '/images/blogs/' . $post->main_image)
        : null;

    $prevImgUrl = $prev && $prev->main_image
        ? (str_starts_with($prev->main_image, 'http') ? $prev->main_image : '/images/blogs/' . $prev->main_image)
        : null;

    $nextImgUrl = $next && $next->main_image
        ? (str_starts_with($next->main_image, 'http') ? $next->main_image : '/images/blogs/' . $next->main_image)
        : null;

    return response()->json([
        'id'           => $post->id,
        'title'        => $post->title,
        'slug'         => $post->slug,
        'excerpt'      => $post->meta_description,
        'content'      => $post->content,
        'image_url'    => $imgUrl,
        'main_image'   => $post->main_image,
        'author'       => 'Nikhil Sharma',
        'category_id'  => $post->category_id,
        'tags'         => $post->tags,
        'published_at' => $post->created_at,
        'created_at'   => $post->created_at,
        'comments'     => $comments,
        'prev_post'    => $prev ? ['id' => $prev->id, 'slug' => $prev->slug, 'title' => $prev->title, 'image_url' => $prevImgUrl, 'main_image' => $prev->main_image] : null,
        'next_post'    => $next ? ['id' => $next->id, 'slug' => $next->slug, 'title' => $next->title, 'image_url' => $nextImgUrl, 'main_image' => $next->main_image] : null,
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

// Get single portfolio item by ID
Route::get('/portfolio/{id}', function ($id) {
    $item = PortfolioItem::findOrFail($id);

    $prev = PortfolioItem::where('id', '<', $id)->orderBy('id', 'desc')->first(['id', 'title', 'image', 'slug']);
    $next = PortfolioItem::where('id', '>', $id)->orderBy('id', 'asc')->first(['id', 'title', 'image', 'slug']);

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
            'text'     => $r->description ?? '',
            'image'    => $r->image ? url('storage/' . $r->image) : null,
        ];
    });

    return response()->json($rows);
});
