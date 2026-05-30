<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

    {{-- Static Pages --}}
    <sitemap>
        <loc>{{ url('/sitemap-pages.xml') }}</loc>
        <lastmod>{{ now()->toAtomString() }}</lastmod>
    </sitemap>

    {{-- Blog Posts --}}
    <sitemap>
        <loc>{{ url('/sitemap-blog.xml') }}</loc>
        <lastmod>{{ now()->toAtomString() }}</lastmod>
    </sitemap>

    {{-- Portfolio --}}
    <sitemap>
        <loc>{{ url('/sitemap-portfolio.xml') }}</loc>
        <lastmod>{{ now()->toAtomString() }}</lastmod>
    </sitemap>

    {{-- Services --}}
    <sitemap>
        <loc>{{ url('/sitemap-services.xml') }}</loc>
        <lastmod>{{ now()->toAtomString() }}</lastmod>
    </sitemap>

    {{-- Keywords (paginated) --}}
    @for ($i = 1; $i <= $keywordsPageCount; $i++)
    <sitemap>
        <loc>{{ url('/keywords-' . $i . '.xml') }}</loc>
        <lastmod>{{ now()->toAtomString() }}</lastmod>
    </sitemap>
    @endfor

    {{-- Tags / Location combinations (paginated) --}}
    @for ($i = 1; $i <= $tagsPageCount; $i++)
    <sitemap>
        <loc>{{ url('/tags-' . $i . '.xml') }}</loc>
        <lastmod>{{ now()->toAtomString() }}</lastmod>
    </sitemap>
    @endfor

</sitemapindex>
