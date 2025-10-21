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
    public function generateUniqueDemande()
    {
        return DB::transaction(function () {
            $anneeCourte = date('y'); // 2 derniers chiffres de l'année, ex: 25
            $prefixe = 'DEM' . $anneeCourte; // ex: DEM25

            do {
                // Générer 6 chiffres aléatoires
                $numero = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
                $matricule = $prefixe . '-' . $numero;

                // Vérifier si ce matricule existe déjà
                $exists = DB::table('demandes')->where('uid', $matricule)->lockForUpdate()->exists();
            } while ($exists); // Réessayer tant que doublon

            return $matricule;
        }, 5); // tentatives en cas de blocage concurrent
    }

    public function generateUniqueUser()
    {
        return DB::transaction(function () {
            $anneeCourte = date('y'); // 2 derniers chiffres de l'année, ex: 25
            $prefixe = 'AGENT' . $anneeCourte; // ex: DEM25

            do {
                // Générer 6 chiffres aléatoires
                $numero = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
                $matricule = $prefixe . '-' . $numero;

                // Vérifier si ce matricule existe déjà
                $exists = DB::table('users')->where('uid', $matricule)->lockForUpdate()->exists();
            } while ($exists); // Réessayer tant que doublon

            return $matricule;
        }, 5); // tentatives en cas de blocage concurrent
    }

    public function generateUniqueTraitement()
    {
        return DB::transaction(function () {
            $anneeCourte = date('y'); // 2 derniers chiffres de l'année, ex: 25
            $prefixe = 'TRAIT' . $anneeCourte; // ex: DEM25

            do {
                // Générer 6 chiffres aléatoires
                $numero = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
                $matricule = $prefixe . '-' . $numero;

                // Vérifier si ce matricule existe déjà
                $exists = DB::table('demande_actions')->where('uid', $matricule)->lockForUpdate()->exists();
            } while ($exists); // Réessayer tant que doublon

            return $matricule;
        }, 5); // tentatives en cas de blocage concurrent
    }

    public function generateUniqueService()
    {
        return DB::transaction(function () {
            $anneeCourte = date('y'); // 2 derniers chiffres de l'année, ex: 25
            $prefixe = 'SER' . $anneeCourte; // ex: DEM25

            do {
                // Générer 6 chiffres aléatoires
                $numero = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
                $matricule = $prefixe . '-' . $numero;

                // Vérifier si ce matricule existe déjà
                $exists = DB::table('services')->where('uid', $matricule)->lockForUpdate()->exists();
            } while ($exists); // Réessayer tant que doublon

            return $matricule;
        }, 5); // tentatives en cas de blocage concurrent
    }

    public function generateUniqueCategorie()
    {
        return DB::transaction(function () {
            $anneeCourte = date('y'); // 2 derniers chiffres de l'année, ex: 25
            $prefixe = 'CATEG' . $anneeCourte; // ex: DEM25

            do {
                // Générer 6 chiffres aléatoires
                $numero = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
                $matricule = $prefixe . '-' . $numero;

                // Vérifier si ce matricule existe déjà
                $exists = DB::table('categories_demandes')->where('uid', $matricule)->lockForUpdate()->exists();
            } while ($exists); // Réessayer tant que doublon

            return $matricule;
        }, 5); // tentatives en cas de blocage concurrent
    }






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
            $demandeUid = $this->generateUniqueDemande();

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

    public function InsertUser(Request $request)
    {
        // ✅ Validation complète
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'login' => 'required',
            'tel' => 'required',
            'email' => 'required',
            'password' => 'required',
            'role_id' => 'required',
            'service_id' => 'required',
            'suppr' => 'required|boolean',
            'lock' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            Log::info($validator->errors());
            return response()->json([
                'info' => true,
                'msg' => 'Formulaire non valide',
                'errors' => $validator->errors()
            ], 201);
        }

        $verifications = [
            'tel' => $request->tel,
            'login' => $request->login,
            'email' => $request->email,
        ];

        $Exist = DB::table('users')->where(function ($query) use ($verifications) {
            $query->where('tel', $verifications['tel'])
                    ->where('login', $verifications['login'])
                    ->where('email', $verifications['email']);
        })->first();

        if ($Exist) {
            if ($Exist->tel === $verifications['tel']) {
                return response()->json(['success' => false, 'msg' => 'Ce numéro de télèphone existe déjà'], 201);
            } elseif ($Exist->login === $verifications['login']) {
                return response()->json(['success' => false, 'msg' => 'Le login existe déjà'], 201);
            } elseif ($Exist->email === $verifications['email']) {
                return response()->json(['success' => false, 'msg' => 'L\'email existe déjà'], 201);
            }
        }

        DB::beginTransaction();

        try {
            // ✅ Insertion de la demande
            $uid = $this->generateUniqueUser();

            $inserted = DB::table('users')->insert([
                'uid' => $uid,
                'name' => $request->name,
                'tel' => $request->tel,
                'login' => $request->login,
                'email' => $request->email,
                'password' => password_hash($request->password, PASSWORD_BCRYPT),
                'role_id' => 4,
                'service_id' => 0,
                'suppr' => $request->suppr,
                'lock' => $request->lock,
                'created_at' => now(),
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

    public function InsertTraitement(Request $request, $user_id, $demande_id, $type)
    {
        // ✅ Validation complète
        $validator = Validator::make($request->all(), [
            'motif' => 'required',
        ]);

        if ($validator->fails()) {
            Log::info($validator->errors());
            return response()->json([
                'info' => true,
                'msg' => 'Formulaire non valide',
                'errors' => $validator->errors()
            ], 201);
        }

        DB::beginTransaction();

        try {
            // ✅ Insertion de la demande
            $uid = $this->generateUniqueTraitement();

            if ($type == 0) {
                $statut = 'rejete';
            } else if ($type == 1) {
                $statut = 'traitee';
            }

            $inserted = DB::table('demande_actions')->insert([
                'uid' => $uid,
                'demande_id' => $demande_id,
                'action' => 'Traitement de la demande',
                'user_id' => $user_id,
                'commentaire' => $request->motif,
                'type' => $type,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if (!$inserted) {
                throw new Exception('Erreur lors de l\'insertion dans la table demande_actions');
            }

            $insertedU = DB::table('demandes')->where('id', $demande_id)->update([
                'statut' => $statut,
                'date_traiter' => now(),
                'traiter' => 1,
                'updated_at' => now(),
            ]);

            if (!$insertedU) {
                throw new Exception('Erreur lors de l\'insertion dans la table demandes');
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

    public function InsertServices(Request $request)
    {
        // ✅ Validation complète
        $validator = Validator::make($request->all(), [
            'name' => 'required',
        ]);

        if ($validator->fails()) {
            Log::info($validator->errors());
            return response()->json([
                'info' => true,
                'msg' => 'Formulaire non valide',
                'errors' => $validator->errors()
            ], 201);
        }

        $rech = DB::table('services')
                    ->where('nom', $request->name)
                    ->exists();

        if ($rech) {
            return response()->json(['success' => false, 'msg' => 'Cet service existe déjà'], 201);
        }

        DB::beginTransaction();

        try {
            // ✅ Insertion de la demande
            $uid = $this->generateUniqueService();

            $inserted = DB::table('services')->insert([
                'uid' => $uid,
                'entreprise_id' => 1,
                'nom' => $request->name,
                'description' => "SERVICE $request->name",
                'created_at' => now(),
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

    public function InsertCategorie(Request $request)
    {
        // ✅ Validation complète
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'service_id' => 'required',
        ]);

        if ($validator->fails()) {
            Log::info($validator->errors());
            return response()->json([
                'info' => true,
                'msg' => 'Formulaire non valide',
                'errors' => $validator->errors()
            ], 201);
        }

        $rech = DB::table('categories_demandes')
                    ->where('nom', $request->name)
                    ->where('service_id', $request->service_id)
                    ->exists();

        if ($rech) {
            return response()->json(['success' => false, 'msg' => 'Cette catégorie existe déjà'], 201);
        }

        DB::beginTransaction();

        try {
            // ✅ Insertion de la demande
            $uid = $this->generateUniqueCategorie();

            $inserted = DB::table('categories_demandes')->insert([
                'uid' => $uid,
                'service_id' => $request->service_id,
                'nom' => $request->name,
                'description' => $request->name,
                'created_at' => now(),
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
