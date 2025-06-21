<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Product extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'description',
        'long_description',
        'image',
        'badge',
        'category_id',
        'gallery',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'gallery' => 'array',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    // Relationships
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(ProductDetail::class)->orderBy('sort_order');
    }

    public function ingredients(): HasMany
    {
        return $this->hasMany(Ingredient::class)->orderBy('sort_order');
    }

    public function allergens(): HasMany
    {
        return $this->hasMany(Allergen::class)->orderBy('sort_order');
    }

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory(Builder $query, int $categoryId): Builder
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    public function scopeWithBadge(Builder $query, string $badge): Builder
    {
        return $query->where('badge', $badge);
    }

    // Accessors
    public function getMinPriceAttribute(): ?float
    {
        return $this->details()->min('price');
    }

    public function getMaxPriceAttribute(): ?float
    {
        return $this->details()->max('price');
    }

    public function getPriceRangeAttribute(): string
    {
        $min = $this->min_price;
        $max = $this->max_price;
        
        if (!$min) return 'Liên hệ';
        if ($min == $max) return number_format($min, 0, ',', '.') . 'đ';
        
        return number_format($min, 0, ',', '.') . 'đ - ' . number_format($max, 0, ',', '.') . 'đ';
    }

    public function getMainIngredientsAttribute()
    {
        return $this->ingredients()->where('is_main', true)->get();
    }

    public function getAvailableSizesAttribute()
    {
        return $this->details()->where('is_available', true)->get();
    }

    // Static methods
    public static function getBadges(): array
    {
        return [
            'new' => 'Mới',
            'hot' => 'Hot',
            'bestseller' => 'Bán chạy',
            'limited' => 'Limited',
            'premium' => 'Premium',
            'trending' => 'Trending',
            'wedding' => 'Wedding',
            'birthday' => 'Birthday',
            'healthy' => 'Healthy',
        ];
    }

    public static function getActiveWithDetails()
    {
        return static::active()
            ->with(['category', 'details', 'ingredients', 'allergens'])
            ->ordered()
            ->get();
    }
}
