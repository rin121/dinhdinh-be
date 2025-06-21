<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SettingsApiController extends Controller
{
    /**
     * Get setting by key
     */
    public function getByKey(string $key): JsonResponse
    {
        try {
            $setting = Setting::where('key', $key)->first();

            if (!$setting) {
                return response()->json([
                    'success' => false,
                    'message' => "Setting với key '{$key}' không tồn tại",
                    'data' => null
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lấy setting thành công',
                'data' => [
                    'id' => $setting->id,
                    'key' => $setting->key,
                    'value' => $setting->value,
                    'created_at' => $setting->created_at,
                    'updated_at' => $setting->updated_at
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi lấy setting',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get menu settings specifically
     */
    public function getMenu(): JsonResponse
    {
        return $this->getByKey('menu');
    }

    /**
     * Get all settings
     */
    public function index(): JsonResponse
    {
        try {
            $settings = Setting::orderBy('key')->get();

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách settings thành công',
                'data' => $settings->map(function ($setting) {
                    return [
                        'id' => $setting->id,
                        'key' => $setting->key,
                        'value' => $setting->value,
                        'created_at' => $setting->created_at,
                        'updated_at' => $setting->updated_at
                    ];
                }),
                'total' => $settings->count()
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi lấy danh sách settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get multiple settings by keys
     */
    public function getByKeys(Request $request): JsonResponse
    {
        try {
            $keys = $request->input('keys', []);
            
            if (empty($keys)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vui lòng cung cấp danh sách keys',
                    'data' => []
                ], 400);
            }

            $settings = Setting::whereIn('key', $keys)->get();

            $result = [];
            foreach ($keys as $key) {
                $setting = $settings->firstWhere('key', $key);
                $result[$key] = $setting ? $setting->value : null;
            }

            return response()->json([
                'success' => true,
                'message' => 'Lấy settings thành công',
                'data' => $result
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi lấy settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create or update setting
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'key' => 'required|string|max:255',
                'value' => 'nullable'
            ]);

            $setting = Setting::updateOrCreate(
                ['key' => $request->key],
                ['value' => $request->value]
            );

            return response()->json([
                'success' => true,
                'message' => 'Setting đã được lưu thành công',
                'data' => [
                    'id' => $setting->id,
                    'key' => $setting->key,
                    'value' => $setting->value,
                    'created_at' => $setting->created_at,
                    'updated_at' => $setting->updated_at
                ]
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi lưu setting',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 