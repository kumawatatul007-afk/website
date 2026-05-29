<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\BlogPost;

$total = BlogPost::count();
$published = BlogPost::where('status', 1)->count();
echo "Total blogs: $total\n";
echo "Published (status=1): $published\n";

$sample = BlogPost::first();
if ($sample) {
    echo "Sample post: {$sample->title}\n";
    echo "  status: {$sample->status}\n";
    echo "  main_image: {$sample->main_image}\n";
    echo "  slug: {$sample->slug}\n";
    echo "  category_id: {$sample->category_id}\n";
}
