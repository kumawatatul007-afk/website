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
        Schema::table('works', function (Blueprint $table) {
            // Add missing columns that the PortfolioItem model expects
            if (!Schema::hasColumn('works', 'is_publish')) {
                $table->tinyInteger('is_publish')->default(1)->after('og_description');
            }
            if (!Schema::hasColumn('works', 'category_id')) {
                $table->unsignedBigInteger('category_id')->nullable()->after('id');
            }
            if (!Schema::hasColumn('works', 'image')) {
                $table->string('image')->nullable()->after('cover_image');
            }
            if (!Schema::hasColumn('works', 'clint_name')) {
                $table->string('clint_name')->nullable()->after('client');
            }
            if (!Schema::hasColumn('works', 'status')) {
                $table->integer('status')->default(1)->after('is_publish');
            }
            if (!Schema::hasColumn('works', 'date')) {
                $table->date('date')->nullable()->after('year');
            }
            if (!Schema::hasColumn('works', 'website_link')) {
                $table->string('website_link')->nullable()->after('project');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('works', function (Blueprint $table) {
            $columns = ['is_publish', 'category_id', 'image', 'clint_name', 'status', 'date', 'website_link'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('works', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
