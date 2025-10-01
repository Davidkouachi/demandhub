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
        Schema::create('demande_actions', function (Blueprint $table) {
            $table->id();
            $table->string('uid')->unique()->index();
            $table->integer('demande_id');
            $table->integer('user_id'); // celui qui agit
            $table->string('action'); // ex: assigné, commentaire, clôture
            $table->text('commentaire')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demande_actions');
    }
};
