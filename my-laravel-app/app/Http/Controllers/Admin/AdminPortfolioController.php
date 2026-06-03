<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioItem;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminPortfolioController extends Controller
{
    public function index(Request $request)
    {
        $query = PortfolioItem::query();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('short_description', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('is_publish', $request->status);
        }

        $items = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Portfolio/index', [
            'items'       => $items,
            'filters'     => $request->only(['search', 'status']),
            'hasSearched' => true,
            'categories'  => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Portfolio/create', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'             => 'required|string|max:255',
            'category_id'       => 'nullable|integer',
            'image'             => 'nullable|string|max:500',
            'image_file'        => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:5120',
            'clint_name'        => 'nullable|string|max:255',
            'status'            => 'nullable|string|max:50',
            'date'              => 'nullable|date',
            'website_link'      => 'nullable|string|max:500',
            'short_description' => 'nullable|string',
            'description'       => 'nullable|string',
            'meta_keyword'      => 'nullable|string|max:255',
            'meta_description'  => 'nullable|string|max:255',
            'is_publish'        => 'nullable|integer',
        ]);

        // Handle image file upload
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
            $file->move(public_path('images/portfolio'), $filename);
            $validated['image'] = $filename;
        }

        $validated['slug']       = Str::slug($validated['title']);
        $validated['is_publish'] = $validated['is_publish'] ?? 1;

        // Ensure unique slug
        $base  = $validated['slug'];
        $count = 1;
        while (PortfolioItem::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $base . '-' . $count++;
        }

        // Remove image_file from validated data as it's not in database
        unset($validated['image_file']);

        PortfolioItem::create($validated);

        return redirect()->route('admin.portfolio.index')
            ->with('success', 'Portfolio item created successfully.');
    }

    public function edit(PortfolioItem $portfolio)
    {
        return Inertia::render('Admin/Portfolio/edit', [
            'item'       => $portfolio,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, PortfolioItem $portfolio)
    {
        $validated = $request->validate([
            'title'             => 'required|string|max:255',
            'category_id'       => 'nullable|integer',
            'image'             => 'nullable|string|max:500',
            'image_file'        => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:5120',
            'clint_name'        => 'nullable|string|max:255',
            'status'            => 'nullable|string|max:50',
            'date'              => 'nullable|date',
            'website_link'      => 'nullable|string|max:500',
            'short_description' => 'nullable|string',
            'description'       => 'nullable|string',
            'meta_keyword'      => 'nullable|string|max:255',
            'meta_description'  => 'nullable|string|max:255',
            'is_publish'        => 'nullable|integer',
        ]);

        // Handle image file upload
        if ($request->hasFile('image_file')) {
            // Delete old image if it exists and is a local file
            if ($portfolio->image && !str_starts_with($portfolio->image, 'http')) {
                $oldImagePath = public_path('images/portfolio/' . $portfolio->image);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            $file = $request->file('image_file');
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
            $file->move(public_path('images/portfolio'), $filename);
            $validated['image'] = $filename;
        }

        // Backfill slug if the item doesn't have one yet
        if (empty($portfolio->slug)) {
            $base  = Str::slug($validated['title']);
            $slug  = $base;
            $count = 1;
            while (PortfolioItem::where('slug', $slug)->where('id', '!=', $portfolio->id)->exists()) {
                $slug = $base . '-' . $count++;
            }
            $validated['slug'] = $slug;
        }

        // Remove image_file from validated data as it's not in database
        unset($validated['image_file']);

        $portfolio->update($validated);

        return redirect()->route('admin.portfolio.index')
            ->with('success', 'Portfolio item updated successfully.');
    }

    public function destroy(PortfolioItem $portfolio)
    {
        $portfolio->delete();

        return redirect()->route('admin.portfolio.index')
            ->with('success', 'Portfolio item deleted successfully.');
    }
}
