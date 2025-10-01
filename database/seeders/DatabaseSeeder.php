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

class DatabaseSeeder extends Seeder
{
    
    public function run(): void
    {
        
        $roles = [
            [
                'id' => 1,
                'uid' => uniqid(), // générer un identifiant unique
                'name' => 'Administrateur',
                'description' => 'Accès complet à toutes les fonctionnalités',
                'suppr' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'uid' => uniqid(),
                'name' => 'Responsable',
                'description' => 'Peut gérer les utilisateurs et suivre les activités',
                'suppr' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'uid' => uniqid(),
                'name' => 'Traiteur de demande',
                'description' => 'Peut traiter les demandes soumises par les employés',
                'suppr' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'uid' => uniqid(),
                'name' => 'Employé',
                'description' => 'Peut soumettre des demandes et consulter son statut',
                'suppr' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('roles')->insert($roles);

        # Menus parents (niveau 1)
        $menus = [
            ['id' => 1, 'name' => 'Tableau de bord', 'slug' => 'tableau_de_bord', 'icon' => 'ri-dashboard-2-line', 'is_dropdown' => false, 'parent_id' => null, 'order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Mes demandes', 'slug' => 'mes_demandes', 'icon' => 'ri-file-list-line', 'is_dropdown' => true, 'parent_id' => null, 'order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Demandes reçues', 'slug' => 'demandes_recues', 'icon' => 'ri-inbox-line', 'is_dropdown' => true, 'parent_id' => null, 'order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'name' => 'Réponses / Suivi', 'slug' => 'suivi', 'icon' => 'ri-mail-open-line', 'is_dropdown' => false, 'parent_id' => null, 'order' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'name' => 'Utilisateurs', 'slug' => 'utilisateurs', 'icon' => 'ri-user-3-line', 'is_dropdown' => true, 'parent_id' => null, 'order' => 6, 'created_at' => now(), 'updated_at' => now()],
        ];

        # Ajout des champs supplémentaires
        $menus = array_map(function ($item) {
            return array_merge($item, [
                'href' => '/?page=' . $item['slug'],
                'title' => $item['name'],
                'data_page' => $item['slug'],
                'data_data' => $item['slug'],
            ]);
        }, $menus);

        DB::table('menus')->insert($menus);

        # Sous-menus
        $subMenus = [
            // Mes demandes (id = 2)
            ['name' => 'Créer une demande', 'slug' => 'creer_demande', 'parent_id' => 2, 'order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Liste des demandes', 'slug' => 'liste_demandes', 'parent_id' => 2, 'order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Demandes traitées', 'slug' => 'demandes_traitees', 'parent_id' => 2, 'order' => 3, 'created_at' => now(), 'updated_at' => now()],

            // Demandes reçues (id = 3)
            ['name' => 'Toutes les demandes', 'slug' => 'toutes_demandes', 'parent_id' => 3, 'order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Demandes en attente', 'slug' => 'demandes_attente', 'parent_id' => 3, 'order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Demandes traitées', 'slug' => 'demandes_recues_traitees', 'parent_id' => 3, 'order' => 3, 'created_at' => now(), 'updated_at' => now()],

            // Utilisateurs (id = 6)
            ['name' => 'Liste des employés', 'slug' => 'liste_employes', 'parent_id' => 5, 'order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Ajouter un employé', 'slug' => 'ajouter_employe', 'parent_id' => 5, 'order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Gestion des agences', 'slug' => 'gestion_agences', 'parent_id' => 5, 'order' => 3, 'created_at' => now(), 'updated_at' => now()],

        ];

        $subMenus = array_map(function ($item) {
            return array_merge($item, [
                'href' => '/?page=' . $item['slug'],
                'title' => $item['name'],
                'data_page' => $item['slug'],
                'data_data' => $item['slug'],
                'icon' => null,
                'is_dropdown' => true,
            ]);
        }, $subMenus);

        DB::table('menus')->insert($subMenus);

        # Associer les menus aux rôles
        $menus = DB::table('menus')->get()->keyBy('slug');
        $insertData = [];

        /** ADMINISTRATEUR (id = 1) => Accès total */
        foreach ($menus as $menu) {
            $insertData[] = ['role_id' => 1, 'menu_id' => $menu->id];
        }

        /** RESPONSABLE RÉCLAMATION (id = 2) */
        $responsableSlugs = [
            'tableau_de_bord',
            'demandes_recues', 'toutes_demandes', 'demandes_attente', 'demandes_recues_traitees',
            'suivi', 'notifications', 'statistiques',
            'profil', 'mon_compte', 'parametres', 'deconnexion',
        ];
        $responsableMenuIds = collect($responsableSlugs)
            ->map(fn($slug) => $menus->firstWhere('slug', $slug)?->id)
            ->filter();

        foreach ($responsableMenuIds as $menuId) {
            $insertData[] = ['role_id' => 2, 'menu_id' => $menuId];
        }

        /** TRAITEUR DE DEMANDE (id = 3) */
        $traiteurSlugs = [
            'tableau_de_bord',
            'demandes_recues', 'toutes_demandes', 'demandes_attente',
            'suivi', 'notifications',
            'profil', 'mon_compte', 'parametres', 'deconnexion',
        ];
        $traiteurMenuIds = collect($traiteurSlugs)
            ->map(fn($slug) => $menus->firstWhere('slug', $slug)?->id)
            ->filter();

        foreach ($traiteurMenuIds as $menuId) {
            $insertData[] = ['role_id' => 3, 'menu_id' => $menuId];
        }

        /** EMPLOYÉ (id = 4) */
        $employeSlugs = [
            'tableau_de_bord',
            'mes_demandes', 'creer_demande', 'liste_demandes', 'demandes_traitees',
            'suivi', 'notifications',
            'profil', 'mon_compte', 'parametres', 'deconnexion',
        ];
        $employeMenuIds = collect($employeSlugs)
            ->map(fn($slug) => $menus->firstWhere('slug', $slug)?->id)
            ->filter();

        foreach ($employeMenuIds as $menuId) {
            $insertData[] = ['role_id' => 4, 'menu_id' => $menuId];
        }

        DB::table('role_menus')->insert($insertData);


        // ----------------------------------------------------------------------------------------


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

        // 7. Employé test
        DB::table('users')->insert([
            'uid' => Str::uuid(),
            'login' => 'employe',
            'email' => 'employe@demandhub.com',
            'password' => password_hash('password', PASSWORD_BCRYPT),
            'role_id' => 4, // Employé
            'service_id' => 0,
            'lock' => false,
            'suppr' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('users')->insert([
            'uid' => Str::uuid(),
            'login' => 'traiteur',
            'email' => 'traiteur@demandhub.com',
            'password' => password_hash('password', PASSWORD_BCRYPT),
            'role_id' => 3, // Employé
            'service_id' => 0,
            'lock' => false,
            'suppr' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

    }

}
