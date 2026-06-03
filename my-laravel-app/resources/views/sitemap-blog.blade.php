<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

    @foreach ($posts as $post)
    @if ($post->slug)
    <url>
        <loc>{{ url('/' . $post->slug) }}</loc>
        <lastmod>{{ $post->updated_at->toAtomString() }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
        @if ($post->main_image)
        <image:image>
            <image:loc>{{ url($post->image_url) }}</image:loc>
            <image:title>{{ htmlspecialchars($post->title, ENT_XML1) }}</image:title>
        </image:image>
        @endif
    </url>
    @endif
    @endforeach

</urlset>
