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
        Schema::create('files_demandes', function (Blueprint $table) {
            $table->id();
            $table->string('nom_original');
            $table->string('chemin');
            $table->string('type');
            $table->string('uid')->unique()->index();
            $table->string('demande_uid')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('files_demandes');
    }
};
