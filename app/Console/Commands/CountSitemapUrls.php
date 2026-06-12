<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\SitemapController;
use App\Models\BlogPost;
use App\Models\PortfolioItem;
use App\Models\Service;
use Illuminate\Support\Facades\Schema;
use ReflectionMethod;

class CountSitemapUrls extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sitemap:count';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Count total URLs in sitemap';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $controller = new SitemapController();
        
        // Use reflection to access private method
        $method = new ReflectionMethod(SitemapController::class, 'buildTagUrls');
        $method->setAccessible(true);
        $tagUrls = $method->invoke($controller);

        // Count other URLs
        $posts = BlogPost::whereNotNull('slug')
            ->where('slug', '!=', '')
            ->count();

        $portfolios = PortfolioItem::where('is_publish', 1)->count();

        $query = Service::whereNotNull('slug')->where('slug', '!=', '');
        if (Schema::hasColumn('services', 'is_active')) {
            $query->where('is_active', true);
        }
        $services = $query->count();

        $staticPages = 13; // Count from sitemap.blade.php

        // Use reflection for allKeywords method
        $keywordMethod = new ReflectionMethod(SitemapController::class, 'allKeywords');
        $keywordMethod->setAccessible(true);
        $keywords = $keywordMethod->invoke($controller);

        $totalUrls = $staticPages + $posts + $portfolios + $services + count($keywords) + count($tagUrls);

        $this->info('╔══════════════════════════════════════════════════╗');
        $this->info('║           SITEMAP URL COUNT SUMMARY              ║');
        $this->info('╚══════════════════════════════════════════════════╝');
        $this->newLine();
        $this->info("Static Pages:      " . number_format($staticPages));
        $this->info("Blog Posts:        " . number_format($posts));
        $this->info("Portfolio Items:   " . number_format($portfolios));
        $this->info("Services:          " . number_format($services));
        $this->info("Keywords:          " . number_format(count($keywords)));
        $this->info("Tag URLs:          " . number_format(count($tagUrls)));
        $this->newLine();
        $this->info('────────────────────────────────────────────────────');
        $this->info("TOTAL URLs:        " . number_format($totalUrls));
        $this->info('────────────────────────────────────────────────────');
        $this->newLine();

        if (count($tagUrls) > 0) {
            $pagesNeeded = ceil(count($tagUrls) / SitemapController::URLS_PER_SITEMAP);
            $this->info("Tag sitemap pages needed: " . $pagesNeeded);
            $this->info("(5000 URLs per sitemap page)");
        }

        return 0;
    }
}
