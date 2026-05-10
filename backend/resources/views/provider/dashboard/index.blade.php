@extends('layouts.provider')

@section('title', 'Dashboard')
@section('page-title', 'Vue d\'ensemble')

@section('content')
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Profile Card -->
        <div class="md:col-span-1">
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex flex-col items-center">
                    @if($prestataire->photo)
                        <img src="{{ asset('storage/' . $prestataire->photo) }}" alt="{{ $prestataire->nomEntreprise }}"
                             class="w-24 h-24 rounded-full object-cover mb-4">
                    @else
                        <div class="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4">
                            <i class="fas fa-user text-gray-500 text-3xl"></i>
                        </div>
                    @endif
                    <h2 class="text-lg font-bold text-gray-800">{{ $prestataire->nomEntreprise }}</h2>
                    <p class="text-sm text-gray-500">{{ $prestataire->ville }}</p>
                    <a href="{{ route('provider.profile') }}"
                       class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Modifier le profil
                    </a>
                </div>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="md:col-span-2 space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500 font-semibold">Total Services</p>
                            <p class="text-3xl font-bold text-blue-600">{{ $stats['total_services'] }}</p>
                        </div>
                        <i class="fas fa-cogs text-3xl text-gray-300"></i>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500 font-semibold">Total Réservations</p>
                            <p class="text-3xl font-bold text-green-600">{{ $stats['total_reservations'] }}</p>
                        </div>
                        <i class="fas fa-calendar text-3xl text-gray-300"></i>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500 font-semibold">En attente</p>
                            <p class="text-3xl font-bold text-yellow-600">{{ $stats['pending_reservations'] }}</p>
                        </div>
                        <i class="fas fa-hourglass-half text-3xl text-gray-300"></i>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500 font-semibold">Total Photos</p>
                            <p class="text-3xl font-bold text-purple-600">{{ $prestataire->photos()->count() }}</p>
                        </div>
                        <i class="fas fa-images text-3xl text-gray-300"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Latest Reservations -->
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-gray-800">Dernières Réservations</h3>
            <a href="{{ route('provider.reservations.index') }}" class="text-blue-600 hover:text-blue-800">
                Voir tout <i class="fas fa-arrow-right"></i>
            </a>
        </div>

        @if($latest_reservations->count())
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                    <tr class="border-b border-gray-200">
                        <th class="text-left py-3 px-4 text-gray-600 font-semibold">Service</th>
                        <th class="text-left py-3 px-4 text-gray-600 font-semibold">Client</th>
                        <th class="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                        <th class="text-left py-3 px-4 text-gray-600 font-semibold">Statut</th>
                        <th class="text-left py-3 px-4 text-gray-600 font-semibold">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach($latest_reservations as $reservation)
                        <tr class="border-b border-gray-100 hover:bg-gray-50">
                            <td class="py-3 px-4">{{ $reservation->service->name }}</td>
                            <td class="py-3 px-4">{{ $reservation->client->user->name }}</td>
                            <td class="py-3 px-4">{{ $reservation->date->format('d/m/Y') }}</td>
                            <td class="py-3 px-4">
                                <span class="px-3 py-1 rounded-full text-xs font-semibold
                                    @if($reservation->status == 'pending') bg-yellow-100 text-yellow-800
                                    @elseif($reservation->status == 'accepted') bg-green-100 text-green-800
                                    @elseif($reservation->status == 'rejected') bg-red-100 text-red-800
                                    @elseif($reservation->status == 'completed') bg-blue-100 text-blue-800
                                    @else bg-gray-100 text-gray-800
                                    @endif">
                                    {{ ucfirst($reservation->status) }}
                                </span>
                            </td>
                            <td class="py-3 px-4">
                                <a href="{{ route('provider.reservations.show', $reservation) }}"
                                   class="text-blue-600 hover:text-blue-800 text-sm">Détails</a>
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <p class="text-gray-500 text-center py-8">Aucune réservation pour le moment</p>
        @endif
    </div>
@endsection
