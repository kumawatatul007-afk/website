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

        $validated['slug']       = Str::slug($validated['title']);
        $validated['is_publish'] = $validated['is_publish'] ?? 1;

        // Ensure unique slug
        $base  = $validated['slug'];
        $count = 1;
        while (PortfolioItem::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $base . '-' . $count++;
        }

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
        // Debug incoming request
        \Log::info('Portfolio Update Request', [
            'all_data' => $request->all(),
            'title' => $request->input('title'),
            'has_file' => $request->hasFile('image')
        ]);

        $validated = $request->validate([
            'title'             => 'required|string|max:255',
            'category_id'       => 'nullable|integer',
            'image'             => 'nullable|file|image|max:5120', // Changed to handle file upload
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

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/portfolio'), $imageName);
            $validated['image'] = $imageName;

            // Delete old image if exists
            if ($portfolio->image && file_exists(public_path('uploads/portfolio/' . $portfolio->image))) {
                unlink(public_path('uploads/portfolio/' . $portfolio->image));
            }
        } else {
            // Keep existing image
            unset($validated['image']);
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
