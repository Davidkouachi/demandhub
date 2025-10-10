<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class files_demande extends Model
{
    protected $fillable = [
        'uid',
        'demande_uid',
        'nom_original',
        'chemin',
        'url',
        'type',
    ];
}
