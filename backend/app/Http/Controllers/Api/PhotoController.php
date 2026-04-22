<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Photo\StorePhotoRequest;
use App\Models\Photo;
use Illuminate\Http\Request;

class PhotoController extends Controller
{
    public function index(Request $request)
    {
        $query = Photo::query();

        if ($request->filled('prestataire_id')) {
            $query->where('prestataire_id', $request->get('prestataire_id'));
        }

        return response()->json([
            'success' => true,
            'data' => $query->orderByDesc('id')->paginate(20),
        ]);
    }

    public function store(StorePhotoRequest $request)
    {
        $user = $request->user();
        $prestataire = $user->prestataire;

        if ($user->role !== 'prestataire' || !$prestataire) {
            return response()->json([
                'success' => false,
                'message' => 'Only prestataires can upload photos.',
            ], 403);
        }

        $photo = Photo::create([
            'prestataire_id' => $prestataire->user_id,
            'url' => $request->url,
            'description' => $request->description,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Photo uploaded.',
            'data' => $photo,
        ], 201);
    }

    public function destroy(Request $request, Photo $photo)
    {
        $user = $request->user();
        $prestataireId = $user->prestataire?->user_id;

        if ($user->role !== 'prestataire' || $photo->prestataire_id !== $prestataireId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $photo->delete();

        return response()->json([
            'success' => true,
            'message' => 'Photo deleted.',
        ]);
    }
}
