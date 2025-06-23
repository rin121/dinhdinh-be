<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Models\Allergen;
use App\Models\Category;
use App\Models\Ingredient;
use App\Models\Product;
use App\Models\ProductDetail;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'details', 'primaryImage']);

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

            // Debug: Log request data
            // Removed logging to avoid import conflicts

            // Create product
            $product = Product::create($request->only([
                'name', 'slug', 'description', 'long_description',
                'image', 'badge', 'category_id', 'gallery',
                'is_active', 'sort_order',
            ]));

            // Handle image uploads
            if ($request->hasFile('images')) {
                $this->handleImageUploads($product, $request->file('images'));
            }

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
                'error' => 'Có lỗi xảy ra khi tạo sản phẩm: '.$e->getMessage(),
            ])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load(['category', 'details', 'ingredients', 'allergens', 'images']);

        return Inertia::render('products/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $product->load(['category', 'details', 'ingredients', 'allergens', 'images']);

        // Clear all session data that might contain old validation errors
        session()->forget(['errors', '_flash', 'laravel_session']);

        // Clear validation error bag specifically
        $errors = session()->get('errors');
        if ($errors) {
            session()->remove('errors');
        }

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

            // Debug: Log request data for images
            // Removed logging to avoid import conflicts

            // Update product
            $product->update($request->only([
                'name', 'slug', 'description', 'long_description',
                'image', 'badge', 'category_id', 'gallery',
                'is_active', 'sort_order',
            ]));

            // Handle image updates
            if ($request->has('images_data')) {
                $this->syncProductImages($product, $request->images_data);
            } elseif ($request->hasFile('images')) {
                $this->handleImageUploads($product, $request->file('images'));
            }

            // Update product details with safe defaults
            $details = $request->details ?? [];
            $this->syncProductDetails($product, $details);

            // Update ingredients with safe defaults
            $ingredients = $request->ingredients ?? [];
            if (! empty($ingredients)) {
                $this->syncIngredients($product, $ingredients);
            } else {
                $product->ingredients()->delete();
            }

            // Update allergens with safe defaults
            $allergens = $request->allergens ?? [];
            if (! empty($allergens)) {
                $this->syncAllergens($product, $allergens);
            } else {
                $product->allergens()->delete();
            }

            DB::commit();

            return redirect()->route('products.index')
                ->with('success', 'Sản phẩm đã được cập nhật thành công!');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors([
                'error' => 'Có lỗi xảy ra khi cập nhật sản phẩm: '.$e->getMessage(),
            ])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {
            DB::beginTransaction();

            // Delete all related images (ProductImage model will handle file deletion via boot method)
            $product->images()->delete();

            // Delete product directory if empty
            $productPath = 'public/products/'.$product->id;
            if (Storage::exists($productPath) && count(Storage::files($productPath)) === 0) {
                Storage::deleteDirectory($productPath);
            }

            // Delete the product (this will cascade delete related data)
            $product->delete();

            DB::commit();

            return redirect()->route('products.index')
                ->with('success', 'Sản phẩm đã được xóa thành công!');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors([
                'error' => 'Có lỗi xảy ra khi xóa sản phẩm: '.$e->getMessage(),
            ]);
        }
    }

    /**
     * Sync product details.
     */
    private function syncProductDetails(Product $product, array $details)
    {
        $existingIds = collect($details)
            ->filter(fn ($detail) => isset($detail['id']))
            ->pluck('id')
            ->toArray();

        // Delete removed details
        $product->details()->whereNotIn('id', $existingIds)->delete();

        // Update or create details
        foreach ($details as $index => $detailData) {
            // Ensure sort_order has a default value
            if (! isset($detailData['sort_order'])) {
                $detailData['sort_order'] = $index;
            }

            if (isset($detailData['id'])) {
                // Update existing - exclude timestamps and id
                $product->details()->where('id', $detailData['id'])
                    ->update(collect($detailData)->except(['id', 'created_at', 'updated_at'])->toArray());
            } else {
                // Create new - exclude timestamps
                $product->details()->create(collect($detailData)->except(['created_at', 'updated_at'])->toArray());
            }
        }
    }

    /**
     * Sync ingredients.
     */
    private function syncIngredients(Product $product, array $ingredients)
    {
        $existingIds = collect($ingredients)
            ->filter(fn ($ingredient) => isset($ingredient['id']))
            ->pluck('id')
            ->toArray();

        // Delete removed ingredients
        $product->ingredients()->whereNotIn('id', $existingIds)->delete();

        // Update or create ingredients
        foreach ($ingredients as $index => $ingredientData) {
            // Ensure sort_order has a default value
            if (! isset($ingredientData['sort_order'])) {
                $ingredientData['sort_order'] = $index;
            }

            if (isset($ingredientData['id'])) {
                // Update existing - exclude timestamps and id
                $product->ingredients()->where('id', $ingredientData['id'])
                    ->update(collect($ingredientData)->except(['id', 'created_at', 'updated_at'])->toArray());
            } else {
                // Create new - exclude timestamps
                $product->ingredients()->create(collect($ingredientData)->except(['created_at', 'updated_at'])->toArray());
            }
        }
    }

    /**
     * Sync allergens.
     */
    private function syncAllergens(Product $product, array $allergens)
    {
        $existingIds = collect($allergens)
            ->filter(fn ($allergen) => isset($allergen['id']))
            ->pluck('id')
            ->toArray();

        // Delete removed allergens
        $product->allergens()->whereNotIn('id', $existingIds)->delete();

        // Update or create allergens
        foreach ($allergens as $index => $allergenData) {
            // Ensure sort_order has a default value
            if (! isset($allergenData['sort_order'])) {
                $allergenData['sort_order'] = $index;
            }

            if (isset($allergenData['id'])) {
                // Update existing - exclude timestamps and id
                $product->allergens()->where('id', $allergenData['id'])
                    ->update(collect($allergenData)->except(['id', 'created_at', 'updated_at'])->toArray());
            } else {
                // Create new - exclude timestamps
                $product->allergens()->create(collect($allergenData)->except(['created_at', 'updated_at'])->toArray());
            }
        }
    }

    /**
     * Toggle product status.
     */
    public function toggleStatus(Product $product)
    {
        $product->update(['is_active' => ! $product->is_active]);

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
            $newProduct->name = $originalProduct->name.' (Copy)';
            $newProduct->slug = $originalProduct->slug.'-copy-'.time();
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
                'error' => 'Có lỗi xảy ra khi sao chép sản phẩm: '.$e->getMessage(),
            ]);
        }
    }

    /**
     * Handle image uploads for a product.
     */
    private function handleImageUploads(Product $product, array $images, array $removedImages = [])
    {

        // Remove deleted images
        if (! empty($removedImages)) {
            $product->images()->whereIn('id', $removedImages)->delete();
        }

        $sortOrder = $product->images()->max('sort_order') ?? 0;
        $isPrimarySet = $product->images()->where('is_primary', true)->exists();

        foreach ($images as $index => $image) {

            if ($image instanceof UploadedFile) {
                $sortOrder++;
                $isPrimary = ! $isPrimarySet && $index === 0; // First image is primary if no primary exists

                try {
                    $result = $this->uploadProductImage($product, $image, $isPrimary, $sortOrder);

                    if ($isPrimary) {
                        $isPrimarySet = true;
                    }
                } catch (\Exception $e) {
                    throw $e;
                }
            }
        }
    }

    /**
     * Upload a single product image.
     */
    private function uploadProductImage(Product $product, UploadedFile $file, bool $isPrimary = false, int $sortOrder = 0): ProductImage
    {
        // Validate file
        $this->validateImageFile($file);

        // Create unique filename
        $extension = $file->getClientOriginalExtension();
        $filename = time().'_'.uniqid().'.'.$extension;
        $path = "products/{$product->id}/".$filename;

        // Store original file using public disk
        $file->storeAs('products/'.$product->id, $filename, 'public');

        // Get image dimensions
        $imageInfo = getimagesize($file->getPathname());
        $width = $imageInfo[0] ?? null;
        $height = $imageInfo[1] ?? null;

        // Create database record
        return $product->images()->create([
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'url' => 'products/'.$product->id.'/'.$filename,
            'alt_text' => $product->name,
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'width' => $width,
            'height' => $height,
            'is_primary' => $isPrimary,
            'sort_order' => $sortOrder,
        ]);
    }

    /**
     * Validate uploaded image file.
     */
    private function validateImageFile(UploadedFile $file): void
    {
        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        $maxSize = 5 * 1024 * 1024; // 5MB

        if (! in_array($file->getMimeType(), $allowedMimes)) {
            throw new \InvalidArgumentException('Chỉ chấp nhận file ảnh định dạng: JPEG, PNG, WebP, GIF');
        }

        if ($file->getSize() > $maxSize) {
            throw new \InvalidArgumentException('Kích thước file không được vượt quá 5MB');
        }
    }

    /**
     * Update product images.
     */
    private function syncProductImages(Product $product, array $imageData = []): void
    {
        // Handle removed images
        if (isset($imageData['removed_images']) && is_array($imageData['removed_images'])) {
            $removedIds = array_filter($imageData['removed_images'], 'is_numeric');
            if (! empty($removedIds)) {
                $product->images()->whereIn('id', $removedIds)->delete();
            }
        }

        // Handle new primary image
        if (isset($imageData['new_primary_id']) && is_numeric($imageData['new_primary_id'])) {
            // Reset all images to non-primary
            $product->images()->update(['is_primary' => false]);

            // Set the new primary image
            $product->images()
                ->where('id', $imageData['new_primary_id'])
                ->update(['is_primary' => true]);
        }

        // Handle new uploads
        if (isset($imageData['new_images'])) {
            $this->handleImageUploads($product, $imageData['new_images']);
        }

        // Ensure at least one primary image
        $this->ensurePrimaryImage($product);
    }

    /**
     * Ensure product has a primary image.
     */
    private function ensurePrimaryImage(Product $product): void
    {
        $hasPrimary = $product->images()->where('is_primary', true)->exists();

        if (! $hasPrimary) {
            $firstImage = $product->images()->orderBy('sort_order')->first();
            if ($firstImage) {
                $firstImage->update(['is_primary' => true]);
            }
        }
    }
}
