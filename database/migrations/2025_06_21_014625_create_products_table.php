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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->text('description');
            $table->longText('long_description')->nullable();
            $table->string('image')->nullable(); // emoji or image path
            $table->string('badge')->nullable(); // Bán chạy, Mới, Hot, etc.
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->json('gallery')->nullable(); // array of emojis/images
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            // Indexes
            $table->index('category_id');
            $table->index('is_active');
            $table->index('sort_order');
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
