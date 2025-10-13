$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";
    let filesArray = [];
    let maxFileSize = 5 * 1024 * 1024;   // 5 Mo
    let maxTotalSize = 20 * 1024 * 1024; // 20 Mo

    initStart();

    function initStart()  {

        globalePage.append(FormulaireAffecterEmploye());
        select_service_all('#service_id');
        select_employe_all('#employe_id');

    }

    $('#service_id').on('change', function(e) {
        e.preventDefault();

        const props = getSelecteData('#service_id');
        console.log(props);
        
        if (props.nbre_respo > 0) {

            const msg = "Le " + $(this).text() + " à déjà un responsable, par conséquent, l'employé selectionnez sera le responsable automatiquement"

            confirmAction('Information', msg).then((result) => {
                if (result.isConfirmed) {

                    
                } else {

                    selectRefreshNull('#service_id');
                    selectRefreshNull('#employe_id');
                    return;
                }
            });

            
        }
    });

    $('#formulaire').on('submit', function(e) {
        e.preventDefault();

        const btnId = $('.btnForm');
        const btnLabel = $('.btnForm').text(); 

        const name = $('#name');
        const tel = $('#tel');
        const login = $('#login');
        const email = $('#email');
        const password = $('#password');
        const role_id = 4;
        const service_id = 0;

        if (!name.val().trim() || !login.val().trim() || !email.val().trim() ||
            !password.val().trim() || !tel.val().trim()) {

            showAlert(
                "Attention", 
                "Veuillez bien remplir tous les champs s'il vous plaît", 
                "info"
            );

            return;
        }

        if (tel.val().length < 10) { 
            showAlert("Alert","Saisir un numéro de téléphone valide","warning");
            return false;
        }

        if (!verifEmail(email.val()) ) { 
            showAlert("Alert","Format Email invalide","warning");
            return false;
        }

        // if (!verifPassword(password.val())) {
        //     showAlert(
        //         "Alert",
        //         "Le mot de passe doit comporter au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre.",
        //         "warning"
        //     );
        //     return false;
        // }

        const data = {
            name: name.val(),
            tel: tel.val(),
            login: login.val(),
            email: email.val(),
            password: password.val(),
            role_id: 4,
            service_id: 0,
            suppr: $('#suppr').is(':checked') ? 1 : 0,
            lock: $('#lock').is(':checked') ? 1 : 0,
        };

        spinerButton(0, btnId, 'Vérification en cours');

        const urlAxios = `${url}/api/InsertUser`;

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
        $('#login').val(null);
        $('#email').val(null);
        $('#password').val('password');
        $('#suppr').prop('checked', false);
        $('#lock').prop('checked', false);
    }

});