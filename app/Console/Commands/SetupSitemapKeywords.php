<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Setting;

class SetupSitemapKeywords extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sitemap:setup-keywords';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setup keywords in settings for generating 45000+ sitemap URLs';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $setting = Setting::first();

        if (!$setting) {
            $this->error('No settings record found. Please create one first.');
            return 1;
        }

        // Set up start_keyword with prefixes
        // With 107 service types × 358 locations = 38,306 URLs per prefix
        // Using 2 prefixes will give us 76,612 URLs (more than 45,000)
        $prefixes = 'Best, Top';
        
        $setting->start_keyword = $prefixes;
        $setting->save();

        $this->info('✓ Updated start_keyword with: ' . $prefixes);
        $this->info('');
        $this->info('Expected URL generation:');
        $this->info('- Service Types: 107');
        $this->info('- Locations: 358');
        $this->info('- Prefixes: 2 (Best, Top)');
        $this->info('- Total Tag URLs: ~76,612');
        $this->info('- Plus static pages, blog posts, portfolio items, services');
        $this->info('');
        $this->info('To verify, run:');
        $this->info('  php artisan tinker');
        $this->info('  (new \App\Http\Controllers\SitemapController)->buildTagUrls() |> count(_)');

        return 0;
    }
}
