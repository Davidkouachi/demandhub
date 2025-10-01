<!DOCTYPE html>
<html lang="fr">

<head>
    <!-- Title Meta -->
    <meta charset="utf-8" />
    <title>Sign In | DemandHub</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A fully responsive premium admin dashboard template, Real Estate Management Admin Template" />
    <meta name="author" content="Techzaa" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- App favicon -->
    <link rel="shortcut icon" href="assets/images/favicon.ico">
    <!-- Vendor css (Require in all Page) -->
    <link href="assets/css/vendor.min.css" rel="stylesheet" type="text/css" />
    <!-- Icons css (Require in all Page) -->
    <link href="assets/css/icons.min.css" rel="stylesheet" type="text/css" />
    <!-- App css (Require in all Page) -->
    <link href="assets/css/app.min.css" rel="stylesheet" type="text/css" />
    <!-- Theme Config js (Require in all Page) -->
    <script src="assets/js/config.min.js"></script>

    <link href="{{ asset('assets/app/css/styleLogin.css') }}" rel="stylesheet" type="text/css" />
    <script src="{{ asset('jquery-3.7.1.min.js') }} "></script>
    <script defer="" src="{{ asset('assets/app/librairies/axios/dist/axios.min.js') }}"></script>
    <script src="{{asset('assets/app/js/alert.js')}}"></script>
    <script src="{{asset('assets/app/js/format.js')}}"></script>
    <link rel="stylesheet" href="{{ asset('assets/app/css/style.css') }}">
    <script src="{{ asset('assets/app/js/url.js') }} "></script>
    <script src="{{ asset('assets/app/js/scriptlogin.js') }} "></script>
</head>

<body>

    <div class="row justify-content-center align-items-center" style="height:100vh;">
        <div class="col-xl-3">
            <div class="card auth-card">
                <div class="card-body px-4 py-4">
                    <div class="mx-auto mb-1 text-center auth-logo">
                        <a href="index.html" class="logo-dark">
                            <img src="assets/app/images/logo.png" height="80" alt="logo dark">
                        </a>
                    </div>
                    <h2 class="fw-bold text-uppercase text-center fs-18 mb-1">DemandHub</h2>
                    <div id="contentPage"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Vendor Javascript (Require in all Page) -->
    <script src="assets/js/vendor.js"></script>
    <!-- App Javascript (Require in all Page) -->
    <script src="assets/js/app.js"></script>

</body>

</html>
