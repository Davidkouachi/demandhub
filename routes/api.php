<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SelectController;
use App\Http\Controllers\InsertController;
use App\Http\Controllers\ListeController;
use App\Http\Controllers\DeleteController;

Route::middleware(['web'])->group(function () {
    Route::post('/traitement_login', [AuthController::class, 'traitement_login']);
});

Route::middleware(['web', 'checkAuth'])->group(function () {

    // select start 
        Route::get('/select_categories_all', [SelectController::class, 'select_categories_all']);
        Route::get('/select_traiteur_service/{service_id}', [SelectController::class, 'select_traiteur_service']);
        Route::get('/select_demande_assign/{service_id}/{statut}', [SelectController::class, 'select_demande_assign']);
        Route::get('/select_entreprise_all', [SelectController::class, 'select_entreprise_all']);
        Route::get('/select_role_all', [SelectController::class, 'select_role_all']);
        Route::get('/select_service_all', [SelectController::class, 'select_service_all']);
        Route::get('/select_employe_all', [SelectController::class, 'select_employe_all']);
    // select end

    // insert start 
        Route::post('/InsertDemandes/{user_id}', [InsertController::class, 'InsertDemandes']);
        Route::post('/InsertDesigneTraiteur/{respo_id}/{demande_id}', [InsertController::class, 'InsertDesigneTraiteur']);
        Route::post('/InsertUser', [InsertController::class, 'InsertUser']);
    // insert end

    // list start 
        Route::get('/ListeMesDemandes/{user_id}/{statut?}', [ListeController::class, 'ListeMesDemandes']);
        Route::get('/ListeDemandesRecu/{user_id}/{role_id}/{service_id}/{statut?}', [ListeController::class, 'ListeDemandesRecu']);
        Route::get('/ListeDemandesAssign/{user_id}/{service_id}/{statut?}', [ListeController::class, 'ListeDemandesAssign']);
    // list end

    // update start 

    // update end

    // delete start 
        Route::delete('/DeleteMesDemandes/{user_id}/{demande_id}', [DeleteController::class, 'DeleteMesDemandes']);
    // delete end
});
