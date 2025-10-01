<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class categories_demande extends Model
{
    protected $fillable = [
        'uid',
        'service_id',
        'nom',
        'description',
        'suppr',
    ];
}
