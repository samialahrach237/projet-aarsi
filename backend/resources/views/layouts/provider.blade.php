<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title') - Provider Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        :root {
            --provider-gold: #d4a017;
            --provider-gold-dark: #a86b00;
            --provider-green: #16833a;
            --provider-green-dark: #0f6d2d;
            --provider-text: #111827;
            --provider-muted: #64748b;
            --provider-border: #e5e7eb;
            --provider-soft: #f8fafc;
            --provider-shadow: 0 18px 45px rgba(15, 23, 42, 0.07);
        }

        * {
            box-sizing: border-box;
        }

        body {
            min-height: 100vh;
            margin: 0;
            background: #ffffff;
            color: var(--provider-text);
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .provider-shell {
            min-height: 100vh;
            display: flex;
            background: #ffffff;
        }

        .provider-sidebar {
            position: fixed;
            inset: 0 auto 0 0;
            z-index: 40;
            width: 220px;
            display: flex;
            flex-direction: column;
            padding: 28px 20px 18px;
            background: #ffffff;
            border-right: 1px solid #eef2f7;
            box-shadow: 8px 0 30px rgba(15, 23, 42, 0.03);
        }

        .provider-logo {
            display: inline-flex;
            align-items: center;
            margin: 0 0 36px 6px;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 27px;
            font-weight: 800;
            line-height: 1;
            letter-spacing: -0.04em;
            color: var(--provider-gold);
        }

        .provider-logo span {
            color: #24a34a;
        }

        .provider-nav {
            display: grid;
            gap: 8px;
        }

        .provider-nav-link,
        .provider-logout-button {
            min-height: 48px;
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 0 18px;
            border: 1px solid transparent;
            border-radius: 14px;
            color: #1f2937;
            font-size: 15px;
            font-weight: 600;
            text-decoration: none;
            transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }

        .provider-nav-link i,
        .provider-logout-button i {
            width: 18px;
            text-align: center;
            font-size: 15px;
        }

        .provider-nav-link:hover,
        .provider-logout-button:hover {
            background: var(--provider-soft);
            transform: translateX(2px);
        }

        .provider-nav-link.is-active {
            background: #fffaf0;
            border-color: rgba(212, 160, 23, 0.26);
            box-shadow: inset -3px 0 0 var(--provider-gold), 0 12px 24px rgba(212, 160, 23, 0.08);
            color: var(--provider-gold-dark);
        }

        .provider-sidebar-bottom {
            margin-top: auto;
            display: grid;
            gap: 16px;
        }

        .provider-help-card {
            padding: 16px;
            border: 1px solid #eef2f7;
            border-radius: 16px;
            background: #ffffff;
            box-shadow: 0 12px 26px rgba(15, 23, 42, 0.04);
        }

        .provider-help-card i {
            width: 28px;
            height: 28px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
            border: 1px solid #cbeed5;
            border-radius: 999px;
            color: var(--provider-green);
        }

        .provider-help-card strong {
            display: block;
            font-size: 14px;
            margin-bottom: 5px;
        }

        .provider-help-card p {
            margin: 0 0 12px;
            color: var(--provider-muted);
            font-size: 12px;
            line-height: 1.45;
        }

        .provider-help-card a {
            min-height: 34px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            border: 1px solid #bfe8c9;
            border-radius: 10px;
            color: var(--provider-green);
            font-size: 12px;
            font-weight: 700;
            text-decoration: none;
        }

        .provider-main {
            width: 100%;
            min-width: 0;
            margin-left: 220px;
        }

        .provider-page {
            width: min(100%, 1440px);
            margin: 0 auto;
            padding: 34px 46px 54px;
        }

        .provider-topbar {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 24px;
        }

        .provider-page-title {
            margin: 0;
            color: #0f172a;
            font-size: 24px;
            font-weight: 800;
            line-height: 1.15;
        }

        .provider-page-subtitle {
            margin: 7px 0 0;
            color: var(--provider-muted);
            font-size: 14px;
            line-height: 1.45;
        }

        .provider-topbar-actions {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-left: auto;
        }

        .provider-notification {
            position: relative;
            width: 36px;
            height: 36px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: 999px;
            background: transparent;
            color: #334155;
            font-size: 18px;
        }

        .provider-notification span {
            position: absolute;
            top: 1px;
            right: 2px;
            min-width: 15px;
            height: 15px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            background: var(--provider-gold);
            color: #ffffff;
            font-size: 9px;
            font-weight: 800;
        }

        .provider-avatar {
            width: 42px;
            height: 42px;
            border-radius: 999px;
            object-fit: cover;
            border: 2px solid #ffffff;
            box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
        }

        .provider-action-button {
            min-height: 44px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 0 20px;
            border: none;
            border-radius: 10px;
            background: linear-gradient(135deg, #199148, var(--provider-green));
            color: #ffffff;
            font-size: 14px;
            font-weight: 750;
            text-decoration: none;
            box-shadow: 0 12px 24px rgba(22, 131, 58, 0.22);
            transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .provider-action-button:hover {
            background: linear-gradient(135deg, var(--provider-green), var(--provider-green-dark));
            transform: translateY(-1px);
            box-shadow: 0 16px 30px rgba(22, 131, 58, 0.26);
        }

        .provider-upload-zone {
            min-height: 92px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            padding: 18px;
            border: 1.5px dashed #cbd5e1;
            border-radius: 16px;
            background: #ffffff;
            cursor: pointer;
            transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }

        .provider-upload-zone:hover,
        .provider-upload-zone.is-dragging {
            border-color: var(--provider-green);
            background: #fbfefc;
            transform: translateY(-1px);
            box-shadow: 0 12px 24px rgba(22, 131, 58, 0.08);
        }

        .provider-upload-zone i {
            width: 38px;
            height: 38px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            color: var(--provider-green);
            font-size: 18px;
        }

        .provider-upload-zone strong {
            display: block;
            color: #111827;
            font-size: 14px;
            font-weight: 750;
            line-height: 1.3;
        }

        .provider-upload-zone span {
            display: block;
            margin-top: 3px;
            color: var(--provider-muted);
            font-size: 12px;
            line-height: 1.35;
        }

        .provider-file-input {
            display: none !important;
        }

        .provider-alert {
            margin-bottom: 18px;
            padding: 14px 16px;
            border-radius: 14px;
            font-size: 14px;
            font-weight: 600;
        }

        .provider-alert-success {
            border: 1px solid #bbf7d0;
            background: #f0fdf4;
            color: #166534;
        }

        .provider-alert-error {
            border: 1px solid #fecaca;
            background: #fef2f2;
            color: #991b1b;
        }

        .provider-mobile-toggle,
        .provider-sidebar-backdrop {
            display: none;
        }

        @media (max-width: 960px) {
            .provider-sidebar {
                transform: translateX(-105%);
                transition: transform 0.28s ease;
            }

            .provider-sidebar.is-open {
                transform: translateX(0);
            }

            .provider-sidebar-backdrop {
                position: fixed;
                inset: 0;
                z-index: 35;
                background: rgba(15, 23, 42, 0.35);
            }

            .provider-sidebar-backdrop.is-open,
            .provider-mobile-toggle {
                display: inline-flex;
            }

            .provider-main {
                margin-left: 0;
            }

            .provider-page {
                padding: 22px 20px 42px;
            }

            .provider-mobile-toggle {
                width: 42px;
                height: 42px;
                align-items: center;
                justify-content: center;
                margin-right: 4px;
                border: 1px solid #eef2f7;
                border-radius: 12px;
                background: #ffffff;
                color: #1f2937;
                box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
            }

            .provider-topbar {
                align-items: center;
            }
        }

        @media (max-width: 700px) {
            .provider-topbar {
                flex-wrap: wrap;
            }

            .provider-topbar-actions {
                width: 100%;
                justify-content: flex-start;
                flex-wrap: wrap;
            }

            .provider-action-button {
                width: 100%;
            }
        }
    </style>
    @stack('styles')
</head>
<body>
@php
    $user = auth()->user();
    $avatarUrl = $user?->photo_url ?: 'https://ui-avatars.com/api/?name=' . urlencode($user?->name ?? 'Provider') . '&background=16833a&color=fff';
    $navItems = [
        ['label' => "Vue d'ensemble", 'icon' => 'fa-wand-magic-sparkles', 'route' => 'provider.index', 'active' => 'provider.index'],
        ['label' => 'Services', 'icon' => 'fa-store', 'route' => 'provider.services.index', 'active' => 'provider.services.*'],
        ['label' => 'Reservations', 'icon' => 'fa-clipboard-list', 'route' => 'provider.reservations.index', 'active' => 'provider.reservations.*'],
        ['label' => 'Calendrier', 'icon' => 'fa-calendar-days', 'url' => '#', 'active' => 'provider.calendar.*'],
        ['label' => 'Photos', 'icon' => 'fa-image', 'route' => 'provider.photos.index', 'active' => 'provider.photos.*'],
        ['label' => 'Avis', 'icon' => 'fa-message', 'url' => '#', 'active' => 'provider.avis.*'],
        ['label' => 'Messages', 'icon' => 'fa-comments', 'url' => '#', 'active' => 'provider.messages.*'],
        ['label' => 'Paiements', 'icon' => 'fa-credit-card', 'url' => '#', 'active' => 'provider.payments.*'],
        ['label' => 'Parametres', 'icon' => 'fa-gear', 'route' => 'provider.profile', 'active' => 'provider.profile'],
    ];
@endphp

<div class="provider-shell">
    <div class="provider-sidebar-backdrop" data-sidebar-backdrop></div>

    <aside class="provider-sidebar" data-provider-sidebar>
        <a class="provider-logo" href="{{ route('provider.index') }}">AAR<span>SSI</span></a>

        <nav class="provider-nav">
            @foreach($navItems as $item)
                @php
                    $href = isset($item['route']) ? route($item['route']) : $item['url'];
                    $isActive = request()->routeIs($item['active']);
                @endphp
                <a href="{{ $href }}" class="provider-nav-link {{ $isActive ? 'is-active' : '' }}">
                    <i class="fa-solid {{ $item['icon'] }}"></i>
                    <span>{{ $item['label'] }}</span>
                </a>
            @endforeach
        </nav>

        <div class="provider-sidebar-bottom">
            @if(\Illuminate\Support\Facades\Route::has('logout'))
                <form action="{{ route('logout') }}" method="POST">
                    @csrf
                    <button type="submit" class="provider-logout-button w-full">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                        <span>Deconnexion</span>
                    </button>
                </form>
            @else
                <a href="#" class="provider-logout-button">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                    <span>Deconnexion</span>
                </a>
            @endif

            <div class="provider-help-card">
                <i class="fa-solid fa-question"></i>
                <strong>Besoin d'aide ?</strong>
                <p>Notre equipe est la pour vous accompagner.</p>
                <a href="#">Contacter le support</a>
            </div>
        </div>
    </aside>

    <main class="provider-main">
        <div class="provider-page">
            <header class="provider-topbar">
                <div class="flex items-start gap-3">
                    <button class="provider-mobile-toggle" type="button" data-sidebar-toggle>
                        <i class="fa-solid fa-bars"></i>
                    </button>
                    <div>
                        <h1 class="provider-page-title">@yield('page-title')</h1>
                        @hasSection('page-subtitle')
                            <p class="provider-page-subtitle">@yield('page-subtitle')</p>
                        @endif
                    </div>
                </div>

                <div class="provider-topbar-actions">
                    <button class="provider-notification" type="button" aria-label="Notifications">
                        <i class="fa-regular fa-bell"></i>
                        <span>3</span>
                    </button>
                    <img class="provider-avatar" src="{{ $avatarUrl }}" alt="{{ $user?->name ?? 'Avatar' }}">
                    @hasSection('page-action')
                        @yield('page-action')
                    @endif
                </div>
            </header>

            @if(session('success'))
                <div class="provider-alert provider-alert-success flex justify-between items-center">
                    <span>{{ session('success') }}</span>
                    <button onclick="this.parentElement.style.display='none';" class="text-green-800">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            @endif

            @if($errors->any())
                <div class="provider-alert provider-alert-error">
                    <ul class="m-0 pl-4">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @yield('content')
        </div>
    </main>
</div>

<script>
    const sidebar = document.querySelector('[data-provider-sidebar]');
    const backdrop = document.querySelector('[data-sidebar-backdrop]');
    const toggle = document.querySelector('[data-sidebar-toggle]');

    function closeSidebar() {
        sidebar?.classList.remove('is-open');
        backdrop?.classList.remove('is-open');
    }

    toggle?.addEventListener('click', () => {
        sidebar?.classList.toggle('is-open');
        backdrop?.classList.toggle('is-open');
    });

    backdrop?.addEventListener('click', closeSidebar);

    document.querySelectorAll('[data-provider-upload]').forEach((zone) => {
        const input = zone.querySelector('input[type="file"]');
        const label = zone.querySelector('[data-provider-upload-label]');

        input?.addEventListener('change', () => {
            if (label && input.files?.[0]) {
                label.textContent = input.files[0].name;
            }
        });

        zone.addEventListener('dragover', (event) => {
            event.preventDefault();
            zone.classList.add('is-dragging');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('is-dragging');
        });

        zone.addEventListener('drop', (event) => {
            event.preventDefault();
            zone.classList.remove('is-dragging');

            if (!input || !event.dataTransfer.files.length) return;

            input.files = event.dataTransfer.files;
            if (label) {
                label.textContent = event.dataTransfer.files[0].name;
            }
        });
    });
</script>
@stack('scripts')
</body>
</html>
