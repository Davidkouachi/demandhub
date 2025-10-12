$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";
    let filesArray = [];
    let maxFileSize = 5 * 1024 * 1024;   // 5 Mo
    let maxTotalSize = 20 * 1024 * 1024; // 20 Mo

    initStart();

    function initStart()  {

        globalePage.append(FomulaireAssignDemdande());
        selectRefreshId('#statut');
        select_demande_assign(true, '#demande_id', user.service_id, $('#statut').val());
        select_traiteur_service("#traiteur_id", user.service_id);
        dataDayLimite('#date', 'min');
        
    }

    $('#statut').on('change', function(e) {
        e.preventDefault();

        const statut = $(this).val();

        console.log(statut);

        select_demande_assign(false,'#demande_id', user.service_id, statut);
 
    })

    $('#formAssignDemande').on('submit', function(e) {
        e.preventDefault();

        const btnId = $('.btnForm');
        const btnLabel = $('.btnForm').text(); 

        const statut = $('#statut');
        const demande_id = $('#demande_id');
        const traiteur_id = $('#traiteur_id');
        const date = $('#date');

        if (!traiteur_id.val().trim() || !statut.val().trim() || !demande_id.val().trim() || !date.val().trim()) {

            showAlert(
                "Attention", 
                "Veuillez bien remplir tous les champs s'il vous plaît", 
                "info"
            );

            return;
        }

        const data = {
            traiteur_id: traiteur_id.val(),
            date: date.val(),
            traiteur: traiteur_id.text(),
            respo: user.name,
        };

        spinerButton(0, btnId, 'Vérification en cours');

        const urlAxios = `${url}/api/InsertDesigneTraiteur/${user.id}/${demande_id.val()}`;

        reqAxios(1, urlAxios,'POST',data,btnId,btnLabel)
            .then(res => {
                if (res.success) {
                    resetForm();
                }
            });   
    });

    function resetForm() {
        // Réinitialise les champs texte
        $('#statut').val('en_attente').trigger('change'); 
        $('#traiteur_id').val(null).trigger('change.select2');
        $('#date').val(null);
        dataDayLimite('#date', 'min');
    }

});
