<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SettingsApiController;
use App\Http\Controllers\Api\CategoryApiController;

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