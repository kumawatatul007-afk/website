<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Step 1: Rename table from 'portfolio' to 'portfolio_items'
        if (Schema::hasTable('portfolio') && !Schema::hasTable('portfolio_items')) {
            Schema::rename('portfolio', 'portfolio_items');
        }

        // Step 2: Ensure all required columns exist with proper types
        if (Schema::hasTable('portfolio_items')) {
            Schema::table('portfolio_items', function (Blueprint $table) {
                // Basic columns
                if (!Schema::hasColumn('portfolio_items', 'id')) {
                    $table->id()->first();
                }
                if (!Schema::hasColumn('portfolio_items', 'category_id')) {
                    $table->unsignedBigInteger('category_id')->nullable()->after('id');
                }
                if (!Schema::hasColumn('portfolio_items', 'title')) {
                    $table->string('title')->nullable()->after('category_id');
                }
                if (!Schema::hasColumn('portfolio_items', 'slug')) {
                    $table->string('slug')->unique()->nullable()->after('title');
                }
                if (!Schema::hasColumn('portfolio_items', 'year')) {
                    $table->string('year')->nullable()->after('slug');
                }
                if (!Schema::hasColumn('portfolio_items', 'client')) {
                    $table->string('client')->nullable()->after('year');
                }
                if (!Schema::hasColumn('portfolio_items', 'services')) {
                    $table->string('services')->nullable()->after('client');
                }
                if (!Schema::hasColumn('portfolio_items', 'project')) {
                    $table->string('project')->nullable()->after('services');
                }
                if (!Schema::hasColumn('portfolio_items', 'image')) {
                    $table->string('image')->nullable()->after('project');
                }
                if (!Schema::hasColumn('portfolio_items', 'clint_name')) {
                    $table->string('clint_name')->nullable()->after('image');
                }
                if (!Schema::hasColumn('portfolio_items', 'status')) {
                    $table->string('status')->default('Active')->after('clint_name');
                }
                if (!Schema::hasColumn('portfolio_items', 'date')) {
                    $table->date('date')->nullable()->after('status');
                }
                if (!Schema::hasColumn('portfolio_items', 'website_link')) {
                    $table->string('website_link')->nullable()->after('date');
                }
                if (!Schema::hasColumn('portfolio_items', 'short_description')) {
                    $table->text('short_description')->nullable()->after('website_link');
                }
                if (!Schema::hasColumn('portfolio_items', 'description')) {
                    $table->longText('description')->nullable()->after('short_description');
                }
                if (!Schema::hasColumn('portfolio_items', 'summary')) {
                    $table->text('summary')->nullable()->after('description');
                }
                
                // SEO columns
                if (!Schema::hasColumn('portfolio_items', 'meta_title')) {
                    $table->string('meta_title')->nullable()->after('summary');
                }
                if (!Schema::hasColumn('portfolio_items', 'og_title')) {
                    $table->string('og_title')->nullable()->after('meta_title');
                }
                if (!Schema::hasColumn('portfolio_items', 'meta_keyword')) {
                    $table->text('meta_keyword')->nullable()->after('og_title');
                }
                if (!Schema::hasColumn('portfolio_items', 'image_alt')) {
                    $table->string('image_alt')->nullable()->after('meta_keyword');
                }
                if (!Schema::hasColumn('portfolio_items', 'meta_description')) {
                    $table->text('meta_description')->nullable()->after('image_alt');
                }
                if (!Schema::hasColumn('portfolio_items', 'og_description')) {
                    $table->text('og_description')->nullable()->after('meta_description');
                }
                
                // Publishing status
                if (!Schema::hasColumn('portfolio_items', 'is_publish')) {
                    $table->integer('is_publish')->default(1)->after('og_description');
                }
                
                // Timestamps
                if (!Schema::hasColumn('portfolio_items', 'created_at')) {
                    $table->timestamps();
                }
            });

            // Update status column type if it's integer to string
            $columnType = DB::select("SHOW COLUMNS FROM portfolio_items WHERE Field = 'status'");
            if (!empty($columnType) && strpos($columnType[0]->Type, 'int') !== false) {
                DB::statement("ALTER TABLE portfolio_items MODIFY COLUMN status VARCHAR(255) DEFAULT 'Active'");
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Rename back from 'portfolio_items' to 'portfolio'
        if (Schema::hasTable('portfolio_items') && !Schema::hasTable('portfolio')) {
            Schema::rename('portfolio_items', 'portfolio');
        }
    }
};
