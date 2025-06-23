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
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('filename'); // Tên file gốc
            $table->string('path'); // Đường dẫn lưu file
            $table->string('url'); // URL để truy cập file
            $table->string('alt_text')->nullable(); // Alt text cho SEO
            $table->integer('size')->nullable(); // Kích thước file (bytes)
            $table->string('mime_type')->nullable(); // Loại file (image/jpeg, image/png, etc.)
            $table->integer('width')->nullable(); // Chiều rộng ảnh
            $table->integer('height')->nullable(); // Chiều cao ảnh
            $table->boolean('is_primary')->default(false); // Ảnh chính
            $table->integer('sort_order')->default(0); // Thứ tự hiển thị
            $table->timestamps();

            // Indexes
            $table->index(['product_id', 'is_primary']);
            $table->index(['product_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};
