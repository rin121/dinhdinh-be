<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductApiController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'details', 'ingredients', 'allergens', 'images', 'primaryImage']);

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by category type
        if ($request->filled('category_type')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('id', $request->category_type);
            });
        }

        // Filter by badge
        if ($request->filled('badge')) {
            $query->where('badge', $request->badge);
        }

        // Filter active products
        if ($request->boolean('active_only', true)) {
            $query->active();
        }

        // Search by name or description
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'sort_order');
        $sortOrder = $request->get('sort_order', 'asc');

        if ($sortBy === 'price') {
            // Sort by minimum price
            $query->leftJoin('product_details', 'products.id', '=', 'product_details.product_id')
                ->groupBy('products.id')
                ->orderBy(DB::raw('MIN(product_details.price)'), $sortOrder);
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination
        $perPage = min($request->get('per_page', 12), 50);
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'has_more' => $products->hasMorePages(),
            ],
        ]);
    }

    /**
     * Display the specified product.
     */
    public function show(string $slug): JsonResponse
    {
        $product = Product::with(['category', 'details', 'ingredients', 'allergens', 'images', 'primaryImage'])
            ->where('slug', $slug)
            ->active()
            ->first();

        if (! $product) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm không tồn tại hoặc đã bị ẩn',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    /**
     * Get products by category.
     */
    public function byCategory(string $categoryType): JsonResponse
    {
        $category = Category::where('type', $categoryType)->active()->first();

        if (! $category) {
            return response()->json([
                'success' => false,
                'message' => 'Danh mục không tồn tại',
            ], 404);
        }

        $products = Product::with(['category', 'details', 'ingredients', 'allergens', 'images', 'primaryImage'])
            ->where('category_id', $category->id)
            ->active()
            ->ordered()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
            'category' => $category,
        ]);
    }

    /**
     * Get featured products.
     */
    public function featured(): JsonResponse
    {
        $products = Product::with(['category', 'details', 'ingredients', 'allergens', 'images', 'primaryImage'])
            ->active()
            ->whereIn('badge', ['hot', 'bestseller', 'trending'])
            ->ordered()
            ->limit(6)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Get products with specific badge.
     */
    public function byBadge(string $badge): JsonResponse
    {
        $products = Product::with(['category', 'details', 'ingredients', 'allergens', 'images', 'primaryImage'])
            ->active()
            ->withBadge($badge)
            ->ordered()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
            'badge' => $badge,
        ]);
    }

    /**
     * Get available badges.
     */
    public function badges(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Product::getBadges(),
        ]);
    }

    /**
     * Search products.
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q', '');

        if (empty($query)) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng nhập từ khóa tìm kiếm',
            ], 400);
        }

        $products = Product::with(['category', 'details', 'images', 'primaryImage'])
            ->active()
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%")
                    ->orWhere('long_description', 'like', "%{$query}%");
            })
            ->ordered()
            ->limit(20)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
            'query' => $query,
            'count' => $products->count(),
        ]);
    }
}
