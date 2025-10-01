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

        Schema::create('categories_demandes', function (Blueprint $table) {
            $table->id();
            $table->string('uid')->unique()->index();
            $table->integer('service_id');
            $table->string('nom');
            $table->string('description')->nullable();
            $table->boolean('suppr')->default(false);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories_demandes');
    }
};
