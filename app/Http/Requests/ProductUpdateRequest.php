<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class ProductUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $productId = $this->route('product');

        return [
            // Product basic info
            'name' => 'required|string|max:255',
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'slug')->ignore($productId)
            ],
            'description' => 'required|string|max:500',
            'long_description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'badge' => 'nullable|string|max:50',
            'category_id' => 'required|exists:categories,id',
            'gallery' => 'nullable|array',
            'gallery.*' => 'string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',

            // Product details (sizes)
            'details' => 'required|array|min:1',
            'details.*.id' => 'nullable|exists:product_details,id',
            'details.*.size' => 'required|string|max:100',
            'details.*.price' => 'required|numeric|min:0',
            'details.*.price_display' => 'nullable|string|max:50',
            'details.*.servings' => 'nullable|string|max:100',
            'details.*.description' => 'nullable|string|max:500',
            'details.*.is_available' => 'boolean',
            'details.*.sort_order' => 'integer|min:0',

            // Ingredients
            'ingredients' => 'nullable|array',
            'ingredients.*.id' => 'nullable|exists:ingredients,id',
            'ingredients.*.name' => 'required|string|max:255',
            'ingredients.*.description' => 'nullable|string|max:500',
            'ingredients.*.type' => 'nullable|string|max:50',
            'ingredients.*.is_main' => 'boolean',
            'ingredients.*.sort_order' => 'integer|min:0',

            // Allergens
            'allergens' => 'nullable|array',
            'allergens.*.id' => 'nullable|exists:allergens,id',
            'allergens.*.name' => 'required|string|max:255',
            'allergens.*.description' => 'nullable|string|max:500',
            'allergens.*.severity' => 'nullable|string|in:mild,moderate,severe',
            'allergens.*.icon' => 'nullable|string|max:10',
            'allergens.*.sort_order' => 'integer|min:0',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Tên sản phẩm là bắt buộc',
            'slug.required' => 'Slug là bắt buộc',
            'slug.unique' => 'Slug đã tồn tại',
            'description.required' => 'Mô tả ngắn là bắt buộc',
            'category_id.required' => 'Danh mục là bắt buộc',
            'category_id.exists' => 'Danh mục không tồn tại',
            'details.required' => 'Thông tin size/giá là bắt buộc',
            'details.min' => 'Cần ít nhất 1 thông tin size/giá',
            'details.*.size.required' => 'Size là bắt buộc',
            'details.*.price.required' => 'Giá là bắt buộc',
            'details.*.price.numeric' => 'Giá phải là số',
            'details.*.price.min' => 'Giá phải lớn hơn 0',
            'ingredients.*.name.required' => 'Tên nguyên liệu là bắt buộc',
            'allergens.*.name.required' => 'Tên chất gây dị ứng là bắt buộc',
            'allergens.*.severity.in' => 'Mức độ dị ứng không hợp lệ',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Auto-generate slug if not provided
        if (!$this->has('slug') && $this->has('name')) {
            $this->merge([
                'slug' => Str::slug($this->name)
            ]);
        }

        // Set default values
        $this->merge([
            'is_active' => $this->boolean('is_active', true),
            'sort_order' => $this->integer('sort_order', 0),
        ]);

        // Process details
        if ($this->has('details')) {
            $details = collect($this->details)->map(function ($detail, $index) {
                return array_merge($detail, [
                    'is_available' => $detail['is_available'] ?? true,
                    'sort_order' => $detail['sort_order'] ?? $index,
                ]);
            })->toArray();

            $this->merge(['details' => $details]);
        }

        // Process ingredients
        if ($this->has('ingredients')) {
            $ingredients = collect($this->ingredients)->map(function ($ingredient, $index) {
                return array_merge($ingredient, [
                    'is_main' => $ingredient['is_main'] ?? false,
                    'sort_order' => $ingredient['sort_order'] ?? $index,
                ]);
            })->toArray();

            $this->merge(['ingredients' => $ingredients]);
        }

        // Process allergens
        if ($this->has('allergens')) {
            $allergens = collect($this->allergens)->map(function ($allergen, $index) {
                return array_merge($allergen, [
                    'sort_order' => $allergen['sort_order'] ?? $index,
                ]);
            })->toArray();

            $this->merge(['allergens' => $allergens]);
        }
    }
}
