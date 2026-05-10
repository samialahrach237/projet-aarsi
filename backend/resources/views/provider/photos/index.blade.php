@extends('layouts.provider')

@section('title', 'Mes Photos')
@section('page-title', 'Galerie Photos')

@section('content')
    <div class="mb-8">
        <a href="{{ route('provider.photos.create') }}" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <i class="fas fa-plus mr-2"></i>Ajouter des photos
        </a>
    </div>

    @if($photos->count())
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            @foreach($photos as $photo)
                <div class="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition">
                    <img src="{{ $photo->url }}" alt="Photo"
                         class="w-full h-48 object-cover group-hover:scale-105 transition duration-300">

                    <!-- Overlay -->
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition duration-300 flex items-center justify-center">
                        <div class="space-x-2 opacity-0 group-hover:opacity-100 transition duration-300">
                            <form action="{{ route('provider.photos.setAsProfile', $photo) }}" method="POST" class="inline">
                                @csrf
                                <button type="submit"
                                        class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                        title="Définir comme photo de profil">
                                    <i class="fas fa-user"></i>
                                </button>
                            </form>

                            <form action="{{ route('provider.photos.destroy', $photo) }}" method="POST" class="inline"
                                  onsubmit="return confirm('Êtes-vous sûr?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit"
                                        class="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                        title="Supprimer la photo">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </form>
                        </div>
                    </div>

                    <!-- Date -->
                    <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white px-3 py-2 text-xs">
                        {{ $photo->created_at->format('d/m/Y') }}
                    </div>
                </div>
            @endforeach
        </div>

        <!-- Pagination -->
        <div class="mt-8">
            {{ $photos->links() }}
        </div>
    @else
        <div class="bg-white rounded-lg shadow-md p-12 text-center">
            <i class="fas fa-image text-4xl text-gray-300 mb-4"></i>
            <p class="text-gray-500 text-lg mb-4">Aucune photo pour le moment</p>
            <a href="{{ route('provider.photos.create') }}"
               class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block">
                Télécharger votre première photo
            </a>
        </div>
    @endif
@endsection
