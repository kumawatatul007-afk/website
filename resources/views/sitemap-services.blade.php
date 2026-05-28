<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

    @foreach ($services as $service)
    @if ($service->slug)
    @php
        $slugParts = explode('-', $service->slug, 2);
        $svcPrefix = ucfirst($slugParts[0] ?? $service->slug);
        $svcRest   = $slugParts[1] ?? '';
        $svcUrl    = $svcRest ? "/service/{$svcPrefix}/{$svcRest}" : "/service/{$svcPrefix}";
    @endphp
    <url>
        <loc>{{ url($svcUrl) }}</loc>
        <lastmod>{{ $service->updated_at->toAtomString() }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.75</priority>
    </url>
    @endif
    @endforeach

</urlset>
