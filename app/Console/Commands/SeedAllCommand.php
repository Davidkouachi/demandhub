<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class SeedAllCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seed:all';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Exécute tous les seeders (menus, rôles, entreprises, utilisateurs, etc.)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Nettoyage de la base...');
        Artisan::call('migrate:fresh');
        $this->info('✅ Base de données réinitialisée.');

        $this->info('🌱 Lancement des seeders...');
        Artisan::call('db:seed');
        $this->info('✅ Données initiales insérées avec succès !');

        $this->info('🎉 Tous les seeders ont été exécutés avec succès !');
    }
}
