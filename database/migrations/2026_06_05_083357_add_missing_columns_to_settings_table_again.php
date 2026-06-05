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
            if (!Schema::hasColumn('settings', 'phonenumber')) {
                $table->string('phonenumber')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('settings', 'social_links')) {
                $table->json('social_links')->nullable()->after('favicon');
            }
            if (!Schema::hasColumn('settings', 'start_keyword')) {
                $table->string('start_keyword')->nullable()->after('strating_keyword');
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
            $columns = ['phonenumber', 'social_links', 'start_keyword', 'service_keyword'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('settings', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
