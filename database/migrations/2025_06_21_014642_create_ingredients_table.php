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
        Schema::create('ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('name'); // Tên nguyên liệu: Bột mì, Trứng gà tươi, etc.
            $table->text('description')->nullable(); // Mô tả chi tiết nguyên liệu
            $table->string('type')->nullable(); // main, flavor, decoration, etc.
            $table->boolean('is_main')->default(false); // Nguyên liệu chính hay phụ
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            // Indexes
            $table->index('product_id');
            $table->index('type');
            $table->index('is_main');
            $table->index('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingredients');
    }
};
