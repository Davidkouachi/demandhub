$(document).ready(function () {

    window.list_config_servers = function () {

        $.ajax({
            url: $('#url').attr('content') + '/api/select_server',
            method: 'GET',
            dataType: 'json',
            success: function(data) {

                const servers = data.data;

                const table = $('.table_server');
                if ($.fn.DataTable.isDataTable(table)) {
                    table.DataTable().destroy();
                }

                table.find("tbody").empty();

                if (servers.length > 0) {

                    $.each(servers, function(index, item) {

                        const row = $(`
                            <tr class="nk-tb-item" >
                                <td class="nk-tb-col">
                                    <span class="tb-amount">${index + 1}</span>
                                </td>
                                <td class="nk-tb-col">
                                    ${item.name}
                                </td>
                                <td class="nk-tb-col">
                                    ${item.ip}
                                </td>
                                <td class="nk-tb-col">
                                    ${item.bd}
                                </td>
                                <td class="nk-tb-col">
                                    ${item.username}
                                </td>
                                <td class="nk-tb-col">
                                    ${'*'.repeat(item.password.length)}
                                </td>
                                <td class="nk-tb-col">
                                    <span class="tb-amount" >
                                        ${formatDateHeure(item.created_at)}
                                    </span>
                                </td>
                                <td class="nk-tb-col">
                                    <ul class="nk-tb-actions gx-1">
                                        <li class="nk-tb-action-hidden" >
                                            <a  href="#"
                                                class="btn btn-trigger btn-icon btn-delete text-danger"
                                                title="Supprimer"
                                                data-id="${item.id}"
                                            >
                                                <em class="icon ni ni-trash"></em>
                                            </a>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        `);

                        table.find("tbody").append(row);

                    });

                    initializeDataTable(".table_server", { responsive: { details: true } });
                } else {

                    // showAlert2("Alert", "Aucune facture n'a été trouver.", "info");

                    initializeDataTable(".table_server", { responsive: { details: true } });

                }
            },
            error: function() {
                initializeDataTable(".table_server", { responsive: { details: true } });
            }
        });
        
    }

    $('#btn_insert_servers').on('click', function (event) {
        event.preventDefault();

        $('#modal_serveur_select').hide();
        $('#modal_serveur_contenu').show();
        $('#modal_serveur_btn_btn').show();

        $('#type_modal').val(0);
        $('#modal_serveur_login').val(null);
        $('#modal_serveur_password').val(null);
        $('#name_serveur').val(null);
        $('#host_serveur').val(null);
        $('#database_serveur').val(null);
        $('#username_serveur').val(null);
        $('#password_serveur').val(null);

    });

    $('#btn_insert_update').on('click', function (event) {
        event.preventDefault();
        
        $('#modal_config_serveur_select').val(null).trigger('change.select2');

        $('#modal_serveur_select').show();
        $('#modal_serveur_contenu').hide();
        $('#modal_serveur_btn_btn').hide();

        $('#type_modal').val(1);
        $('#modal_serveur_login').val(null);
        $('#modal_serveur_password').val(null);
        $('#name_serveur').val(null);
        $('#host_serveur').val(null);
        $('#database_serveur').val(null);
        $('#username_serveur').val(null);
        $('#password_serveur').val(null);

    });

    $('.table_server').off('click', '.btn-delete').on('click', '.btn-delete', function (event) {
        event.preventDefault();

            const id = $(this).data('id');

            confirmAction().then((result) => {
                if (result.isConfirmed) {

                    preloader();

                    $.ajax({
                        url: $('#url').attr('content') + '/api/delete_servers/' + id,
                        method: 'GET',
                        success: function(response) {
                            $("#preloader_ch").remove();

                            if (response.success) {
                                list_config_servers();
                                Swal.fire("Succès!", "Opération éffectuée.", "success");
                            } else if (response.error) {
                                showAlert("Alert", "Échec de l'opération", "warning");
                            } else {
                                showAlert("Alert", "Une erreur est survenue", "error");
                            }
                        },
                        error: function() {
                            $("#preloader_ch").remove();
                            showAlert("Erreur", "Une erreur est survenue", "error");
                        }
                    });
                }
            });

    });

    $("#modal_config_serveur_select").on("change", function (event) {
        event.preventDefault();

        $('#modal_serveur_contenu').stop(true, true).slideDown();
        $('#modal_serveur_btn_btn').show();

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

    $("#modal_serveur_btn_btn").on("click", function (event) {
        event.preventDefault();

        let type = $('#type_modal').val();
        let login = $('#login').val();
        let mdp = $('#login_password').val();
        let server = $('#modal_config_serveur_select').val();
        let name = $('#name_serveur').val();
        let host = $('#host_serveur').val();
        let database = $('#database_serveur').val();
        let username = $('#username_serveur').val();
        let password = $('#password_serveur').val();

        if (type == 0) {
            
            if (!name.trim() || !host.trim() || !database.trim() || !username.trim() || !password.trim()) {
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
                    action: 1,
                },
                success: function (response) {
                    $("#preloader_ch").remove();

                    if (response.success) {

                        list_config_servers();
                        select_server('#modal_config_serveur_select',0);
                        $('#modalForm').modal('hide');
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

            if (!server.trim() || !name.trim() || !host.trim() || !database.trim() || !username.trim() || !password.trim()) {
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
                    action: 1,
                },
                success: function (response) {
                    $("#preloader_ch").remove();

                    if (response.success) {

                        list_config_servers();
                        select_server('#modal_config_serveur_select',0);
                        $('#modalForm').modal('hide');
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

    });

    $('#host_serveur').on('input', function () {
        let value = $(this).val();

        // Autorise chiffres et points
        value = value.replace(/[^0-9.]/g, '');

        // Empêche plusieurs points consécutifs
        value = value.replace(/\.{2,}/g, '.');

        // Empêche point au début
        if (value.startsWith('.')) {
            value = value.substring(1);
        }

        $(this).val(value);
    });



    list_config_servers();

});