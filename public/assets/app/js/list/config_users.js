$(document).ready(function () {

    select_users('#users_select',0);

    window.list_config_users = function () {

        $.ajax({
            url: $('#url').attr('content') + '/api/list_users',
            method: 'GET',
            dataType: 'json',
            success: function(data) {

                const users = data.data;

                const table = $('.table_users');
                if ($.fn.DataTable.isDataTable(table)) {
                    table.DataTable().destroy();
                }

                table.find("tbody").empty();

                let rowsHtml = '';

                if (users.length > 0) {
                    $("#preloader_ch").remove();

                    $.each(users, function(index, item) {

                        rowsHtml += `
                            <tr class="nk-tb-item" >
                                <td class="nk-tb-col">
                                    <span class="tb-amount">${index + 1}</span>
                                </td>
                                <td class="nk-tb-col">
                                    ${item.login}
                                </td>
                                <td class="nk-tb-col">
                                    ${'*'.repeat(10)}
                                </td>
                                <td class="nk-tb-col">
                                    <span class="badge ${item.g_users == 1 ? 'bg-success' : 'bg-danger'}"> 
                                        ${item.g_users == 1 ? 'Autorisé' : 'Non-autorisé'}
                                    </span>
                                </td>
                                <td class="nk-tb-col">
                                    <span class="badge ${item.g_servers == 1 ? 'bg-success' : 'bg-danger'}"> 
                                        ${item.g_servers == 1 ? 'Autorisé' : 'Non-autorisé'}
                                    </span>
                                </td>
                                <td class="nk-tb-col">
                                    <span class="badge ${item.actif == 1 ? 'bg-success' : 'bg-danger'}"> 
                                        ${item.actif == 1 ? 'Compte activé' : 'Compte non-activé'}
                                    </span>
                                </td>
                                <td class="nk-tb-col">
                                    <span class="badge ${item.ligne == 1 ? 'bg-success' : 'bg-danger'}"> 
                                        ${item.ligne == 1 ? 'en ligne' : 'hors ligne'}
                                    </span>
                                </td>
                                <td class="nk-tb-col">
                                    <ul class="nk-tb-actions gx-1">
                                    ${ item.ligne == 1  ? `` : 
                                        `
                                            <li class="nk-tb-action-hidden" >
                                                <a  href="#"
                                                    class="btn btn-trigger btn-icon btn-delete text-danger"
                                                    title="Supprimer"
                                                    data-id="${item.id}"
                                                >
                                                    <em class="icon ni ni-trash"></em>
                                                </a>
                                            </li>
                                        `}
                                        
                                    </ul>
                                </td>
                            </tr>
                        `;

                        // table.find("tbody").append(row);

                    });

                    table.find("tbody").html(rowsHtml);

                    initializeDataTable(".table_users", { responsive: { details: true } });
                } else {
                    $("#preloader_ch").remove();
                    // showAlert2("Alert", "Aucune facture n'a été trouver.", "info");

                    initializeDataTable(".table_users", { responsive: { details: true } });

                }
            },
            error: function() {
                $("#preloader_ch").remove();
                initializeDataTable(".table_users", { responsive: { details: true } });
            }
        });
        
    }

    $('#btn_insert_servers').on('click', function (event) {
        event.preventDefault();

        $('#name_users').val(null);
        $('#login_users').val(null);
        $('#password_users').val(null);
        $('#modal_ges_uers_select').val(0).trigger('change');
        $('#modal_ges_servers_select').val(0).trigger('change');
        $('#modal_active_uers_select').val(0).trigger('change');

    });

    $('.table_users').off('click', '.btn-delete').on('click', '.btn-delete', function (event) {
        event.preventDefault();

            const id = $(this).data('id');

            confirmAction().then((result) => {
                if (result.isConfirmed) {

                    preloader();

                    $.ajax({
                        url: $('#url').attr('content') + '/api/delete_users/' + id,
                        method: 'GET',
                        success: function(response) {
                            $("#preloader_ch").remove();

                            if (response.success) {
                                list_config_users();
                                Swal.fire("Succès!", "Opération éffectuée.", "success");
                            } else if (response.error) {
                                list_config_users();
                                showAlert("Alert", response.message, "warning");
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

    $("#users_select").on("change", function (event) {
        event.preventDefault();

        $('#modal_users_contenu').stop(true, true).slideDown();
        $('#modal_users_edit_btn').show();

        let selectedOption = $('#users_select').find(':selected');
        let name = selectedOption.data('name');
        let login = selectedOption.data('login');
        let g_users = selectedOption.data('g_users');
        let g_servers = selectedOption.data('g_servers');
        let actif = selectedOption.data('actif');

        $('#name_edit').val(name);
        $('#login_edit').val(login);
        $('#ges_uers_select_edit').val(g_users).trigger('change');
        $('#ges_servers_select_edit').val(g_servers).trigger('change');
        $('#active_uers_select_edit').val(actif).trigger('change');

    });

    $("#modal_btn_users").on("click", function (event) {
        event.preventDefault();

        let name_users = $('#name_users').val();
        let login_users = $('#login_users').val();
        let password_users = $('#password_users').val();
        let modal_ges_uers_select = $('#modal_ges_uers_select').val();
        let modal_ges_servers_select = $('#modal_ges_servers_select').val();
        let modal_active_uers_select = $('#modal_active_uers_select').val();


            
        if (!name_users.trim() || !login_users.trim() || !password_users.trim()) {
            showAlert2("Alert","Veuillez remplir le formulaire s'il vous plaît","info");
            return false;
        }

        preloader();

        $.ajax({
            url: $('#url').attr('content') + "/api/insert_users",
            method: "GET",
            data: {
                name: name_users,
                login: login_users,
                password: password_users,
                ges_users: modal_ges_uers_select,
                ges_servers: modal_ges_servers_select,
                active: modal_active_uers_select,
            },
            success: function (response) {
                $("#preloader_ch").remove();

                if (response.success) {

                    list_config_users();
                    select_users('#users_select',0);
                    $('#modalFormAjouter').modal('hide');
                    showAlert2("Succès", "Opération effectué", "success");

                } else if (response.login_existe) {
                    showAlert2("Alert", "Ce login existe déjà", "info");
                    // console.log(response.message);
                } else if (response.error) {
                    showAlert2("Alert", "Echec de l'opération, veuillez réessayer", "warning");
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

    });

    $("#modal_users_edit_btn").on("click", function (event) {
        event.preventDefault();

        let id = $('#users_select').val();
        let name_users = $('#name_edit').val();
        let login_users = $('#login_edit').val();
        let password_users = $('#password_edit').val();
        let modal_ges_uers_select = $('#ges_uers_select_edit').val();
        let modal_ges_servers_select = $('#ges_servers_select_edit').val();
        let modal_active_uers_select = $('#active_uers_select_edit').val();
            
        if (!name_users.trim() || !login_users.trim()) {
            showAlert2("Alert","Veuillez remplir le formulaire s'il vous plaît","info");
            return false;
        }

        preloader();

        $.ajax({
            url: $('#url').attr('content') + "/api/update_users/" + id,
            method: "GET",
            data: {
                name: name_users,
                login: login_users,
                password: password_users,
                ges_users: modal_ges_uers_select,
                ges_servers: modal_ges_servers_select,
                active: modal_active_uers_select,
            },
            success: function (response) {
                $("#preloader_ch").remove();

                if (response.success) {

                    list_config_users();
                    $('#modal_users_contenu').stop(true, true).slideUp();
                    $('#users_select').val(null).trigger('change.select2');
                    $('#modalFormUpdate').modal('hide');
                    showAlert2("Succès", "Opération effectué", "success");

                } else if (response.login_existe) {
                    showAlert2("Alert", "Ce login existe déjà", "info");
                    // console.log(response.message);
                } else if (response.error_update) {
                    showAlert2("Alert", "Echec de l'opération, veuillez réessayer", "warning");
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

    });

    $('#btn_reload').on('click', function (event) {

        preloader();

        let table = $('.table_users').DataTable();
        table.clear().draw();

        list_config_users();
    });

    list_config_users();

});