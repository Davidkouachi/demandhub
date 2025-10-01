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
        Schema::create('demandes', function (Blueprint $table) {
            $table->id();
            $table->string('uid')->unique()->index();
            $table->integer('user_id');
            $table->integer('categorie_id');
            $table->string('objet');
            $table->text('description')->nullable();
            $table->enum('statut', ['en_attente', 'en_cours', 'traitee', 'rejete'])->default('en_attente');
            $table->boolean('suppr')->default(false);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demandes');
    }
};
