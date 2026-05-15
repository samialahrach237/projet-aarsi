@extends('layouts.provider')

@section('title', 'Créer un Service')
@section('page-title', 'Créer un Service')

@section('content')
    <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-8 border-2 border-[#d4a017]" style="box-shadow: 0 18px 45px rgba(212, 160, 23, 0.10);">
            <form action="{{ route('provider.services.store') }}" method="POST" enctype="multipart/form-data">
                @csrf

                <!-- Service Name -->
                <div class="mb-6">
                    <label for="name" class="block text-gray-700 font-semibold mb-2">
                        Nom du service *
                    </label>
                    <input type="text" id="name" name="name" value="{{ old('name') }}"
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
                              required>{{ old('description') }}</textarea>
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
                        <input type="number" id="price" name="price" value="{{ old('price') }}" min="0"
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
                        <input type="number" id="duration" name="duration" value="{{ old('duration') }}" min="1"
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
                        <option value="">-- Sélectionner une catégorie --</option>
                        <option value="Nettoyage" {{ old('category') == 'Nettoyage' ? 'selected' : '' }}>Nettoyage</option>
                        <option value="Réparation" {{ old('category') == 'Réparation' ? 'selected' : '' }}>Réparation</option>
                        <option value="Beauté" {{ old('category') == 'Beauté' ? 'selected' : '' }}>Beauté</option>
                        <option value="Plomberie" {{ old('category') == 'Plomberie' ? 'selected' : '' }}>Plomberie</option>
                        <option value="Électricité" {{ old('category') == 'Électricité' ? 'selected' : '' }}>Électricité</option>
                        <option value="Autre" {{ old('category') == 'Autre' ? 'selected' : '' }}>Autre</option>
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
                    <div class="w-full">
                        <label for="image" class="provider-upload-zone" data-provider-upload>
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>
                                <strong data-provider-upload-label>Cliquer pour telecharger ou glisser-deposer</strong>
                                <span>PNG, JPG jusqu'a 5MB</span>
                            </span>
                            <input id="image" type="file" name="image" class="provider-file-input" style="display: none;" accept="image/*">
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
                        <i class="fas fa-save mr-2"></i>Créer le service
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
