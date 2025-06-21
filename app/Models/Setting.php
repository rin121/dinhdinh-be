<?php

namespace App\Models;

class Setting extends BaseModel
{
    protected $fillable = ['key', 'value'];

    protected $casts = [
        'value' => 'array',
    ];
}
