<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Ingredient extends Model
{
    protected $fillable = [
        'product_id',
        'name',
        'description',
        'type',
        'is_main',
        'sort_order',
    ];

    protected $casts = [
        'is_main' => 'boolean',
        'sort_order' => 'integer',
    ];

    // Relationships
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // Scopes
    public function scopeMain(Builder $query): Builder
    {
        return $query->where('is_main', true);
    }

    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    // Static methods
    public static function getTypes(): array
    {
        return [
            'main' => 'Nguyên liệu chính',
            'flavor' => 'Hương vị',
            'decoration' => 'Trang trí',
            'filling' => 'Nhân bánh',
            'topping' => 'Topping',
            'base' => 'Đế bánh',
            'cream' => 'Kem',
            'fruit' => 'Trái cây',
            'chocolate' => 'Chocolate',
            'nuts' => 'Hạt',
            'spice' => 'Gia vị',
            'other' => 'Khác',
        ];
    }

    public function getTypeDisplayAttribute(): string
    {
        return static::getTypes()[$this->type] ?? $this->type;
    }
}
