<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\PortfolioItem;
use App\Models\Category;
use App\Models\Service;
use App\Models\Setting;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class PublicController extends Controller
{
    /**
     * Home page — latest blogs + featured portfolio + services + settings
     */
    public function home()
    {
        $blogPosts = BlogPost::where('status', '!=', 'draft')
            ->where('status', '!=', 0)
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($post) {
                return [
                    'id'               => $post->id,
                    'title'            => $post->title ?? '',
                    'slug'             => $post->slug ?? '',
                    'content'          => $post->content ?? '',
                    'description'      => $post->description ?? $post->content ?? '',
                    'main_image'       => $post->main_image ?? $post->image_url ?? '',
                    'image_url'        => $post->image_url ?? $post->main_image ?? '',
                    'meta_description' => $post->meta_description ?? '',
                    'created_at'       => $post->created_at?->toISOString() ?? '',
                ];
            });

        $portfolios = PortfolioItem::where('is_publish', 1)
            ->where('status', 'Active')
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title ?? '',
                    'slug' => $item->slug ?? '',
                    'image' => $item->image ?? '',
                    'image_url' => $item->image_url ?? '',
                    'website_link' => $item->website_link ?? '',
                    'short_description' => $item->short_description ?? '',
                    'clint_name' => $item->clint_name ?? '',
                    'date' => $item->date ? $item->date->format('Y-m-d') : '',
                ];
            });

        // Fetch services from BlogPost where type=1 (consistent with the rest of the app)
        $services = BlogPost::where('type', 1)
            ->where('status', 1)
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($service) {
                return [
                    'id'          => $service->id,
                    'title'       => $service->title,
                    'subtitle'    => $service->meta_description ?? '',
                    'slug'        => $service->slug,
                    'description' => $service->content ?? '',
                    'features'    => [],
                    'meta_keyword' => $service->meta_keyword ?? '',
                ];
            });

        $setting  = \App\Models\Setting::first();
        $siteName = $setting?->website_title ?: 'Nikhil Sharma';

        // Generate dynamic keywords by combining services and locations
        $dynamicKeywords = $this->generateDynamicKeywords($services, $setting);

        return Inertia::render('home/index', [
            'blogPosts'        => $blogPosts,
            'portfolios'       => $portfolios,
            'services'         => $services,
            'setting'          => $setting,
            'dynamicKeywords'  => $dynamicKeywords,
            'seo'              => [
                'title'       => "{$siteName} | Freelance PHP, React & Flutter Developer — Jaipur, India",
                'description' => "Hire {$siteName}, a Jaipur-based Full Stack Developer with 8+ years building websites, apps & digital solutions. Fast delivery, affordable rates, real results.",
                'keywords'    => "Web Developer Jaipur, PHP Developer Jaipur, React Developer India, Full Stack Developer Jaipur, {$siteName}",
                'canonical'   => url()->current(),
                'robots'      => 'index, follow',
            ],
        ]);
    }

    /**
     * Generate dynamic keywords by combining services and locations
     */
    private function generateDynamicKeywords($services, $setting)
    {
        $keywords = [];
        $prefixes = ['Best', 'Top', 'Top 10', 'Top 5', 'No1', 'Find', 'Hire'];
        
        // Get locations from settings
        $locations = [];
        if ($setting && $setting->locations) {
            $locations = array_map('trim', explode(',', $setting->locations));
        }
        
        // Fallback locations if none in settings
        if (empty($locations)) {
            $locations = ['Jaipur', 'Malviya Nagar', 'Vaishali Nagar', 'C-Scheme', 'Mansarovar', 'Ajmer Road', 'Jagatpura', 'Civil Lines', 'Kalwar Road', 'Jhotwara', 'Ajmer', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Alwar', 'Sikar', 'Tonk', 'Pali', 'Nagaur', 'Bhilwara', 'Bangalore', 'Pune', 'Kolkata', 'Delhi', 'Mumbai', 'Hyderabad', 'Chennai'];
        }

        // Get service names
        $serviceNames = [];
        foreach ($services as $service) {
            $serviceNames[] = $service['title'];
        }

        // Fallback services if none in database
        if (empty($serviceNames)) {
          $serviceNames = ['Website Development', 'Mobile App Development', 'E-Commerce Solutions', 'Custom Software Development', 'Digital Marketing', 'UI UX Design'];
        }

        // Generate keywords by combining prefixes, services, and locations
        foreach ($prefixes as $prefix) {
            foreach ($serviceNames as $service) {
                foreach ($locations as $location) {
                    $keywords[] = "{$prefix} {$service} in {$location}";
                }
            }
        }

        return array_unique($keywords);
    }

    /**
     * Blog listing page
     */
    public function blog()
    {
        // Fetch all published blogs with all necessary fields
        $posts = BlogPost::where('status', '!=', 'draft')
            ->where('status', '!=', 0)
            ->latest()
            ->get()
            ->map(function ($post) {
                return [
                    'id'               => $post->id,
                    'title'            => $post->title ?? '',
                    'slug'             => $post->slug ?? '',
                    'content'          => $post->content ?? '',
                    'description'      => $post->description ?? $post->content ?? '',
                    'main_image'       => $post->main_image ?? $post->image_url ?? '',
                    'image_url'        => $post->image_url ?? $post->main_image ?? '',
                    'meta_description' => $post->meta_description ?? '',
                    'meta_title'       => $post->meta_title ?? '',
                    'meta_keyword'     => $post->meta_keyword ?? '',
                    'category_id'      => $post->category_id,
                    'tags'             => $post->tags ?? '',
                    'created_at'       => $post->created_at?->toISOString() ?? '',
                    'updated_at'       => $post->updated_at?->toISOString() ?? '',
                ];
            });

        $setting  = Setting::first();
        $siteName = $setting?->website_title ?: 'Nikhil Sharma';

        return Inertia::render('Blog/index', [
            'posts' => $posts,
            'seo'   => [
                'title'       => "Blog — Web Development Tips & Tutorials | {$siteName}",
                'description' => "Read the latest articles on web development, app development, UI/UX design, and SEO by {$siteName}, a Jaipur-based Full Stack Developer.",
                'keywords'    => "Web Development Blog, PHP Tips, React Tutorials, Laravel Blog, {$siteName} Blog",
                'canonical'   => url()->current(),
                'robots'      => 'index, follow',
            ],
        ]);
    }

    /**
     * Blog detail page — /{slug}  (new clean URL)
     */
    public function blogDetail($slug)
    {
        $post = BlogPost::where('slug', $slug)->firstOrFail();
        
        $postArray = [
            'id'               => $post->id,
            'title'            => $post->title ?? '',
            'slug'             => $post->slug ?? '',
            'content'          => $post->content ?? '',
            'description'      => $post->description ?? $post->content ?? '',
            'main_image'       => $post->main_image ?? $post->image_url ?? '',
            'image_url'        => $post->image_url ?? $post->main_image ?? '',
            'meta_description' => $post->meta_description ?? '',
            'meta_title'       => $post->meta_title ?? '',
            'meta_keyword'     => $post->meta_keyword ?? '',
            'og_title'         => $post->og_title ?? '',
            'og_description'   => $post->og_description ?? '',
            'category_id'      => $post->category_id,
            'tags'             => $post->tags ?? '',
            'created_at'       => $post->created_at?->toISOString() ?? '',
            'updated_at'       => $post->updated_at?->toISOString() ?? '',
        ];

        // Previous post (older)
        $prevPost = BlogPost::where('status', '!=', 'draft')
            ->where('status', '!=', 0)
            ->where('id', '<', $post->id)
            ->orderBy('id', 'desc')
            ->select('id', 'title', 'slug')
            ->first();

        // Next post (newer)
        $nextPost = BlogPost::where('status', '!=', 'draft')
            ->where('status', '!=', 0)
            ->where('id', '>', $post->id)
            ->orderBy('id', 'asc')
            ->select('id', 'title', 'slug')
            ->first();

        // Recent posts for sidebar
        $recentPosts = BlogPost::where('status', '!=', 'draft')
            ->where('status', '!=', 0)
            ->where('id', '!=', $post->id)
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($p) {
                return [
                    'id'         => $p->id,
                    'title'      => $p->title ?? '',
                    'slug'       => $p->slug ?? '',
                    'main_image' => $p->main_image ?? $p->image_url ?? '',
                    'image_url'  => $p->image_url ?? $p->main_image ?? '',
                    'created_at' => $p->created_at?->toISOString() ?? '',
                ];
            });

        $setting   = Setting::first();
        $siteName  = $setting?->website_title ?: 'Nikhil Sharma';
        $descText  = strip_tags($postArray['description'] ?? '');
        $descShort = mb_substr($descText, 0, 160);

        // Parse meta_keywords JSON to plain string
        $metaKw = $post->meta_keywords_plain ?: "{$post->title}, {$siteName}, Web Development Blog";

        // Append prev/next to the post object
        $postArray['prev_post'] = $prevPost;
        $postArray['next_post'] = $nextPost;

        return Inertia::render('Blog/BlogDetail/index', [
            'post'        => $postArray,
            'recentPosts' => $recentPosts,
            'seo'         => [
                'title'       => $post->title . " | {$siteName}",
                'description' => $post->meta_description ?: ($descShort ?: "Read {$post->title} on {$siteName}'s blog."),
                'keywords'    => $metaKw,
                'canonical'   => url()->current(),
                'robots'      => 'index, follow',
            ],
        ]);
    }

    /**
     * Blog detail — /blog/{slug}  (legacy — 301 redirect to /{slug})
     */
    public function blogDetailLegacy($slug)
    {
        return redirect("/{$slug}", 301);
    }

    /**
     * Blog detail with sidebar — /{slug}/sidebar  (new clean URL)
     */
    public function blogDetailSidebar($slug)
    {
        $post = BlogPost::where('slug', $slug)->firstOrFail();
        
        $postArray = [
            'id'               => $post->id,
            'title'            => $post->title ?? '',
            'slug'             => $post->slug ?? '',
            'content'          => $post->content ?? '',
            'description'      => $post->description ?? $post->content ?? '',
            'main_image'       => $post->main_image ?? $post->image_url ?? '',
            'image_url'        => $post->image_url ?? $post->main_image ?? '',
            'meta_description' => $post->meta_description ?? '',
            'meta_title'       => $post->meta_title ?? '',
            'meta_keyword'     => $post->meta_keyword ?? '',
            'og_title'         => $post->og_title ?? '',
            'og_description'   => $post->og_description ?? '',
            'category_id'      => $post->category_id,
            'tags'             => $post->tags ?? '',
            'created_at'       => $post->created_at?->toISOString() ?? '',
            'updated_at'       => $post->updated_at?->toISOString() ?? '',
        ];

        $recentPosts = BlogPost::where('status', '!=', 'draft')
            ->where('status', '!=', 0)
            ->latest()
            ->where('id', '!=', $post->id)
            ->take(5)
            ->get()
            ->map(function ($p) {
                return [
                    'id'         => $p->id,
                    'title'      => $p->title ?? '',
                    'slug'       => $p->slug ?? '',
                    'main_image' => $p->main_image ?? $p->image_url ?? '',
                    'image_url'  => $p->image_url ?? $p->main_image ?? '',
                    'created_at' => $p->created_at?->toISOString() ?? '',
                ];
            });

        $setting   = Setting::first();
        $siteName  = $setting?->website_title ?: 'Nikhil Sharma';
        $descText  = strip_tags($postArray['description'] ?? '');
        $descShort = mb_substr($descText, 0, 160);

        $metaKw = $post->meta_keywords_plain ?: "{$post->title}, {$siteName}, Web Development Blog";

        return Inertia::render('Blog/BlogDetailSidebar/index', [
            'post'        => $postArray,
            'recentPosts' => $recentPosts,
            'seo'         => [
                'title'       => $post->title . " | {$siteName}",
                'description' => $post->meta_description ?: ($descShort ?: "Read {$post->title} on {$siteName}'s blog."),
                'keywords'    => $metaKw,
                'canonical'   => url()->current(),
                'robots'      => 'index, follow',
            ],
        ]);
    }

    /**
     * Blog detail sidebar — /blog/{slug}/sidebar  (legacy — 301 redirect)
     */
    public function blogDetailSidebarLegacy($slug)
    {
        return redirect("/{$slug}/sidebar", 301);
    }

    /**
     * Portfolio listing page
     */
    public function portfolio()
    {
        $items = PortfolioItem::where('is_publish', 1)
            ->where('status', 'Active')
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title ?? '',
                    'slug' => $item->slug ?? '',
                    'image' => $item->image ?? '',
                    'image_url' => $item->image_url ?? '',
                    'website_link' => $item->website_link ?? '',
                    'short_description' => $item->short_description ?? '',
                    'description' => $item->description ?? '',
                    'category_id' => $item->category_id,
                    'clint_name' => $item->clint_name ?? '',
                    'date' => $item->date ? $item->date->format('Y-m-d') : '',
                ];
            });

        $setting  = Setting::first();
        $siteName = $setting?->website_title ?: 'Nikhil Sharma';

        return Inertia::render('Portfolio/index', [
            'items' => $items,
            'seo'   => [
                'title'       => "Portfolio — Web & App Projects | {$siteName}",
                'description' => "Explore {$siteName}'s portfolio of web development, mobile app, and UI/UX design projects delivered for clients across India and the Middle East.",
                'keywords'    => "Web Development Portfolio, App Development Projects, {$siteName} Portfolio, Jaipur Developer Work",
                'canonical'   => url()->current(),
                'robots'      => 'index, follow',
            ],
        ]);
    }

    /**
     * Portfolio list page (alternate)
     */
    public function portfolioList()
    {
        $items = PortfolioItem::where('is_publish', 1)
            ->where('status', 'Active')
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title ?? '',
                    'slug' => $item->slug ?? '',
                    'image' => $item->image ?? '',
                    'image_url' => $item->image_url ?? '',
                    'website_link' => $item->website_link ?? '',
                    'short_description' => $item->short_description ?? '',
                    'description' => $item->description ?? '',
                    'category_id' => $item->category_id,
                    'clint_name' => $item->clint_name ?? '',
                    'date' => $item->date ? $item->date->format('Y-m-d') : '',
                ];
            });

        $setting  = Setting::first();
        $siteName = $setting?->website_title ?: 'Nikhil Sharma';

        return Inertia::render('Portfolio/PortfolioList/index', [
            'items' => $items,
            'seo'   => [
                'title'       => "All Projects — Portfolio | {$siteName}",
                'description' => "Browse all web and app development projects by {$siteName}, a Jaipur-based Full Stack Developer.",
                'keywords'    => "Portfolio Projects, Web Development Work, {$siteName} Projects",
                'canonical'   => url()->current(),
                'robots'      => 'index, follow',
            ],
        ]);
    }

    /**
     * Portfolio project detail
     */
    public function portfolioDetail($slug)
    {
        $item = is_numeric($slug)
            ? PortfolioItem::where('is_publish', 1)->where('status', 'Active')->findOrFail($slug)
            : PortfolioItem::where('slug', $slug)->where('is_publish', 1)->where('status', 'Active')->firstOrFail();

        $related = PortfolioItem::where('is_publish', 1)
            ->where('status', 'Active')
            ->where('id', '!=', $item->id)
            ->where('category_id', $item->category_id)
            ->take(3)
            ->get()
            ->map(function ($r) {
                return [
                    'id' => $r->id,
                    'title' => $r->title ?? '',
                    'slug' => $r->slug ?? '',
                    'image' => $r->image ?? '',
                    'image_url' => $r->image_url ?? '',
                ];
            });

        $setting   = Setting::first();
        $siteName  = $setting?->website_title ?: 'Nikhil Sharma';
        $descText  = strip_tags($item->description ?? $item->short_description ?? '');
        $descShort = mb_substr($descText, 0, 160);

        $itemData = [
            'id' => $item->id,
            'title' => $item->title ?? '',
            'slug' => $item->slug ?? '',
            'image' => $item->image ?? '',
            'image_url' => $item->image_url ?? '',
            'website_link' => $item->website_link ?? '',
            'short_description' => $item->short_description ?? '',
            'description' => $item->description ?? '',
            'clint_name' => $item->clint_name ?? '',
            'date' => $item->date ? $item->date->format('Y-m-d') : '',
            'category_id' => $item->category_id,
            'category' => optional(Category::find($item->category_id))->name ?? '',
            'meta_title' => $item->meta_title ?? '',
            'meta_keyword' => $item->meta_keyword ?? '',
            'meta_description' => $item->meta_description ?? '',
        ];

        return Inertia::render('Portfolio/ProjectDetail/index', [
            'item'    => $itemData,
            'slug'    => $slug,
            'related' => $related,
            'seo'     => [
                'title'       => "{$item->title} — Portfolio | {$siteName}",
                'description' => $descShort ?: "View the {$item->title} project by {$siteName}.",
                'keywords'    => $item->meta_keyword ?: "{$item->title}, Portfolio, {$siteName}",
                'canonical'   => url()->current(),
                'robots'      => 'index, follow',
            ],
        ]);
    }

    /**
     * Services page
     */
    public function services()
    {
        $servicesQuery = \App\Models\Service::query();
        if (Schema::hasColumn('services', 'is_active')) {
            $servicesQuery->where('is_active', true);
        }
        if (Schema::hasColumn('services', 'sort_order')) {
            $servicesQuery->orderBy('sort_order', 'asc');
        }
        $services = $servicesQuery
            ->latest()
            ->get()
            ->map(function ($service) {
                return [
                    'id'          => $service->id,
                    'title'       => $service->title,
                    'subtitle'    => $service->subtitle,
                    'slug'        => $service->slug,
                    'price_range' => $service->price_range,
                    'description' => $service->description,
                    'features'    => $service->features ?? [],
                    'cta_text'    => $service->cta_text,
                ];
            });

        $setting  = Setting::first();
        $siteName = $setting?->website_title ?: 'Nikhil Sharma';

        return Inertia::render('Services/index', [
            'services' => $services,
            'seo'      => [
                'title'       => "Web Development, App Development & UI/UX Design Services — Jaipur | {$siteName}",
                'description' => "Hire {$siteName} for professional web development, mobile app development, and UI/UX design in Jaipur. PHP, React, Flutter. Affordable rates, fast delivery.",
                'keywords'    => "Web Development Services Jaipur, App Development Jaipur, UI UX Design India, PHP Developer Jaipur, React Developer, Flutter App Developer",
                'canonical'   => url()->current(),
                'robots'      => 'index, follow',
            ],
        ]);
    }

    /**
     * About page
     */
    public function about()
    {
        $setting  = Setting::first();
        $siteName = $setting?->website_title ?: 'Nikhil Sharma';

        return Inertia::render('About/index', [
            'seo' => [
                'title'       => "About {$siteName} — Freelance Developer Jaipur",
                'description' => "Learn about {$siteName}, a Jaipur-based Full Stack Developer with 8+ years of experience in web development, mobile apps, and UI/UX design.",
                'keywords'    => "About {$siteName}, Freelance Developer Jaipur, Full Stack Developer India, Web Developer Bio",
                'canonical'   => url()->current(),
                'robots'      => 'index, follow',
            ],
        ]);
    }

    /**
     * Contact page
     */
    public function contact()
    {
        $setting  = Setting::first();
        $siteName = $setting?->website_title ?: 'Nikhil Sharma';

        return Inertia::render('Contact/index', [
            'seo' => [
                'title'       => "Contact {$siteName} — Hire a Freelance Developer in Jaipur",
                'description' => "Get in touch with {$siteName} for web development, app development, or UI/UX design projects. Based in Jaipur, available worldwide.",
                'keywords'    => "Contact {$siteName}, Hire Web Developer Jaipur, Freelance Developer Contact, Get a Quote",
                'canonical'   => url()->current(),
                'robots'      => 'index, follow',
            ],
        ]);
    }

    /**
     * Web Developer Jaipur landing page
     */
    public function webDeveloperJaipur()
    {
        $setting  = Setting::first();
        $siteName = $setting?->website_title ?: 'Nikhil Sharma';

        return Inertia::render('LocalLanding/WebDeveloperJaipur', [
            'seo' => [
                'title'       => "Web Developer in Jaipur — {$siteName} | PHP, React, Flutter",
                'description' => "Looking for a Web Developer in Jaipur? {$siteName} builds fast, SEO-optimised websites and apps using React, Laravel & Flutter. 8+ years experience.",
                'keywords'    => "Web Developer Jaipur, Website Developer Jaipur, PHP Developer Jaipur, React Developer Jaipur, {$siteName}",
                'canonical'   => url()->current(),
                'robots'      => 'index, follow',
            ],
        ]);
    }

    /**
     * Privacy Policy page
     */
    public function privacyPolicy()
    {
        $setting  = Setting::first();
        $siteName = $setting?->website_title ?: 'Nikhil Sharma';

        return Inertia::render('PrivacyPolicy/index', [
            'seo' => [
                'title'       => "Privacy Policy | {$siteName}",
                'description' => "Read the privacy policy for {$siteName}'s website. Learn how we collect, use, and protect your personal information.",
                'keywords'    => "Privacy Policy, {$siteName}",
                'canonical'   => url()->current(),
                'robots'      => 'noindex, follow',
            ],
        ]);
    }

    /**
     * Terms of Service page
     */
    public function termsOfService()
    {
        $setting  = Setting::first();
        $siteName = $setting?->website_title ?: 'Nikhil Sharma';

        return Inertia::render('TermsOfService/index', [
            'seo' => [
                'title'       => "Terms of Service | {$siteName}",
                'description' => "Read the terms of service for {$siteName}'s website and freelance development services.",
                'keywords'    => "Terms of Service, {$siteName}",
                'canonical'   => url()->current(),
                'robots'      => 'noindex, follow',
            ],
        ]);
    }

    /**
     * Convert a service slug to the new clean URL format.
     * "web-development" → "/service/Web/development"
     */
    public static function serviceToUrl(string $slug): string
    {
        $parts  = explode('-', $slug, 2);
        $prefix = ucfirst($parts[0] ?? $slug);
        $rest   = $parts[1] ?? '';

        if ($rest) {
            return "/{$prefix}/{$rest}";
        }
        return "/{$prefix}";
    }

    /**
     * Single service detail page — /services/{slug}  (legacy — 301 redirect to new URL)
     */
    public function serviceDetail($slug)
    {
        $query = \App\Models\Service::where('slug', $slug);
        if (Schema::hasColumn('services', 'is_active')) {
            $query->where('is_active', true);
        }
        $service = $query->first();

        if (!$service) {
            abort(404);
        }

        return redirect(self::serviceToUrl($slug), 301);
    }

    /**
     * Single service detail page — /service/{prefix}/{rest}
     * New clean URL: /service/Web/development
     */
    public function serviceDetailNew($prefix, $rest)
    {
        // Reconstruct slug: "Web" + "development" → "web-development"
        $slug = strtolower($prefix) . '-' . $rest;

        $query = \App\Models\Service::where('slug', $slug);
        if (Schema::hasColumn('services', 'is_active')) {
            $query->where('is_active', true);
        }
        $service = $query->firstOrFail();

        $serviceData = [
            'id'               => $service->id,
            'title'            => $service->title,
            'subtitle'         => $service->subtitle,
            'slug'             => $service->slug,
            'price_range'      => $service->price_range,
            'description'      => $service->description,
            'features'         => $service->features ?? [],
            'cta_text'         => $service->cta_text,
            'meta_title'       => $service->meta_title,
            'meta_description' => $service->meta_description,
            'meta_keyword'     => $service->meta_keyword,
        ];

        $relatedQuery = \App\Models\Service::query();
        if (Schema::hasColumn('services', 'is_active')) {
            $relatedQuery->where('is_active', true);
        }
        $related = $relatedQuery
            ->where('id', '!=', $service->id)
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($s) {
                return [
                    'id'          => $s->id,
                    'title'       => $s->title,
                    'subtitle'    => $s->subtitle,
                    'slug'        => $s->slug,
                    'price_range' => $s->price_range,
                    'description' => $s->description,
                    'features'    => $s->features ?? [],
                    'cta_text'    => $s->cta_text,
                ];
            });

        $setting  = Setting::first();
        $siteName = $setting?->website_title ?: 'Nikhil Sharma';
        $descText = strip_tags($serviceData['description'] ?? '');
        $descShort = mb_substr($descText, 0, 160);

        return Inertia::render('Services/Detail/index', [
            'service' => $serviceData,
            'related' => $related,
            'setting' => $setting,
            'seo'     => [
                'title'       => $serviceData['meta_title']       ?: "{$serviceData['title']} — Jaipur | {$siteName}",
                'description' => $serviceData['meta_description'] ?: ($serviceData['subtitle'] ?: ($descShort ?: "Professional {$serviceData['title']} services in Jaipur by {$siteName}.")),
                'keywords'    => $serviceData['meta_keyword']     ?: "{$serviceData['title']} Jaipur, {$serviceData['title']} India, {$siteName} {$serviceData['title']}",
                'canonical'   => url()->current(),
                'robots'      => 'index, follow',
            ],
        ]);
    }

    /**
     * Convert a keyword string to the new clean URL format.
     * "Best Software Developer in Jaipur"     → "/Best/software-developer/Jaipur"
     * "Best Software Developer in Kalwar Road" → "/Best/software-developer/Kalwar-Road"
     * "Top 10 Website Design Near Me"          → "/Top10/website-design-near-me"
     * "No1 Website Design Near Me"             → "/No1/website-design-near-me"
     */
    public static function keywordToUrl(string $keyword): string
    {
        $parts       = explode(' in ', $keyword, 2);
        $servicePart = trim($parts[0] ?? $keyword);
        $location    = trim($parts[1] ?? '');

        $words       = preg_split('/\s+/', $servicePart);
        $prefix      = $words[0] ?? 'Best';

        // If second word is a number (e.g. "Top 10", "Top 5"), merge it into prefix
        if (isset($words[1]) && is_numeric($words[1])) {
            $prefix = $prefix . $words[1];
            $restWords = array_slice($words, 2);
        } else {
            $restWords = array_slice($words, 1);
        }

        $rest        = implode(' ', $restWords);
        $serviceSlug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $rest));
        $serviceSlug = trim($serviceSlug, '-');

        if ($location) {
            // Convert location to slug: "Kalwar Road" → "Kalwar-Road"
            $locationSlug = preg_replace('/\s+/', '-', $location);
            $locationSlug = preg_replace('/[^A-Za-z0-9\-]/', '', $locationSlug);
            return "/{$prefix}/{$serviceSlug}/{$locationSlug}";
        }
        return "/{$prefix}/{$serviceSlug}";
    }

    /**
     * Keyword detail page — /keyword/{slug}  (legacy — 301 redirect to new URL)
     */
    public function keywordDetail($slug)
    {
        $setting     = Setting::first();
        $allKeywords = ($setting && ($setting->start_keyword || $setting->strating_keyword))
            ? array_map('trim', explode(',', $setting->start_keyword ?: $setting->strating_keyword))
            : [];

        $keyword = null;
        foreach ($allKeywords as $kw) {
            $kwSlug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $kw));
            $kwSlug = trim($kwSlug, '-');
            if ($kwSlug === $slug) {
                $keyword = $kw;
                break;
            }
        }

        if (!$keyword) {
            abort(404);
        }

        return redirect(self::keywordToUrl($keyword), 301);
    }

    /**
     * Keyword detail page — /{prefix}/{service}  OR  /{prefix}/{service}/{location}
     * New clean URL: /Best/software-developer/Jaipur  OR  /Best/website-developer-for-hire
     * Also handles: /Top10/website-design-near-me  (Top 10 merged into prefix)
     */
    public function keywordDetailNew($prefix, $service, $location = null)
    {
        if (!$location) {
            // Check if this matches a Service (BlogPost type=1)
            $slug = strtolower($prefix) . '-' . $service;
            $blogPost = BlogPost::where('slug', $slug)->where('type', 1)->where('status', 1)->first();
            if ($blogPost) {
                return $this->serviceDetailNew($prefix, $service);
            }
        }

        $setting     = Setting::first();

        // Check both start_keyword (new) and strating_keyword (old, with typo) and service_keyword
        $allKeywords = [];
        if ($setting && $setting->start_keyword) {
            $allKeywords = array_merge($allKeywords, array_map('trim', explode(',', $setting->start_keyword)));
        } elseif ($setting && $setting->strating_keyword) {
            $allKeywords = array_merge($allKeywords, array_map('trim', explode(',', $setting->strating_keyword)));
        }
        if ($setting && $setting->service_keyword) {
            // service_keyword format: "title|slug,title|slug" OR just "title,title"
            foreach (explode(',', $setting->service_keyword) as $entry) {
                $parts = explode('|', trim($entry), 2);
                if (!empty($parts[0])) {
                    $allKeywords[] = trim($parts[0]);
                }
            }
        }
        $allKeywords = array_filter(array_unique($allKeywords));

        $keyword    = null;
        // Normalize location: "Kalwar Road" (space) or "Kalwar-Road" (hyphen) both should match
        $normalizedLocation = $location ? preg_replace('/\s+/', '-', trim($location)) : null;
        $currentUrl = $normalizedLocation
            ? strtolower("/{$prefix}/{$service}/{$normalizedLocation}")
            : strtolower("/{$prefix}/{$service}");

        foreach ($allKeywords as $kw) {
            if (strtolower(self::keywordToUrl($kw)) === $currentUrl) {
                $keyword = $kw;
                break;
            }
        }

        // ── Fallback: reconstruct keyword from URL segments ──────────────────
        // If keyword not found in settings, build it from the URL so the page
        // still renders instead of returning 404.
        if (!$keyword) {
            // Convert service slug back to words: "software-developer" → "Software Developer"
            $serviceWords = ucwords(str_replace('-', ' ', $service));

            // Extract any numeric suffix from prefix: "Top10" → prefix="Top", num="10"
            if (preg_match('/^([A-Za-z]+)(\d+)$/', $prefix, $m)) {
                $prefixWord = $m[1];
                $numWord    = $m[2];
                $keyword    = "{$prefixWord} {$numWord} {$serviceWords}";
            } else {
                $keyword = "{$prefix} {$serviceWords}";
            }

            if ($location) {
                // Convert location slug back to readable: "Kalwar-Road" → "Kalwar Road"
                $locationReadable = str_replace('-', ' ', $location);
                $keyword .= " in {$locationReadable}";
            }
        }

        $services = BlogPost::where('type', 1)
            ->where('status', 1)
            ->latest()
            ->take(10)
            ->get(['id', 'title', 'slug']);

        $parts       = explode(' in ', $keyword, 2);
        $serviceType = $parts[0] ?? '';
        $loc         = $parts[1] ?? ($location ? str_replace('-', ' ', $location) : '');

        $relatedKeywords = array_values(array_filter(array_slice(
            array_filter($allKeywords, function ($kw) use ($keyword, $loc, $serviceType) {
                if ($kw === $keyword) return false;
                return ($loc && str_contains($kw, $loc)) || str_contains($kw, $serviceType);
            }),
            0, 8
        )));

        $siteName = $setting?->website_title ?: 'Nikhil Sharma';

        return Inertia::render('Keyword/index', [
            'keyword'         => $keyword,
            'services'        => $services,
            'relatedKeywords' => $relatedKeywords,
            'setting'         => $setting,
            'seo'             => [
                'title'       => "{$keyword} — {$siteName} | Jaipur",
                'description' => "Looking for {$keyword}? {$siteName} is a top-rated freelance developer in " . ($loc ?: 'Jaipur') . " with 8+ years of experience. Affordable rates, fast delivery, real results.",
                'keywords'    => "{$keyword}, {$serviceType} " . ($loc ?: 'Jaipur') . ", hire " . strtolower($serviceType) . ", freelance developer " . ($loc ?: 'Jaipur'),
                'canonical'   => url()->current(),
                'robots'      => 'index, follow',
            ],
        ]);
    }
}
