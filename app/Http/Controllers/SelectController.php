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

class SelectController extends Controller
{
    public function select_categories_all(Request $res)
    {

        $data = DB::table('categories_demandes')->where('suppr', 0)->select('id','uid','service_id','nom')->get();

        return response()->json([ 
            'data' => $data,
        ]);

    }

    public function select_traiteur_service(Request $res, $service_id)
    {
        $data = DB::table('users')
                    ->where('suppr', 0)
                    ->where('lock', 0)
                    ->where('role_id', 3)
                    ->where('service_id', $service_id)
                    ->select('id','name')
                    ->get();

        return response()->json([ 
            'data' => $data,
        ]);

    }

    public function select_demande_assign(Request $res, $service_id, $statut)
    {
        $data = DB::table('demandes')
                    ->join('users', 'users.id', '=', 'demandes.user_id')
                    ->join('categories_demandes', 'categories_demandes.id', '=', 'demandes.categorie_id')
                    ->join('services', 'services.id', '=', 'categories_demandes.service_id')
                    ->where('services.id', $service_id)
                    ->where('demandes.suppr', 0)
                    ->where('demandes.statut', $statut)
                    ->select('demandes.id','demandes.objet','users.name')
                    ->get();

        return response()->json([ 
            'data' => $data,
        ]);

    } 

    public function select_entreprise_all(Request $res)
    {

        $data = DB::table('entreprises')->where('suppr', 0)->select('id', 'nom')->get();

        return response()->json([ 
            'data' => $data,
        ]);

    }

    public function select_role_all(Request $res)
    {

        $data = DB::table('roles')->where('id', '!=', 1)->where('suppr', 0)->select('id', 'name')->get();

        return response()->json([ 
            'data' => $data,
        ]);

    }

    public function select_service_all(Request $res)
    {

        $data = DB::table('services')
                    ->where('suppr', 0)
                    ->select(
                        'id',
                        'nom',
                        'description',
                        DB::raw('(SELECT COUNT(*) FROM users WHERE users.service_id = services.id AND users.role_id = 2) AS nbre_respo')
                    )
                    ->get();

        return response()->json([ 
            'data' => $data,
        ]);

    }

    public function select_employe_all(Request $res)
    {

        $data = DB::table('users')
                    ->where('suppr', 0)
                    ->where('role_id', 4)
                    ->select(
                        'id',
                        'name',
                    )
                    ->get();

        return response()->json([ 
            'data' => $data,
        ]);

    }
}
