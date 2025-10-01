<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class demande_action extends Model
{
    protected $fillable = [
        'uid',
        'demande_id',
        'user_id',
        'action',
        'commentaire',
    ];
}
