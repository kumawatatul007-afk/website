<?php

namespace App\Console\Commands;

use App\Models\PortfolioItem;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class BackfillPortfolioSlugs extends Command
{
    protected $signature   = 'portfolio:backfill-slugs';
    protected $description = 'Generate slugs for portfolio items that are missing one';

    public function handle(): void
    {
        $items = PortfolioItem::whereNull('slug')->orWhere('slug', '')->get();

        if ($items->isEmpty()) {
            $this->info('All portfolio items already have slugs.');
            return;
        }

        foreach ($items as $item) {
            $base  = Str::slug($item->title);
            $slug  = $base;
            $count = 1;
            while (PortfolioItem::where('slug', $slug)->where('id', '!=', $item->id)->exists()) {
                $slug = $base . '-' . $count++;
            }
            $item->update(['slug' => $slug]);
            $this->line("  #{$item->id} → {$slug}");
        }

        $this->info("Done. {$items->count()} item(s) updated.");
    }
}
