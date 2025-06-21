<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductDetail;
use App\Models\Ingredient;
use App\Models\Allergen;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'slug' => 'banh-kem-vanilla',
                'name' => 'Bánh Kem Vanilla',
                'description' => 'Hương vị vanilla thơm ngọt, mềm mịn.',
                'long_description' => 'Bánh kem vanilla là sự lựa chọn cổ điển nhưng không bao giờ lỗi thời. Với lớp bánh bông lan mềm mịn, hòa quyện cùng lớp kem tươi vanilla ngọt ngào, chiếc bánh này phù hợp với mọi dịp, từ sinh nhật ấm cúng đến những buổi tiệc trà thanh lịch.',
                'image' => '🍰',
                'badge' => 'bestseller',
                'category' => 'birthday',
                'gallery' => ['🍰', '🎂', '🧁'],
                'sizes' => [
                    ['size' => 'S (6-inch)', 'price' => 250000, 'price_display' => '250.000đ', 'servings' => 'Dành cho 4-6 người ăn'],
                    ['size' => 'M (8-inch)', 'price' => 350000, 'price_display' => '350.000đ', 'servings' => 'Dành cho 8-10 người ăn'],
                    ['size' => 'L (10-inch)', 'price' => 450000, 'price_display' => '450.000đ', 'servings' => 'Dành cho 12-15 người ăn']
                ],
                'ingredients' => [
                    ['name' => 'Bột mì', 'type' => 'main', 'is_main' => true],
                    ['name' => 'Trứng gà tươi', 'type' => 'main', 'is_main' => true],
                    ['name' => 'Đường tinh luyện', 'type' => 'main', 'is_main' => true],
                    ['name' => 'Sữa tươi không đường', 'type' => 'main', 'is_main' => true],
                    ['name' => 'Kem tươi whipping', 'type' => 'cream', 'is_main' => false],
                    ['name' => 'Tinh chất Vanilla Madagascar', 'type' => 'flavor', 'is_main' => false]
                ],
                'allergens' => [
                    ['name' => 'Trứng', 'severity' => 'moderate'],
                    ['name' => 'Sữa', 'severity' => 'moderate'],
                    ['name' => 'Gluten', 'severity' => 'moderate']
                ]
            ],
            [
                'slug' => 'banh-kem-chocolate',
                'name' => 'Bánh Kem Chocolate',
                'description' => 'Chocolate đậm đà, ngọt ngào.',
                'long_description' => 'Dành cho các tín đồ chocolate, chiếc bánh này là một bản giao hưởng của vị đắng nhẹ từ chocolate đen nguyên chất và vị ngọt ngào của lớp kem bơ chocolate. Mỗi miếng bánh tan chảy trong miệng, để lại dư vị khó quên.',
                'image' => '🍫',
                'badge' => 'new',
                'category' => 'chocolate',
                'gallery' => ['🍫', '🍩', '🍪'],
                'sizes' => [
                    ['size' => 'S (6-inch)', 'price' => 299000, 'price_display' => '299.000đ', 'servings' => 'Dành cho 4-6 người ăn'],
                    ['size' => 'M (8-inch)', 'price' => 399000, 'price_display' => '399.000đ', 'servings' => 'Dành cho 8-10 người ăn'],
                    ['size' => 'L (10-inch)', 'price' => 499000, 'price_display' => '499.000đ', 'servings' => 'Dành cho 12-15 người ăn']
                ],
                'ingredients' => [
                    ['name' => 'Bột mì', 'type' => 'main', 'is_main' => true],
                    ['name' => 'Trứng', 'type' => 'main', 'is_main' => true],
                    ['name' => 'Đường', 'type' => 'main', 'is_main' => true],
                    ['name' => 'Sữa tươi', 'type' => 'main', 'is_main' => true],
                    ['name' => 'Kem tươi', 'type' => 'cream', 'is_main' => false],
                    ['name' => 'Bột Cacao Barry', 'type' => 'chocolate', 'is_main' => false],
                    ['name' => 'Chocolate đen 70%', 'type' => 'chocolate', 'is_main' => false]
                ],
                'allergens' => [
                    ['name' => 'Trứng', 'severity' => 'moderate'],
                    ['name' => 'Sữa', 'severity' => 'moderate'],
                    ['name' => 'Gluten', 'severity' => 'moderate']
                ]
            ],
            [
                'slug' => 'banh-kem-trai-cay',
                'name' => 'Bánh Kem Trái Cây',
                'description' => 'Trái cây tươi, nhiều vitamin.',
                'long_description' => 'Một lựa chọn tươi mát và tốt cho sức khỏe. Bánh được phủ đầy các loại trái cây tươi theo mùa như dâu tây, kiwi, và xoài trên lớp kem sữa chua thanh mát. Đây là món tráng miệng hoàn hảo cho mùa hè.',
                'image' => '🍓',
                'badge' => 'hot',
                'category' => 'fruit',
                'gallery' => ['🍓', '🥝', '🥭'],
                'sizes' => [
                    ['size' => 'S (6-inch)', 'price' => 350000, 'price_display' => '350.000đ', 'servings' => 'Dành cho 4-6 người ăn'],
                    ['size' => 'M (8-inch)', 'price' => 450000, 'price_display' => '450.000đ', 'servings' => 'Dành cho 8-10 người ăn'],
                    ['size' => 'L (10-inch)', 'price' => 550000, 'price_display' => '550.000đ', 'servings' => 'Dành cho 12-15 người ăn']
                ],
                'ingredients' => [
                    ['name' => 'Bột mì', 'type' => 'main', 'is_main' => true],
                    ['name' => 'Trứng', 'type' => 'main', 'is_main' => true],
                    ['name' => 'Đường', 'type' => 'main', 'is_main' => true],
                    ['name' => 'Sữa chua Hy Lạp', 'type' => 'main', 'is_main' => true],
                    ['name' => 'Kem tươi', 'type' => 'cream', 'is_main' => false],
                    ['name' => 'Dâu tây', 'type' => 'fruit', 'is_main' => false],
                    ['name' => 'Kiwi', 'type' => 'fruit', 'is_main' => false],
                    ['name' => 'Xoài', 'type' => 'fruit', 'is_main' => false]
                ],
                'allergens' => [
                    ['name' => 'Trứng', 'severity' => 'moderate'],
                    ['name' => 'Sữa', 'severity' => 'moderate'],
                    ['name' => 'Gluten', 'severity' => 'moderate']
                ]
            ]
        ];

        foreach ($products as $productData) {
            // Tìm category
            $category = Category::where('type', $productData['category'])->first();
            if (!$category) {
                continue;
            }

            // Tạo product
            $product = Product::create([
                'slug' => $productData['slug'],
                'name' => $productData['name'],
                'description' => $productData['description'],
                'long_description' => $productData['long_description'],
                'image' => $productData['image'],
                'badge' => $productData['badge'],
                'category_id' => $category->id,
                'gallery' => $productData['gallery'],
                'is_active' => true,
                'sort_order' => 0,
            ]);

            // Tạo product details (sizes)
            foreach ($productData['sizes'] as $index => $sizeData) {
                ProductDetail::create([
                    'product_id' => $product->id,
                    'size' => $sizeData['size'],
                    'price' => $sizeData['price'],
                    'price_display' => $sizeData['price_display'],
                    'servings' => $sizeData['servings'],
                    'is_available' => true,
                    'sort_order' => $index,
                ]);
            }

            // Tạo ingredients
            foreach ($productData['ingredients'] as $index => $ingredientData) {
                Ingredient::create([
                    'product_id' => $product->id,
                    'name' => $ingredientData['name'],
                    'type' => $ingredientData['type'],
                    'is_main' => $ingredientData['is_main'],
                    'sort_order' => $index,
                ]);
            }

            // Tạo allergens
            foreach ($productData['allergens'] as $index => $allergenData) {
                Allergen::create([
                    'product_id' => $product->id,
                    'name' => $allergenData['name'],
                    'severity' => $allergenData['severity'],
                    'sort_order' => $index,
                ]);
            }
        }
    }
}
