@extends('layouts.provider')

@section('title', 'Modifier un Service')
@section('page-title', 'Modifier un Service')

@section('content')
    <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-8">
            <form action="{{ route('provider.services.update', $service) }}" method="POST" enctype="multipart/form-data">
                @csrf
                @method('PUT')

                <!-- Service Name -->
                <div class="mb-6">
                    <label for="name" class="block text-gray-700 font-semibold mb-2">
                        Nom du service *
                    </label>
                    <input type="text" id="name" name="name" value="{{ old('name', $service->name) }}"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                           required>
                    @error('name')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Description -->
                <div class="mb-6">
                    <label for="description" class="block text-gray-700 font-semibold mb-2">
                        Description *
                    </label>
                    <textarea id="description" name="description" rows="5"
                              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                              required>{{ old('description', $service->description) }}</textarea>
                    @error('description')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Price -->
                <div class="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label for="price" class="block text-gray-700 font-semibold mb-2">
                            Prix ($) *
                        </label>
                        <input type="number" id="price" name="price" value="{{ old('price', $service->price) }}" min="0"
                               step="0.01"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                               required>
                        @error('price')
                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Duration -->
                    <div>
                        <label for="duration" class="block text-gray-700 font-semibold mb-2">
                            Durée (minutes) *
                        </label>
                        <input type="number" id="duration" name="duration" value="{{ old('duration', $service->duration) }}" min="1"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                               required>
                        @error('duration')
                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                        @enderror
                    </div>
                </div>

                <!-- Category -->
                <div class="mb-6">
                    <label for="category" class="block text-gray-700 font-semibold mb-2">
                        Catégorie *
                    </label>
                    <select id="category" name="category"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                            required>
                        <option value="Nettoyage" {{ old('category', $service->category) == 'Nettoyage' ? 'selected' : '' }}>Nettoyage</option>
                        <option value="Réparation" {{ old('category', $service->category) == 'Réparation' ? 'selected' : '' }}>Réparation</option>
                        <option value="Beauté" {{ old('category', $service->category) == 'Beauté' ? 'selected' : '' }}>Beauté</option>
                        <option value="Plomberie" {{ old('category', $service->category) == 'Plomberie' ? 'selected' : '' }}>Plomberie</option>
                        <option value="Électricité" {{ old('category', $service->category) == 'Électricité' ? 'selected' : '' }}>Électricité</option>
                        <option value="Autre" {{ old('category', $service->category) == 'Autre' ? 'selected' : '' }}>Autre</option>
                    </select>
                    @error('category')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Image -->
                <div class="mb-6">
                    <label for="image" class="block text-gray-700 font-semibold mb-2">
                        Image du service
                    </label>
                    @if($service->image)
                        <div class="mb-4">
                            <img src="{{ asset('storage/' . $service->image) }}" alt="{{ $service->name }}"
                                 class="h-32 rounded-lg">
                        </div>
                    @endif
                    <div class="flex items-center justify-center w-full">
                        <label for="image"
                               class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <i class="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
                                <p class="text-sm text-gray-500">Cliquez pour sélectionner</p>
                                <p class="text-xs text-gray-400">JPG, PNG, GIF</p>
                            </div>
                            <input id="image" type="file" name="image" class="hidden" accept="image/*">
                        </label>
                    </div>
                    @error('image')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Buttons -->
                <div class="flex space-x-4">
                    <button type="submit"
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <i class="fas fa-save mr-2"></i>Enregistrer les modifications
                    </button>
                    <a href="{{ route('provider.services.index') }}"
                       class="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">
                        Annuler
                    </a>
                </div>
            </form>
        </div>
    </div>
@endsection
