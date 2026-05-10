@extends('layouts.provider')

@section('title', 'Télécharger des Photos')
@section('page-title', 'Télécharger des Photos')

@section('content')
    <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-8">
            <form action="{{ route('provider.photos.store') }}" method="POST" enctype="multipart/form-data">
                @csrf

                <!-- Photo Upload -->
                <div class="mb-6">
                    <label for="photos" class="block text-gray-700 font-semibold mb-4">
                        Sélectionner des photos
                    </label>
                    <div class="flex items-center justify-center w-full">
                        <label for="photos"
                               class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                                <p class="text-sm text-gray-500 font-semibold">Cliquez pour sélectionner des photos</p>
                                <p class="text-xs text-gray-400 mt-1">ou glissez-déposez des fichiers</p>
                                <p class="text-xs text-gray-400 mt-2">JPG, PNG, GIF (Max 5MB par fichier)</p>
                            </div>
                            <input id="photos" type="file" name="photos[]" class="hidden" accept="image/*" multiple required>
                        </label>
                    </div>
                    @error('photos')
                    <p class="text-red-500 text-sm mt-2">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Preview -->
                <div id="preview" class="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4"></div>

                <!-- Buttons -->
                <div class="flex space-x-4">
                    <button type="submit"
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <i class="fas fa-upload mr-2"></i>Télécharger les photos
                    </button>
                    <a href="{{ route('provider.photos.index') }}"
                       class="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">
                        Annuler
                    </a>
                </div>
            </form>
        </div>
    </div>

    <script>
        const photosInput = document.getElementById('photos');
        const preview = document.getElementById('preview');

        photosInput.addEventListener('change', function() {
            preview.innerHTML = '';
            const files = this.files;

            for (let i = 0; i < Math.min(files.length, 12); i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = function(e) {
                    const div = document.createElement('div');
                    div.className = 'relative';
                    div.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" class="w-full h-32 object-cover rounded-lg">
                        <span class="absolute top-1 right-1 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">✓</span>
                    `;
                    preview.appendChild(div);
                };

                reader.readAsDataURL(file);
            }

            if (files.length > 12) {
                const div = document.createElement('div');
                div.className = 'flex items-center justify-center';
                div.innerHTML = `<p class="text-gray-500">+ ${files.length - 12} photo(s)</p>`;
                preview.appendChild(div);
            }
        });

        // Drag and drop
        const dropZone = document.querySelector('label[for="photos"]');
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('bg-gray-100');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('bg-gray-100');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('bg-gray-100');
            photosInput.files = e.dataTransfer.files;
            photosInput.dispatchEvent(new Event('change', { bubbles: true }));
        });
    </script>
@endsection
