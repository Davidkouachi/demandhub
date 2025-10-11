<?php

namespace Database\Seeders;

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
use Illuminate\Database\Seeder;

use Carbon\Carbon;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 7. Employé test
        DB::table('users')->insert([
            'uid' => Str::uuid(),
            'login' => 'employe',
            'email' => 'employe@demandhub.com',
            'password' => password_hash('password', PASSWORD_BCRYPT),
            'role_id' => 4, // Employé
            'service_id' => 0,
            'lock' => false,
            'suppr' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('users')->insert([
            'uid' => Str::uuid(),
            'login' => 'traiteur',
            'email' => 'traiteur@demandhub.com',
            'password' => password_hash('password', PASSWORD_BCRYPT),
            'role_id' => 3, // Employé
            'service_id' => 3,
            'lock' => false,
            'suppr' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

    }
}
