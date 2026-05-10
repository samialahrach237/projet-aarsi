@extends('layouts.provider')

@section('title', 'Détails de la Réservation')
@section('page-title', 'Détails de la Réservation')

@section('content')
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Reservation Details -->
        <div class="md:col-span-2">
            <div class="bg-white rounded-lg shadow-md p-8 mb-6">
                <h3 class="text-xl font-bold text-gray-800 mb-6">Informations de la réservation</h3>

                <div class="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <p class="text-gray-500 text-sm">Service</p>
                        <p class="text-lg font-semibold text-gray-800">{{ $reservation->service->name }}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 text-sm">Statut</p>
                        <span class="px-3 py-1 rounded-full text-sm font-semibold inline-block
                            @if($reservation->status == 'pending') bg-yellow-100 text-yellow-800
                            @elseif($reservation->status == 'accepted') bg-green-100 text-green-800
                            @elseif($reservation->status == 'rejected') bg-red-100 text-red-800
                            @elseif($reservation->status == 'completed') bg-blue-100 text-blue-800
                            @else bg-gray-100 text-gray-800
                            @endif">
                            {{ ucfirst($reservation->status) }}
                        </span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <p class="text-gray-500 text-sm">Date</p>
                        <p class="text-lg font-semibold text-gray-800">{{ $reservation->date->format('d/m/Y') }}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 text-sm">Horaire</p>
                        <p class="text-lg font-semibold text-gray-800">{{ $reservation->start_time->format('H:i') }} - {{ $reservation->end_time->format('H:i') }}</p>
                    </div>
                </div>

                <div class="mb-6 pb-6 border-b border-gray-200">
                    <p class="text-gray-500 text-sm">Description du service</p>
                    <p class="text-gray-800">{{ $reservation->service->description }}</p>
                </div>

                <div class="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <p class="text-gray-500 text-sm">Prix du service</p>
                        <p class="text-2xl font-bold text-blue-600">${{ number_format($reservation->service->price, 2) }}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 text-sm">Durée</p>
                        <p class="text-lg font-semibold text-gray-800">{{ $reservation->service->duration }} minutes</p>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            @if($reservation->status == 'pending')
                <div class="bg-yellow-50 rounded-lg shadow-md p-6 mb-6 border border-yellow-200">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Actions requises</h3>
                    <div class="flex flex-wrap gap-3">
                        <form action="{{ route('provider.reservations.accept', $reservation) }}" method="POST" class="inline">
                            @csrf
                            <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                <i class="fas fa-check mr-2"></i>Accepter la réservation
                            </button>
                        </form>

                        <form action="{{ route('provider.reservations.reject', $reservation) }}" method="POST" class="inline">
                            @csrf
                            <button type="submit" class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                <i class="fas fa-times mr-2"></i>Refuser la réservation
                            </button>
                        </form>
                    </div>
                </div>
            @elseif($reservation->status == 'accepted')
                <div class="bg-green-50 rounded-lg shadow-md p-6 mb-6 border border-green-200">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Actions</h3>
                    <div class="flex flex-wrap gap-3">
                        <form action="{{ route('provider.reservations.complete', $reservation) }}" method="POST" class="inline">
                            @csrf
                            <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                <i class="fas fa-check-circle mr-2"></i>Marquer comme complétée
                            </button>
                        </form>

                        <form action="{{ route('provider.reservations.cancel', $reservation) }}" method="POST" class="inline">
                            @csrf
                            <button type="submit" class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                                <i class="fas fa-ban mr-2"></i>Annuler
                            </button>
                        </form>
                    </div>
                </div>
            @endif
        </div>

        <!-- Client Information -->
        <div class="md:col-span-1">
            <div class="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h3 class="text-lg font-bold text-gray-800 mb-6">Informations du client</h3>

                <div class="flex items-center mb-6">
                    <img src="https://ui-avatars.com/api/?name={{ $reservation->client->user->name }}&background=0D8ABC&color=fff"
                         alt="Avatar" class="w-12 h-12 rounded-full mr-4">
                    <div>
                        <p class="font-semibold text-gray-800">{{ $reservation->client->user->name }}</p>
                        <p class="text-sm text-gray-500">Client</p>
                    </div>
                </div>

                <div class="border-t border-gray-200 pt-4">
                    <p class="text-sm text-gray-500 mb-1">Email</p>
                    <p class="text-gray-800 mb-4">{{ $reservation->client->user->email }}</p>

                    @if($reservation->client->user->phone)
                        <p class="text-sm text-gray-500 mb-1">Téléphone</p>
                        <p class="text-gray-800 mb-4">{{ $reservation->client->user->phone }}</p>
                    @endif

                    @if($reservation->client->user->city)
                        <p class="text-sm text-gray-500 mb-1">Ville</p>
                        <p class="text-gray-800">{{ $reservation->client->user->city }}</p>
                    @endif
                </div>
            </div>
        </div>
    </div>

    <!-- Back Button -->
    <div class="mt-8">
        <a href="{{ route('provider.reservations.index') }}"
           class="text-blue-600 hover:text-blue-800">
            <i class="fas fa-arrow-left mr-2"></i>Retour aux réservations
        </a>
    </div>
@endsection
