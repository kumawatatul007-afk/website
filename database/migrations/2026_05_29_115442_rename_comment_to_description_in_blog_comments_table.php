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
        if (Schema::hasColumn('blog_comments', 'comment') && !Schema::hasColumn('blog_comments', 'description')) {
            Schema::table('blog_comments', function (Blueprint $table) {
                $table->renameColumn('comment', 'description');
            });
        }
    }

    public function down(): void
    {
        Schema::table('blog_comments', function (Blueprint $table) {
            $table->renameColumn('description', 'comment');
        });
    }
};
