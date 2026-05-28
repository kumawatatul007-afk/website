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
    private function xmlResponse(string $view, array $data): \Illuminate\Http\Response
    {
        return response(view($view, $data)->render(), 200)
            ->header('Content-Type', 'application/xml; charset=UTF-8')
            ->header('Cache-Control', 'public, max-age=3600');
    }

    private function allKeywords(): array
    {
        $setting = Setting::first();
        $all = [];

        if ($setting && $setting->strating_keyword) {
            $all = array_merge($all, array_filter(array_map('trim', explode(',', $setting->strating_keyword))));
        }

        if ($setting && $setting->service_keyword) {
            foreach (explode(',', $setting->service_keyword) as $entry) {
                $parts = explode('|', trim($entry), 2);
                if (!empty(trim($parts[0] ?? ''))) {
                    $all[] = trim($parts[0]);
                }
            }
        }

        return array_values(array_filter(array_unique($all)));
    }

    /** Main sitemap — all pages, blog, portfolio, services */
    public function index()
    {
        $posts = BlogPost::whereNotNull('slug')
            ->where('slug', '!=', '')
            ->where('status', 1)
            ->where('type', 0)
            ->latest('updated_at')
            ->get();

        $portfolios = PortfolioItem::where('is_publish', 1)->latest('updated_at')->get();

        $query = Service::whereNotNull('slug')->where('slug', '!=', '');
        if (Schema::hasColumn('services', 'is_active')) {
            $query->where('is_active', true);
        }
        $services = $query->latest('updated_at')->get();

        return $this->xmlResponse('sitemap', [
            'posts'      => $posts,
            'portfolios' => $portfolios,
            'services'   => $services,
        ]);
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
            ->where('status', 1)
            ->where('type', 0)
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
        $query = Service::whereNotNull('slug')->where('slug', '!=', '');
        if (Schema::hasColumn('services', 'is_active')) {
            $query->where('is_active', true);
        }
        $services = $query->latest('updated_at')->get();

        return $this->xmlResponse('sitemap-services', ['services' => $services]);
    }

    /** Tags sitemap — prefix-based keyword combinations (Trusted, Affordable, etc.) */
    public function tags()
    {
        $setting = Setting::first();

        // Parse valid single-token prefixes from start_keyword (no spaces, no dots)
        $rawPrefixes = $setting && $setting->start_keyword
            ? array_map('trim', explode(',', $setting->start_keyword))
            : [];

        $prefixes = array_values(array_unique(array_filter($rawPrefixes, function ($p) {
            // Only keep prefixes that match the route regex [A-Za-z][A-Za-z0-9]*
            return $p !== '' && preg_match('/^[A-Za-z][A-Za-z0-9]*$/', $p);
        })));

        $serviceTypes = [
            'Software Developer',
            'Website Developer',
            'IT Freelancer',
            'Mobile App Developer',
            'Web Development Company',
        ];

        $locations = [
            'Jaipur','Kalwar-Road','Jagatpura','Civil-Lines','C-Scheme',
            'Malviya-Nagar','Vaishali-Nagar','Ajmer-Road','Jhotwara','Johri-bazar',
            'Niwaru','mansarovar','Galta-gate','Choti-Chopad','Chandpole',
            'Ridhi-Sidhi','Raja-park','Pratap-Nagar','badi-chopad',
            'Rajasthan','Alwar','Ajmer','Jodhpur','Udaipur','Kota','Bikaner',
            'Bhilwara','Sikar','Tonk','Pali','Nagaur','Jaisalmer','Jhunjhunu',
            'Hanumangarh','Ganganagar','Churu','Bharatpur','Barmer','Dhaulpur',
            'Dungarpur','Dausa','Bundi','Banswara','Baran',
            'Bangalore','Pune','Kolkata','Delhi','Mumbai','Hyderabad',
            'uttar-pradesh','punjab','maharashtra',
        ];

        $tagUrls = [];
        foreach ($prefixes as $prefix) {
            foreach ($serviceTypes as $service) {
                foreach ($locations as $location) {
                    $keyword   = "{$prefix} {$service} in {$location}";
                    $tagUrls[] = PublicController::keywordToUrl($keyword);
                }
            }
        }

        return $this->xmlResponse('tags-sitemap', [
            'tagUrls' => array_unique($tagUrls),
        ]);
    }

    /** Keywords sitemap — all keyword pages from settings */
    public function keywords()
    {
        $keywords    = $this->allKeywords();
        $keywordUrls = array_map(fn($kw) => [
            'url'     => PublicController::keywordToUrl($kw),
            'keyword' => $kw,
        ], $keywords);

        return $this->xmlResponse('keywords-sitemap', [
            'keywordUrls' => $keywordUrls,
        ]);
    }

    public function robots()
    {
        $robots  = "User-agent: *\n";
        $robots .= "Allow: /\n";
        $robots .= "Disallow: /admin/\n";
        $robots .= "Disallow: /login\n";
        $robots .= "Disallow: /register\n\n";
        $robots .= "# Sitemaps\n";
        $robots .= "Sitemap: " . url('sitemap.xml') . "\n";
        $robots .= "Sitemap: " . url('keywords.xml') . "\n";
        $robots .= "Sitemap: " . url('tags.xml') . "\n";
        $robots .= "Sitemap: " . url('sitemap-blog.xml') . "\n";
        $robots .= "Sitemap: " . url('sitemap-portfolio.xml') . "\n";
        $robots .= "Sitemap: " . url('sitemap-pages.xml') . "\n";
        $robots .= "Sitemap: " . url('sitemap-services.xml') . "\n";

        return response($robots, 200)
            ->header('Content-Type', 'text/plain; charset=UTF-8');
    }
}
