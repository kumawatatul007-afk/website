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
        Schema::table('blogs', function (Blueprint $table) {
            if (!Schema::hasColumn('blogs', 'category_id')) {
                $table->unsignedBigInteger('category_id')->nullable()->after('id');
            }
            if (!Schema::hasColumn('blogs', 'serial_number')) {
                $table->integer('serial_number')->nullable()->after('slug');
            }
            if (!Schema::hasColumn('blogs', 'meta_title')) {
                $table->string('meta_title')->nullable()->after('serial_number');
            }
            if (!Schema::hasColumn('blogs', 'meta_keywords')) {
                $table->text('meta_keywords')->nullable()->after('meta_title');
            }
            if (!Schema::hasColumn('blogs', 'meta_keyword')) {
                $table->string('meta_keyword')->nullable()->after('meta_keywords');
            }
            if (!Schema::hasColumn('blogs', 'meta_description')) {
                $table->text('meta_description')->nullable()->after('meta_keyword');
            }
            if (!Schema::hasColumn('blogs', 'og_title')) {
                $table->string('og_title')->nullable()->after('meta_description');
            }
            if (!Schema::hasColumn('blogs', 'og_description')) {
                $table->text('og_description')->nullable()->after('og_title');
            }
            if (!Schema::hasColumn('blogs', 'image_alt')) {
                $table->string('image_alt')->nullable()->after('og_description');
            }
            if (!Schema::hasColumn('blogs', 'type')) {
                $table->integer('type')->default(0)->after('image_alt');
            }
            if (!Schema::hasColumn('blogs', 'tags')) {
                $table->text('tags')->nullable()->after('type');
            }
            if (!Schema::hasColumn('blogs', 'main_image')) {
                $table->string('main_image')->nullable()->after('tags');
            }
            if (!Schema::hasColumn('blogs', 'description')) {
                $table->text('description')->nullable()->after('main_image');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            $columnsToDrop = [
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
            ];
            
            foreach ($columnsToDrop as $column) {
                if (Schema::hasColumn('blogs', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
