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
        Schema::create('product_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('size'); // S (6-inch), M (8-inch), L (10-inch), etc.
            $table->decimal('price', 10, 2); // Giá tiền
            $table->string('price_display')->nullable(); // 250.000đ
            $table->string('servings')->nullable(); // Dành cho 4-6 người ăn
            $table->text('description')->nullable(); // Mô tả chi tiết cho size này
            $table->boolean('is_available')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            // Indexes
            $table->index('product_id');
            $table->index('is_available');
            $table->index('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_details');
    }
};
