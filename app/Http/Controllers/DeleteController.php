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

class DeleteController extends Controller
{
    public function DeleteMesDemandes(Request $request, $user_id)
    {

        $rech = DB::table('demandes')->where('user_id', $user_id)->exists();

        if (!$rech) {
            return response()->json(['success' => false], 204);
        }

        DB::beginTransaction();

        try {
            // ✅ Insertion de la demande
            $demandeUid = (string) Str::uuid();

            $updated = DB::table('demandes')->where('user_id', $user_id)->update([
                'suppr' => 1,
                'date_suppr' => now(),
                'updated_at' => now(),
            ]);

            if (!$updated) {
                throw new Exception('Erreur lors de l\'insertion dans la table demandes');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Demande supprimer avec succès ✅'
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'error' => true,
                'message' => 'Échec de l\'opération',
                'details' => $e->getMessage(),
            ], 500);
        }

    }
}
