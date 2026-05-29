<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminGalleryController extends Controller
{
    public function index(Request $request)
    {
        $query = Gallery::query();

        if ($request->filled('search')) {
            $query->where('image', 'like', "%{$request->search}%");
        }

        $items = $query->latest()->paginate(12)->withQueryString();

        // Append full URL to each item
        $items->getCollection()->transform(function ($item) {
            $item->image_url = $this->resolveImageUrl($item->image);
            return $item;
        });

        return Inertia::render('Admin/Gallery/index', [
            'items'   => $items,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|file|image|mimes:jpeg,jpg,png,gif,webp,PNG|max:5120',
        ]);

        $path = $request->file('image')->store('gallery', 'public');
        $filename = basename($path);

        Gallery::create(['image' => $filename]);

        return redirect()->route('admin.gallery.index')
            ->with('success', 'Image uploaded successfully.');
    }

    public function destroy(Gallery $gallery)
    {
        // Delete file from storage if it exists
        if ($gallery->image && Storage::disk('public')->exists('gallery/' . $gallery->image)) {
            Storage::disk('public')->delete('gallery/' . $gallery->image);
        }

        $gallery->delete();

        return redirect()->route('admin.gallery.index')
            ->with('success', 'Gallery image deleted successfully.');
    }

    /**
     * Resolve the full accessible URL for a gallery image.
     * Handles both locally uploaded files and legacy filenames.
     */
    private function resolveImageUrl(?string $image): ?string
    {
        if (!$image) return null;

        // Already a full URL
        if (str_starts_with($image, 'http')) {
            return $image;
        }

        // Check if file exists in local storage/public/gallery
        if (Storage::disk('public')->exists('gallery/' . $image)) {
            return asset('storage/gallery/' . $image);
        }

        // Fallback: try the original site's URL (legacy imported images)
        return 'https://thenikhilsharma.in/public/uploads/gallery/' . $image;
    }
}
