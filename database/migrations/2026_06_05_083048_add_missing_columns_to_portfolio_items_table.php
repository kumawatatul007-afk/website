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
        Schema::table('portfolio', function (Blueprint $table) {
            if (!Schema::hasColumn('portfolio', 'category_id')) {
                $table->unsignedBigInteger('category_id')->nullable()->after('id');
            }
            if (!Schema::hasColumn('portfolio', 'image')) {
                $table->string('image')->nullable()->after('slug');
            }
            if (!Schema::hasColumn('portfolio', 'clint_name')) {
                $table->string('clint_name')->nullable()->after('image');
            }
            if (!Schema::hasColumn('portfolio', 'status')) {
                $table->integer('status')->default(1)->after('clint_name');
            }
            if (!Schema::hasColumn('portfolio', 'date')) {
                $table->date('date')->nullable()->after('status');
            }
            if (!Schema::hasColumn('portfolio', 'website_link')) {
                $table->string('website_link')->nullable()->after('date');
            }
            if (!Schema::hasColumn('portfolio', 'short_description')) {
                $table->text('short_description')->nullable()->after('website_link');
            }
            if (!Schema::hasColumn('portfolio', 'meta_keyword')) {
                $table->string('meta_keyword')->nullable()->after('description');
            }
            if (!Schema::hasColumn('portfolio', 'meta_description')) {
                $table->text('meta_description')->nullable()->after('meta_keyword');
            }
            if (!Schema::hasColumn('portfolio', 'is_publish')) {
                $table->integer('is_publish')->default(1)->after('meta_description');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portfolio', function (Blueprint $table) {
            $columns = [
                'category_id',
                'image',
                'clint_name',
                'status',
                'date',
                'website_link',
                'short_description',
                'meta_keyword',
                'meta_description',
                'is_publish',
            ];
            foreach ($columns as $column) {
                if (Schema::hasColumn('portfolio', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
