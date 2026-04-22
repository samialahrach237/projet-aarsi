<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reservation\StoreReservationRequest;
use App\Http\Requests\Reservation\UpdateReservationStatusRequest;
use App\Models\Reservation;
use App\Models\Service;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function myReservations(Request $request)
    {
        return $this->index($request);
    }

    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'client') {
            $reservations = Reservation::with('service.prestataire.user')
                ->where('client_id', $user->id)
                ->orderByDesc('id')
                ->paginate(20);
        } elseif ($user->role === 'prestataire') {
            $prestataireId = $user->prestataire?->user_id;
            $reservations = Reservation::with('service', 'client.user')
                ->whereHas('service', function ($query) use ($prestataireId) {
                    $query->where('prestataire_id', $prestataireId);
                })
                ->orderByDesc('id')
                ->paginate(20);
        } else {
            $reservations = Reservation::with(['service', 'client.user'])
                ->orderByDesc('id')
                ->paginate(20);
        }

        return response()->json([
            'success' => true,
            'data' => $reservations,
        ]);
    }

    public function store(StoreReservationRequest $request)
    {
        $user = $request->user();

        if ($user->role !== 'client') {
            return response()->json([
                'success' => false,
                'message' => 'Only clients can make reservations.',
            ], 403);
        }

        $service = Service::findOrFail($request->service_id);

        $reservation = Reservation::create([
            'client_id' => $user->id,
            'service_id' => $service->id,
            'date' => $request->date,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reservation created.',
            'data' => $reservation,
        ], 201);
    }

    public function updateStatus(UpdateReservationStatusRequest $request, Reservation $reservation)
    {
        return $this->updateReservationStatus($request, $reservation, $request->status);
    }

    public function acceptReservation(Request $request, Reservation $reservation)
    {
        return $this->updateReservationStatus($request, $reservation, 'accepted');
    }

    public function refuseReservation(Request $request, Reservation $reservation)
    {
        return $this->updateReservationStatus($request, $reservation, 'rejected');
    }

    protected function updateReservationStatus(Request $request, Reservation $reservation, string $status)
    {
        $user = $request->user();
        $prestataireId = $user->prestataire?->user_id;

        if ($user->role !== 'prestataire' || !$prestataireId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        if ($reservation->service->prestataire_id !== $prestataireId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $reservation->status = $status;
        $reservation->save();

        return response()->json([
            'success' => true,
            'message' => 'Reservation status updated.',
            'data' => $reservation,
        ]);
    }
}
