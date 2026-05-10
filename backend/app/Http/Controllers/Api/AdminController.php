<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prestataire;
use App\Models\Reservation;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'users' => User::count(),
            'clients' => User::where('role', 'client')->count(),
            'prestataires' => User::where('role', 'prestataire')->count(),
            'services' => Service::count(),
            'reservations' => Reservation::count(),
            'pendingReservations' => Reservation::where('status', 'pending')->count(),
            'acceptedReservations' => Reservation::where('status', 'accepted')->count(),
            'rejectedReservations' => Reservation::whereIn('status', ['rejected', 'refused'])->count(),
            'pendingPrestataires' => Prestataire::where('is_validated', false)->count(),
            'validatedPrestataires' => Prestataire::where('is_validated', true)->count(),
        ]);
    }

    public function users(): JsonResponse
    {
        return response()->json([
            'data' => User::query()
                ->latest()
                ->get(['id', 'name', 'email', 'role', 'created_at'])
                ->map(fn (User $user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => optional($user->created_at)->toISOString(),
                ])
                ->values(),
        ]);
    }

    public function pendingPrestataires(): JsonResponse
    {
        return response()->json([
            'data' => Prestataire::query()
                ->with('user:id,email')
                ->where('is_validated', false)
                ->latest('user_id')
                ->get()
                ->map(function (Prestataire $prestataire) {
                    $photoPath = $prestataire->photo;

                    return [
                        'id' => $prestataire->user_id,
                        'nomEntreprise' => $prestataire->nomEntreprise,
                        'email' => $prestataire->user?->email,
                        'adresse' => $prestataire->adresse,
                        'photo' => $photoPath,
                        'photo_url' => $photoPath ? asset('storage/' . ltrim($photoPath, '/')) : null,
                        'is_validated' => (bool) $prestataire->is_validated,
                    ];
                })
                ->values(),
        ]);
    }

    public function validatePrestataire(int $id): JsonResponse
    {
        $prestataire = Prestataire::query()->findOrFail($id);

        $prestataire->update([
            'is_validated' => true,
        ]);

        return response()->json([
            'message' => 'Prestataire validated successfully.',
            'data' => [
                'id' => $prestataire->user_id,
                'is_validated' => (bool) $prestataire->is_validated,
            ],
        ]);
    }

    public function deleteUser(int $id): JsonResponse
    {
        $user = User::query()->findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }
}
