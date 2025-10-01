<?php

namespace App\Http\Controllers;

use App\Models\User;

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

class AuthController extends Controller
{

    public function login() 
    {
        if (Auth::check()) {
            return redirect()->route('dashbord');
        }

        return view('pages.auth.login');
    }

    public function traitement_login(Request $request)
    {

        $login = $request->input('login');
        $password = $request->input('password');
        $remember = $request->input('remember_me') === 'true' || $request->input('remember_me') === true;

        $user = DB::table('users')->whereRaw('BINARY login = ?', [$login])->first();

        if ($user) {

            // verifier si l'user n'a pas ete supprimer
            $controle1 = DB::table('users')->where('suppr', true)->where('id', $user->id)->first();
            if ($controle1) {
                return response()->json(['warning' => true, 'message' => 'Login ou Mot de passe incorrect']);
            }

            // verifier si l'user n'a pas ete bloquer
            $controle1 = DB::table('users')->where('lock', true)->where('id', $user->id)->first();
            if ($controle1) {
                return response()->json(['warning' => true, 'message' => 'Votre compte a été temporairement bloqué pour des raisons de sécurité. Veuillez contacter l’administrateur']);
            }

            $nbreAlert = DB::table('alertes')->where('lu', false)->where('user_id', $user->id)->count();
            $nomRole = DB::table('roles')->where('id', $user->role_id)->value('name');

            $menus = DB::table('menus')
                ->join('role_menus', 'menus.id', '=', 'role_menus.menu_id')
                ->where('role_menus.role_id', $user->role_id)
                ->orderBy('menus.order')
                ->select('menus.*')
                ->get();

            // Grouper les menus par parent
            $parents = collect($menus)->whereNull('parent_id')->values();
            $children = collect($menus)->whereNotNull('parent_id')->values();

            // Construction de la structure imbriquée
            $structuredMenus = $parents->map(function ($parent) use ($children) {
                $parent->submenus = $children->where('parent_id', $parent->id)->values();
                return $parent;
            });

            session([
                'nbreAlert' => $nbreAlert ?? 0,
                'nomRole' => $nomRole,
                'menuRole' => $structuredMenus,
            ]);

            if (Hash::check($password, $user->password)) {

                Auth::loginUsingId($user->id, $remember);

                // Récupérer les sessions du user
                $nbreSessions= DB::table('sessions')->where('user_id', $user->id)->count();

                // Vérifier s'il y a une session
                if ($nbreSessions) {
                    $last_activity = $nbreSessions->last_activity; // typiquement un timestamp UNIX

                    // Temps actuel en secondes
                    $now = time();

                    // Calcul de la différence en secondes
                    $diff = $now - $last_activity;

                    // Si l'utilisateur s'est connecté récemment (ex: il y a moins de 10 minutes)
                    if ($diff <= 600) { // 600 secondes = 10 minutes
                        return response()->json([
                            'user_connecter' => true,
                            'message' => 'Ce compte est déjà connecté sur un autre ordinateur, déconnectez-vous ou patientez 10 minutes et réessayez.'
                        ]);
                    }

                    // Sinon : session expirée → on la supprime (optionnel)
                    DB::table('sessions')->where('user_id', $user->id)->delete();
                }

                return response()->json(['success' => true, 'message' => 'Compte connecté']);
            }

            return response()->json(['warning' => true, 'message' => 'Login ou Mot de passe incorrect']);

        }

        return response()->json(['error' => true, 'message' => 'Login ou Mot de passe incorrect']);
    }

    public function traitement_register(Request $res)
    {
        $verifBout = new Boutique_verif();
        $verifUser = new User_verif();
        $verifFormule = new Souscription_verif();
        $fn = new fonctionTable();

        $nom = $res->input('nom');
        $email = $res->input('email');
        $tel = $res->input('tel');
        $login = $res->input('login');
        $password = $res->input('password');

        $existing = $fn->checkUniqueValues('users', [
            'tel' => $res->input('tel'),
            'email' => $res->input('email'),
            'login' => $res->input('login'),
        ], 'suppr', '=', 0);

        if ($existing) {
            return response()->json([
                'info' => true,
                'message' => "Un utilisateur avec le même $existing existe déjà."
            ]);
        }

        DB::beginTransaction();

        try {

            // 3. Insertion en base
            $userId = DB::table('users')->insertGetId([
                'name' => $res->input('nom'),
                'login' => $res->input('login'),
                'email' => $res->input('email'),
                'tel' => $res->input('tel'),
                'password' => password_hash($res->input('password'), PASSWORD_BCRYPT),
                'reset' => 1,
                'lock' => 0,
                'actif' => 1,
                'suppr' => 0,
                'type' => 1,
                'uid' => (string) Str::uuid(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if (!$userId) {
                throw new Exception('Données du formulaire incomplètes');
            }

            $credit = DB::table('user_credits')->insert([
                'user_id' => $userId,
                'produits' => 50,
                'magasins' => 1,
                'users' => 1,
                'fournisseurs' => 2,
                'clients' =>10,
                'uid' => (string) Str::uuid(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if (!$credit) {
                throw new Exception('Une erreur est survenue lors de la creation du compte');
            }

            $souscrit = DB::table('souscriptions')->insert([
                'user_id' => $userId,
                'formule_id' => 1,
                'is_active' => 1,
                'is_demo' => 1,
                'nbreMois' => 1,
                'dateDebut' => now(),
                'dateFin' => now()->addDays(30),
                'total' => 0,
                'payer' => 0,
                'reduc' => 0,
                'uid' => Str::uuid()->toString(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if (!$souscrit) {
                throw new Exception('Une erreur est survenue lors de la creation du compte');
            }

            DB::commit();
        } catch (Exception $e) {

            DB::rollback();
            return response()->json(['warning' => true, 'message' => $e->getMessage()]);
        }

        session([
            'nbre_magasin' => 0,
            'nbre_user' => 0,
            'menu_magasin' => '',
            'menu_role' => '',
        ]);

        if (Auth::attempt(['login' => $login, 'password' => $password])) {

            $creditUser = $fn->firstDataTable('user_credits', ['user_id' => $userId]);

            $formuleDemo = $verifFormule->verifDemo($userId);
            $formuleActuel = $verifFormule->verifActuel($userId);
            $formuleNbre = $verifFormule->verifNbre($userId);

            session([
                'creditUser' => $creditUser,
                'select_magasin' => 0,
                'magasin' => '',
                'formuleDemo' => $formuleDemo,
                'formuleActuel' => $formuleActuel,
                'formuleNbre' => $formuleNbre,
            ]);

            return response()->json(['success' => true, 'message' => 'Compte connecté']);
        }

        return response()->json(['warning' => true, 'message' => 'Login ou Mot de passe incorrect']);
    }

    public function mdp_reset(Request $res)
    {
        $fn = new fonctionTable();

        $existing = $fn->checkUniqueValues('users', [
            'email' => $res->input('email'),
        ], 'suppr', '=', 0);

        if (!$existing) {
            return response()->json([
                'info' => true,
                'message' => "Aucun utilisateur trouvé avec cet e-mail."
            ]);
        }

        DB::beginTransaction();

        try {

            $user = $fn->firstDataTable('users', ['email' => $res->input('email')]);
            $nouveauMdp = Str::random(10);
            $userUpdate = DB::table('users')->where('email', $res->input('email'))->update([
                'password' => password_hash($nouveauMdp, PASSWORD_BCRYPT),
                'reset' => 0,
                'updated_at' => now(),
            ]);

            if (!$userUpdate) {
                throw new Exception('Une erreur est survenue lors de la creation du nouveau mot de passe');
            }

            // envoi de email
            $mail = new PHPMailer(true);

            try {   
                $mail->isHTML(true);
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Username = 'dkstock225@gmail.com';
                $mail->Password = 'wfef myix wcdj whge';
                // $mail->SMTPSecure = 'tls';
                // $mail->Port = 587;
                $mail->SMTPSecure = 'ssl';
                $mail->Port = 465;
                $mail->CharSet = 'UTF-8';
                $mail->setFrom('dkstock225@gmail.com', 'DK-Stock');
                $mail->addAddress($res->email);
                $mail->Subject = 'Nouveau mot de passe | ' . config('app.name');
                $mail->Body = "
                    <h2 style='color: #116aef;'>Votre mot de passe a été réinitialisé</h2>
                    
                    <p>Bonjour <strong>{$user->name}</strong>,</p>
                    
                    <p>Voici votre nouveau mot de passe pour accéder à votre compte sur <strong>" . config('app.name') . "</strong> :</p>

                    <div style='background: #f4f4f4; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center; font-size: 18px; font-weight: bold;'>
                        {$nouveauMdp}
                    </div>

                    <p>Veuillez vous connecter avec ce mot de passe, puis le modifier immédiatement depuis votre profil.</p>

                    <hr style='margin-top: 30px;'>
                    <p style='font-size: 12px; color: #999;'>Demande faite le : <strong>" . now()->format('d/m/Y H:i') . "</strong></p>
                    <p style='font-size: 12px; color: #999;'>Ce message vous a été envoyé automatiquement. Ne pas répondre.</p>
                ";
                $mail->send();

            } catch (Exception $e) {
                DB::rollback();
                return response()->json([
                    'warning' => true,
                    'message' => "Une erreur c'est produite lors de l'envoi du email.",
                    'errorInfo' => $mail->ErrorInfo
                ]);
            }

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Lien envoyé avec succès']);

        } catch (Exception $e) {

            DB::rollback();
            return response()->json(['warning' => true, 'message' => $e->getMessage()]);
        }

    }

    public function UpdateMdpUser(Request $res, $uid)
    {
        $fn = new fonctionTable();

        $existing = $fn->checkUniqueValues('users', [
            'uid' => $uid,
        ]);

        if (!$existing) {
            return response()->json([
                'info' => true,
                'message' => "utilisateur introuvable."
            ]);
        }

        DB::beginTransaction();

        try {

            $userUpdate = DB::table('users')->where('uid', $uid)->update([
                'password' => password_hash($res->input('mdp'), PASSWORD_BCRYPT),
                'reset' => 1,
                'updated_at' => now(),
            ]);

            if (!$userUpdate) {
                throw new Exception('Une erreur est survenue lors de la mise à jour du nouveau mot de passe');
            }

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Mot de passe mis à jour']);

        } catch (Exception $e) {

            DB::rollback();
            return response()->json([
                'warning' => true, 
                'message' => 'Une erreur est survenue, veuillez réessayer', 
                'errorInfo' => $e->getMessage(),
            ]);
        }

    }

    public function deconnecter(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Supprimer le cookie de session (ajuster le domaine si besoin)
        setcookie('dk_stock_session', '', time() - 3600, '/', null, config('session.secure'), true);

        return redirect()->route('login')->withHeaders([
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }
}
