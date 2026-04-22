<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Avis\StoreAvisRequest;
use App\Models\Avis;
use App\Models\Reservation;
use Illuminate\Http\Request;

class AvisController extends Controller
{
    public function index(Request $request)
    {
        $query = Avis::with(['service', 'client.user']);

        if ($request->filled('service_id')) {
            $query->where('service_id', $request->get('service_id'));
        }

        return response()->json([
            'success' => true,
            'data' => $query->orderByDesc('id')->paginate(20),
        ]);
    }

    public function store(StoreAvisRequest $request)
    {
        $user = $request->user();

        if ($user->role !== 'client') {
            return response()->json([
                'success' => false,
                'message' => 'Only clients can leave reviews.',
            ], 403);
        }

        $hasReservation = Reservation::query()
            ->where('client_id', $user->id)
            ->where('service_id', $request->service_id)
            ->where('status', 'accepted')
            ->exists();

        if (!$hasReservation) {
            return response()->json([
                'success' => false,
                'message' => 'You can only review services you have reserved.',
            ], 422);
        }

        $existingAvis = Avis::query()
            ->where('client_id', $user->id)
            ->where('service_id', $request->service_id)
            ->first();

        if ($existingAvis) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this service.',
            ], 422);
        }

        $avis = Avis::create([
            'client_id' => $user->id,
            'service_id' => $request->service_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review added.',
            'data' => $avis,
        ], 201);
    }
}
