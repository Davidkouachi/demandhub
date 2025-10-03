$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";

    initStart();

    function initStart()  {

        globalePage.append(ListeDemdandesCours());
        ListDemandeCours('#tableData');

        // Handler pour le bouton
        $(document).off('click', '.btn-view-row').on('click', '.btn-view-row', function() {
            const rowObj = $(this).data('row');
            const rowData = rowObj._cells.map(cell => cell.data);
            console.log(rowData);
        });
 
    }

});
