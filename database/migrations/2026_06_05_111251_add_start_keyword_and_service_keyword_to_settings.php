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
        Schema::table('settings', function (Blueprint $table) {
            if (!Schema::hasColumn('settings', 'start_keyword')) {
                $table->text('start_keyword')->nullable()->after('strating_keyword');
            }
            if (!Schema::hasColumn('settings', 'service_keyword')) {
                $table->text('service_keyword')->nullable()->after('start_keyword');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            if (Schema::hasColumn('settings', 'start_keyword')) {
                $table->dropColumn('start_keyword');
            }
            if (Schema::hasColumn('settings', 'service_keyword')) {
                $table->dropColumn('service_keyword');
            }
        });
    }
};
