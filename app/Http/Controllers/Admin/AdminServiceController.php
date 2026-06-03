<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
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
    // type=1 means service in blogs table
    private const TYPE_SERVICE = 1;

    public function index()
    {
        $services = BlogPost::where('type', self::TYPE_SERVICE)
            ->orderBy('serial_number')
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
            'slug'             => 'nullable|string|max:255|unique:blogs,slug',
            'meta_description' => 'nullable|string',
            'meta_keywords'    => 'nullable|string',
            'tags'             => 'nullable|string',
            'content'          => 'nullable|string',
            'main_image'       => 'nullable|string|max:255',
            'serial_number'    => 'nullable|integer|min:0',
            'status'           => 'nullable|integer',
            'category_id'      => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $validated['content'] = cleanServiceContent($validated['content'] ?? '');
        $validated['type']    = self::TYPE_SERVICE;
        $validated['status']  = $validated['status'] ?? 1;

        BlogPost::create($validated);

        return redirect()->route('admin.services.index')
            ->with('success', 'Service created successfully.');
    }

    public function edit($id)
    {
        $service = BlogPost::where('type', self::TYPE_SERVICE)->findOrFail($id);

        // Parse meta_keywords from JSON array to plain comma string for the form
        $data = $service->toArray();
        if ($data['meta_keywords']) {
            $decoded = json_decode($data['meta_keywords'], true);
            if (is_array($decoded)) {
                $data['meta_keywords'] = implode(', ', array_column($decoded, 'value'));
            }
        }

        return Inertia::render('Admin/Services/edit', [
            'service' => $data,
        ]);
    }

    public function update(Request $request, $id)
    {
        $service = BlogPost::where('type', self::TYPE_SERVICE)->findOrFail($id);

        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'slug'             => 'nullable|string|max:255|unique:blogs,slug,' . $service->id,
            'meta_description' => 'nullable|string',
            'meta_keywords'    => 'nullable|string',
            'tags'             => 'nullable|string',
            'content'          => 'nullable|string',
            'main_image'       => 'nullable|string|max:255',
            'serial_number'    => 'nullable|integer|min:0',
            'status'           => 'nullable|integer',
            'category_id'      => 'nullable|integer',
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
        $service = BlogPost::where('type', self::TYPE_SERVICE)->findOrFail($id);
        $service->delete();

        return redirect()->route('admin.services.index')
            ->with('success', 'Service deleted successfully.');
    }
}
