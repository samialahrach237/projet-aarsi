@extends('layouts.provider')

@section('title', 'Services')
@section('page-title', 'Services')
@section('page-subtitle', 'Gerez les services que vous proposez')

@section('page-action')
    <a href="#service-create" class="provider-action-button">
        <i class="fa-solid fa-plus"></i>
        Ajouter un service
    </a>
@endsection

@push('styles')
    <style>
        .services-dashboard {
            display: grid;
            gap: 22px;
        }

        .services-card {
            background: #ffffff;
            border: 1px solid rgba(212, 160, 23, 0.42);
            border-radius: 24px;
            box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
        }

        .services-create-card {
            border: 2px solid #d4a017;
            padding: 24px;
            box-shadow: 0 18px 45px rgba(212, 160, 23, 0.1);
        }

        .services-card-title {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
        }

        .services-title-icon {
            width: 28px;
            height: 28px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            background: #fff7e6;
            color: #c47a00;
            border: 1px solid #f8dfaa;
            font-size: 13px;
        }

        .services-card-title h2 {
            margin: 0;
            color: #111827;
            font-size: 18px;
            font-weight: 800;
        }

        .services-form-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
        }

        .services-field {
            display: grid;
            gap: 8px;
        }

        .services-field-full {
            grid-column: 1 / -1;
        }

        .services-field label {
            color: #111827;
            font-size: 13px;
            font-weight: 700;
        }

        .services-field input,
        .services-field select,
        .services-field textarea {
            width: 100%;
            min-height: 52px;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            background: #ffffff;
            padding: 0 16px;
            color: #111827;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .services-field textarea {
            min-height: 110px;
            padding-top: 14px;
            padding-bottom: 14px;
            resize: none;
        }

        .services-field input:focus,
        .services-field select:focus,
        .services-field textarea:focus {
            border-color: #d4a017;
            box-shadow: 0 0 0 4px rgba(212, 160, 23, 0.16);
        }

        .services-upload {
            min-height: 76px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 18px;
            border: 1.5px dashed #cbd5e1;
            border-radius: 14px;
            background: #ffffff;
            cursor: pointer;
            transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
        }

        .services-upload:hover,
        .services-upload.is-dragging {
            border-color: #16833a;
            background: #fbfefc;
            transform: translateY(-1px);
        }

        .services-upload i {
            color: #64748b;
            font-size: 22px;
        }

        .services-upload strong {
            display: block;
            color: #111827;
            font-size: 14px;
            font-weight: 750;
        }

        .services-upload span {
            display: block;
            color: #64748b;
            font-size: 12px;
            margin-top: 2px;
        }

        .services-upload input {
            display: none;
        }

        .services-form-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 18px;
        }

        .services-submit {
            min-width: 170px;
            height: 50px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 0 24px;
            border: none;
            border-radius: 12px;
            background: linear-gradient(135deg, #199148, #16833a);
            color: #ffffff;
            font-size: 14px;
            font-weight: 800;
            box-shadow: 0 12px 24px rgba(22, 131, 58, 0.2);
            transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .services-submit:hover {
            background: linear-gradient(135deg, #16833a, #0f6d2d);
            transform: translateY(-1px);
            box-shadow: 0 16px 30px rgba(22, 131, 58, 0.26);
        }

        .services-table-card {
            overflow: hidden;
        }

        .services-table-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
            padding: 20px 22px;
            border-bottom: 1px solid #e5e7eb;
        }

        .services-table-header h2 {
            margin: 0;
            color: #111827;
            font-size: 18px;
            font-weight: 800;
        }

        .services-table-header p {
            margin: 4px 0 0;
            color: #64748b;
            font-size: 14px;
        }

        .services-table-tools {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .services-search {
            position: relative;
        }

        .services-search i {
            position: absolute;
            top: 50%;
            left: 14px;
            transform: translateY(-50%);
            color: #64748b;
            font-size: 14px;
        }

        .services-search input,
        .services-table-tools select {
            height: 44px;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            background: #ffffff;
            color: #334155;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .services-search input {
            width: 250px;
            padding: 0 14px 0 40px;
        }

        .services-table-tools select {
            width: 190px;
            padding: 0 14px;
        }

        .services-search input:focus,
        .services-table-tools select:focus {
            border-color: #16833a;
            box-shadow: 0 0 0 4px rgba(22, 131, 58, 0.08);
        }

        .services-table-wrap {
            width: 100%;
            overflow-x: auto;
        }

        .services-table {
            width: 100%;
            min-width: 940px;
            border-collapse: collapse;
        }

        .services-table th {
            padding: 14px 18px;
            background: #fbfcfe;
            border-bottom: 1px solid #e5e7eb;
            color: #64748b;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.04em;
            text-align: left;
            text-transform: uppercase;
        }

        .services-table td {
            padding: 13px 18px;
            border-bottom: 1px solid #eef2f7;
            color: #1f2937;
            font-size: 14px;
            vertical-align: middle;
        }

        .services-table tbody tr {
            transition: background 0.2s ease;
        }

        .services-table tbody tr:hover {
            background: #fbfcfe;
        }

        .services-name-cell {
            display: flex;
            align-items: center;
            gap: 14px;
            min-width: 0;
        }

        .services-thumb {
            width: 42px;
            height: 42px;
            flex: 0 0 42px;
            overflow: hidden;
            border-radius: 8px;
            background: #f1f5f9;
            border: 1px solid #e5e7eb;
        }

        .services-thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .services-thumb-placeholder {
            width: 100%;
            height: 100%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
        }

        .services-name-cell strong {
            display: block;
            color: #111827;
            font-size: 14px;
            font-weight: 800;
        }

        .services-name-cell span {
            display: block;
            max-width: 440px;
            margin-top: 3px;
            color: #64748b;
            font-size: 13px;
            line-height: 1.35;
        }

        .services-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            padding: 6px 12px;
            font-size: 12px;
            font-weight: 700;
            white-space: nowrap;
        }

        .badge-decoration { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
        .badge-traiteur { background: #ecfdf5; color: #047857; border: 1px solid #bbf7d0; }
        .badge-negafa { background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe; }
        .badge-animation { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
        .badge-photographie { background: #fdf2f8; color: #db2777; border: 1px solid #fbcfe8; }
        .badge-location { background: #ecfeff; color: #0284c7; border: 1px solid #bae6fd; }
        .badge-default { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }

        .services-price {
            color: #0f172a;
            font-weight: 800;
            white-space: nowrap;
        }

        .services-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .services-icon-button {
            width: 34px;
            height: 34px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: 9px;
            transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .services-icon-button:hover {
            transform: scale(1.05);
        }

        .services-edit {
            background: #fff4d8;
            color: #b77900;
        }

        .services-edit:hover {
            box-shadow: 0 10px 20px rgba(212, 160, 23, 0.16);
        }

        .services-delete {
            background: #fee2e2;
            color: #dc2626;
        }

        .services-delete:hover {
            box-shadow: 0 10px 20px rgba(220, 38, 38, 0.14);
        }

        .services-empty {
            padding: 44px 20px;
            text-align: center;
            color: #64748b;
        }

        .services-empty i {
            margin-bottom: 12px;
            color: #cbd5e1;
            font-size: 34px;
        }

        .services-pagination {
            padding: 16px 22px 20px;
            color: #64748b;
            font-size: 13px;
        }

        .services-error {
            color: #dc2626;
            font-size: 12px;
            font-weight: 600;
        }

        @media (max-width: 1100px) {
            .services-table-header {
                align-items: flex-start;
                flex-direction: column;
            }

            .services-table-tools {
                width: 100%;
            }

            .services-search,
            .services-search input,
            .services-table-tools select {
                width: 100%;
            }
        }

        @media (max-width: 760px) {
            .services-create-card {
                padding: 18px;
            }

            .services-form-grid {
                grid-template-columns: 1fr;
            }

            .services-table-tools {
                flex-direction: column;
            }

            .services-form-actions,
            .services-submit {
                width: 100%;
            }
        }
    </style>
@endpush

@section('content')
    @php
        $categoryOptions = [
            'Decoration',
            'Traiteur',
            'Negafa',
            'Animation',
            'Photographie',
            'Location',
            'DJ & Orchestre',
            'Salle',
            'Bijoux',
            'Autre',
        ];

        $badgeClass = function ($category) {
            $value = Str::lower($category ?? '');

            if (Str::contains($value, ['decor', 'decoration'])) return 'badge-decoration';
            if (Str::contains($value, ['traiteur', 'gourmet'])) return 'badge-traiteur';
            if (Str::contains($value, ['negafa', 'nega'])) return 'badge-negafa';
            if (Str::contains($value, ['animation', 'dj', 'orchestre'])) return 'badge-animation';
            if (Str::contains($value, ['photo'])) return 'badge-photographie';
            if (Str::contains($value, ['location', 'materiel'])) return 'badge-location';

            return 'badge-default';
        };
    @endphp

    <div class="services-dashboard">
        <section id="service-create" class="services-card services-create-card">
            <div class="services-card-title">
                <span class="services-title-icon"><i class="fa-solid fa-plus"></i></span>
                <h2>Ajouter un service</h2>
            </div>

            <form action="{{ route('provider.services.store') }}" method="POST" enctype="multipart/form-data">
                @csrf

                <div class="services-form-grid">
                    <div class="services-field">
                        <label for="name">Nom du service</label>
                        <input type="text" id="name" name="name" value="{{ old('name') }}" placeholder="Ex: Decoration mariage" required>
                        @error('name') <p class="services-error">{{ $message }}</p> @enderror
                    </div>

                    <div class="services-field">
                        <label for="category">Categorie</label>
                        <select id="category" name="category" required>
                            <option value="">Selectionnez une categorie</option>
                            @foreach($categoryOptions as $category)
                                <option value="{{ $category }}" {{ old('category') === $category ? 'selected' : '' }}>{{ $category }}</option>
                            @endforeach
                        </select>
                        @error('category') <p class="services-error">{{ $message }}</p> @enderror
                    </div>

                    <div class="services-field">
                        <label for="price">Prix (MAD)</label>
                        <input type="number" id="price" name="price" value="{{ old('price') }}" min="0" step="0.01" placeholder="Ex: 15000" required>
                        @error('price') <p class="services-error">{{ $message }}</p> @enderror
                    </div>

                    <div class="services-field">
                        <label for="duration">Duree (minutes)</label>
                        <input type="number" id="duration" name="duration" value="{{ old('duration') }}" min="1" placeholder="Ex: 120" required>
                        @error('duration') <p class="services-error">{{ $message }}</p> @enderror
                    </div>

                    <div class="services-field services-field-full">
                        <label for="description">Description</label>
                        <textarea id="description" name="description" placeholder="Decrivez votre service en detail..." required>{{ old('description') }}</textarea>
                        @error('description') <p class="services-error">{{ $message }}</p> @enderror
                    </div>

                    <div class="services-field services-field-full">
                        <label for="image">Image</label>
                        <label class="services-upload" for="image" data-upload-zone>
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                            <span>
                                <strong data-upload-label>Cliquer pour telecharger ou glisser-deposer</strong>
                                <span>PNG, JPG jusqu'a 5MB</span>
                            </span>
                            <input id="image" type="file" name="image" style="display: none;" accept="image/png,image/jpeg,image/jpg,image/gif" data-upload-input>
                        </label>
                        @error('image') <p class="services-error">{{ $message }}</p> @enderror
                    </div>
                </div>

                <div class="services-form-actions">
                    <button type="submit" class="services-submit">
                        <i class="fa-solid fa-plus"></i>
                        Creer le service
                    </button>
                </div>
            </form>
        </section>

        <section class="services-card services-table-card">
            <div class="services-table-header">
                <div>
                    <h2>Mes services</h2>
                    <p>Liste de tous vos services</p>
                </div>

                <div class="services-table-tools">
                    <label class="services-search" for="service-search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input id="service-search" type="search" placeholder="Rechercher un service..." data-service-search>
                    </label>

                    <select aria-label="Filtrer par categorie" data-category-filter>
                        <option value="">Toutes categories</option>
                        @foreach($categoryOptions as $category)
                            <option value="{{ Str::lower($category) }}">{{ $category }}</option>
                        @endforeach
                    </select>
                </div>
            </div>

            <div class="services-table-wrap">
                <table class="services-table">
                    <thead>
                    <tr>
                        <th>Service</th>
                        <th>Categorie</th>
                        <th>Prix</th>
                        <th>Duree</th>
                        <th>Reservations</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody data-services-body>
                    @forelse($services as $service)
                        @php
                            $category = $service->category ?: 'Autre';
                            $reservationCount = method_exists($service, 'reservations') ? $service->reservations()->count() : 0;
                        @endphp
                        <tr data-service-row data-name="{{ Str::lower($service->name . ' ' . $service->description) }}" data-category="{{ Str::lower($category) }}">
                            <td>
                                <div class="services-name-cell">
                                    <div class="services-thumb">
                                        @if($service->image)
                                            <img src="{{ asset('storage/' . $service->image) }}" alt="{{ $service->name }}">
                                        @else
                                            <span class="services-thumb-placeholder"><i class="fa-regular fa-image"></i></span>
                                        @endif
                                    </div>
                                    <div>
                                        <strong>{{ $service->name }}</strong>
                                        <span>{{ Str::limit($service->description, 82) }}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="services-badge {{ $badgeClass($category) }}">{{ $category }}</span>
                            </td>
                            <td><span class="services-price">{{ number_format((float) $service->price, 0, ',', ' ') }} MAD</span></td>
                            <td>{{ $service->duration }} min</td>
                            <td>{{ $reservationCount }}</td>
                            <td>
                                <div class="services-actions">
                                    <a href="{{ route('provider.services.edit', $service) }}" class="services-icon-button services-edit" aria-label="Modifier {{ $service->name }}">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </a>
                                    <form action="{{ route('provider.services.destroy', $service) }}" method="POST" onsubmit="return confirm('Supprimer ce service ?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="services-icon-button services-delete" aria-label="Supprimer {{ $service->name }}">
                                            <i class="fa-solid fa-trash-can"></i>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6">
                                <div class="services-empty">
                                    <i class="fa-regular fa-folder-open"></i>
                                    <p class="mb-0">Aucun service pour le moment.</p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                    </tbody>
                </table>
            </div>

            @if($services->count())
                <div class="services-pagination">
                    {{ $services->links() }}
                </div>
            @endif
        </section>
    </div>
@endsection

@push('scripts')
    <script>
        const uploadZone = document.querySelector('[data-upload-zone]');
        const uploadInput = document.querySelector('[data-upload-input]');
        const uploadLabel = document.querySelector('[data-upload-label]');
        const searchInput = document.querySelector('[data-service-search]');
        const categoryFilter = document.querySelector('[data-category-filter]');
        const serviceRows = [...document.querySelectorAll('[data-service-row]')];

        function updateUploadLabel(file) {
            if (file && uploadLabel) {
                uploadLabel.textContent = file.name;
            }
        }

        uploadInput?.addEventListener('change', (event) => {
            updateUploadLabel(event.target.files?.[0]);
        });

        uploadZone?.addEventListener('dragover', (event) => {
            event.preventDefault();
            uploadZone.classList.add('is-dragging');
        });

        uploadZone?.addEventListener('dragleave', () => {
            uploadZone.classList.remove('is-dragging');
        });

        uploadZone?.addEventListener('drop', (event) => {
            event.preventDefault();
            uploadZone.classList.remove('is-dragging');

            if (!uploadInput || !event.dataTransfer.files.length) return;

            uploadInput.files = event.dataTransfer.files;
            updateUploadLabel(event.dataTransfer.files[0]);
        });

        function filterServices() {
            const query = (searchInput?.value || '').trim().toLowerCase();
            const category = (categoryFilter?.value || '').trim().toLowerCase();

            serviceRows.forEach((row) => {
                const matchesQuery = !query || row.dataset.name.includes(query);
                const matchesCategory = !category || row.dataset.category.includes(category);
                row.style.display = matchesQuery && matchesCategory ? '' : 'none';
            });
        }

        searchInput?.addEventListener('input', filterServices);
        categoryFilter?.addEventListener('change', filterServices);
    </script>
@endpush
