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
        // If only the old portfolio_items table exists, rename it to portfolio
        if (!Schema::hasTable('portfolio') && Schema::hasTable('portfolio_items')) {
            Schema::rename('portfolio_items', 'portfolio');
        }
        
        // If neither exists, create portfolio from scratch
        if (!Schema::hasTable('portfolio')) {
            Schema::create('portfolio', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('category_id')->nullable();
                $table->string('title')->nullable();
                $table->string('slug')->unique()->nullable();
                $table->string('year')->nullable();
                $table->string('client')->nullable();
                $table->string('services')->nullable();
                $table->string('project')->nullable();
                $table->string('image')->nullable();
                $table->string('clint_name')->nullable();
                $table->string('status')->default('Active');
                $table->date('date')->nullable();
                $table->string('website_link')->nullable();
                $table->text('short_description')->nullable();
                $table->longText('description')->nullable();
                $table->text('summary')->nullable();
                $table->string('meta_title')->nullable();
                $table->string('og_title')->nullable();
                $table->text('meta_keyword')->nullable();
                $table->string('image_alt')->nullable();
                $table->text('meta_description')->nullable();
                $table->text('og_description')->nullable();
                $table->integer('is_publish')->default(1);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No rollback behavior. The 'portfolio' table is expected to remain available.
        // Dropping it here would remove the current live data.
    }
};
