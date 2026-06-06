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
        if (! Schema::hasTable('blogs')) {
            return;
        }

        Schema::table('blogs', function (Blueprint $table) {
            if (! Schema::hasColumn('blogs', 'content')) {
                if (Schema::hasColumn('blogs', 'description')) {
                    $table->longText('content')->nullable()->after('description');
                } elseif (Schema::hasColumn('blogs', 'main_image')) {
                    $table->longText('content')->nullable()->after('main_image');
                } else {
                    $table->longText('content')->nullable();
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('blogs')) {
            return;
        }

        Schema::table('blogs', function (Blueprint $table) {
            if (Schema::hasColumn('blogs', 'content')) {
                $table->dropColumn('content');
            }
        });
    }
};
