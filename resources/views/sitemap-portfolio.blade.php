<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

    @foreach ($portfolios as $portfolio)
    <url>
        <loc>{{ url('/portfolio/' . ($portfolio->slug ?: $portfolio->id)) }}</loc>
        <lastmod>{{ $portfolio->updated_at->toAtomString() }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
        @if ($portfolio->image)
        <image:image>
            <image:loc>{{ url($portfolio->image_url) }}</image:loc>
            <image:title>{{ htmlspecialchars($portfolio->title, ENT_XML1) }}</image:title>
        </image:image>
        @endif
    </url>
    @endforeach

</urlset>
