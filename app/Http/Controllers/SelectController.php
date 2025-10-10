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
    public function select_categories(Request $res)
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
}
