<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Footer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FooterController extends Controller
{
    public function index()
    {
        $footer = Footer::first();

        return Inertia::render('Admin/Settings/Footer', [
            'footer' => $footer,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'facebook' => 'nullable|string|max:255',
            'twitter' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'youtube' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'footer_text' => 'nullable|string',
            'terms_condition' => 'nullable|string',
            'impressum' => 'nullable|string',
            'privacy_policy' => 'nullable|string',
        ]);

        $footer = Footer::first();

        if ($footer) {
            $footer->update($validated);
        } else {
            Footer::create($validated);
        }

        return redirect()->route('admin.settings.footer')
            ->with('success', 'Footer updated successfully.');
    }
}
