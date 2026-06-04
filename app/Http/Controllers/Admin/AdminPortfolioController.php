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
            'slug'              => 'nullable|string|max:255',
            'category_id'       => 'nullable|integer|exists:categories,id',
            'image'             => 'nullable|file|image|mimes:jpeg,jpg,png,gif,webp|max:5120',
            'clint_name'        => 'nullable|string|max:255',
            'status'            => 'nullable|string|in:Active,Inactive',
            'date'              => 'nullable|date',
            'website_link'      => 'nullable|url|max:500',
            'short_description' => 'nullable|string|max:1000',
            'description'       => 'nullable|string',
            'meta_keyword'      => 'nullable|string|max:500',
            'meta_description'  => 'nullable|string|max:500',
            'is_publish'        => 'nullable|integer|in:0,1',
        ], [
            'title.required'       => 'The title field is required.',
            'title.max'            => 'The title must not exceed 255 characters.',
            'category_id.exists'   => 'The selected category does not exist.',
            'image.image'          => 'The file must be an image.',
            'image.mimes'          => 'The image must be a file of type: jpeg, jpg, png, gif, webp.',
            'image.max'            => 'The image size must not exceed 5MB.',
            'website_link.url'     => 'Please enter a valid URL starting with http:// or https://',
            'status.in'            => 'Status must be either Active or Inactive.',
            'is_publish.in'        => 'Publish status must be 0 or 1.',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            
            // Generate unique filename
            $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            
            // Ensure upload directory exists
            $uploadPath = public_path('uploads/portfolio');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }
            
            // Move uploaded file
            $image->move($uploadPath, $imageName);
            $validated['image'] = $imageName;
        } else {
            unset($validated['image']);
        }

        // Handle slug generation
        $baseSlug = !empty($validated['slug']) 
            ? Str::slug($validated['slug']) 
            : Str::slug($validated['title']);
        
        $slug = $baseSlug;
        $counter = 1;
        
        // Ensure unique slug
        while (PortfolioItem::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }
        
        $validated['slug'] = $slug;
        $validated['status'] = $validated['status'] ?? 'Active';
        $validated['is_publish'] = $validated['is_publish'] ?? 1;

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
        // Validate the incoming request
        $validated = $request->validate([
            'title'             => 'required|string|max:255',
            'category_id'       => 'nullable|integer|exists:categories,id',
            'image'             => 'nullable|file|image|mimes:jpeg,jpg,png,gif,webp|max:5120',
            'clint_name'        => 'nullable|string|max:255',
            'status'            => 'nullable|string|in:Active,Inactive',
            'date'              => 'nullable|date',
            'website_link'      => 'nullable|url|max:500',
            'short_description' => 'nullable|string|max:1000',
            'description'       => 'nullable|string',
            'meta_keyword'      => 'nullable|string|max:500',
            'meta_description'  => 'nullable|string|max:500',
            'is_publish'        => 'nullable|integer|in:0,1',
        ], [
            'title.required'            => 'The title field is required.',
            'title.max'                 => 'The title must not exceed 255 characters.',
            'category_id.exists'        => 'The selected category does not exist.',
            'image.image'               => 'The file must be an image.',
            'image.mimes'               => 'The image must be a file of type: jpeg, jpg, png, gif, webp.',
            'image.max'                 => 'The image size must not exceed 5MB.',
            'website_link.url'          => 'Please enter a valid URL starting with http:// or https://',
            'status.in'                 => 'Status must be either Active or Inactive.',
            'is_publish.in'             => 'Publish status must be 0 or 1.',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            
            // Generate unique filename
            $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            
            // Ensure upload directory exists
            $uploadPath = public_path('uploads/portfolio');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }
            
            // Move uploaded file
            $image->move($uploadPath, $imageName);
            $validated['image'] = $imageName;

            // Delete old image if exists
            if ($portfolio->image && file_exists(public_path('uploads/portfolio/' . $portfolio->image))) {
                @unlink(public_path('uploads/portfolio/' . $portfolio->image));
            }
        } else {
            // Don't update image field if no new image uploaded
            unset($validated['image']);
        }

        // Handle slug generation only if title changed or slug is empty
        if (empty($portfolio->slug) || trim($portfolio->title) !== trim($validated['title'])) {
            $baseSlug = Str::slug($validated['title']);
            $slug = $baseSlug;
            $counter = 1;
            
            // Ensure unique slug (excluding current portfolio item)
            while (PortfolioItem::where('slug', $slug)
                                 ->where('id', '!=', $portfolio->id)
                                 ->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            
            $validated['slug'] = $slug;
        }

        // Set default values if not provided
        $validated['status'] = $validated['status'] ?? 'Active';
        $validated['is_publish'] = $validated['is_publish'] ?? 1;

        // Update the portfolio item
        $portfolio->update($validated);

        // Redirect with success message
        return redirect()->route('admin.portfolio.index')
            ->with('success', 'Portfolio item "' . $validated['title'] . '" updated successfully!');
    }

    public function destroy(PortfolioItem $portfolio)
    {
        $portfolio->delete();

        return redirect()->route('admin.portfolio.index')
         ->with('success', 'Portfolio item deleted successfully.'); 
    }
}
