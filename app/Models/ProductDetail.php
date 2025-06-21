<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class ProductDetail extends Model
{
    protected $fillable = [
        'product_id',
        'size',
        'price',
        'price_display',
        'servings',
        'description',
        'is_available',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_available' => 'boolean',
        'sort_order' => 'integer',
    ];

    // Relationships
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // Scopes
    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('is_available', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order');
    }

    // Accessors
    public function getFormattedPriceAttribute(): string
    {
        return $this->price_display ?: number_format($this->price, 0, ',', '.') . 'đ';
    }

    public function getSizeDisplayAttribute(): string
    {
        $sizeMap = [
            'S' => 'Nhỏ',
            'M' => 'Vừa', 
            'L' => 'Lớn',
            'XL' => 'Rất lớn',
        ];

        foreach ($sizeMap as $key => $value) {
            if (str_contains($this->size, $key)) {
                return $value . ' (' . $this->size . ')';
            }
        }

        return $this->size;
    }

    // Static methods
    public static function getSizeOptions(): array
    {
        return [
            'S (6-inch)' => 'Nhỏ (6 inch)',
            'M (8-inch)' => 'Vừa (8 inch)',
            'L (10-inch)' => 'Lớn (10 inch)',
            'XL (12-inch)' => 'Rất lớn (12 inch)',
            '2 tầng (6/8-inch)' => '2 tầng (6/8 inch)',
            '3 tầng (6/8/10-inch)' => '3 tầng (6/8/10 inch)',
        ];
    }
}
