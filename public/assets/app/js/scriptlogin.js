$(document).ready(function () {

    const emailVerif = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const loginPage = `
        <div class="text-center">
            <p class="text-muted mt-2">Plateforme de gestion des demandes</p>
        </div>
        <div class="text-center div_alert"></div>
        <form class="mt-4 pt-2" id="formLogin">
            <div class="mb-3">
                <label class="form-label">Login</label>
                <input type="text" class="form-control" id="login" placeholder="Entrer votre login">
            </div>
            <div class="mb-3">
                <div class="d-flex align-items-start">
                    <div class="flex-grow-1">
                        <label class="form-label">Mot passe</label>
                    </div>
                    <div class="flex-shrink-0">
                        <div class="">
                            <a href="#" data-page="password_oublier" class="text-muted">Mot de passe oublié?</a>
                        </div>
                    </div>
                </div>
                
                <div class="input-group auth-pass-inputgroup">
                    <input id="password" type="password" class="form-control" placeholder="Entrer votre mot de passe" aria-label="Password" aria-describedby="password-addon">
                    <button class="btn btn-light shadow-none ms-0" type="button" id="password-addon"><i class="mdi mdi-eye-outline"></i></button>
                </div>
            </div>
            <div class="row mb-4">
                <div class="col">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="remember_me">
                        <label class="form-check-label" for="remember_me">
                            Se souvenir de moi
                        </label>
                    </div>  
                </div>
                
            </div>
            <div class="mb-3">
                <button class="btn btn-success w-100 waves-effect waves-light" type="submit" id="btnLogin">
                    Connexion
                </button>
            </div>
        </form>
    `;

    const passwordPage = `
        <div class="text-center">
            <p class="text-muted mt-2">Plateforme de gestion des demandes</p>
        </div>
        <form class="mt-4 pt-2" action="">
            <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="text" class="form-control" id="username" placeholder="Enter username">
            </div>
            <div class="mb-3">
                <button class="btn btn-success w-100 waves-effect waves-light" type="submit">
                    Connexion
                </button>
            </div>
        </form>
        <div class="mt-3 text-center">
            <a href="#" data-page="Login" class="text-primary fw-semibold">
                Se connecter
            </a>
        </div>
    `;

    // 1. Chargement initial selon l'URL
    loadPage(getPageFromUrl());

    // 2. Gestion des liens dynamiques (changer de page sans recharger)
    $(document).on('click', 'a[data-page]', function (e) {
        e.preventDefault();
        const page = $(this).data('page');
        loadPage(page);
    });

    // 3. Gestion du bouton retour du navigateur
    window.addEventListener('popstate', function (event) {
        const page = getPageFromUrl() || 'Login' ; // récupère à nouveau l'URL
        loadPage(page);
    });

    function loadPage(page) {

        let titre = page;
        const appContenu = $('#contentPage');

        if (page === 'password_oublier') {
            titre = 'Mot de passe oublier';
        }

        document.title = titre + " | DemandeHub";
        history.pushState({ page }, '', '?page=' + page);
        
        const pageContent = (page === 'Login') ? loginPage : (page === 'password_oublier') ? passwordPage : loginPage;

        appContenu.hide('slow').empty(); // suppression immédiate de l'affichage
        appContenu.html(pageContent).show('slow'); // remplacement et réaffichage immédiats

    }

    function getPageFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page');
        return page === 'Login' ? 'Login' : page === 'password_oublier' ? 'password_oublier' : 'Login';
    }

    $(document).off('submit', '#formLogin').on('submit', '#formLogin', function (e) {
        e.preventDefault();

        const btnLabel = $('#btnLogin').text();
        const btnId = '#btnLogin';


        let login = $("#login").val().trim();
        let password = $("#password").val().trim();
        let remember_me = $('#remember_me').val().trim();

        if (!login || !password) {

            showAlert2(
                ".div_alert",
                "Veuillez bien vérifier le Login et le Mot de passe s'il vous plaît !!!",
                "warning",
                "0",
            );
        }

        spinerButton(0, '#btnLogin', 'Verification en cours');

        axios.get(`${url}/refresh-csrf`)
            .then(response => {
                
                // Configuration de l'en-tête CSRF d'Axios
                axios.defaults.headers.common['X-CSRF-TOKEN'] = response.csrf_token;

                // Deuxième requête : login
                return axios.post(`${url}/api/traitement_login`, {
                    login: login,
                    password: password,
                    remember_me: remember_me,
                });
            })
            .then(response => {
                spinerButton(1, btnId, btnLabel);

                const res = response.data;

                if (res.success) {

                    // localStorage.setItem("last_user_login", login);
                    successCompteUser('#contentPage', res.message);

                    window.location.href = url + "/";
                } else if (res.info) {
                    showAlert2(".div_alert", res.message, "info", "0");
                } else if (res.warning) {
                    showAlert2(".div_alert", res.message, "warning", "0");
                } else if (res.error) {
                    showAlert2(".div_alert", res.message, "danger", "0");
                } else {
                    showAlert2(".div_alert", "Désolé, une erreur est survenue. Veuillez rafraîchir la page ou revenir plus tard.", "danger", "0");
                }
            })
            .catch(error => {
                spinerButton(1, btnId, btnLabel);

                console.error(error);
                if (error.response && error.response.config.url.includes('refresh-csrf')) {
                    showAlert("Erreur", "Une erreur est survenue lors de la récupération du token.", "error");
                } else {
                    showAlert("Erreur", "Erreur lors de l'authentification.", "error");
                }
            });
    });

});
