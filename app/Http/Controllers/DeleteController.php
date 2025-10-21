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
    public function DeleteMesDemandes(Request $request, $user_id, $demande_id)
    {

        $rech = DB::table('demandes')->where('id', $demande_id)->exists();

        if (!$rech) {
            return response()->json(['success' => false], 204);
        }

        DB::beginTransaction();

        try {
            // ✅ Insertion de la demande
            $demandeUid = (string) Str::uuid();

            $updated = DB::table('demandes')->where('id', $demande_id)->where('user_id', $user_id)->update([
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
                'message' => 'Opération éffectuée avec succès'
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

    public function DeleteService(Request $request, $service_id)
    {

        $rech = DB::table('services')->where('id', $service_id)->exists();

        if (!$rech) {
            return response()->json(['success' => false], 204);
        }

        DB::beginTransaction();

        try {

            $updated = DB::table('services')->where('id', $service_id)->update([
                'suppr' => 1,
                'updated_at' => now(),
            ]);

            if (!$updated) {
                throw new Exception('Erreur lors de l\'insertion dans la table services');
            }

            $updated2 = DB::table('categories_demandes')->where('service_id', $service_id)->update([
                'suppr' => 1,
                'updated_at' => now(),
            ]);

            if (!$updated2) {
                throw new Exception('Erreur lors de l\'insertion dans la table categories_demandes');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Opération éffectuée avec succès'
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

    public function DeleteCategorie(Request $request, $categorie_id)
    {

        $rech = DB::table('categories_demandes')->where('id', $categorie_id)->exists();

        if (!$rech) {
            return response()->json(['success' => false], 204);
        }

        DB::beginTransaction();

        try {

            $updated = DB::table('categories_demandes')->where('id', $categorie_id)->update([
                'suppr' => 1,
                'updated_at' => now(),
            ]);

            if (!$updated) {
                throw new Exception('Erreur lors de l\'insertion dans la table categories_demandes');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Opération éffectuée avec succès'
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

    // Fonction pour supprimer une annonce et les images associées
    // private function rollbackAnnonce($annonceId)
    // {
    //     $annonce = Annonce::find($annonceId);
    //     if ($annonce) {
    //         // Supprimer les images associées
    //         $photos = Annonce_photo::where('annonce_id', $annonceId)->get();
    //         foreach ($photos as $photo) {
    //             // Supprimer le fichier image du stockage
    //             Storage::delete($photo->image_chemin);
    //             // Supprimer l'enregistrement de la photo
    //             $photo->delete();
    //         }
    //         // Supprimer l'annonce
    //         $annonce->delete();
    //     }
    // }
}
