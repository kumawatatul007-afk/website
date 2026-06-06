<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('blogs')) {
            return;
        }

        if (! Schema::hasColumn('blogs', 'content')) {
            Schema::table('blogs', function (Blueprint $table) {
                $table->longText('content')->nullable()->after('description');
            });
        }

        if (Schema::hasColumn('blogs', 'created_by')) {
            DB::statement('ALTER TABLE `blogs` MODIFY `created_by` varchar(251) NULL');
        }

        if (Schema::hasColumn('blogs', 'category_id')) {
            DB::statement('ALTER TABLE `blogs` MODIFY `category_id` int(11) NULL');
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('blogs')) {
            return;
        }

        if (Schema::hasColumn('blogs', 'content')) {
            Schema::table('blogs', function (Blueprint $table) {
                $table->dropColumn('content');
            });
        }

        if (Schema::hasColumn('blogs', 'created_by')) {
            DB::statement('ALTER TABLE `blogs` MODIFY `created_by` varchar(251) NOT NULL');
        }

        if (Schema::hasColumn('blogs', 'category_id')) {
            DB::statement('ALTER TABLE `blogs` MODIFY `category_id` int(11) NOT NULL');
        }
    }
};
