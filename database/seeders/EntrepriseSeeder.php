<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Http\UploadedFile;
use Illuminate\Database\Seeder;

use Carbon\Carbon;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

class EntrepriseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        // 1. Entreprises
        $entrepriseId = DB::table('entreprises')->insertGetId([
            'uid' => Str::uuid(),
            'nom' => 'DemandHub Corp',
            'description' => 'Entreprise fictive pour gestion des demandes internes',
            'suppr' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Services
        $servicesData = [
            'Réclamations',
            'Informatique',
            'Ressources Humaines',
            'Logistique'
        ];
        $serviceIds = [];
        foreach ($servicesData as $service) {
            $serviceIds[$service] = DB::table('services')->insertGetId([
                'uid' => Str::uuid(),
                'entreprise_id' => $entrepriseId,
                'nom' => $service,
                'description' => "Service $service",
                'suppr' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 4. Utilisateur admin
        DB::table('users')->insert([
            'uid' => Str::uuid(),
            'login' => 'admin',
            'email' => 'admin@demandhub.com',
            'password' => password_hash('password', PASSWORD_BCRYPT),
            'role_id' => 1, // Administrateur
            'service_id' => 0,
            'lock' => false,
            'suppr' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 5. Responsables par service
        foreach ($serviceIds as $serviceName => $id) {
            DB::table('users')->insert([
                'uid' => Str::uuid(),
                'login' => strtolower("resp_" . str_replace(' ', '_', $serviceName)),
                'email' => strtolower("resp." . str_replace(' ', '.', $serviceName) . "@demandhub.com"),
                'password' => password_hash('password', PASSWORD_BCRYPT),
                'role_id' => 2, // Responsable
                'service_id' => $id,
                'lock' => false,
                'suppr' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 6. Catégories de demandes
        $categories = [
            ['nom' => 'Problème informatique', 'service' => 'Informatique'],
            ['nom' => 'Réclamation client', 'service' => 'Réclamations'],
            ['nom' => 'Demande de congé', 'service' => 'Ressources Humaines'],
            ['nom' => 'Problème de matériel', 'service' => 'Logistique'],
        ];
        foreach ($categories as $cat) {
            DB::table('categories_demandes')->insert([
                'uid' => Str::uuid(),
                'service_id' => $serviceIds[$cat['service']],
                'nom' => $cat['nom'],
                'description' => $cat['nom'],
                'suppr' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->call(UserSeeder::class);

    }
}
