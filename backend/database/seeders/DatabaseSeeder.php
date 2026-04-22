<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Client;
use App\Models\Prestataire;
use App\Models\Service;
use App\Models\Reservation;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ========================
        // CLIENT USER
        // ========================
        $clientUser = User::create([
            'name' => 'Client Test',
            'email' => 'client@test.com',
            'password' => Hash::make('123456'),
            'role' => 'client',
        ]);

        $client = Client::create([
            'user_id' => $clientUser->id,
            'address' => 'Fes',
        ]);

        // ========================
        // PRESTATAIRE USER
        // ========================
        $prestataireUser = User::create([
            'name' => 'Prestataire Test',
            'email' => 'prestataire@test.com',
            'password' => Hash::make('123456'),
            'role' => 'prestataire',
        ]);

        $prestataire = Prestataire::create([
            'user_id' => $prestataireUser->id,
            'nomEntreprise' => 'Salon Beauty',
            'description' => 'Service professionnel de coiffure et esthétique',
            'adresse' => 'Fes',
        ]);

        // ========================
        // SERVICES
        // ========================
        $service = Service::create([
            'prestataire_id' => $prestataire->id,
            'name' => 'Coupe cheveux',
            'description' => 'Coupe moderne professionnelle',
            'price' => 100,
            'duration' => 60,
            'category' => 'Coiffure',
        ]);

        // ========================
        // RESERVATION
        // ========================
        Reservation::create([
            'client_id' => $client->id,
            'service_id' => $service->id,
            'date' => now()->format('Y-m-d'),
            'start_time' => '10:00',
            'end_time' => '11:00',
            'status' => 'pending',
        ]);
    }
}