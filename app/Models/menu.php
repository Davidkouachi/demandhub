<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class menu extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'parent_id',
        'href',
        'data_page',
        'data_data',
        'title',
        'icon',
        'is_dropdown',
        'order',
    ];

}
