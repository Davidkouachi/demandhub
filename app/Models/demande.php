<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class demande extends Model
{
    protected $fillable = [
        'uid',
        'user_id',
        'traiteur_id',
        'date_limite',
        'categorie_id',
        'objet',
        'description',
        'statut',
        'traiter',
        'suppr',
        'date_suppr',
    ];
}
