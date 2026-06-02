<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // Add new columns if they don't already exist
            if (!Schema::hasColumn('services', 'subtitle')) {
                $table->string('subtitle')->nullable()->after('title');
            }
            if (!Schema::hasColumn('services', 'price_range')) {
                $table->string('price_range')->nullable()->after('subtitle');
            }
            if (!Schema::hasColumn('services', 'features')) {
                $table->json('features')->nullable()->after('description');
            }
            if (!Schema::hasColumn('services', 'cta_text')) {
                $table->string('cta_text')->nullable()->after('features');
            }
            if (!Schema::hasColumn('services', 'sort_order')) {
                $table->integer('sort_order')->default(0)->after('cta_text');
            }
            if (!Schema::hasColumn('services', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('sort_order');
            }
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['subtitle', 'price_range', 'features', 'cta_text', 'sort_order', 'is_active']);
        });
    }
};
