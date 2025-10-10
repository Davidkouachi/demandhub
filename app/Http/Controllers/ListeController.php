<?php

namespace App\Http\Controllers;

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

use Carbon\Carbon;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class ListeController extends Controller
{
    public function ListeMesDemandes(Request $request, $user_id, $statut = null)
    {
        $data = DB::table('demandes')
            ->join('categories_demandes', 'categories_demandes.id', '=', 'demandes.categorie_id')
            ->join('services', 'services.id', '=', 'categories_demandes.service_id')
            ->where('demandes.suppr', 0)
            ->where('demandes.user_id', $user_id); // si tu veux filtrer par utilisateur

        // Filtrer par statut uniquement si précisé
        if (!empty($statut) && $statut !== "0") {
            $data->where('demandes.statut', $statut);
        }

        $data = $data->select(
                'demandes.id',
                'demandes.uid',
                'demandes.categorie_id',
                'demandes.objet',
                'demandes.description',
                'demandes.statut',
                'demandes.created_at',
                'categories_demandes.nom as categorie',
                'categories_demandes.service_id',
                'services.nom as service',
                DB::raw('(SELECT COUNT(*) FROM files_demandes WHERE files_demandes.demande_uid = demandes.uid) as total_files')
            )
            ->orderBy('demandes.created_at', 'desc')
            ->get()
            ->map(function ($item) {
                $item->fichiers = DB::table('files_demandes')
                    ->where('demande_uid', $item->uid)
                    ->get();
                return $item;
            });

        if ($data->isNotEmpty()) {
            return response()->json(['success' => true, 'data' => $data], 200);
        }

        return response()->json(['success' => false], 204);
    }

    public function ListeDemandesRecu(Request $request, $user_id, $role_id, $service_id, $statut = null)
    {

        $rech = DB::table('users')
                    ->where('id', $user_id)
                    ->where('service_id', $service_id)
                    ->where('role_id', $role_id)
                    ->exists();

        if (!$rech) {
            return response()->json(['success' => false], 204);
        }

        $data = DB::table('demandes')
            ->join('categories_demandes', 'categories_demandes.id', '=', 'demandes.categorie_id')
            ->join('services', 'services.id', '=', 'categories_demandes.service_id')
            ->join('users', 'users.id', '=', 'demandes.user_id')
            ->where('services.id', $service_id)
            ->where('demandes.suppr', 0);

        // Filtrer par statut uniquement si précisé
        if (!empty($statut) && $statut !== "0") {
            $data->where('demandes.statut', $statut);
        }

        $data = $data->select(
                'demandes.id',
                'demandes.uid',
                'demandes.traiteur_id',
                'demandes.categorie_id',
                'demandes.objet',
                'demandes.description',
                'demandes.statut',
                'demandes.created_at',
                'users.name',
                'categories_demandes.nom as categorie',
                'categories_demandes.service_id',
                DB::raw('(SELECT COUNT(*) FROM files_demandes WHERE files_demandes.demande_uid = demandes.uid) as total_files')
            )
            ->orderBy('demandes.created_at', 'desc')
            ->get()
            ->map(function ($item) {
                $item->fichiers = DB::table('files_demandes')
                    ->where('demande_uid', $item->uid)
                    ->get();
                return $item;
            });

        if ($data->isNotEmpty()) {
            return response()->json(['success' => true, 'data' => $data], 200);
        }

        return response()->json(['success' => false], 204);
    }

}
