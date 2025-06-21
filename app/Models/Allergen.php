<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Allergen extends Model
{
    protected $fillable = [
        'product_id',
        'name',
        'description',
        'severity',
        'icon',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    // Relationships
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // Scopes
    public function scopeBySeverity(Builder $query, string $severity): Builder
    {
        return $query->where('severity', $severity);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    // Static methods
    public static function getSeverities(): array
    {
        return [
            'mild' => 'Nhẹ',
            'moderate' => 'Vừa',
            'severe' => 'Nặng',
        ];
    }

    public static function getCommonAllergens(): array
    {
        return [
            'Trứng' => ['icon' => '🥚', 'severity' => 'moderate'],
            'Sữa' => ['icon' => '🥛', 'severity' => 'moderate'],
            'Gluten' => ['icon' => '🌾', 'severity' => 'moderate'],
            'Hạt' => ['icon' => '🥜', 'severity' => 'severe'],
            'Đậu phộng' => ['icon' => '🥜', 'severity' => 'severe'],
            'Cồn' => ['icon' => '🍷', 'severity' => 'mild'],
            'Đậu nành' => ['icon' => '🫘', 'severity' => 'moderate'],
            'Cá' => ['icon' => '🐟', 'severity' => 'severe'],
            'Tôm cua' => ['icon' => '🦐', 'severity' => 'severe'],
            'Mè' => ['icon' => '🌰', 'severity' => 'moderate'],
        ];
    }

    // Accessors
    public function getSeverityDisplayAttribute(): string
    {
        return static::getSeverities()[$this->severity] ?? $this->severity;
    }

    public function getDisplayIconAttribute(): string
    {
        if ($this->icon) {
            return $this->icon;
        }

        $common = static::getCommonAllergens();
        return $common[$this->name]['icon'] ?? '⚠️';
    }

    public function getSeverityColorAttribute(): string
    {
        return match($this->severity) {
            'mild' => 'text-yellow-600',
            'moderate' => 'text-orange-600',
            'severe' => 'text-red-600',
            default => 'text-gray-600',
        };
    }
}
