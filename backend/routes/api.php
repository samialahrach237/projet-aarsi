<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\AvisController;
use App\Http\Controllers\Api\PhotoController;
use App\Http\Controllers\Api\CalendarController;
use App\Http\Controllers\Api\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{service}', [ServiceController::class, 'show']);
Route::get('/avis', [AvisController::class, 'index']);
Route::get('/photos', [PhotoController::class, 'index']);
Route::get('/calendar', [CalendarController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/my-services', [ServiceController::class, 'myServices'])->middleware('role:prestataire');
    Route::post('/services', [ServiceController::class, 'store'])->middleware('role:prestataire');
    Route::put('/services/{service}', [ServiceController::class, 'update'])->middleware('role:prestataire');
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

    Route::get('/my-reservations', [ReservationController::class, 'myReservations']);
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store'])->middleware('role:client');
    Route::post('/accept-reservation/{reservation}', [ReservationController::class, 'acceptReservation'])
        ->middleware('role:prestataire');
    Route::post('/refuse-reservation/{reservation}', [ReservationController::class, 'refuseReservation'])
        ->middleware('role:prestataire');
    Route::put('/reservations/{reservation}/status', [ReservationController::class, 'updateStatus'])
        ->middleware('role:prestataire');

    Route::post('/avis', [AvisController::class, 'store'])->middleware('role:client');

    Route::post('/photos', [PhotoController::class, 'store'])->middleware('role:prestataire');
    Route::delete('/photos/{photo}', [PhotoController::class, 'destroy'])->middleware('role:prestataire');

    Route::post('/calendar', [CalendarController::class, 'store'])->middleware('role:prestataire');
    Route::put('/calendar/{calendar}', [CalendarController::class, 'update'])->middleware('role:prestataire');
    Route::delete('/calendar/{calendar}', [CalendarController::class, 'destroy'])->middleware('role:prestataire');

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::delete('/admin/users/{user}', [AdminController::class, 'deleteUser']);
        Route::get('/admin/services', [AdminController::class, 'services']);
        Route::delete('/admin/services/{service}', [AdminController::class, 'deleteService']);
        Route::post('/admin/prestataires/{prestataire}/validate', [AdminController::class, 'validatePrestataire']);
    });
});
