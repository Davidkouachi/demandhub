<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class CheckAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            // Log facultatif (utile en debug seulement)
            Log::info('Utilisateur non authentifié sur : ' . $request->path());

            // Si c’est une requête "navigateur" (HTML)
            if (!$request->expectsJson() && !$request->ajax()) {
                return redirect()->route('login')
                    ->with('error', 'Veuillez vous connecter pour accéder à cette page.');
            }

            // Si c’est une requête API ou AJAX
            return response()->json(['error' => 'Non authentifié.'], 401);
        }

        return $next($request);
    }
}
