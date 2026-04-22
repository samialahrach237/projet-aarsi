<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Calendar\StoreCalendarRequest;
use App\Http\Requests\Calendar\UpdateCalendarRequest;
use App\Models\Calendrier;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    public function index(Request $request)
    {
        $query = Calendrier::query();

        if ($request->filled('prestataire_id')) {
            $query->where('prestataire_id', $request->get('prestataire_id'));
        }

        return response()->json([
            'success' => true,
            'data' => $query->orderBy('date')->paginate(30),
        ]);
    }

    public function store(StoreCalendarRequest $request)
    {
        $user = $request->user();
        $prestataire = $user->prestataire;

        if ($user->role !== 'prestataire' || !$prestataire) {
            return response()->json([
                'success' => false,
                'message' => 'Only prestataires can manage availability.',
            ], 403);
        }

        $calendar = Calendrier::updateOrCreate(
            [
                'prestataire_id' => $prestataire->user_id,
                'date' => $request->date,
            ],
            [
                'available' => $request->available,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Availability saved.',
            'data' => $calendar,
        ], 201);
    }

    public function update(UpdateCalendarRequest $request, Calendrier $calendar)
    {
        $user = $request->user();
        $prestataireId = $user->prestataire?->user_id;

        if ($user->role !== 'prestataire' || $calendar->prestataire_id !== $prestataireId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $calendar->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Availability updated.',
            'data' => $calendar,
        ]);
    }

    public function destroy(Request $request, Calendrier $calendar)
    {
        $user = $request->user();
        $prestataireId = $user->prestataire?->user_id;

        if ($user->role !== 'prestataire' || $calendar->prestataire_id !== $prestataireId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $calendar->delete();

        return response()->json([
            'success' => true,
            'message' => 'Availability deleted.',
        ]);
    }
}
