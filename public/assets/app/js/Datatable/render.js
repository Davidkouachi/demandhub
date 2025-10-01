$(document).ready(function () {

    window.ListData = function (Gid, id, rowsHtml) 
    {

        $(Gid).empty().append(divListMagasin2());

        const tableau = $(id);
        if ($.fn.DataTable.isDataTable(tableau)) {
            tableau.DataTable().destroy();
        }

        tableau.find("tbody").empty().append(rowsHtml);

        initializeDataTable(id).then(() => {
            $(Gid).show();
        }).catch((error) => {
            console.error("Erreur DataTable :", error);
        });


    }

    window.ListDataEmploye = function (Gid, id, rowsHtml) 
    {

        $(Gid).empty().append(divListEmploye2());

        const tableau = $(id);
        if ($.fn.DataTable.isDataTable(tableau)) {
            tableau.DataTable().destroy();
        }

        tableau.find("tbody").empty().append(rowsHtml);

        initializeDataTable(id).then(() => {
            $(Gid).show();
        }).catch((error) => {
            console.error("Erreur DataTable :", error);
        });


    }

});