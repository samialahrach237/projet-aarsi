@extends('layouts.provider')

@section('title', 'Mon Profil')
@section('page-title', 'Mon Profil')

@section('content')
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Profile Photo -->
        <div class="md:col-span-1">
            <div class="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <div class="flex flex-col items-center">
                    @if($prestataire->photo)
                        <img src="{{ asset('storage/' . $prestataire->photo) }}" alt="{{ $prestataire->nomEntreprise }}"
                             class="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-600">
                    @else
                        <div class="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center mb-4 border-4 border-blue-600">
                            <i class="fas fa-user text-gray-500 text-5xl"></i>
                        </div>
                    @endif
                    <h2 class="text-lg font-bold text-gray-800 text-center">{{ $prestataire->nomEntreprise }}</h2>
                    <p class="text-sm text-gray-500 text-center">{{ $prestataire->ville }}</p>
                    <p class="text-xs text-gray-400 text-center mt-2">{{ $prestataire->user->email }}</p>
                </div>
            </div>
        </div>

        <!-- Edit Form -->
        <div class="md:col-span-2">
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-6">Informations de l'entreprise</h3>

                <form action="{{ route('provider.profile.update') }}" method="POST" enctype="multipart/form-data">
                    @csrf

                    <!-- Nom Entreprise -->
                    <div class="mb-6">
                        <label for="nomEntreprise" class="block text-gray-700 font-semibold mb-2">
                            Nom de l'entreprise
                        </label>
                        <input type="text" id="nomEntreprise" name="nomEntreprise"
                               value="{{ old('nomEntreprise', $prestataire->nomEntreprise) }}"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                               required>
                        @error('nomEntreprise')
                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Description -->
                    <div class="mb-6">
                        <label for="description" class="block text-gray-700 font-semibold mb-2">
                            Description
                        </label>
                        <textarea id="description" name="description" rows="4"
                                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600">{{ old('description', $prestataire->description) }}</textarea>
                        @error('description')
                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Adresse -->
                    <div class="mb-6">
                        <label for="adresse" class="block text-gray-700 font-semibold mb-2">
                            Adresse
                        </label>
                        <input type="text" id="adresse" name="adresse"
                               value="{{ old('adresse', $prestataire->adresse) }}"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                               required>
                        @error('adresse')
                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Ville -->
                    <div class="mb-6">
                        <label for="ville" class="block text-gray-700 font-semibold mb-2">
                            Ville
                        </label>
                        <input type="text" id="ville" name="ville"
                               value="{{ old('ville', $prestataire->ville) }}"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                               required>
                        @error('ville')
                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Photo -->
                    <div class="mb-6">
                        <label for="photo" class="block text-gray-700 font-semibold mb-2">
                            Photo de profil
                        </label>
                        <div class="flex items-center justify-center w-full">
                            <label for="photo"
                                   class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                    <i class="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
                                    <p class="text-sm text-gray-500">Cliquez pour sélectionner</p>
                                </div>
                                <input id="photo" type="file" name="photo" class="hidden" accept="image/*">
                            </label>
                        </div>
                        @error('photo')
                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Submit Button -->
                    <div class="flex space-x-4">
                        <button type="submit"
                                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            <i class="fas fa-save mr-2"></i>Enregistrer
                        </button>
                        <a href="{{ route('provider.index') }}"
                           class="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">
                            Annuler
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
