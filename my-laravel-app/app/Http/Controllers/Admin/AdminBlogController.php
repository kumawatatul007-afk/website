<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminBlogController extends Controller
{
    public function index(Request $request)
    {
        $query = BlogPost::query();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('slug', 'like', "%{$request->search}%")
                  ->orWhere('tags', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $posts = $query->latest()->paginate(15)->withQueryString();

        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Blog/index', [
            'posts'      => $posts,
            'categories' => $categories,
            'filters'    => $request->only(['search', 'category_id', 'status']),
        ]);
    }

    public function create()
    {
        $categories = Category::orderBy('name')->get(['id', 'name']);
        return Inertia::render('Admin/Blog/create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'content'          => 'nullable|string',
            'main_image'       => 'nullable|string|max:500',
            'category_id'      => 'nullable|integer',
            'serial_number'    => 'nullable|integer',
            'meta_title'       => 'nullable|string|max:255',
            'meta_keywords'    => 'nullable|string',
            'meta_keyword'     => 'nullable|string',
            'meta_description' => 'nullable|string',
            'og_title'         => 'nullable|string|max:255',
            'og_description'   => 'nullable|string',
            'image_alt'        => 'nullable|string|max:255',
            'tags'             => 'nullable|string',
            'type'             => 'nullable|integer',
            'status'           => 'nullable|integer',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        // Ensure unique slug
        $baseSlug = $validated['slug'];
        $count    = 1;
        while (BlogPost::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $baseSlug . '-' . $count++;
        }

        $validated['serial_number'] = $validated['serial_number'] ?? 0;
        $validated['status']        = $validated['status'] ?? 1;
        $validated['type']          = $validated['type'] ?? 0;

        BlogPost::create($validated);

        return redirect()->route('admin.blog.index')
            ->with('success', 'Blog post created successfully.');
    }

    public function edit(BlogPost $blog)
    {
        $categories = Category::orderBy('name')->get(['id', 'name']);
        return Inertia::render('Admin/Blog/edit', [
            'post'       => $blog,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, BlogPost $blog)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'content'          => 'nullable|string',
            'main_image'       => 'nullable|string|max:500',
            'category_id'      => 'nullable|integer',
            'serial_number'    => 'nullable|integer',
            'meta_title'       => 'nullable|string|max:255',
            'meta_keywords'    => 'nullable|string',
            'meta_keyword'     => 'nullable|string',
            'meta_description' => 'nullable|string',
            'og_title'         => 'nullable|string|max:255',
            'og_description'   => 'nullable|string',
            'image_alt'        => 'nullable|string|max:255',
            'tags'             => 'nullable|string',
            'type'             => 'nullable|integer',
            'status'           => 'nullable|integer',
        ]);

        $blog->update($validated);

        return redirect()->route('admin.blog.index')
            ->with('success', 'Blog post updated successfully.');
    }

    public function destroy(BlogPost $blog)
    {
        $blog->delete();

        return redirect()->route('admin.blog.index')
            ->with('success', 'Blog post deleted successfully.');
    }
}
