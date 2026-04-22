<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prestataire;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function users(Request $request)
    {
        $query = User::with(['client', 'prestataire']);

        if ($request->filled('role')) {
            $query->where('role', $request->get('role'));
        }

        return response()->json([
            'success' => true,
            'data' => $query->orderByDesc('id')->paginate(30),
        ]);
    }

    public function deleteUser(User $user)
    {
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted.',
        ]);
    }

    public function services()
    {
        return response()->json([
            'success' => true,
            'data' => Service::with('prestataire.user')->orderByDesc('id')->paginate(30),
        ]);
    }

    public function deleteService(Service $service)
    {
        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service deleted.',
        ]);
    }

    public function validatePrestataire(Prestataire $prestataire, Request $request)
    {
        $prestataire->is_validated = $request->boolean('is_validated', true);
        $prestataire->save();

        return response()->json([
            'success' => true,
            'message' => 'Prestataire validation updated.',
            'data' => $prestataire,
        ]);
    }
}
