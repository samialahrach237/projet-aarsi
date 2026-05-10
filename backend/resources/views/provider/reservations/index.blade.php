@extends('layouts.provider')

@section('title', 'Réservations')
@section('page-title', 'Réservations')

@section('content')
    @if($reservations->count())
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <table class="w-full">
                <thead class="bg-gray-100 border-b border-gray-200">
                <tr>
                    <th class="text-left py-4 px-6 text-gray-600 font-semibold">Service</th>
                    <th class="text-left py-4 px-6 text-gray-600 font-semibold">Client</th>
                    <th class="text-left py-4 px-6 text-gray-600 font-semibold">Date</th>
                    <th class="text-left py-4 px-6 text-gray-600 font-semibold">Horaire</th>
                    <th class="text-left py-4 px-6 text-gray-600 font-semibold">Statut</th>
                    <th class="text-left py-4 px-6 text-gray-600 font-semibold">Actions</th>
                </tr>
                </thead>
                <tbody>
                @foreach($reservations as $reservation)
                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                        <td class="py-4 px-6">
                            <strong>{{ $reservation->service->name }}</strong>
                        </td>
                        <td class="py-4 px-6">
                            {{ $reservation->client->user->name }}
                            <br>
                            <span class="text-xs text-gray-500">{{ $reservation->client->user->email }}</span>
                        </td>
                        <td class="py-4 px-6">
                            {{ $reservation->date->format('d/m/Y') }}
                        </td>
                        <td class="py-4 px-6">
                            {{ $reservation->start_time->format('H:i') }} - {{ $reservation->end_time->format('H:i') }}
                        </td>
                        <td class="py-4 px-6">
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
                        <td class="py-4 px-6">
                            <div class="flex space-x-2">
                                <a href="{{ route('provider.reservations.show', $reservation) }}"
                                   class="text-blue-600 hover:text-blue-800 text-sm">
                                    <i class="fas fa-eye"></i> Voir
                                </a>

                                @if($reservation->status == 'pending')
                                    <form action="{{ route('provider.reservations.accept', $reservation) }}" method="POST" class="inline">
                                        @csrf
                                        <button type="submit" class="text-green-600 hover:text-green-800 text-sm">
                                            <i class="fas fa-check"></i> Accepter
                                        </button>
                                    </form>

                                    <form action="{{ route('provider.reservations.reject', $reservation) }}" method="POST" class="inline">
                                        @csrf
                                        <button type="submit" class="text-red-600 hover:text-red-800 text-sm">
                                            <i class="fas fa-times"></i> Refuser
                                        </button>
                                    </form>
                                @elseif($reservation->status == 'accepted')
                                    <form action="{{ route('provider.reservations.complete', $reservation) }}" method="POST" class="inline">
                                        @csrf
                                        <button type="submit" class="text-blue-600 hover:text-blue-800 text-sm">
                                            <i class="fas fa-check-circle"></i> Compléter
                                        </button>
                                    </form>

                                    <form action="{{ route('provider.reservations.cancel', $reservation) }}" method="POST" class="inline">
                                        @csrf
                                        <button type="submit" class="text-gray-600 hover:text-gray-800 text-sm">
                                            <i class="fas fa-ban"></i> Annuler
                                        </button>
                                    </form>
                                @endif
                            </div>
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="mt-8">
            {{ $reservations->links() }}
        </div>
    @else
        <div class="bg-white rounded-lg shadow-md p-12 text-center">
            <i class="fas fa-inbox text-4xl text-gray-300 mb-4"></i>
            <p class="text-gray-500 text-lg">Aucune réservation pour le moment</p>
        </div>
    @endif
@endsection
