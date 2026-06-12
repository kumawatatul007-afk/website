<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\PortfolioItem;
use App\Models\Service;
use App\Models\Setting;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Schema;

class SitemapController extends Controller
{
    const URLS_PER_SITEMAP = 5000;

    private function xmlResponse(string $view, array $data): \Illuminate\Http\Response
    {
        return response(view($view, $data)->render(), 200)
            ->header('Content-Type', 'application/xml; charset=UTF-8')
            ->header('Cache-Control', 'public, max-age=3600');
    }

    private function generateDynamicKeywords(): array
    {
        $keywords = [];
        $setting = Setting::first();
        
        // Get prefixes from settings (check both strating_keyword and start_keyword)
        $prefixes = [];
        if ($setting) {
            if ($setting->start_keyword) {
                $prefixes = array_map('trim', explode(',', $setting->start_keyword));
            } elseif ($setting->strating_keyword) {
                $prefixes = array_map('trim', explode(',', $setting->strating_keyword));
            }
        }
        
        // Fallback prefixes if none in settings
        if (empty($prefixes)) {
            $prefixes = ['Best', 'Top', 'Top 10', 'Top 5', 'No1', 'Find', 'Hire'];
        }
        
        // Get locations from settings
        $locations = [];
        if ($setting && $setting->locations) {
            $locations = array_map('trim', explode(',', $setting->locations));
        }
        
        // Fallback locations if none in settings
        if (empty($locations)) {
            $locations = ['Jaipur', 'Malviya Nagar', 'Vaishali Nagar', 'C-Scheme', 'Mansarovar', 'Ajmer Road', 'Jagatpura', 'Civil Lines', 'Kalwar Road', 'Jhotwara', 'Ajmer', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Alwar', 'Sikar', 'Tonk', 'Pali', 'Nagaur', 'Bhilwara', 'Bangalore', 'Pune', 'Kolkata', 'Delhi', 'Mumbai', 'Hyderabad', 'Chennai'];
        }

        // Get services from Service model
        $servicesQuery = Service::query();
        if (Schema::hasColumn('services', 'is_active')) {
            $servicesQuery->where('is_active', true);
        }
        $services = $servicesQuery
            ->latest()
            ->get()
            ->pluck('title')
            ->toArray();

        // Fallback services if none
        if (empty($services)) {
            $services = ['Website Development', 'Mobile App Development', 'E-Commerce Solutions', 'Custom Software Development', 'Digital Marketing', 'UI UX Design'];
        }

        // Generate keywords by combining prefixes, services, and locations
        foreach ($prefixes as $prefix) {
            foreach ($services as $service) {
                foreach ($locations as $location) {
                    $keywords[] = "{$prefix} {$service} in {$location}";
                }
            }
        }

        return array_values(array_filter(array_unique($keywords)));
    }

    private function allKeywords(): array
    {
        $setting = Setting::first();
        $all = [];

        // First, add all dynamically generated keywords
        $dynamicKeywords = $this->generateDynamicKeywords();
        $all = array_merge($all, $dynamicKeywords);

        // Also keep the old keywords from settings as backup
        if ($setting && $setting->strating_keyword) {
            $all = array_merge($all, array_filter(array_map('trim', explode(',', $setting->strating_keyword))));
        }
        
        if ($setting && $setting->start_keyword) {
            $all = array_merge($all, array_filter(array_map('trim', explode(',', $setting->start_keyword))));
        }

        return array_values(array_filter(array_unique($all)));
    }

    private function buildTagUrls(): array
    {
        $setting = Setting::first();

        // Get prefixes from settings only (check both strating_keyword and start_keyword)
        $rawPrefixes = [];
        if ($setting) {
            if ($setting->start_keyword) {
                $rawPrefixes = array_map('trim', explode(',', $setting->start_keyword));
            } elseif ($setting->strating_keyword) {
                $rawPrefixes = array_map('trim', explode(',', $setting->strating_keyword));
            }
        }

        $prefixes = array_values(array_unique(array_filter($rawPrefixes, fn($p) => trim($p) !== '')));
        
        // Get services from Service table
        $servicesQuery = Service::query();
        if (Schema::hasColumn('services', 'is_active')) {
            $servicesQuery->where('is_active', true);
        }
        $serviceTypes = $servicesQuery
            ->latest()
            ->pluck('title')
            ->toArray();

        // Get locations from settings only
        $locations = [];
        if ($setting && $setting->locations) {
            $locations = array_map('trim', explode(',', $setting->locations));
        }

        // Filter out empty values
        $prefixes = array_filter($prefixes);
        $serviceTypes = array_filter($serviceTypes);
        $locations = array_filter($locations);

        // Generate all combinations
        $tagUrls = [];
        foreach ($prefixes as $prefix) {
            foreach ($serviceTypes as $service) {
                foreach ($locations as $location) {
                    $keyword   = "{$prefix} {$service} in {$location}";
                    $tagUrls[] = PublicController::keywordToUrl($keyword);
                }
            }
        }

        return array_unique($tagUrls);
    }

    /** sitemap.xml — all URLs with <url> tags directly */
    public function index()
    {
        ini_set('memory_limit', '1024M');
        set_time_limit(600);

        $posts = BlogPost::whereNotNull('slug')
            ->where('slug', '!=', '')
            ->latest('updated_at')
            ->get();

        $portfolios = PortfolioItem::where('is_publish', 1)->latest('updated_at')->get();

        // Fetch services from Service model
        $servicesQuery = Service::query();
        if (Schema::hasColumn('services', 'is_active')) {
            $servicesQuery->where('is_active', true);
        }
        $services = $servicesQuery
            ->whereNotNull('slug')
            ->where('slug', '!=', '')
            ->latest('updated_at')
            ->get();

        $keywords    = $this->allKeywords();
        $keywordUrls = array_map(fn($kw) => [
            'url'     => PublicController::keywordToUrl($kw),
            'keyword' => $kw,
        ], $keywords);

        // Include ALL tag URLs directly in main sitemap
        $tagUrls = $this->buildTagUrls();

        return $this->xmlResponse('sitemap', [
            'posts'       => $posts,
            'portfolios'  => $portfolios,
            'services'    => $services,
            'keywordUrls' => $keywordUrls,
            'tagUrls'     => $tagUrls,
        ]);
    }

    /** sitemap-main.xml — all URLs with <url> tags (alias for main sitemap) */
    public function main()
    {
        return $this->index();
    }

    /** Static pages sitemap */
    public function pages()
    {
        return $this->xmlResponse('sitemap-pages', []);
    }

    /** Blog posts sitemap */
    public function blog()
    {
        $posts = BlogPost::whereNotNull('slug')
            ->where('slug', '!=', '')
            ->latest('updated_at')
            ->get();

        return $this->xmlResponse('sitemap-blog', ['posts' => $posts]);
    }

    /** Portfolio sitemap */
    public function portfolio()
    {
        $portfolios = PortfolioItem::where('is_publish', 1)->latest('updated_at')->get();

        return $this->xmlResponse('sitemap-portfolio', ['portfolios' => $portfolios]);
    }

    /** Services sitemap */
    public function services()
    {
        // Fetch services from Service model
        $servicesQuery = Service::query();
        if (Schema::hasColumn('services', 'is_active')) {
            $servicesQuery->where('is_active', true);
        }
        $services = $servicesQuery
            ->whereNotNull('slug')
            ->where('slug', '!=', '')
            ->latest('updated_at')
            ->get();

        return $this->xmlResponse('sitemap-services', ['services' => $services]);
    }

    /** Tags sitemap — paginated (5000 URLs per page) */
    public function tagsPage(int $page)
    {
        $tagUrls = $this->buildTagUrls();
        $chunk   = array_slice($tagUrls, ($page - 1) * self::URLS_PER_SITEMAP, self::URLS_PER_SITEMAP);

        if (empty($chunk)) {
            abort(404);
        }

        return $this->xmlResponse('tags-sitemap', ['tagUrls' => $chunk]);
    }

    /** tags.xml — all tag URL combinations */
    public function tags()
    {
        ini_set('memory_limit', '512M');
        set_time_limit(120);

        $tagUrls = $this->buildTagUrls();

        return $this->xmlResponse('tags-sitemap', ['tagUrls' => $tagUrls]);
    }

    /** Keywords sitemap — paginated (5000 URLs per page) */
    public function keywordsPage(int $page)
    {
        $keywords    = $this->allKeywords();
        $keywordUrls = array_map(fn($kw) => [
            'url'     => PublicController::keywordToUrl($kw),
            'keyword' => $kw,
        ], $keywords);

        $chunk = array_slice($keywordUrls, ($page - 1) * self::URLS_PER_SITEMAP, self::URLS_PER_SITEMAP);

        if (empty($chunk)) {
            abort(404);
        }

        return $this->xmlResponse('keywords-sitemap', ['keywordUrls' => $chunk]);
    }

    /** keywords.xml — all keyword URLs + all tag URL combinations */
    public function keywords()
    {
        ini_set('memory_limit', '512M');
        set_time_limit(120);

        $keywords    = $this->allKeywords();
        $keywordUrls = array_map(fn($kw) => [
            'url'     => PublicController::keywordToUrl($kw),
            'keyword' => $kw,
        ], $keywords);

        $tagUrls = $this->buildTagUrls();
        foreach ($tagUrls as $tagUrl) {
            $keywordUrls[] = ['url' => $tagUrl, 'keyword' => ''];
        }

        return $this->xmlResponse('keywords-sitemap', [
            'keywordUrls' => $keywordUrls,
        ]);
    }

    public function robots()
    {
        $tagUrls = $this->buildTagUrls();
        $totalTagPages = ceil(count($tagUrls) / self::URLS_PER_SITEMAP);

        $keywords = $this->allKeywords();
        $totalKeywordPages = ceil(count($keywords) / self::URLS_PER_SITEMAP);

        $robots  = "User-agent: *\n";
        $robots .= "Allow: /\n";
        $robots .= "Disallow: /admin/\n";
        $robots .= "Disallow: /login\n";
        $robots .= "Disallow: /register\n\n";
        $robots .= "# Sitemaps\n";
        $robots .= "Sitemap: " . url('sitemap.xml') . "\n";
        $robots .= "Sitemap: " . url('sitemap-main.xml') . "\n";
        $robots .= "Sitemap: " . url('sitemap-blog.xml') . "\n";
        $robots .= "Sitemap: " . url('sitemap-portfolio.xml') . "\n";
        $robots .= "Sitemap: " . url('sitemap-services.xml') . "\n";
        
        // Add paginated sitemap URLs
        for ($page = 1; $page <= $totalTagPages; $page++) {
            $robots .= "Sitemap: " . url("sitemap-tags-{$page}.xml") . "\n";
        }
        
        for ($page = 1; $page <= $totalKeywordPages; $page++) {
            $robots .= "Sitemap: " . url("sitemap-keywords-{$page}.xml") . "\n";
        }

        return response($robots, 200)
            ->header('Content-Type', 'text/plain; charset=UTF-8');
    }
}
