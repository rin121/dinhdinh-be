<?php

use App\Http\Controllers\Api\CategoryApiController;
use App\Http\Controllers\Api\OrderApiController;
use App\Http\Controllers\Api\OrderRequestApiController;
use App\Http\Controllers\Api\ProductApiController;
use App\Http\Controllers\Api\SettingsApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Settings API Routes
Route::prefix('settings')->group(function () {
    // Get all settings
    Route::get('/', [SettingsApiController::class, 'index']);

    // Get menu specifically
    Route::get('/menu', [SettingsApiController::class, 'getMenu']);

    // Get setting by key
    Route::get('/{key}', [SettingsApiController::class, 'getByKey']);

    // Get multiple settings by keys (POST for complex data)
    Route::post('/bulk', [SettingsApiController::class, 'getByKeys']);

    // Create or update setting
    Route::post('/', [SettingsApiController::class, 'store']);
});

// Categories API Routes
Route::prefix('categories')->group(function () {
    // Get all categories
    Route::get('/', [CategoryApiController::class, 'index']);
    Route::get('/active', [CategoryApiController::class, 'active']);
});

// Products API Routes
Route::prefix('products')->group(function () {
    // Get all products with filtering and pagination
    Route::get('/', [ProductApiController::class, 'index']);

    // Get featured products
    Route::get('/featured', [ProductApiController::class, 'featured']);

    // Get products by badge
    Route::get('/badge/{badge}', [ProductApiController::class, 'byBadge']);

    // Get available badges
    Route::get('/badges', [ProductApiController::class, 'badges']);

    // Search products
    Route::get('/search', [ProductApiController::class, 'search']);

    // Get products by category type
    Route::get('/category/{categoryType}', [ProductApiController::class, 'byCategory']);

    // Get specific product by slug
    Route::get('/{slug}', [ProductApiController::class, 'show']);
});

// Orders API Routes
Route::prefix('orders')->group(function () {
    // Public routes (không cần auth)
    Route::post('/', [OrderApiController::class, 'store']); // Tạo đơn hàng

    // Protected routes (cần auth cho admin)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/', [OrderApiController::class, 'index']); // Danh sách đơn hàng
        Route::get('/statistics', [OrderApiController::class, 'statistics']); // Thống kê
        Route::get('/{order}', [OrderApiController::class, 'show']); // Chi tiết đơn hàng
        Route::put('/{order}', [OrderApiController::class, 'update']); // Cập nhật đơn hàng
        Route::patch('/{order}/cancel', [OrderApiController::class, 'cancel']); // Hủy đơn hàng
    });
});

// Order Requests API Routes
Route::prefix('order-requests')->group(function () {
    // Public routes (không cần auth)
    Route::post('/', [OrderRequestApiController::class, 'store']); // Gửi yêu cầu

    // Protected routes (cần auth cho admin)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/', [OrderRequestApiController::class, 'index']); // Danh sách yêu cầu
        Route::get('/statistics', [OrderRequestApiController::class, 'statistics']); // Thống kê
        Route::get('/{orderRequest}', [OrderRequestApiController::class, 'show']); // Chi tiết yêu cầu
        Route::put('/{orderRequest}', [OrderRequestApiController::class, 'update']); // Cập nhật yêu cầu
        Route::patch('/{orderRequest}/respond', [OrderRequestApiController::class, 'respond']); // Phản hồi yêu cầu
        Route::patch('/{orderRequest}/convert', [OrderRequestApiController::class, 'convertToOrder']); // Chuyển đổi thành đơn hàng
        Route::delete('/{orderRequest}', [OrderRequestApiController::class, 'destroy']); // Xóa yêu cầu
    });
});
