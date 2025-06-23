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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique(); // Mã đơn hàng

            // Thông tin khách hàng
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();
            $table->text('customer_address');
            $table->text('customer_notes')->nullable(); // Ghi chú từ khách hàng

            // Thông tin đơn hàng
            $table->enum('status', ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'])
                ->default('pending'); // Trạng thái đơn hàng
            $table->decimal('subtotal', 15, 2); // Tạm tính
            $table->decimal('shipping_fee', 15, 2)->default(0); // Phí vận chuyển
            $table->decimal('total_amount', 15, 2); // Tổng tiền

            // Thông tin giao hàng
            $table->datetime('delivery_date')->nullable(); // Ngày giao hàng mong muốn
            $table->string('delivery_time')->nullable(); // Khung giờ giao hàng
            $table->enum('payment_method', ['cash', 'transfer', 'card'])->default('cash'); // Phương thức thanh toán
            $table->enum('payment_status', ['pending', 'paid', 'failed'])->default('pending'); // Trạng thái thanh toán

            // Metadata
            $table->json('order_items'); // Lưu chi tiết sản phẩm dạng JSON
            $table->text('admin_notes')->nullable(); // Ghi chú của admin

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('order_number');
            $table->index('customer_phone');
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
