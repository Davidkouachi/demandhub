$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";

    initStart();

    function initStart()  {

        globalePage.append(FomulaireNewService());
        textMajuscule('#name');
        
    }

    $('#formDemande').on('submit', function(e) {
        e.preventDefault();

        const btnId = $('.btnForm');
        const btnLabel = $('.btnForm').text(); 

        const name = $('#name');
        const validation = $('#validation');

        if (!name.val().trim()) {

            showAlert(
                "Attention", 
                "Veuillez saisir le nom du service s'il vous plaît", 
                "info"
            );

            return;
        }

        if (!validation.is(':checked')) {

            showAlert(
                "Confirmation requise ⚠️", 
                "Vous devez confirmer que toutes les informations renseignées sont exactes.", 
                "warning"
            );

            return;
        }

        const data = {
            name: $('#name').val(),
            validation: validation.is(':checked') ? 1 : 0,
        };

        spinerButton(0, btnId, 'Vérification en cours');

        const urlAxios = `${url}/api/InsertServices`;

        reqAxios(1, urlAxios,'POST',data,btnId,btnLabel)
            .then(res => {
                if (res.success) {
                    resetForm();
                }
            });   
    });

    function resetForm() {
        // Réinitialise les champs texte
        $('#name').val(null);
        $('#validation').prop('checked', false);
    }

});
