<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UpdateUserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($this->formatUserProfile($request->user()));
    }

    public function update(UpdateUserRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();

        $user->fill([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'city' => $data['city'] ?? null,
        ]);

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return response()->json([
            'message' => 'Profil mis a jour avec succes.',
            'data' => $this->formatUserProfile($user->fresh()),
        ]);
    }

    protected function formatUserProfile($user): array
    {
        $user->loadMissing(['client', 'prestataire']);

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'city' => $user->city ?? $user->client?->address,
            'created_at' => optional($user->created_at)->toDateString(),
            'role' => $user->role,
            'client' => $user->client,
            'prestataire' => $user->prestataire,
        ];
    }
}
