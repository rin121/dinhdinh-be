<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Bánh sinh nhật',
                'icon' => '🎂',
                'type' => 'birthday',
                'description' => 'Bánh sinh nhật đặc biệt cho ngày vui',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Bánh cưới',
                'icon' => '💒',
                'type' => 'wedding',
                'description' => 'Bánh cưới sang trọng cho ngày trọng đại',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Bánh chocolate',
                'icon' => '🍫',
                'type' => 'chocolate',
                'description' => 'Bánh chocolate thơm ngon đậm đà',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Bánh trái cây',
                'icon' => '🍓',
                'type' => 'fruit',
                'description' => 'Bánh trái cây tươi mát, bổ dưỡng',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Bánh đặc biệt',
                'icon' => '⭐',
                'type' => 'special',
                'description' => 'Bánh đặc biệt theo yêu cầu',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Bánh cupcake',
                'icon' => '🧁',
                'type' => 'cupcake',
                'description' => 'Bánh cupcake nhỏ xinh đáng yêu',
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'name' => 'Bánh kem tươi',
                'icon' => '🍰',
                'type' => 'cream',
                'description' => 'Bánh kem tươi mềm mịn',
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'name' => 'Bánh theo mùa',
                'icon' => '🌸',
                'type' => 'seasonal',
                'description' => 'Bánh theo mùa với hương vị đặc trưng',
                'is_active' => true,
                'sort_order' => 8,
            ],
            [
                'name' => 'Bánh khuyến mãi',
                'icon' => '🎉',
                'type' => 'promotion',
                'description' => 'Bánh khuyến mãi giá ưu đãi',
                'is_active' => true,
                'sort_order' => 9,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
