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
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->unsignedBigInteger('category_id')->nullable()->after('id');
            $table->integer('serial_number')->nullable()->after('slug');
            $table->string('meta_title')->nullable()->after('serial_number');
            $table->text('meta_keywords')->nullable()->after('meta_title');
            $table->string('meta_keyword')->nullable()->after('meta_keywords');
            $table->text('meta_description')->nullable()->after('meta_keyword');
            $table->string('og_title')->nullable()->after('meta_description');
            $table->text('og_description')->nullable()->after('og_title');
            $table->string('image_alt')->nullable()->after('og_description');
            $table->integer('type')->default(0)->after('image_alt');
            $table->text('tags')->nullable()->after('type');
            $table->string('main_image')->nullable()->after('tags');
            $table->text('description')->nullable()->after('main_image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropColumn([
                'category_id',
                'serial_number',
                'meta_title',
                'meta_keywords',
                'meta_keyword',
                'meta_description',
                'og_title',
                'og_description',
                'image_alt',
                'type',
                'tags',
                'main_image',
                'description',
            ]);
        });
    }
};
