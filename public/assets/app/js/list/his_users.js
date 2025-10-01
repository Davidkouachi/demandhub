$(document).ready(function () {

    window.list_his_users = function () {

        $.ajax({
            url: $('#url').attr('content') + '/api/his_users',
            method: 'GET',
            dataType: 'json',
            success: function(data) {

                const users = data.data;

                const table = $('.table_his');
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
                                    <span class="badge ${item.motif == 1 ? 'bg-success' : 'bg-danger'}"> 
                                        ${item.motif == 1 ? 'Connexion' : 'Déconnexion'}
                                    </span>
                                </td>
                                <td class="nk-tb-col">
                                    <span class="badge ${item.action == 0 ? 'bg-primary' : 'bg-warning'}"> 
                                        ${item.action == 0 ? `Par l'utilisateur` : 'Automatique'}
                                    </span>
                                </td>
                                <td class="nk-tb-col">
                                    <span class="tb-amount" >
                                        ${formatDateHeure(item.created_at)}
                                    </span>
                                </td>
                            </tr>
                        `;

                        // table.find("tbody").append(row);

                    });

                    table.find("tbody").html(rowsHtml);

                    initializeDataTable(".table_his", { responsive: { details: true } });
                } else {
                    $("#preloader_ch").remove();
                    // showAlert2("Alert", "Aucune facture n'a été trouver.", "info");

                    initializeDataTable(".table_his", { responsive: { details: true } });

                }
            },
            error: function() {
                $("#preloader_ch").remove();
                initializeDataTable(".table_his", { responsive: { details: true } });
            }
        });
        
    }

    $(document).off('click', '#btn_reload').on('click', '#btn_reload', function (event) {
        event.preventDefault();

        preloader();

        let table = $('.table_his').DataTable();
        table.clear().draw();

        list_his_users();

    });

    list_his_users();

});