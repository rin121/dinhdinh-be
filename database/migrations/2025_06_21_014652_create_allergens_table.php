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
        Schema::create('allergens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('name'); // Tên chất gây dị ứng: Trứng, Sữa, Gluten, etc.
            $table->text('description')->nullable(); // Mô tả chi tiết
            $table->string('severity')->nullable(); // mild, moderate, severe
            $table->string('icon')->nullable(); // emoji hoặc icon
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            // Indexes
            $table->index('product_id');
            $table->index('name');
            $table->index('severity');
            $table->index('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('allergens');
    }
};
