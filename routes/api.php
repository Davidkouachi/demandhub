<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SelectController;
use App\Http\Controllers\InsertController;
use App\Http\Controllers\ListeController;

Route::middleware(['web'])->group(function () {
    Route::post('/traitement_login', [AuthController::class, 'traitement_login']);

    // select start 
        Route::get('/select_categories', [SelectController::class, 'select_categories']);
    // select end

    // insert start 
        Route::post('/InsertDemandes/{user_id}', [InsertController::class, 'InsertDemandes']);
    // insert end

    // list start 
        Route::get('/ListeMesDemandes/{user_id}', [ListeController::class, 'ListeMesDemandes']);
    // list end

    // update start 

    // update end
});
