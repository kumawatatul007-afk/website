<?php

namespace App\Console\Commands;

use App\Models\BlogPost;
use Illuminate\Console\Command;

class StripServiceContent extends Command
{
    protected $signature   = 'services:strip-html-content {--dry-run : Preview changes without saving}';
    protected $description = 'Strip all HTML tags from service page content and decode HTML entities';

    public function handle(): void
    {
        $services = BlogPost::where('type', 1)->get();

        if ($services->isEmpty()) {
            $this->info('No service records found.');
            return;
        }

        $dryRun  = $this->option('dry-run');
        $updated = 0;

        $this->info(($dryRun ? '[DRY RUN] ' : '') . "Processing {$services->count()} service record(s)...");
        $this->newLine();

        foreach ($services as $service) {
            $original = $service->content ?? '';
            $cleaned  = $this->cleanContent($original);

            if ($original === $cleaned) {
                $this->line("  <fg=gray>#{$service->id} {$service->title} — no change</>");
                continue;
            }

            $this->line("  <fg=green>#{$service->id} {$service->title} — updated</>");

            if (! $dryRun) {
                $service->update(['content' => $cleaned]);
            }

            $updated++;
        }

        $this->newLine();

        if ($dryRun) {
            $this->info("[DRY RUN] {$updated} record(s) would be updated. Run without --dry-run to apply.");
        } else {
            $this->info("Done. {$updated} record(s) updated.");
        }
    }

    private function cleanContent(string $html): string
    {
        if (trim($html) === '') {
            return '';
        }

        // Convert block-level closing tags and <br> to newlines before stripping
        $text = preg_replace('/<br\s*\/?>/i', "\n", $html);
        $text = preg_replace('/<\/(p|div|h[1-6]|li|tr|blockquote|section|article)>/i', "\n", $text);

        // Prefix list items with a bullet
        $text = preg_replace('/<li[^>]*>/i', '• ', $text);

        // Strip all remaining tags
        $text = strip_tags($text);

        // Decode HTML entities
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // Collapse excessive whitespace / blank lines
        $text = preg_replace('/[ \t]+/', ' ', $text);
        $text = preg_replace('/\n[ \t]+/', "\n", $text);
        $text = preg_replace('/\n{3,}/', "\n\n", $text);

        return trim($text);
    }
}
