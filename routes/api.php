<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SettingsApiController;
use App\Http\Controllers\Api\CategoryApiController;
use App\Http\Controllers\Api\ProductApiController;

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