<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

// Strips all HTML tags and decodes entities to produce clean plain text.
// Applied on every store/update so the database never contains raw HTML.
function cleanServiceContent(?string $html): string
{
    if (!$html || trim($html) === '' || trim($html) === '<p><br></p>') {
        return '';
    }
    $text = preg_replace('/<br\s*\/?>/i', "\n", $html);
    $text = preg_replace('/<\/(p|div|h[1-6]|li|tr|blockquote|section|article)>/i', "\n", $text);
    $text = preg_replace('/<li[^>]*>/i', '• ', $text);
    $text = strip_tags($text);
    $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $text = preg_replace('/[ \t]+/', ' ', $text);
    $text = preg_replace('/\n[ \t]+/', "\n", $text);
    $text = preg_replace('/\n{3,}/', "\n\n", $text);
    return trim($text);
}

class AdminServiceController extends Controller
{
    public function index()
    {
        $services = Service::where('is_active', 1)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Services/index', [
            'services' => $services,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Services/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'slug'             => 'nullable|string|max:255|unique:services,slug',
            'subtitle'         => 'nullable|string|max:255',
            'price_range'      => 'nullable|string|max:255',
            'description'      => 'nullable|string',
            'features'         => 'nullable|array',
            'cta_text'         => 'nullable|string|max:255',
            'sort_order'       => 'nullable|integer|min:0',
            'is_active'        => 'nullable|boolean',
            'tags'             => 'nullable|string',
            'image'            => 'nullable|string|max:255',
            'category_id'      => 'nullable|integer',
            'meta_title'       => 'nullable|string|max:255',
            'meta_keyword'     => 'nullable|string',
            'meta_description' => 'nullable|string',
            'image_alt'        => 'nullable|string|max:255',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $validated['content'] = cleanServiceContent($validated['content'] ?? '');
        $validated['type']    = self::TYPE_SERVICE;
        $validated['status']  = $validated['status'] ?? 1;

        Service::create($validated);

        return redirect()->route('admin.services.index')
            ->with('success', 'Service created successfully.');
    }

    public function edit($id)
    {
        $service = Service::findOrFail($id);

        return Inertia::render('Admin/Services/edit', [
            'service' => $service,
        ]);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'slug'             => 'nullable|string|max:255|unique:services,slug,' . $service->id,
            'subtitle'         => 'nullable|string|max:255',
            'price_range'      => 'nullable|string|max:255',
            'description'      => 'nullable|string',
            'features'         => 'nullable|array',
            'cta_text'         => 'nullable|string|max:255',
            'sort_order'       => 'nullable|integer|min:0',
            'is_active'        => 'nullable|boolean',
            'tags'             => 'nullable|string',
            'image'            => 'nullable|string|max:255',
            'category_id'      => 'nullable|integer',
            'meta_title'       => 'nullable|string|max:255',
            'meta_keyword'     => 'nullable|string',
            'meta_description' => 'nullable|string',
            'image_alt'        => 'nullable|string|max:255',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $validated['content'] = cleanServiceContent($validated['content'] ?? '');

        // Never change type
        unset($validated['type']);

        $service->update($validated);

        return redirect()->route('admin.services.index')
            ->with('success', 'Service updated successfully.');
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return redirect()->route('admin.services.index')
            ->with('success', 'Service deleted successfully.');
    }
}
