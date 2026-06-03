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

    private function buildTagUrls(): array
    {
        $setting = Setting::first();

        $rawPrefixes = $setting && $setting->start_keyword
            ? array_map('trim', explode(',', $setting->start_keyword))
            : [];

        $prefixes = array_values(array_unique(array_filter($rawPrefixes, fn($p) => trim($p) !== '')));

        $serviceTypes = [
            'Software Developer',
            'Website Developer',
            'IT Freelancer',
            'Mobile Application Development',
            'Web Development Company',
            'Web Designer',
            'App Developer',
        ];

        $locations = [
            // Jaipur areas
            'Jaipur','Kalwar-Road','Jagatpura','Civil-Lines','C-Scheme',
            'Malviya-Nagar','Vaishali-Nagar','Ajmer-Road','Jhotwara','Johri-bazar',
            'Niwaru','niwaru','mansarovar','Galta-gate','Choti-Chopad','Chandpole',
            'Ridhi-Sidhi','Raja-park','rajapark','Pratap-Nagar','badi-chopad',
            'johri-bazar',
            // Rajasthan cities
            'Rajasthan','Alwar','Ajmer','Jodhpur','Udaipur','Kota','Bikaner',
            'Bhilwara','Sikar','Tonk','Pali','Nagaur','Jaisalmer','Jhunjhunu',
            'Hanumangarh','Ganganagar','Churu','Bharatpur','Barmer','Dhaulpur',
            'Dungarpur','Dausa','Bundi','Banswara','Baran',
            'Chittaurgarh','Jalor','Jhalawar','Karauli','Pratapgarh',
            'Rajsamand','Sawai','Sirohi',
            // Major Indian cities
            'Bangalore','Pune','pune','Kolkata','Delhi','Mumbai','Hyderabad',
            'Chennai','Ahmedabad','Surat','Lucknow','Bhopal','Indore','Nagpur',
            'Patna','Chandigarh','Gurgaon','Noida','Jamshedpur','Ranchi',
            'Coimbatore','Vadodara','Visakhapatnam','Amritsar','Ludhiana',
            // States
            'uttar-pradesh','punjab','maharashtra','Gujarat','Karnataka',
            'Tamil-Nadu','Madhya-Pradesh','Bihar','Haryana','Telangana',
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

        return array_unique($tagUrls);
    }

    /** sitemap.xml — all URLs with <url> tags */
    public function index()
    {
        ini_set('memory_limit', '512M');
        set_time_limit(300);

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

        $keywords    = $this->allKeywords();
        $keywordUrls = array_map(fn($kw) => [
            'url'     => PublicController::keywordToUrl($kw),
            'keyword' => $kw,
        ], $keywords);

        $tagUrls = $this->buildTagUrls();

        return $this->xmlResponse('sitemap', [
            'posts'       => $posts,
            'portfolios'  => $portfolios,
            'services'    => $services,
            'keywordUrls' => $keywordUrls,
            'tagUrls'     => $tagUrls,
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
        $robots  = "User-agent: *\n";
        $robots .= "Allow: /\n";
        $robots .= "Disallow: /admin/\n";
        $robots .= "Disallow: /login\n";
        $robots .= "Disallow: /register\n\n";
        $robots .= "# Sitemaps\n";
        $robots .= "Sitemap: " . url('sitemap.xml') . "\n";

        return response($robots, 200)
            ->header('Content-Type', 'text/plain; charset=UTF-8');
    }
}
