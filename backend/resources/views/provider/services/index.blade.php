@extends('layouts.provider')

@section('title', 'Mes Services')
@section('page-title', 'Mes Services')

@section('content')
    <div class="mb-8">
        <a href="{{ route('provider.services.create') }}" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <i class="fas fa-plus mr-2"></i>Ajouter un service
        </a>
    </div>

    @if($services->count())
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach($services as $service)
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                    <!-- Service Image -->
                    @if($service->image)
                        <img src="{{ asset('storage/' . $service->image) }}" alt="{{ $service->name }}"
                             class="w-full h-48 object-cover">
                    @else
                        <div class="w-full h-48 bg-gray-300 flex items-center justify-center">
                            <i class="fas fa-image text-gray-500 text-3xl"></i>
                        </div>
                    @endif

                    <div class="p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-2">{{ $service->name }}</h3>
                        <p class="text-gray-600 text-sm mb-3">{{ Str::limit($service->description, 100) }}</p>

                        <div class="flex justify-between items-center mb-4">
                            <span class="text-2xl font-bold text-blue-600">${{ number_format($service->price, 2) }}</span>
                            <span class="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-semibold">
                                {{ $service->duration }} min
                            </span>
                        </div>

                        <p class="text-sm text-gray-500 mb-4">Catégorie: {{ $service->category }}</p>

                        <div class="flex space-x-2">
                            <a href="{{ route('provider.services.edit', $service) }}"
                               class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center text-sm">
                                <i class="fas fa-edit mr-1"></i>Modifier
                            </a>
                            <form action="{{ route('provider.services.destroy', $service) }}" method="POST" class="flex-1"
                                  onsubmit="return confirm('Êtes-vous sûr?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit"
                                        class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">
                                    <i class="fas fa-trash mr-1"></i>Supprimer
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>

        <!-- Pagination -->
        <div class="mt-8">
            {{ $services->links() }}
        </div>
    @else
        <div class="bg-white rounded-lg shadow-md p-12 text-center">
            <i class="fas fa-folder-open text-4xl text-gray-300 mb-4"></i>
            <p class="text-gray-500 text-lg mb-4">Aucun service pour le moment</p>
            <a href="{{ route('provider.services.create') }}"
               class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block">
                Créer votre premier service
            </a>
        </div>
    @endif
@endsection
