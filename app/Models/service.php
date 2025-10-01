<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class service extends Model
{
    protected $fillable = [
        'uid',
        'entreprise_id',
        'nom',
        'description',
        'suppr',
    ];
}
