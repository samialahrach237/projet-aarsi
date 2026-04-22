<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Service\StoreServiceRequest;
use App\Http\Requests\Service\UpdateServiceRequest;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function myServices(Request $request)
    {
        $prestataireId = $request->user()->prestataire?->user_id;

        if (!$prestataireId) {
            return response()->json([
                'success' => false,
                'message' => 'Prestataire profile not found.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => Service::with('prestataire.user')
                ->where('prestataire_id', $prestataireId)
                ->orderByDesc('id')
                ->get(),
        ]);
    }

    public function index(Request $request)
    {
        $query = Service::with('prestataire.user');

        if ($request->filled('category')) {
            $query->where('category', $request->get('category'));
        }

        if ($request->filled('prestataire_id')) {
            $query->where('prestataire_id', $request->get('prestataire_id'));
        }

        return response()->json([
            'success' => true,
            'data' => $query->paginate(20),
        ]);
    }

    public function show(Service $service)
    {
        return response()->json([
            'success' => true,
            'data' => $service->load(['prestataire.user', 'avis']),
        ]);
    }

    public function store(StoreServiceRequest $request)
    {
        $prestataire = $request->user()->prestataire;

        if (!$prestataire) {
            return response()->json([
                'success' => false,
                'message' => 'Prestataire profile not found.',
            ], 403);
        }

        if (!$prestataire->is_validated) {
            return response()->json([
                'success' => false,
                'message' => 'Prestataire not validated yet.',
            ], 403);
        }

        $service = Service::create([
            'prestataire_id' => $prestataire->user_id,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'duration' => $request->duration,
            'category' => $request->category,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Service created.',
            'data' => $service,
        ], 201);
    }

    public function update(UpdateServiceRequest $request, Service $service)
    {
        $prestataire = $request->user()->prestataire;

        if (!$prestataire || $service->prestataire_id !== $prestataire->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $service->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Service updated.',
            'data' => $service,
        ]);
    }

    public function destroy(Request $request, Service $service)
    {
        $user = $request->user();
        $prestataire = $user->prestataire;

        if (($prestataire && $service->prestataire_id === $prestataire->user_id) || $user->role === 'admin') {
            $service->delete();

            return response()->json([
                'success' => true,
                'message' => 'Service deleted.',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Unauthorized.',
        ], 403);
    }
}
