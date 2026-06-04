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
            if (!Schema::hasColumn('portfolio', 'slug')) {
                $table->string('slug')->unique()->nullable()->after('title');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portfolio', function (Blueprint $table) {
            if (Schema::hasColumn('portfolio', 'slug')) {
                $table->dropColumn('slug');
            }
        });
    }
};
