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
    public function ListeMesDemandes(Request $request, $user_id) 
    {

        $data = DB::table('demandes')
            ->join('categories_demandes', 'categories_demandes.id', 'demandes.categorie_id')
            ->join('services', 'services.id', 'categories_demandes.service_id')
            ->where('demandes.suppr', 0)
            ->select(
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
            ->get()
            ->map(function($item) {
                // Récupère les fichiers liés comme tableau
                $item->fichiers = DB::table('files_demandes')
                    ->where('demande_uid', $item->uid)
                    ->get();
                return $item;
            });


        if($data){
           return response()->json(['success' => true, 'data' => $data], 200); 
        }

        return response()->json(['info' => true, 'msg' => 'Aucune données n\'à été trouver'], 404);

    }
}
