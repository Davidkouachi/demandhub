<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class demande extends Model
{
    protected $fillable = [
        'uid',
        'user_id',
        'categorie_id',
        'objet',
        'description',
        'statut',
        'suppr',
    ];
}
