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
        Schema::table('services', function (Blueprint $table) {
            if (!Schema::hasColumn('services', 'designation')) {
                $table->string('designation')->nullable()->after('image');
            }
            if (!Schema::hasColumn('services', 'is_location')) {
                $table->boolean('is_location')->default(false)->after('designation');
            }
            if (!Schema::hasColumn('services', 'meta_title')) {
                $table->string('meta_title')->nullable()->after('is_location');
            }
            if (!Schema::hasColumn('services', 'meta_keyword')) {
                $table->string('meta_keyword')->nullable()->after('meta_title');
            }
            if (!Schema::hasColumn('services', 'image_alt')) {
                $table->string('image_alt')->nullable()->after('meta_keyword');
            }
            if (!Schema::hasColumn('services', 'meta_description')) {
                $table->text('meta_description')->nullable()->after('image_alt');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $columns = ['designation', 'is_location', 'meta_title', 'meta_keyword', 'image_alt', 'meta_description'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('services', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
