<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Client;
use App\Models\Prestataire;
use App\Models\Reservation;
use App\Models\Service;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create() ;
    }
    //     $clientUser = User::updateOrCreate([
    //         'email' => 'client@test.com',
    //     ], [
    //         'name' => 'Client Test',
    //         'password' => Hash::make('123456'),
    //         'role' => 'client',
    //     ]);

    //     $client = Client::updateOrCreate([
    //         'user_id' => $clientUser->id,
    //     ], [
    //         'address' => 'Fes',
    //     ]);

    //     $prestataireSeedData = [
    //         [
    //             'name' => 'Salon Beauty',
    //             'email' => 'salon.beauty@test.com',
    //             'nomEntreprise' => 'Salon Beauty',
    //             'description' => 'Salon elegant pour coiffure, maquillage et soins beaute pour mariages.',
    //             'adresse' => 'Fes',
    //             'services' => [
    //                 ['name' => 'Coupe cheveux', 'description' => 'Coupe moderne professionnelle.', 'price' => 100, 'duration' => 60, 'category' => 'Coiffure'],
    //                 ['name' => 'Maquillage mariee', 'description' => 'Maquillage longue tenue pour ceremonie.', 'price' => 450, 'duration' => 120, 'category' => 'Maquillage'],
    //             ],
    //         ],
    //         [
    //             'name' => 'Atlas Events',
    //             'email' => 'atlas.events@test.com',
    //             'nomEntreprise' => 'Atlas Events',
    //             'description' => 'Equipe complete pour organisation, decoration et coordination de mariage.',
    //             'adresse' => 'Casablanca',
    //             'services' => [
    //                 ['name' => 'Coordination complete', 'description' => 'Organisation du jour J avec suivi des prestataires.', 'price' => 3500, 'duration' => 480, 'category' => 'Organisation'],
    //                 ['name' => 'Decoration florale', 'description' => 'Decoration de salle et arche florale.', 'price' => 2800, 'duration' => 240, 'category' => 'Decoration'],
    //             ],
    //         ],
    //         [
    //             'name' => 'Riad Lumiere',
    //             'email' => 'riad.lumiere@test.com',
    //             'nomEntreprise' => 'Riad Lumiere',
    //             'description' => 'Lieu raffine pour ceremonies intimes et receptions premium.',
    //             'adresse' => 'Marrakech',
    //             'services' => [
    //                 ['name' => 'Location salle prestige', 'description' => 'Salle de reception equipee pour 180 invites.', 'price' => 12000, 'duration' => 600, 'category' => 'Salle'],
    //                 ['name' => 'Pack lumiere et son', 'description' => 'Mise en scene lumineuse et sonorisation.', 'price' => 2600, 'duration' => 300, 'category' => 'DJ'],
    //             ],
    //         ],
    //         [
    //             'name' => 'Saveurs du Maroc',
    //             'email' => 'saveurs.maroc@test.com',
    //             'nomEntreprise' => 'Saveurs du Maroc',
    //             'description' => 'Traiteur marocain et international pour buffets et dners assis.',
    //             'adresse' => 'Rabat',
    //             'services' => [
    //                 ['name' => 'Menu mariage traditionnel', 'description' => 'Pastilla, mechoui, desserts et service inclus.', 'price' => 320, 'duration' => 180, 'category' => 'Traiteur'],
    //                 ['name' => 'Buffet sucre sale', 'description' => 'Buffet chic avec ateliers live.', 'price' => 220, 'duration' => 180, 'category' => 'Traiteur'],
    //             ],
    //         ],
    //         [
    //             'name' => 'Negafa Royal',
    //             'email' => 'negafa.royal@test.com',
    //             'nomEntreprise' => 'Negafa Royal',
    //             'description' => 'Accompagnement complet de la mariee avec tenues et accessoires luxueux.',
    //             'adresse' => 'Meknes',
    //             'services' => [
    //                 ['name' => 'Pack negafa classique', 'description' => 'Trois tenues, accessoires et assistance.', 'price' => 5000, 'duration' => 360, 'category' => 'Negafa'],
    //                 ['name' => 'Pack negafa premium', 'description' => 'Cinq tenues et mise en scene royale.', 'price' => 8500, 'duration' => 420, 'category' => 'Negafa'],
    //             ],
    //         ],
    //         [
    //             'name' => 'Henna Noor',
    //             'email' => 'henna.noor@test.com',
    //             'nomEntreprise' => 'Henna Noor',
    //             'description' => 'Artisane specialisee en motifs hennes modernes et traditionnels.',
    //             'adresse' => 'Tanger',
    //             'services' => [
    //                 ['name' => 'Henna mariee', 'description' => 'Motifs detailles mains et pieds.', 'price' => 700, 'duration' => 150, 'category' => 'Henna'],
    //             ],
    //         ],
    //         [
    //             'name' => 'Studio Horizon',
    //             'email' => 'studio.horizon@test.com',
    //             'nomEntreprise' => 'Studio Horizon',
    //             'description' => 'Photographie et videographie emotionnelles pour ceremonies et ftes.',
    //             'adresse' => 'Agadir',
    //             'services' => [
    //                 ['name' => 'Photo mariage', 'description' => 'Couverture photo du jour J avec album digital.', 'price' => 3000, 'duration' => 600, 'category' => 'Photographe'],
    //                 ['name' => 'Video highlight', 'description' => 'Film court cinematographique de la soiree.', 'price' => 2500, 'duration' => 600, 'category' => 'Photographe'],
    //             ],
    //         ],
    //         [
    //             'name' => 'Golden DJ',
    //             'email' => 'golden.dj@test.com',
    //             'nomEntreprise' => 'Golden DJ',
    //             'description' => 'DJ set moderne avec ambiance orientale, pop et house elegante.',
    //             'adresse' => 'Oujda',
    //             'services' => [
    //                 ['name' => 'Animation DJ', 'description' => 'Animation musicale avec playlist personnalisee.', 'price' => 1800, 'duration' => 360, 'category' => 'DJ'],
    //             ],
    //         ],
    //         [
    //             'name' => 'Tyafer Prestige',
    //             'email' => 'tyafer.prestige@test.com',
    //             'nomEntreprise' => 'Tyafer Prestige',
    //             'description' => 'Presentation raffinée de tyafer, lait, dattes et cadeaux de ceremonie.',
    //             'adresse' => 'Tetouan',
    //             'services' => [
    //                 ['name' => 'Pack tyafer standard', 'description' => 'Presentation soignee avec plateaux decoratifs.', 'price' => 1400, 'duration' => 120, 'category' => 'Tyafer'],
    //                 ['name' => 'Pack tyafer luxe', 'description' => 'Version premium avec compositions personnalisees.', 'price' => 2400, 'duration' => 180, 'category' => 'Tyafer'],
    //             ],
    //         ],
    //         [
    //             'name' => 'Bijoux Andalou',
    //             'email' => 'bijoux.andalou@test.com',
    //             'nomEntreprise' => 'Bijoux Andalou',
    //             'description' => 'Collection de bijoux et accessoires traditionnels pour mariee.',
    //             'adresse' => 'Chefchaouen',
    //             'services' => [
    //                 ['name' => 'Location bijoux mariee', 'description' => 'Parure complete pour ceremony andalouse.', 'price' => 1600, 'duration' => 60, 'category' => 'Bijoux'],
    //             ],
    //         ],
    //         [
    //             'name' => 'Palais Al Amal',
    //             'email' => 'palais.alamal@test.com',
    //             'nomEntreprise' => 'Palais Al Amal',
    //             'description' => 'Palais de reception spacieux pour grands evenements familiaux.',
    //             'adresse' => 'Kenitra',
    //             'services' => [
    //                 ['name' => 'Salle et mobilier', 'description' => 'Location de salle avec tables, chaises et scene.', 'price' => 9500, 'duration' => 720, 'category' => 'Salle'],
    //                 ['name' => 'Decoration table', 'description' => 'Centres de table et nappage premium.', 'price' => 2100, 'duration' => 180, 'category' => 'Decoration'],
    //             ],
    //         ],
    //         [
    //             'name' => 'Lalla Makeup',
    //             'email' => 'lalla.makeup@test.com',
    //             'nomEntreprise' => 'Lalla Makeup',
    //             'description' => 'Makeup artist mobile pour preparatifs a domicile ou en hotel.',
    //             'adresse' => 'El Jadida',
    //             'services' => [
    //                 ['name' => 'Makeup soft glam', 'description' => 'Look elegant et lumineux.', 'price' => 350, 'duration' => 90, 'category' => 'Maquillage'],
    //                 ['name' => 'Pack mariee VIP', 'description' => 'Essai, preparation et retouches.', 'price' => 900, 'duration' => 180, 'category' => 'Maquillage'],
    //             ],
    //         ],
    //         [
    //             'name' => 'Fleurs du Sud',
    //             'email' => 'fleurs.sud@test.com',
    //             'nomEntreprise' => 'Fleurs du Sud',
    //             'description' => 'Atelier floral pour bouquets, centres de table et decor ceremoniel.',
    //             'adresse' => 'Essaouira',
    //             'services' => [
    //                 ['name' => 'Bouquet mariee', 'description' => 'Bouquet sur mesure avec fleurs fraiches.', 'price' => 450, 'duration' => 60, 'category' => 'Decoration'],
    //                 ['name' => 'Arche florale', 'description' => 'Installation complete pour entree ou photo call.', 'price' => 2200, 'duration' => 180, 'category' => 'Decoration'],
    //             ],
    //         ],
    //         [
    //             'name' => 'Royal Sound',
    //             'email' => 'royal.sound@test.com',
    //             'nomEntreprise' => 'Royal Sound',
    //             'description' => 'Sonorisation professionnelle et animation live avec percussion.',
    //             'adresse' => 'Safi',
    //             'services' => [
    //                 ['name' => 'Sonorisation complete', 'description' => 'Enceintes, micros et technicien sur place.', 'price' => 2300, 'duration' => 420, 'category' => 'DJ'],
    //             ],
    //         ],
    //         [
    //             'name' => 'Maison des Reves',
    //             'email' => 'maison.reves@test.com',
    //             'nomEntreprise' => 'Maison des Reves',
    //             'description' => 'Concept store evenementiel pour decoration, scenographie et location.',
    //             'adresse' => 'Nador',
    //             'services' => [
    //                 ['name' => 'Decoration lounge', 'description' => 'Coins photo et salon marocain chic.', 'price' => 3100, 'duration' => 240, 'category' => 'Decoration'],
    //                 ['name' => 'Pack ambiance complete', 'description' => 'Decoration, eclairage et accessoires.', 'price' => 5200, 'duration' => 360, 'category' => 'Organisation'],
    //             ],
    //         ],
    //     ];

    //     $sampleService = null;

    //     foreach ($prestataireSeedData as $entry) {
    //         $user = User::updateOrCreate([
    //             'email' => $entry['email'],
    //         ], [
    //             'name' => $entry['name'],
    //             'password' => Hash::make('123456'),
    //             'role' => 'prestataire',
    //         ]);

    //         $prestataire = Prestataire::updateOrCreate([
    //             'user_id' => $user->id,
    //         ], [
    //             'nomEntreprise' => $entry['nomEntreprise'],
    //             'description' => $entry['description'],
    //             'adresse' => $entry['adresse'],
    //             'is_validated' => true,
    //         ]);

    //         Service::where('prestataire_id', $prestataire->user_id)->delete();

    //         foreach ($entry['services'] as $serviceData) {
    //             $createdService = Service::create([
    //                 'prestataire_id' => $prestataire->user_id,
    //                 'name' => $serviceData['name'],
    //                 'description' => $serviceData['description'],
    //                 'price' => $serviceData['price'],
    //                 'duration' => $serviceData['duration'],
    //                 'category' => $serviceData['category'],
    //             ]);

    //             if (!$sampleService) {
    //                 $sampleService = $createdService;
    //             }
    //         }
    //     }

    //     if ($sampleService) {
    //         Reservation::updateOrCreate([
    //             'client_id' => $client->user_id,
    //             'service_id' => $sampleService->id,
    //             'date' => now()->format('Y-m-d'),
    //         ], [
    //             'start_time' => '10:00',
    //             'end_time' => '11:00',
    //             'status' => 'pending',
    //         ]);
    //     }
    
}
