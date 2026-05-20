<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\PortfolioItem;
use App\Models\Category;
use App\Models\Service;
use App\Models\Setting;
use Inertia\Inertia;

class PublicController extends Controller
{
    /**
     * Home page — latest blogs + featured portfolio + services + settings
     */
    public function home()
    {
        $blogPosts = BlogPost::where('status', 1)
            ->latest()
            ->take(3)
            ->get(['id', 'title', 'slug', 'content', 'main_image', 'meta_description', 'created_at']);

        $portfolios = PortfolioItem::where('is_publish', 1)
            ->latest()
            ->take(6)
            ->get(['id', 'title', 'image', 'website_link', 'short_description', 'slug']);

        $services = BlogPost::where('type', 1)
            ->where('status', 1)
            ->latest()
            ->get(['id', 'title', 'slug', 'meta_description', 'content', 'tags'])
            ->map(function ($post) {
                return [
                    'id'          => $post->id,
                    'title'       => $post->title,
                    'subtitle'    => $post->meta_description,
                    'slug'        => $post->slug,
                    'description' => $post->content,
                    'features'    => $post->tags ? array_map('trim', explode(',', $post->tags)) : [],
                    'cta_text'    => 'Get a Quote',
                ];
            });

        $setting  = \App\Models\Setting::first();
        $siteName = $setting?->website_title ?: 'Nikhil Sharma';

        return Inertia::render('home/index', [
            'blogPosts'  => $blogPosts,
            'portfolios' => $portfolios,
            'services'   => $services,
            'setting'    => $setting,
            'seo'        => [
                'title'       => "{$siteName} | Freelance PHP, React & Flutter Developer — Jaipur, India",
                'description' => "Hire {$siteName}, a Jaipur-based Full Stack Developer with 8+ years building websites, apps & digital solutions. Fast delivery, affordable rates, real results.",
                'keywords'    => "Web Developer Jaipur, PHP Developer Jaipur, React Developer India, Full Stack Developer Jaipur, {$siteName}",
                'canonical'   => url()->current(),
                'robots'      => 'index, follow',
            ],
        ]);
    }

    /**
     * Blog listing page
     */
    public function blog()
    {
        $posts = BlogPost::where('status', 1)
            ->latest()
            ->get(['id', 'title', 'slug', 'content', 'main_image', 'meta_description', 'category_id', 'tags', 'created_at']);

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

        // Previous post (older)
        $prevPost = BlogPost::where('status', 1)
            ->where('id', '<', $post->id)
            ->orderBy('id', 'desc')
            ->select('id', 'title', 'slug')
            ->first();

        // Next post (newer)
        $nextPost = BlogPost::where('status', 1)
            ->where('id', '>', $post->id)
            ->orderBy('id', 'asc')
            ->select('id', 'title', 'slug')
            ->first();

        // Recent posts for sidebar
        $recentPosts = BlogPost::where('status', 1)
            ->where('id', '!=', $post->id)
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'slug', 'main_image', 'created_at']);

        $setting   = Setting::first();
        $siteName  = $setting?->website_title ?: 'Nikhil Sharma';
        $descText  = strip_tags($post->content ?? '');
        $descShort = mb_substr($descText, 0, 160);

        // Parse meta_keywords JSON to plain string
        $metaKw = $post->meta_keywords_plain ?: "{$post->title}, {$siteName}, Web Development Blog";

        // Append prev/next to the post object
        $postData              = $post->toArray();
        $postData['prev_post'] = $prevPost;
        $postData['next_post'] = $nextPost;

        return Inertia::render('Blog/BlogDetail/index', [
            'post'        => $postData,
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

        $recentPosts = BlogPost::where('status', 1)
            ->latest()
            ->where('id', '!=', $post->id)
            ->take(5)
            ->get(['id', 'title', 'slug', 'main_image', 'created_at']);

        $setting   = Setting::first();
        $siteName  = $setting?->website_title ?: 'Nikhil Sharma';
        $descText  = strip_tags($post->content ?? '');
        $descShort = mb_substr($descText, 0, 160);

        $metaKw = $post->meta_keywords_plain ?: "{$post->title}, {$siteName}, Web Development Blog";

        return Inertia::render('Blog/BlogDetailSidebar/index', [
            'post'        => $post,
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
            ->latest()
            ->get(['id', 'title', 'image', 'website_link', 'short_description', 'description', 'slug', 'category_id', 'clint_name', 'date']);

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
            ->latest()
            ->get(['id', 'title', 'image', 'website_link', 'short_description', 'description', 'slug', 'category_id', 'clint_name', 'date']);

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
    public function portfolioDetail($id)
    {
        $item = PortfolioItem::findOrFail($id);

        $related = PortfolioItem::where('is_publish', 1)
            ->where('id', '!=', $id)
            ->where('category_id', $item->category_id)
            ->take(3)
            ->get(['id', 'title', 'image', 'slug']);

        $setting   = Setting::first();
        $siteName  = $setting?->website_title ?: 'Nikhil Sharma';
        $descText  = strip_tags($item->description ?? $item->short_description ?? '');
        $descShort = mb_substr($descText, 0, 160);

        return Inertia::render('Portfolio/ProjectDetail/index', [
            'item'    => $item,
            'id'      => $id,
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
        $services = BlogPost::where('type', 1)
            ->where('status', 1)
            ->latest()
            ->get(['id', 'title', 'slug', 'meta_description', 'content', 'tags'])
            ->map(function ($post) {
                return [
                    'id'          => $post->id,
                    'title'       => $post->title,
                    'subtitle'    => $post->meta_description,
                    'slug'        => $post->slug,
                    'price_range' => null,
                    'description' => $post->content,
                    'features'    => $post->tags ? array_map('trim', explode(',', $post->tags)) : [],
                    'cta_text'    => 'Get a Quote',
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
        $service = Service::where('slug', $slug)
            ->where('is_active', true)
            ->first();

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

        $blogPost = BlogPost::where('slug', $slug)
            ->where('type', 1)
            ->where('status', 1)
            ->firstOrFail();

        $service = (object)[
            'id'               => $blogPost->id,
            'title'            => $blogPost->title,
            'subtitle'         => $blogPost->meta_description,
            'slug'             => $blogPost->slug,
            'price_range'      => null,
            'description'      => $blogPost->content,
            'features'         => $blogPost->tags ? array_map('trim', explode(',', $blogPost->tags)) : [],
            'cta_text'         => 'Get a Quote',
            'meta_title'       => $blogPost->title,
            'meta_description' => $blogPost->meta_description,
            'meta_keyword'     => $blogPost->meta_keywords_plain,
        ];

        $related = BlogPost::where('type', 1)
            ->where('status', 1)
            ->where('id', '!=', $service->id)
            ->latest()
            ->take(3)
            ->get(['id', 'title', 'slug', 'meta_description', 'content', 'tags'])
            ->map(function ($post) {
                return [
                    'id'          => $post->id,
                    'title'       => $post->title,
                    'subtitle'    => $post->meta_description,
                    'slug'        => $post->slug,
                    'price_range' => null,
                    'description' => $post->content,
                    'features'    => $post->tags ? array_map('trim', explode(',', $post->tags)) : [],
                    'cta_text'    => 'Get a Quote',
                ];
            });

        $setting  = Setting::first();
        $siteName = $setting?->website_title ?: 'Nikhil Sharma';
        $descText = strip_tags($service->description ?? '');
        $descShort = mb_substr($descText, 0, 160);

        return Inertia::render('Services/Detail/index', [
            'service' => $service,
            'related' => $related,
            'setting' => $setting,
            'seo'     => [
                'title'       => $service->meta_title       ?: "{$service->title} — Jaipur | {$siteName}",
                'description' => $service->meta_description ?: ($service->subtitle ?: ($descShort ?: "Professional {$service->title} services in Jaipur by {$siteName}.")),
                'keywords'    => $service->meta_keyword     ?: "{$service->title} Jaipur, {$service->title} India, {$siteName} {$service->title}",
                'canonical'   => url()->current(),
                'robots'      => 'index, follow',
            ],
        ]);
    }

    /**
     * Convert a keyword string to the new clean URL format.
     * "Best Software Developer in Jaipur" → "/Best/software-developer/Jaipur"
     */
    public static function keywordToUrl(string $keyword): string
    {
        $parts       = explode(' in ', $keyword, 2);
        $servicePart = trim($parts[0] ?? $keyword);
        $location    = trim($parts[1] ?? '');

        $words       = preg_split('/\s+/', $servicePart);
        $prefix      = $words[0] ?? 'Best';
        $rest        = implode(' ', array_slice($words, 1));
        $serviceSlug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $rest));
        $serviceSlug = trim($serviceSlug, '-');

        if ($location) {
            return "/{$prefix}/{$serviceSlug}/{$location}";
        }
        return "/{$prefix}/{$serviceSlug}";
    }

    /**
     * Keyword detail page — /keyword/{slug}  (legacy — 301 redirect to new URL)
     */
    public function keywordDetail($slug)
    {
        $setting     = Setting::first();
        $allKeywords = $setting && $setting->strating_keyword
            ? array_map('trim', explode(',', $setting->strating_keyword))
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

        // Check both strating_keyword and service_keyword
        $allKeywords = [];
        if ($setting && $setting->strating_keyword) {
            $allKeywords = array_merge($allKeywords, array_map('trim', explode(',', $setting->strating_keyword)));
        }
        if ($setting && $setting->service_keyword) {
            // service_keyword format: "title|slug,title|slug" — extract titles only
            foreach (explode(',', $setting->service_keyword) as $entry) {
                $parts = explode('|', trim($entry), 2);
                if (!empty($parts[0])) {
                    $allKeywords[] = trim($parts[0]);
                }
            }
        }
        $allKeywords = array_filter(array_unique($allKeywords));

        $keyword    = null;
        $currentUrl = $location
            ? strtolower("/{$prefix}/{$service}/{$location}")
            : strtolower("/{$prefix}/{$service}");

        foreach ($allKeywords as $kw) {
            if (strtolower(self::keywordToUrl($kw)) === $currentUrl) {
                $keyword = $kw;
                break;
            }
        }

        if (!$keyword) {
            abort(404);
        }

        $services = BlogPost::where('type', 1)
            ->where('status', 1)
            ->latest()
            ->take(10)
            ->get(['id', 'title', 'slug']);

        $parts       = explode(' in ', $keyword, 2);
        $serviceType = $parts[0] ?? '';
        $loc         = $parts[1] ?? '';

        $relatedKeywords = array_filter($allKeywords, function ($kw) use ($keyword, $loc, $serviceType) {
            if ($kw === $keyword) return false;
            return (str_contains($kw, $loc) || str_contains($kw, $serviceType));
        });

        $relatedKeywords = array_values(array_slice($relatedKeywords, 0, 8));

        $setting = Setting::first();
        $siteName = $setting?->website_title ?: 'Nikhil Sharma';

        return Inertia::render('Keyword/index', [
            'keyword'         => $keyword,
            'services'        => $services,
            'relatedKeywords' => $relatedKeywords,
            'setting'         => $setting,
            'seo'             => [
                'title'       => "{$keyword} — {$siteName} | Jaipur",
                'description' => "Looking for {$keyword}? {$siteName} is a top-rated freelance developer in {$loc} with 8+ years of experience. Affordable rates, fast delivery, real results.",
                'keywords'    => "{$keyword}, {$serviceType} {$loc}, hire " . strtolower($serviceType) . ", freelance developer {$loc}",
                'canonical'   => url()->current(),
                'robots'      => 'index, follow',
            ],
        ]);
    }
}
