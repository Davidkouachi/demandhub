<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class entreprise extends Model
{
    protected $fillable = [
        'uid',
        'nom',
        'description',
        'suppr',
    ];
}
