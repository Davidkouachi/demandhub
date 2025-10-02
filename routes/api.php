<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SelectController;

Route::middleware(['web'])->group(function () {
    Route::post('/traitement_login', [AuthController::class, 'traitement_login']);

    // select start 
        Route::get('/select_categories', [SelectController::class, 'select_categories']);
    // select end

    // insert start 

    // insert end

    // list start 

    // list end

    // update start 

    // update end
});
