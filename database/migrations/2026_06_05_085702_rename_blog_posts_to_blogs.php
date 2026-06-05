<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('blog_posts') && !Schema::hasTable('blogs')) {
            Schema::rename('blog_posts', 'blogs');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('blogs') && !Schema::hasTable('blog_posts')) {
            Schema::rename('blogs', 'blog_posts');
        }
    }
};
