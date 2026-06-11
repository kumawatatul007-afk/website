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
        Schema::table('footer', function (Blueprint $table) {
            if (!Schema::hasColumn('footer', 'footer_logo')) {
                $table->string('footer_logo')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('footer', function (Blueprint $table) {
            if (Schema::hasColumn('footer', 'footer_logo')) {
                $table->dropColumn('footer_logo');
            }
        });
    }
};
