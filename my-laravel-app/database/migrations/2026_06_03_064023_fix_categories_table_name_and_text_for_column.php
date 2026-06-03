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
        Schema::table('categories', function (Blueprint $table) {
            // Change text_for from ENUM to VARCHAR to allow flexible category types
            DB::statement("ALTER TABLE categories MODIFY COLUMN text_for VARCHAR(100) NULL");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            // Revert back to ENUM if needed
            DB::statement("ALTER TABLE categories MODIFY COLUMN text_for ENUM('Blogs', 'Product') NOT NULL");
        });
    }
};
