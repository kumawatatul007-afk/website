<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">

    <?php
        // Page-specific seo (from controller) takes priority over shared seo (from middleware/SeoPage)
        $rawSeo = $page['props']['seo'] ?? null;

        // Normalize: SeoPage model object → array, or plain array as-is
        if (is_object($rawSeo)) {
            $seoArr = method_exists($rawSeo, 'toArray') ? $rawSeo->toArray() : (array)$rawSeo;
        } elseif (is_array($rawSeo)) {
            $seoArr = $rawSeo;
        } else {
            $seoArr = [];
        }

        $title       = $seoArr['title']       ?? 'Nikhil Sharma | Freelance PHP, React & Flutter Developer — Jaipur, India';
        $description = $seoArr['description'] ?? 'Hire Nikhil Sharma, a Jaipur-based Full Stack Developer with 8+ years building websites, apps & digital solutions. Fast delivery, affordable rates, real results.';
        $keywords    = $seoArr['keywords']    ?? 'Web Developer Jaipur, PHP Developer Jaipur, React Developer India, Full Stack Developer Jaipur, Nikhil Sharma';
        $author      = $seoArr['author']      ?? 'Nikhil Sharma';
        $robots      = $seoArr['robots']      ?? 'index, follow';
        $og_image    = $seoArr['og_image']    ?? asset('images/og-social-card.jpg');
        $canonical   = $seoArr['canonical']   ?? url()->current();
    ?>

    <title><?php echo e($title); ?></title>
    <meta name="description" content="<?php echo e($description); ?>">
    <meta name="keywords" content="<?php echo e($keywords); ?>">
    <meta name="author" content="<?php echo e($author); ?>">
    <meta name="robots" content="<?php echo e($robots); ?>">
    <link rel="canonical" href="<?php echo e($canonical); ?>">

    <!-- Geo / Local SEO -->
    <meta name="geo.region" content="IN-RJ">
    <meta name="geo.placename" content="Jaipur">
    <meta name="geo.position" content="26.9124;75.7873">
    <meta name="ICBM" content="26.9124, 75.7873">

    <!-- Open Graph / Facebook — 1200×630 required -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo e(url()->current()); ?>">
    <meta property="og:title" content="<?php echo e($title); ?>">
    <meta property="og:description" content="<?php echo e($description); ?>">
    <meta property="og:image" content="<?php echo e($og_image); ?>">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:site_name" content="Nikhil Sharma">
    <meta property="og:locale" content="en_IN">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@nikhilsharma_in">
    <meta name="twitter:creator" content="@nikhilsharma_in">
    <meta name="twitter:title" content="<?php echo e($title); ?>">
    <meta name="twitter:description" content="<?php echo e($description); ?>">
    <meta name="twitter:image" content="<?php echo e($og_image); ?>">

    <!-- Preconnect for performance (Google Fonts, CDN) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://www.thenikhilsharma.in">
    <link rel="dns-prefetch" href="https://wpdemo.ajufbox.com">

    <!-- Preload LCP hero image (home page) -->
    <link rel="preload" as="image" href="https://www.thenikhilsharma.in/public/profile/images/n2.png" fetchpriority="high">

    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico" sizes="32x32">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23131313'/><text x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial,sans-serif' font-weight='700' font-size='18' fill='%23ffffff'>N</text></svg>" type="image/svg+xml">
    <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23131313'/><text x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial,sans-serif' font-weight='700' font-size='18' fill='%23ffffff'>N</text></svg>">

    <?php if(isset($seo['structured_data'])): ?>
        <script type="application/ld+json">
            <?php echo is_array($seo['structured_data']) ? json_encode($seo['structured_data'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) : $seo['structured_data']; ?>

        </script>
    <?php endif; ?>

    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
    <?php echo app('Illuminate\Foundation\Vite')(['resources/js/app.jsx']); ?>
    <?php $__inertiaSsrResponse = app(\Inertia\Ssr\SsrState::class)->setPage($page)->dispatch();  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->head; } ?>
</head>
<body class="antialiased bg-gray-50">
    <?php $__inertiaSsrResponse = app(\Inertia\Ssr\SsrState::class)->setPage($page)->dispatch();  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->body; } else { ?><script data-page="app" type="application/json"><?php echo json_encode($page); ?></script><div id="app"></div><?php } ?>
</body>
</html>
<?php /**PATH E:\my laravel project\my-laravel-app\resources\views/app.blade.php ENDPATH**/ ?>