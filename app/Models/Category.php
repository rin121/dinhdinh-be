<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Category extends Model
{
    protected $fillable = [
        'name',
        'icon',
        'type',
        'description',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    // Accessors
    public function getDisplayNameAttribute(): string
    {
        return $this->icon ? $this->icon . ' ' . $this->name : $this->name;
    }

    // Static methods
    public static function getTypes(): array
    {
        return [
            'birthday' => 'Bánh sinh nhật',
            'wedding' => 'Bánh cưới', 
            'chocolate' => 'Bánh chocolate',
            'fruit' => 'Bánh trái cây',
            'special' => 'Bánh đặc biệt',
            'cupcake' => 'Bánh cupcake',
            'cream' => 'Bánh kem tươi',
            'seasonal' => 'Bánh theo mùa',
            'promotion' => 'Bánh khuyến mãi',
        ];
    }

    public static function getActiveByType(string $type = 'birthday')
    {
        return static::active()->byType($type)->ordered()->get();
    }
}
