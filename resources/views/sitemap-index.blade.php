<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    
    {{-- Main sitemap with static pages, blog, portfolio, services --}}
    <sitemap>
        <loc>{{ url('sitemap-main.xml') }}</loc>
        <lastmod>{{ now()->toAtomString() }}</lastmod>
    </sitemap>

    {{-- Paginated tag sitemaps --}}
    @for ($page = 1; $page <= $totalTagPages; $page++)
    <sitemap>
        <loc>{{ url("sitemap-tags-{$page}.xml") }}</loc>
        <lastmod>{{ now()->toAtomString() }}</lastmod>
    </sitemap>
    @endfor

    {{-- Paginated keyword sitemaps --}}
    @for ($page = 1; $page <= $totalKeywordPages; $page++)
    <sitemap>
        <loc>{{ url("sitemap-keywords-{$page}.xml") }}</loc>
        <lastmod>{{ now()->toAtomString() }}</lastmod>
    </sitemap>
    @endfor

</sitemapindex>
