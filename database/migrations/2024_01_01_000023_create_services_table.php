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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('tags')->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->text('qnopml')->nullable();
            $table->string('dns')->nullable();
            $table->string('cdn')->nullable();
            $table->string('ssl')->nullable();
            $table->string('minify')->nullable();
            $table->string('caching')->nullable();
            $table->string('databaseas')->nullable();
            $table->string('loadbalance')->nullable();
            $table->string('gzipcomp')->nullable();
            $table->string('prefetchimages')->nullable();
            $table->string('port')->nullable();
            $table->text('content')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
