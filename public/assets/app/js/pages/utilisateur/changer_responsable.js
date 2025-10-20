$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";
    let filesArray = [];
    let maxFileSize = 5 * 1024 * 1024;   // 5 Mo
    let maxTotalSize = 20 * 1024 * 1024; // 20 Mo

    initStart();

    function initStart()  {

        globalePage.append(FormulaireChangerRespo());
        select_service_all("#service_id");
        selectRefreshId("#traiteur_id");

    }

    $('#service_id').on('change', function(e) {
        e.preventDefault();

        const selectedValue = $(this).val(); // ex: "1|nbre_respo=3"
        if (!selectedValue) return;

        const props = selectExtraitData(selectedValue);

        if (props.id == 0) return;

        if (props.nbre_respo == 0) {
            

            const msg = "Le " + $('#service_id option:selected').text() +
                        " n'a pas de responsable.";

            showAlert(
                "Attention", 
                msg, 
                "info"
            );

            return;

        } else if (props.nbre_traiteur == 0) {
            

            const msg = "Le " + $('#service_id option:selected').text() +
                        " n'a pas de traiteurs de demandes. voulez-vous créer un nouvel employé ?";

            confirmAction('Information', msg).then((result) => {
                if (result.isConfirmed) {
                    
                    $btn = $('#submenu-ajouter_employe');
                    if ($btn.length) {
                        console.log('ok');
                        $btn.trigger("click");
                    }

                } else {

                    selectRefreshNull('#service_id');
                }
            });

            return;

        } else {

            select_traiteur_service('#traiteur_id', props.id);
        }

    });


    $('#formulaire').on('submit', function(e) {
        e.preventDefault();

        const btnId = $('.btnForm');
        const btnLabel = $('.btnForm').text(); 

        const traiteur_id = $('#traiteur_id');
        const service_id = $('#service_id');

        if (traiteur_id.val() == '0' || service_id.val() == '0') {

            showAlert(
                "Attention", 
                "Veuillez bien remplir tous les champs s'il vous plaît", 
                "info"
            );

            return;
        }

        const props = selectExtraitData($('#service_id').val());

        spinerButton(0, btnId, 'Vérification en cours');

        const urlAxios = `${url}/api/UpdateChangeRespo/${traiteur_id.val()}/${props.id}`;

        reqAxios(1, urlAxios,'PUT',{},btnId,btnLabel)
            .then(res => {
                if (res.success) {
                    resetForm();
                }
            });   
    });

    function resetForm() {
        // Réinitialise les champs texte
        select_service_all('#service_id');
        selectRefreshNull('#traiteur_id');
    }

});