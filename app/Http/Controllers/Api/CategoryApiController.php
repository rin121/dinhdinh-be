<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CategoryApiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Category::query();

            // Filter by type
            if ($request->has('type') && $request->type !== 'all') {
                $query->byType($request->type);
            }

            // Search
            if ($request->has('search') && $request->search) {
                $query->where('name', 'like', '%'.$request->search.'%');
            }

            // Filter by status
            if ($request->has('status')) {
                if ($request->status === 'active') {
                    $query->active();
                } elseif ($request->status === 'inactive') {
                    $query->where('is_active', false);
                }
            }

            // Pagination
            $perPage = $request->get('per_page', 15);
            $categories = $query->ordered()->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách danh mục thành công',
                'data' => $categories->items(),
                'pagination' => [
                    'current_page' => $categories->currentPage(),
                    'last_page' => $categories->lastPage(),
                    'per_page' => $categories->perPage(),
                    'total' => $categories->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi lấy danh sách danh mục',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get categories by type for frontend
     */
    public function getByType(Request $request): JsonResponse
    {
        try {
            $type = $request->get('type', 'product');
            $categories = Category::getActiveByType($type);

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh mục theo loại thành công',
                'data' => $categories,
                'total' => $categories->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi lấy danh mục',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all active categories
     */
    public function active(): JsonResponse
    {
        try {
            $categories = Category::active()->ordered()->get();

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh mục hoạt động thành công',
                'data' => $categories,
                'total' => $categories->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi lấy danh mục',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'icon' => 'nullable|string|max:10',
                'type' => 'required|string|in:'.implode(',', array_keys(Category::getTypes())),
                'description' => 'nullable|string|max:1000',
                'is_active' => 'boolean',
                'sort_order' => 'integer|min:0',
            ]);

            $category = Category::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Danh mục đã được tạo thành công',
                'data' => $category,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi tạo danh mục',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Lấy thông tin danh mục thành công',
                'data' => $category,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi lấy thông tin danh mục',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'icon' => 'nullable|string|max:10',
                'type' => 'required|string|in:'.implode(',', array_keys(Category::getTypes())),
                'description' => 'nullable|string|max:1000',
                'is_active' => 'boolean',
                'sort_order' => 'integer|min:0',
            ]);

            $category->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Danh mục đã được cập nhật thành công',
                'data' => $category->fresh(),
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi cập nhật danh mục',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category): JsonResponse
    {
        try {
            $category->delete();

            return response()->json([
                'success' => true,
                'message' => 'Danh mục đã được xóa thành công',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi xóa danh mục',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get category types
     */
    public function types(): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách loại danh mục thành công',
                'data' => Category::getTypes(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi lấy loại danh mục',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
