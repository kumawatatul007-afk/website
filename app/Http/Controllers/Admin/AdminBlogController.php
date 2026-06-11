<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
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
                  ->orWhere('slug', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $posts = $query->latest()->paginate(15)->withQueryString();

        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Blog/index', [
            'posts'      => $posts,
            'categories' => $categories,
            'filters'    => $request->only(['search', 'category_id']),
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
            'slug'             => 'nullable|string|max:255|unique:blogs,slug',
            'description'      => 'nullable|string',
            'image'            => 'nullable|file|image|max:5120',
            'category_id'      => 'nullable|integer',
            'meta_title'       => 'nullable|string|max:255',
            'meta_keyword'     => 'nullable|string',
            'meta_description' => 'nullable|string',
            'og_title'         => 'nullable|string|max:255',
            'og_description'   => 'nullable|string',
            'image_alt'        => 'nullable|string|max:255',
        ]);

        // Handle file upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('images/blogs'), $filename);
            $validated['image'] = $filename;
        } else {
            unset($validated['image']);
        }

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Ensure unique slug
        $baseSlug = $validated['slug'];
        $count    = 1;
        while (BlogPost::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $baseSlug . '-' . $count++;
        }

        if (Schema::hasColumn('blogs', 'created_by')) {
            $validated['created_by'] = Auth::id() ?: 0;
        }
        
        $validated['category_id'] = $validated['category_id'] ?: null;

        BlogPost::create($validated);

        return redirect()->route('admin.blog.index')
            ->with('success', 'Blog post created successfully.');
    }

    public function edit(BlogPost $blog)
    {
        $categories = Category::orderBy('name')->get(['id', 'name']);
        
        $blogData = [
            'id'               => $blog->id,
            'title'            => $blog->title ?? '',
            'slug'             => $blog->slug ?? '',
            'description'      => $blog->description ?? '',
            'image'            => $blog->image ?? '',
            'category_id'      => $blog->category_id ?? '',
            'meta_title'       => $blog->meta_title ?? '',
            'meta_keyword'     => $blog->meta_keyword ?? '',
            'meta_description' => $blog->meta_description ?? '',
            'og_title'         => $blog->og_title ?? '',
            'og_description'   => $blog->og_description ?? '',
            'image_alt'        => $blog->image_alt ?? '',
        ];
        
        return Inertia::render('Admin/Blog/edit', [
            'post'       => $blogData,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, BlogPost $blog)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'slug'             => 'nullable|string|max:255|unique:blogs,slug,' . $blog->id,
            'description'      => 'nullable|string',
            'image'            => 'nullable|file|image|max:5120',
            'category_id'      => 'nullable|integer',
            'meta_title'       => 'nullable|string|max:255',
            'meta_keyword'     => 'nullable|string',
            'meta_description' => 'nullable|string',
            'og_title'         => 'nullable|string|max:255',
            'og_description'   => 'nullable|string',
            'image_alt'        => 'nullable|string|max:255',
        ]);

        // Handle file upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('images/blogs'), $filename);
            $validated['image'] = $filename;
        } else {
            unset($validated['image']);
        }

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Ensure unique slug
        $baseSlug = $validated['slug'];
        $count    = 1;
        while (BlogPost::where('slug', $validated['slug'])->where('id', '!=', $blog->id)->exists()) {
            $validated['slug'] = $baseSlug . '-' . $count++;
        }

        $validated['category_id']   = $validated['category_id'] ?: null;

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
