<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Models\Product;
use App\Models\ProductDetail;
use App\Models\Ingredient;
use App\Models\Allergen;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'details']);

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort', 'sort_order');
        $sortOrder = $request->get('order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $products = $query->paginate(15)->withQueryString();

        return Inertia::render('products/Index', [
            'products' => $products,
            'categories' => Category::active()->ordered()->get(),
            'filters' => $request->only(['category_id', 'status', 'search', 'sort', 'order']),
            'badges' => Product::getBadges(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('products/Create', [
            'categories' => Category::active()->ordered()->get(),
            'badges' => Product::getBadges(),
            'ingredientTypes' => Ingredient::getTypes(),
            'allergenSeverities' => Allergen::getSeverities(),
            'commonAllergens' => Allergen::getCommonAllergens(),
            'sizeOptions' => ProductDetail::getSizeOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductStoreRequest $request)
    {
        try {
            DB::beginTransaction();

            // Create product
            $product = Product::create($request->only([
                'name', 'slug', 'description', 'long_description',
                'image', 'badge', 'category_id', 'gallery',
                'is_active', 'sort_order'
            ]));

            // Create product details
            foreach ($request->details as $detailData) {
                $product->details()->create($detailData);
            }

            // Create ingredients
            if ($request->has('ingredients')) {
                foreach ($request->ingredients as $ingredientData) {
                    $product->ingredients()->create($ingredientData);
                }
            }

            // Create allergens
            if ($request->has('allergens')) {
                foreach ($request->allergens as $allergenData) {
                    $product->allergens()->create($allergenData);
                }
            }

            DB::commit();

            return redirect()->route('products.index')
                ->with('success', 'Sản phẩm đã được tạo thành công!');

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'error' => 'Có lỗi xảy ra khi tạo sản phẩm: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load(['category', 'details', 'ingredients', 'allergens']);

        return Inertia::render('products/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $product->load(['category', 'details', 'ingredients', 'allergens']);

        return Inertia::render('products/Edit', [
            'product' => $product,
            'categories' => Category::active()->ordered()->get(),
            'badges' => Product::getBadges(),
            'ingredientTypes' => Ingredient::getTypes(),
            'allergenSeverities' => Allergen::getSeverities(),
            'commonAllergens' => Allergen::getCommonAllergens(),
            'sizeOptions' => ProductDetail::getSizeOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductUpdateRequest $request, Product $product)
    {
        try {
            DB::beginTransaction();

            // Update product
            $product->update($request->only([
                'name', 'slug', 'description', 'long_description',
                'image', 'badge', 'category_id', 'gallery',
                'is_active', 'sort_order'
            ]));

            // Update product details
            $this->syncProductDetails($product, $request->details);

            // Update ingredients
            if ($request->has('ingredients')) {
                $this->syncIngredients($product, $request->ingredients);
            } else {
                $product->ingredients()->delete();
            }

            // Update allergens
            if ($request->has('allergens')) {
                $this->syncAllergens($product, $request->allergens);
            } else {
                $product->allergens()->delete();
            }

            DB::commit();

            return redirect()->route('products.index')
                ->with('success', 'Sản phẩm đã được cập nhật thành công!');

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'error' => 'Có lỗi xảy ra khi cập nhật sản phẩm: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {
            $product->delete();

            return redirect()->route('products.index')
                ->with('success', 'Sản phẩm đã được xóa thành công!');

        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Có lỗi xảy ra khi xóa sản phẩm: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Sync product details.
     */
    private function syncProductDetails(Product $product, array $details)
    {
        $existingIds = collect($details)
            ->filter(fn($detail) => isset($detail['id']))
            ->pluck('id')
            ->toArray();

        // Delete removed details
        $product->details()->whereNotIn('id', $existingIds)->delete();

        // Update or create details
        foreach ($details as $detailData) {
            if (isset($detailData['id'])) {
                // Update existing
                $product->details()->where('id', $detailData['id'])
                    ->update(collect($detailData)->except('id')->toArray());
            } else {
                // Create new
                $product->details()->create($detailData);
            }
        }
    }

    /**
     * Sync ingredients.
     */
    private function syncIngredients(Product $product, array $ingredients)
    {
        $existingIds = collect($ingredients)
            ->filter(fn($ingredient) => isset($ingredient['id']))
            ->pluck('id')
            ->toArray();

        // Delete removed ingredients
        $product->ingredients()->whereNotIn('id', $existingIds)->delete();

        // Update or create ingredients
        foreach ($ingredients as $ingredientData) {
            if (isset($ingredientData['id'])) {
                // Update existing
                $product->ingredients()->where('id', $ingredientData['id'])
                    ->update(collect($ingredientData)->except('id')->toArray());
            } else {
                // Create new
                $product->ingredients()->create($ingredientData);
            }
        }
    }

    /**
     * Sync allergens.
     */
    private function syncAllergens(Product $product, array $allergens)
    {
        $existingIds = collect($allergens)
            ->filter(fn($allergen) => isset($allergen['id']))
            ->pluck('id')
            ->toArray();

        // Delete removed allergens
        $product->allergens()->whereNotIn('id', $existingIds)->delete();

        // Update or create allergens
        foreach ($allergens as $allergenData) {
            if (isset($allergenData['id'])) {
                // Update existing
                $product->allergens()->where('id', $allergenData['id'])
                    ->update(collect($allergenData)->except('id')->toArray());
            } else {
                // Create new
                $product->allergens()->create($allergenData);
            }
        }
    }

    /**
     * Toggle product status.
     */
    public function toggleStatus(Product $product)
    {
        $product->update(['is_active' => !$product->is_active]);

        $status = $product->is_active ? 'kích hoạt' : 'vô hiệu hóa';
        
        return back()->with('success', "Sản phẩm đã được {$status}!");
    }

    /**
     * Duplicate product.
     */
    public function duplicate(Product $product)
    {
        try {
            DB::beginTransaction();

            $originalProduct = $product->load(['details', 'ingredients', 'allergens']);

            // Create new product
            $newProduct = $originalProduct->replicate();
            $newProduct->name = $originalProduct->name . ' (Copy)';
            $newProduct->slug = $originalProduct->slug . '-copy-' . time();
            $newProduct->is_active = false;
            $newProduct->save();

            // Duplicate details
            foreach ($originalProduct->details as $detail) {
                $newDetail = $detail->replicate();
                $newDetail->product_id = $newProduct->id;
                $newDetail->save();
            }

            // Duplicate ingredients
            foreach ($originalProduct->ingredients as $ingredient) {
                $newIngredient = $ingredient->replicate();
                $newIngredient->product_id = $newProduct->id;
                $newIngredient->save();
            }

            // Duplicate allergens
            foreach ($originalProduct->allergens as $allergen) {
                $newAllergen = $allergen->replicate();
                $newAllergen->product_id = $newProduct->id;
                $newAllergen->save();
            }

            DB::commit();

            return redirect()->route('products.edit', $newProduct)
                ->with('success', 'Sản phẩm đã được sao chép thành công!');

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'error' => 'Có lỗi xảy ra khi sao chép sản phẩm: ' . $e->getMessage()
            ]);
        }
    }
}
