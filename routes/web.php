<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Http\Controllers\AuthController;

Route::get('/refresh-csrf', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

Route::get('/Authentification', [AuthController::class, 'login'])->name('login');

Route::get('/deconnecter', [AuthController::class, 'deconnecter'])->name('deconnecter');

Route::middleware(['auth'])->group(function () {
    Route::get('/', [Controller::class, 'dashbord'])->name('dashbord');
});