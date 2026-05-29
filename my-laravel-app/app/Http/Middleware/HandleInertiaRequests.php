<?php

namespace App\Http\Middleware;

use App\Models\SeoPage;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $currentRoute = $request->path() === '/' ? 'home' : $request->path();
        
        $seo = null;
        try {
            $seoModel = SeoPage::where('route', $currentRoute)->first();
            
            if ($seoModel) {
                // Convert model to plain array so blade can access it with ['key']
                $seo = $seoModel->toArray();
            } else {
                if ($currentRoute === 'home' || $currentRoute === '/') {
                    $seo = [
                        'title' => 'Best Web Developer & Digital Marketer in Jaipur | Nikhil Sharma',
                        'description' => 'Nikhil Sharma is a top-rated Web Developer and Full Stack expert in Jaipur, helping small businesses grow with high-quality websites.',
                        'keywords' => 'Web Developer Jaipur, Software Developer Jaipur, Nikhil Sharma, Portfolio',
                    ];
                }
            }
        } catch (\Exception $e) {
            // Database not ready or table missing
            \Log::warning("SEO data could not be loaded: " . $e->getMessage());
        }

        // Load site settings once and share globally
        $setting = null;
        try {
            $setting = Setting::first();
        } catch (\Exception $e) {
            \Log::warning("Settings could not be loaded: " . $e->getMessage());
        }

        return [
            ...parent::share($request),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
            'auth' => [
                'user' => fn () => $request->user()
                    ? $request->user()->only('id', 'name', 'email', 'role')
                    : null,
            ],
            'seo'     => $seo,
            'setting' => $setting,
        ];
    }
}
