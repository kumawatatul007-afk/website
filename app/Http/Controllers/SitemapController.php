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
            'Software Engineer',
            'Full Stack Developer',
            'Frontend Developer',
            'Backend Developer',
            'UI UX Designer',
            'Digital Marketing Agency',
            'SEO Expert',
            'Graphic Designer',
            'E-commerce Developer',
            'WordPress Developer',
            'Laravel Developer',
            'React Developer',
            'Angular Developer',
            'Vue.js Developer',
            'Python Developer',
            'Java Developer',
            'PHP Developer',
            'Node.js Developer',
            'DevOps Engineer',
            'Cloud Consultant',
            'Data Analyst',
            'Mobile App Designer',
            'iOS Developer',
            'Android Developer',
            'Flutter Developer',
            'React Native Developer',
            'API Developer',
            'Database Administrator',
            'System Administrator',
            'Network Engineer',
            'Cybersecurity Expert',
            'Blockchain Developer',
            'AI ML Developer',
            'Game Developer',
            'QA Engineer',
            'Software Tester',
            'Business Analyst',
            'Project Manager',
            'Scrum Master',
            'Product Manager',
            'Technical Writer',
            'IT Consultant',
            'ERP Consultant',
            'CRM Developer',
            'Salesforce Developer',
            'SharePoint Developer',
            'Magento Developer',
            'Shopify Developer',
            'WooCommerce Developer',
            'Drupal Developer',
            'Joomla Developer',
            'Content Management System Developer',
            'CMS Developer',
            'Progressive Web App Developer',
            'PWA Developer',
            'Responsive Web Designer',
            'Bootstrap Developer',
            'Tailwind CSS Developer',
            'TypeScript Developer',
            'JavaScript Developer',
            'Ajax Developer',
            'REST API Developer',
            'GraphQL Developer',
            'Microservices Developer',
            'Docker Expert',
            'Kubernetes Expert',
            'AWS Developer',
            'Azure Developer',
            'Google Cloud Developer',
            'Firebase Developer',
            'MongoDB Developer',
            'MySQL Developer',
            'PostgreSQL Developer',
            'Redis Developer',
            'ElasticSearch Developer',
            'Web3 Developer',
            'Solidity Developer',
            'Smart Contract Developer',
            'NFT Developer',
            'Metaverse Developer',
            'AR VR Developer',
            'Unity Developer',
            'Unreal Engine Developer',
            'Machine Learning Engineer',
            'Deep Learning Engineer',
            'Natural Language Processing Expert',
            'Computer Vision Expert',
            'Chatbot Developer',
            'Voice Assistant Developer',
            'IoT Developer',
            'Embedded Systems Developer',
            'Firmware Developer',
            'Automation Engineer',
            'RPA Developer',
            'ETL Developer',
            'Big Data Engineer',
            'Data Engineer',
            'Data Scientist',
            'Business Intelligence Developer',
            'Power BI Developer',
            'Tableau Developer',
        ];

        $locations = [
            // Jaipur areas
            'Jaipur','Kalwar-Road','Jagatpura','Civil-Lines','C-Scheme',
            'Malviya-Nagar','Vaishali-Nagar','Ajmer-Road','Jhotwara','Johri-bazar',
            'Niwaru','niwaru','mansarovar','Galta-gate','Choti-Chopad','Chandpole',
            'Ridhi-Sidhi','Raja-park','rajapark','Pratap-Nagar','badi-chopad',
            'johri-bazar','Sanganer','Sodala','Murlipura','Bani-Park','MI-Road',
            'Station-Road','Gopalpura','Sitapura','Kukas','Amer','Bagru',
            'Chomu','Shahpura-Jaipur','Bassi','Phulera','Chaksu','Sambhar',
            'Kishangarh-Renwal','Madhorajpura','Vidhyadhar-Nagar','Shyam-Nagar',
            'Jawahar-Nagar','Nirman-Nagar','Lal-Kothi','Tonk-Road','Durgapura',
            'Gandhi-Path','JLN-Marg','Sikar-Road','200-Feet-Bypass','Mahapura',
            
            // Rajasthan cities
            'Rajasthan','Alwar','Ajmer','Jodhpur','Udaipur','Kota','Bikaner',
            'Bhilwara','Sikar','Tonk','Pali','Nagaur','Jaisalmer','Jhunjhunu',
            'Hanumangarh','Ganganagar','Churu','Bharatpur','Barmer','Dhaulpur',
            'Dungarpur','Dausa','Bundi','Banswara','Baran',
            'Chittaurgarh','Jalor','Jhalawar','Karauli','Pratapgarh',
            'Rajsamand','Sawai-Madhopur','Sirohi','Mount-Abu','Beawar','Makrana',
            'Kishangarh','Nasirabad','Sujangarh','Ratangarh','Sardarshahar',
            'Nokha','Ladnun','Didwana','Suratgarh','Padampur','Raisinghnagar',
            'Rawatbhata','Bandikui','Fatehpur-Rajasthan','Mangrol','Bhinmal',
            'Phalodi','Sojat','Merta','Deeg','Kuchaman','Nimbahera','Kekri',
            
            // Major Indian cities
            'Bangalore','Pune','pune','Kolkata','Delhi','Mumbai','Hyderabad',
            'Chennai','Ahmedabad','Surat','Lucknow','Bhopal','Indore','Nagpur',
            'Patna','Chandigarh','Gurgaon','Noida','Jamshedpur','Ranchi',
            'Coimbatore','Vadodara','Visakhapatnam','Amritsar','Ludhiana',
            'Agra','Nashik','Faridabad','Meerut','Rajkot','Varanasi','Srinagar',
            'Aurangabad','Dhanbad','Jabalpur','Gwalior','Vijayawada','Jodhpur',
            'Madurai','Raipur','Kota','Guwahati','Thiruvananthapuram','Solapur',
            'Hubli','Mysore','Tiruchirappalli','Bareilly','Aligarh','Moradabad',
            'Jalandhar','Bhubaneswar','Salem','Warangal','Guntur','Bhiwandi',
            'Saharanpur','Gorakhpur','Bikaner','Amravati','Noida-Extension',
            'Greater-Noida','Ghaziabad','Thane','Navi-Mumbai','Howrah',
            'Allahabad','Prayagraj','Kanpur','Kochi','Kozhikode','Mangalore',
            'Belgaum','Gulbarga','Kolhapur','Jamnagar','Bhavnagar','Junagadh',
            'Udaipur','Ajmer','Gandhidham','Anand','Nadiad','Bharuch',
            'Valsad','Vapi','Daman','Silvassa','Panaji','Margao',
            
            // NCR Region
            'Delhi-NCR','New-Delhi','South-Delhi','North-Delhi','East-Delhi',
            'West-Delhi','Central-Delhi','Dwarka','Rohini','Pitampura',
            'Janakpuri','Laxmi-Nagar','Nehru-Place','Connaught-Place','Karol-Bagh',
            'Saket','Vasant-Kunj','Hauz-Khas','Green-Park','Defence-Colony',
            'Greater-Kailash','Mayur-Vihar','Preet-Vihar','Shahdara','Uttam-Nagar',
            'Punjabi-Bagh','Rajouri-Garden','Noida-Sector-62','Noida-Sector-63',
            'Noida-Sector-18','Gurgaon-Sector-14','Cyber-City','Golf-Course-Road',
            'MG-Road-Gurgaon','Sohna-Road','Manesar','Faridabad-Sector-15',
            'Ballabgarh','Palwal','Sonipat','Panipat','Karnal','Ambala',
            
            // Maharashtra
            'Mumbai-Andheri','Bandra','Powai','Goregaon','Borivali','Thane-West',
            'Kalyan','Dombivli','Panvel','Kharghar','Vashi','Airoli',
            'Pune-Hinjewadi','Kharadi','Wakad','Baner','Aundh','Koregaon-Park',
            'Viman-Nagar','Hadapsar','Kothrud','Deccan','Shivaji-Nagar',
            'Nagpur-Dharampeth','Sadar','Sitabuldi','Wardha-Road','Nashik-Road',
            'Aurangabad-CIDCO','Jalgaon','Kolhapur-Tarabai','Sangli','Satara',
            
            // Karnataka
            'Bangalore-Whitefield','Koramangala','Indiranagar','Electronic-City',
            'BTM-Layout','HSR-Layout','Jayanagar','Marathahalli','Bellandur',
            'Sarjapur-Road','Hebbal','Yelahanka','Rajajinagar','Malleshwaram',
            'JP-Nagar','Banashankari','Mysore-Saraswathipuram','Vijayanagar-Mysore',
            'Mangalore-Hampankatta','Bejai','Hubli-Dharwad','Belgaum-Camp',
            
            // Tamil Nadu
            'Chennai-Anna-Nagar','T-Nagar','Velachery','Adyar','OMR','Porur',
            'Tambaram','Chrompet','Sholinganallur','Guindy','Nungambakkam',
            'Coimbatore-RS-Puram','Gandhipuram','Peelamedu','Saibaba-Colony',
            'Madurai-Anna-Nagar','Pasumalai','Salem-Fairlands','Trichy-Thillai-Nagar',
            
            // Telangana & AP
            'Hyderabad-Hitech-City','Gachibowli','Madhapur','Kukatpally','Ameerpet',
            'Secunderabad','Begumpet','Banjara-Hills','Jubilee-Hills','Miyapur',
            'Vijayawada-Benz-Circle','Labbipet','Guntur-Brodipet','Visakhapatnam-MVP',
            'Dwaraka-Nagar','Tirupati','Kakinada','Nellore','Rajahmundry',
            
            // Gujarat
            'Ahmedabad-SG-Highway','Satellite','Maninagar','Navrangpura','Vastrapur',
            'Surat-Adajan','Vesu','Athwa','Udhna','Katargam','Rajkot-Kalawad-Road',
            'Vadodara-Alkapuri','Sayajigunj','Jamnagar-Pandit-Nehru-Marg',
            'Bhavnagar-Waghawadi','Anand-GIDC','Gandhinagar','Mehsana','Morbi',
            
            // West Bengal
            'Kolkata-Salt-Lake','Rajarhat','New-Town','Park-Street','Ballygunge',
            'Behala','Jadavpur','Howrah-Shibpur','Durgapur','Asansol','Siliguri',
            
            // States
            'uttar-pradesh','punjab','maharashtra','Gujarat','Karnataka',
            'Tamil-Nadu','Madhya-Pradesh','Bihar','Haryana','Telangana',
            'Andhra-Pradesh','West-Bengal','Odisha','Kerala','Jharkhand',
            'Assam','Uttarakhand','Himachal-Pradesh','Chhattisgarh','Goa',
            'Jammu-Kashmir','Ladakh','Puducherry','Andaman-Nicobar',
            'Dadra-Nagar-Haveli','Daman-Diu','Lakshadweep','Chandigarh-UT',
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

    /** sitemap.xml — all URLs with <url> tags directly */
    public function index()
    {
        ini_set('memory_limit', '1024M');
        set_time_limit(600);

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
