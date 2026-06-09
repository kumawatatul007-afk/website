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
        Schema::table('gallery', function (Blueprint $table) {
            $table->dropColumn(['title', 'issue_date', 'description']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gallery', function (Blueprint $table) {
            $table->string('title')->nullable()->after('id');
            $table->date('issue_date')->nullable()->after('title');
            $table->text('description')->nullable()->after('issue_date');
        });
    }
};
