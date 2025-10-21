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


class UpdateController extends Controller
{
    public function UpdateAffecterService(Request $request, $employe_id, $service_id, $role_id)
    {

        DB::beginTransaction();

        try {

            $inserted = DB::table('users')->where('id', $employe_id)->update([
                'role_id' => $role_id,
                'service_id' => $service_id,
                'updated_at' => now(),
            ]);

            if (!$inserted) {
                throw new Exception('Erreur lors de l\'insertion dans la table users');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'msg' => 'Opération éffectuée avec succès'
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'error' => true,
                'msg' => 'Échec de l\'opération',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function UpdateChangeRespo(Request $request, $employe_id, $service_id)
    {

        $rech = DB::table('users')
                    ->where('role_id', 2)
                    ->where('service_id', $service_id)
                    ->select('id')
                    ->first();

        if (!$rech) {
            return response()->json(['success' => false, 'msg' => 'Aucune données sur le responsable actuel a été trouver'], 201);
        }

        DB::beginTransaction();

        try {

            $inserted = DB::table('users')->where('id', $rech->id)->update([
                'role_id' => 3,
                'updated_at' => now(),
            ]);

            if (!$inserted) {
                throw new Exception('Erreur lors de l\'insertion dans la table users');
            }

            $inserted2 = DB::table('users')->where('id', $employe_id)->update([
                'role_id' => 2,
                'updated_at' => now(),
            ]);

            if (!$inserted2) {
                throw new Exception('Erreur lors de l\'insertion dans la table users');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'msg' => 'Opération éffectuée avec succès'
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'error' => true,
                'msg' => 'Échec de l\'opération',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function UpdateService(Request $request, $service_id)
    {

        $rech = DB::table('services')->where('id', $service_id)->exists();

        if (!$rech) {
            return response()->json(['success' => false, 'msg' => 'Aucune données sur ce service n\'a été trouver'], 201);
        }

        DB::beginTransaction();

        try {

            $inserted = DB::table('services')->where('id', $service_id)->update([
                'nom' => $request->name,
                'description' => "SERVICE $request->name",
                'updated_at' => now(),
            ]);

            if (!$inserted) {
                throw new Exception('Erreur lors de l\'insertion dans la table services');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'msg' => 'Opération éffectuée avec succès'
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'error' => true,
                'msg' => 'Échec de l\'opération',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function UpdateCategorie(Request $request, $categorie_id)
    {

        $rech = DB::table('categories_demandes')->where('id', $categorie_id)->exists();

        if (!$rech) {
            return response()->json(['success' => false, 'msg' => 'Aucune données sur cette catégorie n\'a été trouver'], 201);
        }

        DB::beginTransaction();

        try {

            $inserted = DB::table('categories_demandes')->where('id', $categorie_id)->update([
                'nom' => $request->name,
                'description' => $request->name,
                'updated_at' => now(),
            ]);

            if (!$inserted) {
                throw new Exception('Erreur lors de l\'insertion dans la table categories_demandes');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'msg' => 'Opération éffectuée avec succès'
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'error' => true,
                'msg' => 'Échec de l\'opération',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
}
