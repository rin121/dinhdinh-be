<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductImage;

class ProductImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tạo test data cho product ID 9 (có files ảnh thực tế)
        ProductImage::create([
            'product_id' => 9,
            'filename' => '1750648775_6858c7c7c9cc2.jpg',
            'path' => 'products/9/1750648775_6858c7c7c9cc2.jpg',
            'url' => '',
            'alt_text' => 'Bánh kem đẹp 1',
            'size' => 330615,
            'mime_type' => 'image/jpeg',
            'width' => 800,
            'height' => 600,
            'is_primary' => true,
            'sort_order' => 0,
        ]);

        ProductImage::create([
            'product_id' => 9,
            'filename' => '1750648775_6858c7c7ce952.jpg',
            'path' => 'products/9/1750648775_6858c7c7ce952.jpg',
            'url' => '',
            'alt_text' => 'Bánh kem đẹp 2',
            'size' => 1868895,
            'mime_type' => 'image/jpeg',
            'width' => 1200,
            'height' => 900,
            'is_primary' => false,
            'sort_order' => 1,
        ]);

        ProductImage::create([
            'product_id' => 9,
            'filename' => '1750648775_6858c7c7cfbe3.jpg',
            'path' => 'products/9/1750648775_6858c7c7cfbe3.jpg',
            'url' => '',
            'alt_text' => 'Bánh kem đẹp 3',
            'size' => 911445,
            'mime_type' => 'image/jpeg',
            'width' => 1000,
            'height' => 800,
            'is_primary' => false,
            'sort_order' => 2,
        ]);
    }
} 