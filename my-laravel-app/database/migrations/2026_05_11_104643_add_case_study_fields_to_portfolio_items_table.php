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
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->text('challenge')->nullable()->after('description');
            $table->text('approach')->nullable()->after('challenge');
            $table->string('tech_stack')->nullable()->after('approach');
            $table->text('result')->nullable()->after('tech_stack');
            $table->string('client')->nullable()->after('result');
            $table->string('duration')->nullable()->after('client');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->dropColumn(['challenge', 'approach', 'tech_stack', 'result', 'client', 'duration']);
        });
    }
};
