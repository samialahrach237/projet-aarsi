<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title') - Provider Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
<div class="flex">
    <!-- Sidebar -->
    <div class="w-64 bg-gradient-to-b from-blue-600 to-blue-800 min-h-screen text-white p-6">
        <div class="flex items-center mb-8">
            <i class="fas fa-briefcase text-2xl mr-3"></i>
            <span class="text-2xl font-bold">AARSSI</span>
        </div>

        <nav class="space-y-4">
            <a href="{{ route('provider.index') }}"
               class="flex items-center px-4 py-3 rounded-lg transition {{ request()->routeIs('provider.index') ? 'bg-blue-700' : 'hover:bg-blue-700' }}">
                <i class="fas fa-chart-line mr-3"></i>
                <span>Vue d'ensemble</span>
            </a>

            <a href="{{ route('provider.services.index') }}"
               class="flex items-center px-4 py-3 rounded-lg transition {{ request()->routeIs('provider.services.*') ? 'bg-blue-700' : 'hover:bg-blue-700' }}">
                <i class="fas fa-cogs mr-3"></i>
                <span>Services</span>
            </a>

            <a href="{{ route('provider.reservations.index') }}"
               class="flex items-center px-4 py-3 rounded-lg transition {{ request()->routeIs('provider.reservations.*') ? 'bg-blue-700' : 'hover:bg-blue-700' }}">
                <i class="fas fa-calendar mr-3"></i>
                <span>Réservations</span>
            </a>

            <a href="{{ route('provider.photos.index') }}"
               class="flex items-center px-4 py-3 rounded-lg transition {{ request()->routeIs('provider.photos.*') ? 'bg-blue-700' : 'hover:bg-blue-700' }}">
                <i class="fas fa-images mr-3"></i>
                <span>Photos</span>
            </a>

            <a href="{{ route('provider.profile') }}"
               class="flex items-center px-4 py-3 rounded-lg transition {{ request()->routeIs('provider.profile') ? 'bg-blue-700' : 'hover:bg-blue-700' }}">
                <i class="fas fa-user mr-3"></i>
                <span>Mon Profil</span>
            </a>
        </nav>

        <div class="mt-12 pt-6 border-t border-blue-500">
            <form action="{{ route('logout') }}" method="POST">
                @csrf
                <button type="submit" class="flex items-center px-4 py-3 rounded-lg hover:bg-blue-700 transition w-full">
                    <i class="fas fa-sign-out-alt mr-3"></i>
                    <span>Déconnexion</span>
                </button>
            </form>
        </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1">
        <!-- Top bar -->
        <div class="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-800">@yield('page-title')</h1>
            <div class="flex items-center space-x-4">
                <span class="text-gray-600">{{ auth()->user()->name }}</span>
                <img src="https://ui-avatars.com/api/?name={{ auth()->user()->name }}&background=0D8ABC&color=fff"
                     alt="Avatar" class="w-10 h-10 rounded-full">
            </div>
        </div>

        <!-- Content -->
        <div class="p-8">
            @if(session('success'))
                <div class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex justify-between items-center">
                    <span>{{ session('success') }}</span>
                    <button onclick="this.parentElement.style.display='none';" class="text-green-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            @endif

            @if($errors->any())
                <div class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <ul>
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @yield('content')
        </div>
    </div>
</div>
</body>
</html>
