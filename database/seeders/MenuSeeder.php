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

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        // Reset tables
        DB::table('role_menus')->truncate();
        DB::table('menus')->truncate();
        DB::table('roles')->truncate();

        # ======================================================================
        # ROLES
        # ======================================================================
        $roles = [
            ['id' => 1, 'uid' => uniqid(), 'name' => 'Administrateur', 'description' => 'Accès complet à toutes les fonctionnalités', 'suppr' => false, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'uid' => uniqid(), 'name' => 'Responsable', 'description' => 'Peut gérer les utilisateurs et suivre les activités', 'suppr' => false, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'uid' => uniqid(), 'name' => 'Traiteur de demande', 'description' => 'Peut traiter les demandes soumises par les employés', 'suppr' => false, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'uid' => uniqid(), 'name' => 'Employé', 'description' => 'Peut soumettre des demandes et consulter son statut', 'suppr' => false, 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('roles')->insert($roles);

        # ======================================================================
        # MENUS PARENTS
        # ======================================================================
        $menus = [
            ['id' => 1, 'name' => 'Tableau de bord', 'slug' => 'tableau_de_bord', 'icon' => 'ri-dashboard-2-line', 'is_dropdown' => false, 'parent_id' => null, 'order' => 1],
            ['id' => 2, 'name' => 'Créer une demande', 'slug' => 'creer_demande', 'icon' => 'ri-add-circle-line', 'is_dropdown' => false, 'parent_id' => null, 'order' => 2],
            ['id' => 3, 'name' => 'Demandes Recu', 'slug' => 'demandes_recu', 'icon' => 'ri-list-check-2', 'is_dropdown' => true, 'parent_id' => null, 'order' => 3],
            ['id' => 4, 'name' => 'Affecter une demande', 'slug' => 'affecter_demande', 'icon' => 'ri-user-shared-line', 'is_dropdown' => false, 'parent_id' => null, 'order' => 4],
            ['id' => 5, 'name' => 'Demandes assignées', 'slug' => 'demandes_assignees', 'icon' => 'ri-task-line', 'is_dropdown' => true, 'parent_id' => null, 'order' => 5],
            ['id' => 6, 'name' => 'Mes Demandes', 'slug' => 'mes_demandes', 'icon' => 'ri-file-list-line', 'is_dropdown' => true, 'parent_id' => null, 'order' => 6],
            ['id' => 7, 'name' => 'Services', 'slug' => 'gestion_services', 'icon' => 'ri-building-2-line', 'is_dropdown' => true, 'parent_id' => null, 'order' => 7],
            ['id' => 8, 'name' => 'Utilisateurs', 'slug' => 'utilisateurs', 'icon' => 'ri-user-3-line', 'is_dropdown' => true, 'parent_id' => null, 'order' => 8],
            ['id' => 9, 'name' => 'Catégories de demandes', 'slug' => 'categories_demandes', 'icon' => 'ri-list-check-2', 'is_dropdown' => false, 'parent_id' => null, 'order' => 9],
            ['id' => 10, 'name' => 'Limitations des demandes', 'slug' => 'limitations_demandes', 'icon' => 'ri-lock-line', 'is_dropdown' => false, 'parent_id' => null, 'order' => 10],
            ['id' => 11, 'name' => 'Verrouillage de compte', 'slug' => 'verrouillage_compte', 'icon' => 'ri-user-unfollow-line', 'is_dropdown' => false, 'parent_id' => null, 'order' => 11],
            ['id' => 12, 'name' => 'Statistiques & rapports', 'slug' => 'statistiques', 'icon' => 'ri-bar-chart-2-line', 'is_dropdown' => true, 'parent_id' => null, 'order' => 12],
            ['id' => 13, 'name' => 'Réponses / Suivi', 'slug' => 'suivi', 'icon' => 'ri-mail-open-line', 'is_dropdown' => false, 'parent_id' => null, 'order' => 13],
            ['id' => 14, 'name' => 'Paramètres', 'slug' => 'parametres', 'icon' => 'ri-settings-3-line', 'is_dropdown' => true, 'parent_id' => null, 'order' => 15],
            ['id' => 15, 'name' => 'Gestion Service', 'slug' => 'gestion_service_respo', 'icon' => 'ri-building-2-line', 'is_dropdown' => true, 'parent_id' => null, 'order' => 14],
        ];

        $menus = array_map(fn($item) => array_merge($item, [
            'href' => '/?page=' . $item['slug'],
            'title' => $item['name'],
            'data_page' => $item['slug'],
            'data_data' => $item['slug'],
            'created_at' => now(),
            'updated_at' => now(),
        ]), $menus);

        DB::table('menus')->insert($menus);

        # ======================================================================
        # SOUS-MENUS
        # ======================================================================
        $subMenus = [
            // Statistiques & rapports (anciennement sous Tableau de bord)
            ['name' => 'Statistiques globales', 'slug' => 'statistiques_globales', 'parent_id' => 12, 'order' => 1],
            ['name' => 'Vue rapide des demandes', 'slug' => 'vue_rapide_demandes', 'parent_id' => 12, 'order' => 2],

            //Demandes recu
            ['name' => 'Toutes les demandes', 'slug' => 'toutes_demandes_recu', 'parent_id' => 3, 'order' => 1],
            ['name' => 'Demandes en cours', 'slug' => 'demandes_cours', 'parent_id' => 3, 'order' => 2],
            ['name' => 'Demandes traitées / rejetées', 'slug' => 'demandes_traitees_rejetees', 'parent_id' => 3, 'order' => 3],

            // Demandes assignées
            ['name' => 'Liste des Demandes', 'slug' => 'toutes_assign_demandes', 'parent_id' => 5, 'order' => 1],
            ['name' => 'Demandes en cours', 'slug' => 'demandes_assign_cours', 'parent_id' => 5, 'order' => 2],
            ['name' => 'Demandes traitées / rejetées', 'slug' => 'demandes_assign_traitees', 'parent_id' => 5, 'order' => 3],

            // Mes Demandes
            ['name' => 'Historique demandes', 'slug' => 'mes_demandes_historique', 'parent_id' => 6, 'order' => 1],
            ['name' => 'Demandes en cours', 'slug' => 'mes_demandes_cours', 'parent_id' => 6, 'order' => 2],
            ['name' => 'Demandes traitées / rejetées', 'slug' => 'mes_demandes_traitees_rejetees', 'parent_id' => 6, 'order' => 3],

            // Services
            ['name' => 'Créer un service', 'slug' => 'creer_service', 'parent_id' => 7, 'order' => 1],
            ['name' => 'Liste des services', 'slug' => 'liste_services', 'parent_id' => 7, 'order' => 2],

            // Utilisateurs
            ['name' => 'Créer un employé', 'slug' => 'ajouter_employe', 'parent_id' => 8, 'order' => 1],
            ['name' => 'Liste des employés', 'slug' => 'liste_employes', 'parent_id' => 8, 'order' => 2],
            ['name' => 'Affecter un employé à un service', 'slug' => 'affecter_employe_service', 'parent_id' => 8, 'order' => 3],
            ['name' => 'Nommer / Changer responsable de service', 'slug' => 'changer_responsable', 'parent_id' => 8, 'order' => 4],
            ['name' => 'Changer les accès', 'slug' => 'changer_acces', 'parent_id' => 8, 'order' => 5],

            // Statistiques & rapports (autres sous-menus)
            ['name' => 'Rapports globaux', 'slug' => 'rapports_globaux', 'parent_id' => 12, 'order' => 3],
            ['name' => 'Statistiques par service', 'slug' => 'statistiques_service', 'parent_id' => 12, 'order' => 4],

            // Parametre (autres sous-menus)
            ['name' => 'Changer de mot de passe', 'slug' => 'update_password', 'parent_id' => 14, 'order' => 1],

            // Service respo
            ['name' => 'Créer un employé', 'slug' => 'ajouter_employe_respo', 'parent_id' => 15, 'order' => 1],
            ['name' => 'Liste des employés', 'slug' => 'liste_employes_respo', 'parent_id' => 15, 'order' => 2],
            ['name' => 'Changer les accès', 'slug' => 'changer_acces_respo', 'parent_id' => 15, 'order' => 3],
        ];


        $subMenus = array_map(fn($item) => array_merge($item, [
            'icon' => null,
            'is_dropdown' => true,
            'href' => '/?page=' . $item['slug'],
            'title' => $item['name'],
            'data_page' => $item['slug'],
            'data_data' => $item['slug'],
            'created_at' => now(),
            'updated_at' => now(),
        ]), $subMenus);

        DB::table('menus')->insert($subMenus);

        # ======================================================================
        # LIAISON ROLE / MENU
        # ======================================================================
        $menus = DB::table('menus')->get()->keyBy('slug');
        $insertData = [];

        // ADMIN → tous les menus
        foreach ($menus as $menu) $insertData[] = ['role_id' => 1, 'menu_id' => $menu->id];

        // RESPONSABLE
        $responsableSlugs = [
            'tableau_de_bord', 
            'demandes_recu', 
                'toutes_demandes_recu',
                'demandes_cours', 
                'demandes_traitees_rejetees',
            'affecter_demande', 
            'demandes_assignees',
                'toutes_assign_demandes', 
                'demandes_assign_cours', 
                'demandes_assign_traitees',                 
            'liste_employes', 
                'ajouter_employe', 
                'changer_responsable', 
            'statistiques',
                'vue_rapide_demandes',
            'gestion_service_respo',
                'ajouter_employe_respo',
                'liste_employes_respo',
                'changer_acces_respo',
            'categories_demandes', 
            'suivi',
            'parametres',
                'update_password',
        ];
        foreach ($responsableSlugs as $slug) if ($menus->has($slug)) $insertData[] = ['role_id' => 2, 'menu_id' => $menus[$slug]->id];

        // TRAITEUR
        $traiteurSlugs = [
            'tableau_de_bord', 
            'demandes_assignees', 
                'demandes_assign_cours', 
                'demandes_assign_traitees', 
            'suivi', 
            'statistiques', 
            'parametres',
                'update_password',
        ];
        foreach ($traiteurSlugs as $slug) if ($menus->has($slug)) $insertData[] = ['role_id' => 3, 'menu_id' => $menus[$slug]->id];

        // EMPLOYÉ
        $employeSlugs = [
            'tableau_de_bord', 
            'creer_demande', 
            'mes_demandes',
                'mes_demandes_historique',
                'mes_demandes_cours', 
                'mes_demandes_traitees_rejetees', 
            'suivi', 
            'statistiques', 
            'parametres',
                'update_password',
        ];
        foreach ($employeSlugs as $slug) if ($menus->has($slug)) $insertData[] = ['role_id' => 4, 'menu_id' => $menus[$slug]->id];

        DB::table('role_menus')->insert($insertData);

        // Appel des autres seeders
        $this->call(\EntrepriseSeeder::class);
    }
}
