$(document).ready(function () {

    function afficheModal () {
        
    }

    select_server('#modal_config_serveur_select',0);

    $("#config_serveur_insert").on("click", function (event) {
        event.preventDefault();

        $('#modal_serveur_select').hide();
        $('#modal_serveur_contenu').show();
        $('#modal_serveur_btn').show();

        $('#type_modal').val(0);
        $('#modal_serveur_login').val(null);
        $('#modal_serveur_password').val(null);
        $('#name_serveur').val(null);
        $('#host_serveur').val(null);
        $('#database_serveur').val(null);
        $('#username_serveur').val(null);
        $('#password_serveur').val(null);

    });

    $("#config_serveur_update").on("click", function (event) {
        event.preventDefault();

        $('#modal_config_serveur_select').val(null).trigger('change.select2');

        $('#modal_serveur_select').show();
        $('#modal_serveur_contenu').hide();
        $('#modal_serveur_btn').hide();

        $('#type_modal').val(1);
        $('#modal_serveur_login').val(null);
        $('#modal_serveur_password').val(null);
        $('#name_serveur').val(null);
        $('#host_serveur').val(null);
        $('#database_serveur').val(null);
        $('#username_serveur').val(null);
        $('#password_serveur').val(null);

    });

    $("#modal_config_serveur_select").on("change", function (event) {
        event.preventDefault();

        $('#modal_serveur_contenu').stop(true, true).slideDown();
        $('#modal_serveur_btn').show();

        let selectedOption = $('#modal_config_serveur_select').find(':selected');
        let name = selectedOption.data('name');
        let host = selectedOption.data('host');
        let database = selectedOption.data('database');
        let username = selectedOption.data('username');
        let password = selectedOption.data('password');

        $('#name_serveur').val(name);
        $('#host_serveur').val(host);
        $('#database_serveur').val(database);
        $('#username_serveur').val(username);
        $('#password_serveur').val(password);

    });

    $("#modal_serveur_btn").on("click", function (event) {
        event.preventDefault();

        let type = $('#type_modal').val();
        let login = $('#modal_serveur_login').val();
        let mdp = $('#modal_serveur_password').val();
        let server = $('#modal_config_serveur_select').val();
        let name = $('#name_serveur').val();
        let host = $('#host_serveur').val();
        let database = $('#database_serveur').val();
        let username = $('#username_serveur').val();
        let password = $('#password_serveur').val();

        if (type == 0) {
            
            if (!login.trim() || !mdp.trim() || !name.trim() || !host.trim() || !database.trim() || !username.trim() || !password.trim()) {
                showAlert2("Alert","Veuillez remplir le formulaire s'il vous plaît","info");
                return false;
            }

            preloader();

            $.ajax({
                url: $('#url').attr('content') + "/api/insert_serveur",
                method: "GET",
                data: {
                    login: login,
                    mdp: mdp,
                    name: name,
                    host: host,
                    database: database,
                    username: username,
                    password: password,
                },
                success: function (response) {
                    $("#preloader_ch").remove();

                    if (response.success) {

                        select_server('#serveur',$('#CONNECT_ID').val());
                        $('#modalForm').modal('hide');
                        $('#modalForm').remove();
                        showAlert2("Succès", "Opération effectué", "success");

                    } else if (response.login_introuvable) {
                        showAlert2("Alert", "Login Introuvable", "info");
                        // console.log(response.message);
                    } else if (response.error_insert) {
                        showAlert2("Alert", "Une erreur est survenue lors de l'enregistrement'", "warning");
                        // console.log(response.message);
                    } else if (response.server_exists) {
                        showAlert2("Alert", "Ces serveur existe déjà", "warning");
                        // console.log(response.message);
                    } else if (response.g_non) {
                        showAlert2("Alert", "Vous n'avez pas les permissions requise pour éffectuer cette opération", "info");
                        // console.log(response.message);
                    } else if (response.login_non) {
                        showAlert2("Alert", "Veuillez bien vérifier vos coordonner", "warning");
                        // console.log(response.message);
                    } else {
                        showAlert2("Alert", "Echec de l'opération", "error");
                        // console.log(response.message);
                    }
                },
                error: function () {
                    $("#preloader_ch").remove();
                    showAlert2("Erreur", "Erreur est survenu, veuillez réessayer.", "error");
                    // console.log(response.message);
                },
            });

        } else if (type == 1) {

            if (!login.trim() || !mdp.trim() || !server.trim() || !name.trim() || !host.trim() || !database.trim() || !username.trim() || !password.trim()) {
                showAlert2("Alert","Veuillez remplir le formulaire s'il vous plaît","info");
                return false;
            }

            preloader();

            $.ajax({
                url: $('#url').attr('content') + "/api/update_serveur",
                method: "GET",
                data: {
                    login: login,
                    mdp: mdp,
                    server: server,
                    name: name,
                    host: host,
                    database: database,
                    username: username,
                    password: password,
                },
                success: function (response) {
                    $("#preloader_ch").remove();

                    if (response.success) {

                        select_server('#serveur',$('#CONNECT_ID').val());
                        $('#modalForm').modal('hide');
                        $('#modalForm').remove();
                        showAlert2("Succès", "Opération effectué", "success");

                    } else if (response.login_introuvable) {
                        showAlert2("Alert", "Login Introuvable", "info");
                        // console.log(response.message);
                    } else if (response.error_update) {
                        showAlert2("Alert", "Une erreur est survenue lors de la mise à jour", "warning");
                        // console.log(response.message);
                    } else if (response.server_exists) {
                        showAlert2("Alert", "Ce serveur existe déjà", "warning");
                        // console.log(response.message);
                    } else if (response.g_non) {
                        showAlert2("Alert", "Vous n'avez pas les permissions requise pour éffectuer cette opération", "info");
                        // console.log(response.message);
                    } else if (response.login_non) {
                        showAlert2("Alert", "Veuillez bien vérifier vos coordonner", "warning");
                        // console.log(response.message);
                    } else {
                        showAlert2("Alert", "Echec de l'opération", "error");
                        // console.log(response.message);
                    }
                },
                error: function () {
                    $("#preloader_ch").remove();
                    showAlert2("Erreur", "Erreur est survenu, veuillez réessayer.", "error");
                    // console.log(response.message);
                },
            });

        }

        // $('#modal_serveur_select').show();
        // $('#modal_serveur_contenu').hide();
        // $('#modal_serveur_btn').hide();

        // $('#type_modal').val(1);
        // $('#modal_serveur_login').val(null);
        // $('#modal_serveur_password').val(null);
        // $('#name_serveur').val(null);
        // $('#host_serveur').val(null);
        // $('#database_serveur').val(null);
        // $('#username_serveur').val(null);
        // $('#password_serveur').val(null);

        // preloader();

    });

});
