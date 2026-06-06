<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('email_setting')) {
            if (! Schema::hasColumn('email_setting', 'from_name')) {
                Schema::table('email_setting', function (Blueprint $table) {
                    $table->string('from_name')->nullable()->after('from_address');
                });
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('email_setting') && Schema::hasColumn('email_setting', 'from_name')) {
            Schema::table('email_setting', function (Blueprint $table) {
                $table->dropColumn('from_name');
            });
        }
    }
};
