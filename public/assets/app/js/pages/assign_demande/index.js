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
        select_traiteur_service("#traiteur_id", user.service_id);
        
    }

    $('#formAssignDemande').on('submit', function(e) {
        e.preventDefault();

        const btnId = $('.btnForm');
        const btnLabel = $('.btnForm').text(); 

        var totalSize = filesArray.reduce((sum, f) => sum + f.size, 0);

        if (totalSize > maxTotalSize / 5) {

            Swal.fire({
                icon: 'warning',
                title: 'Envoi impossible',
                html: `
                    <p>La taille totale des fichiers dépasse la limite autorisée de <b>20 Mo</b>.</p>
                    <p>Veuillez retirer certains fichiers avant de soumettre le formulaire.</p>
                `,
                confirmButtonColor: '#d33'
            });

            const text = 'La taille totale des fichiers dépasse la limite autorisée de 20 mo, Veuillez retirer certains fichiers avant de soumettre le formulaire.';

            if (text !== "") {
                voixLocalIA(text);
            }

            return;
        }

        const objet = $('#objet');
        const categorie_id = $('#categorie_id');
        const description = $('#description');
        const piece_jointe = $('#piece_jointe');
        const validation = $('#validation');

        if (!objet.val().trim() || !categorie_id.val().trim() || !description.val().trim()) {

            showAlert(
                "Attention", 
                "Veuillez bien remplir tous les champs s'il vous plaît", 
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
            objet: $('#objet').val(),
            categorie_id: $('#categorie_id').val(),
            description: $('#description').val(),
            validation: validation.is(':checked') ? 1 : 0,
        };

        spinerButton(0, btnId, 'Vérification en cours');

        const urlAxios = `${url}/api/InsertDemandes/${user.id}`;

        reqAxios(1, urlAxios,'POST',data,btnId,btnLabel,'piece_jointe')
            .then(res => {
                if (res.success) {
                    resetForm();
                }
            });   
    });

    function resetForm() {
        // Réinitialise les champs texte
        $('#objet').val(null);
        $('#categorie_id').val(null).trigger('change.select2');
        $('#description').val(null);

        // Réinitialise la case à cocher ou le switch
        $('#validation').prop('checked', false);

        // Réinitialise le champ de fichier
        const $fileInput = $('#piece_jointe');
        $fileInput.val(null);

        // Vide le tableau global des fichiers sélectionnés
        if (typeof filesArray !== 'undefined') {
            filesArray = [];
        }

        // Supprime tous les aperçus
        $('#preview_files').empty();

        // Réinitialise le texte d’indication de fichier
        $('#file-chosen').text('Aucun fichier sélectionné');

        // Réinitialise la barre de progression ou les messages éventuels
        $('.progress-bar').css('width', '0%').removeClass('bg-danger').addClass('bg-primary');
        $('.progress-bar').parent().next('.text-center').remove();
    }

});
