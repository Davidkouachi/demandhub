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

class InsertController extends Controller
{
    public function InsertDemandes(Request $request, $user_id)
    {
        // ✅ Validation complète
        $validator = Validator::make($request->all(), [
            'objet' => 'required|string|max:255',
            'categorie_id' => 'required',
            'description' => 'required|string',
            'validation' => 'required|boolean',
            'piece_jointe.*' => 'nullable|file|max:5120|mimes:jpg,jpeg,png,pdf,xls,xlsx,doc,docx',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'info' => true,
                'msg' => 'Formulaire non valide',
                'errors' => $validator->errors()
            ], 201);
        }

        DB::beginTransaction();

        try {
            // ✅ Insertion de la demande
            $demandeUid = (string) Str::uuid();

            $inserted = DB::table('demandes')->insert([
                'uid' => $demandeUid,
                'user_id' => $user_id,
                'categorie_id' => $request->categorie_id,
                'objet' => $request->objet,
                'description' => $request->description,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if (!$inserted) {
                throw new Exception('Erreur lors de l\'insertion dans la table demandes');
            }

            // ✅ Gestion des fichiers
            $fichiers = $request->file('piece_jointe');
            $paths = [];

            if ($fichiers && count($fichiers) > 0) {
                foreach ($fichiers as $fichier) {

                    // Vérifie la taille manuellement
                    if ($fichier->getSize() > 5 * 1024 * 1024) {
                        throw new Exception("Le fichier {$fichier->getClientOriginalName()} dépasse la limite de 5 Mo.");
                    }

                    // Détermine le dossier
                    $extension = strtolower($fichier->getClientOriginalExtension());
                    $dossier = match ($extension) {
                        'jpg', 'jpeg', 'png', 'gif' => 'images',
                        'pdf' => 'pdf',
                        'xls', 'xlsx' => 'excel',
                        'doc', 'docx' => 'word',
                        default => 'autres',
                    };

                    // Crée le dossier si non existant
                    Storage::disk('public')->makeDirectory("uploads/{$dossier}");

                    // Renomme et stocke le fichier
                    $nomBase = pathinfo($fichier->getClientOriginalName(), PATHINFO_FILENAME);
                    $nomFichier = Str::slug($nomBase) . '-' . uniqid() . '.' . $extension;
                    $chemin = $fichier->storeAs("uploads/{$dossier}", $nomFichier, 'public');

                    $paths[] = [
                        'uid' => (string) Str::uuid(),
                        'demande_uid' => $demandeUid, // 🔗 pour relier le fichier à la demande
                        'nom_original' => $fichier->getClientOriginalName(),
                        'chemin' => $chemin,
                        'url' => url(Storage::url($chemin)), // 🔥 URL publique directement disponible
                        'type' => $dossier,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                if (!empty($paths)) {
                    $InsertedFiles = DB::table('files_demandes')->insert($paths);

                    if (!$InsertedFiles) {
                        throw new Exception('Erreur lors de l\'insertion dans la table files_demandes');
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'msg' => 'Demande enregistrée avec succès ✅'
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

    public function InsertDesigneTraiteur(Request $request, $respo_id, $demande_id)
    {
        // ✅ Validation complète
        $validator = Validator::make($request->all(), [
            'traiteur_id' => 'required',
            'date' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'info' => true,
                'msg' => 'Formulaire non valide',
                'errors' => $validator->errors()
            ], 201);
        }

        DB::beginTransaction();

        try {
            // ✅ Insertion de la demande
            $demandeUid = (string) Str::uuid();

            $inserted = DB::table('demandes')->where('id', $demande_id)->update([
                'traiteur_id' => $request->traiteur_id,
                'date_limite' => $request->date,
                'statut' => 'en_cours',
                'updated_at' => now(),
            ]);

            if (!$inserted) {
                throw new Exception('Erreur lors de l\'insertion dans la table demandes');
            }

            $inserted = DB::table('demande_actions')->insert([
                'uid' => $demandeUid,
                'demande_id' => $demande_id,
                'user_id' => $respo_id,
                'action' => 'Ordre de traitement',
                'commentaire' => "Le responsable $request->respo à désigner $request->traiteur pour traiteur avant le $request->date date limite de traitement",
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if (!$inserted) {
                throw new Exception('Erreur lors de l\'insertion dans la table demande_actions');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'msg' => 'Demande enregistrée avec succès ✅'
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
