<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            if (!Schema::hasColumn('settings', 'website_title')) {
                $table->string('website_title')->nullable();
            }
            if (!Schema::hasColumn('settings', 'strating_keyword')) {
                $table->string('strating_keyword')->nullable();
            }
            if (!Schema::hasColumn('settings', 'locations')) {
                $table->string('locations')->nullable();
            }
            if (!Schema::hasColumn('settings', 'email')) {
                $table->string('email')->nullable();
            }
            if (!Schema::hasColumn('settings', 'phone')) {
                $table->string('phone')->nullable();
            }
            if (!Schema::hasColumn('settings', 'address')) {
                $table->text('address')->nullable();
            }
            if (!Schema::hasColumn('settings', 'preloader')) {
                $table->boolean('preloader')->default(false);
            }
            if (!Schema::hasColumn('settings', 'timing')) {
                $table->string('timing')->nullable();
            }
            if (!Schema::hasColumn('settings', 'logo')) {
                $table->string('logo')->nullable();
            }
            if (!Schema::hasColumn('settings', 'favicon')) {
                $table->string('favicon')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn([
                'website_title', 'strating_keyword', 'locations',
                'email', 'phone', 'address', 'preloader',
                'timing', 'logo', 'favicon',
            ]);
        });
    }
};
