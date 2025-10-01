<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->string('name');                     // Nom affiché
            $table->string('slug')->unique();          // Identifiant unique
            $table->unsignedBigInteger('parent_id')->nullable(); // Menu parent
            $table->string('href')->nullable();        // Lien complet (href="/?page=...")
            $table->string('data_page')->nullable();   // Attribut data-page
            $table->string('data_data')->nullable();   // Attribut data-data
            $table->string('title')->nullable();       // Titre
            $table->string('icon')->nullable();        // Classe d'icône (ri-dashboard-line)
            $table->boolean('is_dropdown')->default(false); // Est-ce un menu avec sous-menus ?
            $table->integer('order')->default(0);      // Ordre d'affichage
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
