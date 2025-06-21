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
        Schema::create('order_requests', function (Blueprint $table) {
            $table->id();
            
            // Thông tin khách hàng
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();
            $table->text('customer_address')->nullable();
            
            // Thông tin yêu cầu
            $table->text('message'); // Nội dung yêu cầu
            $table->enum('request_type', ['quote', 'custom_order', 'consultation', 'complaint', 'other'])
                  ->default('quote'); // Loại yêu cầu
            $table->enum('urgency', ['low', 'medium', 'high'])->default('medium'); // Mức độ ưu tiên
            
            // Thông tin sản phẩm quan tâm (nếu có)
            $table->json('interested_products')->nullable(); // Sản phẩm khách hàng quan tâm
            $table->decimal('estimated_budget', 15, 2)->nullable(); // Ngân sách dự kiến
            $table->datetime('preferred_contact_time')->nullable(); // Thời gian liên hệ mong muốn
            
            // Trạng thái xử lý
            $table->enum('status', ['new', 'contacted', 'quoted', 'converted', 'closed'])
                  ->default('new'); // Trạng thái xử lý
            $table->text('admin_response')->nullable(); // Phản hồi từ admin
            $table->datetime('responded_at')->nullable(); // Thời gian phản hồi
            $table->unsignedBigInteger('handled_by')->nullable(); // Admin xử lý
            
            // Tracking
            $table->string('source')->nullable(); // Nguồn (website, facebook, phone, etc.)
            $table->string('utm_source')->nullable(); // UTM tracking
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('customer_phone');
            $table->index('status');
            $table->index('request_type');
            $table->index('created_at');
            $table->index('handled_by');
            
            // Foreign key
            $table->foreign('handled_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_requests');
    }
}; 