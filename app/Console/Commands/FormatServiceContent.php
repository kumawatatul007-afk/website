<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BlogPost;

class FormatServiceContent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'service:format-content {slug?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Format service content to add proper HTML paragraph tags';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $slug = $this->argument('slug');

        if ($slug) {
            // Format specific service
            $service = BlogPost::where('slug', $slug)->where('type', 1)->first();
            
            if (!$service) {
                $this->error("Service with slug '{$slug}' not found!");
                return 1;
            }

            $this->formatService($service);
            $this->info("✓ Formatted service: {$service->title}");
        } else {
            // Format all services
            $services = BlogPost::where('type', 1)->get();
            
            if ($services->isEmpty()) {
                $this->warn('No services found!');
                return 0;
            }

            $this->info("Found {$services->count()} services. Formatting...");
            $bar = $this->output->createProgressBar($services->count());
            $bar->start();

            foreach ($services as $service) {
                $this->formatService($service);
                $bar->advance();
            }

            $bar->finish();
            $this->newLine();
            $this->info("✓ All services formatted successfully!");
        }

        return 0;
    }

    /**
     * Format a single service content
     */
    private function formatService(BlogPost $service)
    {
        $content = $service->content;

        // Skip if already has HTML tags
        if (preg_match('/<p[^>]*>|<h[1-6][^>]*>|<ul>|<ol>/', $content)) {
            return;
        }

        // Remove extra whitespace
        $content = trim($content);

        // Split by common sentence endings followed by space and capital letter
        // This handles: ". A", "? B", "! C"
        $sentences = preg_split('/([.!?])\s+(?=[A-Z])/', $content, -1, PREG_SPLIT_DELIM_CAPTURE);

        $formatted = '';
        $currentParagraph = '';

        for ($i = 0; $i < count($sentences); $i++) {
            if ($i % 2 === 0) {
                // This is a sentence
                $currentParagraph .= $sentences[$i];
            } else {
                // This is a delimiter (., !, ?)
                $currentParagraph .= $sentences[$i];

                // Check if we should start a new paragraph
                // Create paragraph every 2-3 sentences
                if (substr_count($currentParagraph, '.') + substr_count($currentParagraph, '!') + substr_count($currentParagraph, '?') >= 3) {
                    $formatted .= '<p>' . trim($currentParagraph) . '</p>' . "\n\n";
                    $currentParagraph = '';
                }
            }
        }

        // Add remaining content as final paragraph
        if (!empty($currentParagraph)) {
            $formatted .= '<p>' . trim($currentParagraph) . '</p>';
        }

        // If formatting failed or resulted in empty content, wrap entire content in one paragraph
        if (empty($formatted)) {
            $formatted = '<p>' . $content . '</p>';
        }

        // Update the service
        $service->content = $formatted;
        $service->save();
    }
}
