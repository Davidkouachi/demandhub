<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class traitement extends Model
{
    protected $fillable = [
        'uid',
        'demande_uid',
        'motif',
        'traiteur_id',
        'suppr',
    ];
}
