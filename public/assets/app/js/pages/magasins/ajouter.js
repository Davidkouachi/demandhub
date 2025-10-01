$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    const url_base = $('#url').attr('content');
    const csrfMeta = $('meta[name="csrf-token"]');

    window.afficherCardNew = function () {

        $('#new_magasin').append(divNewMagasin());

        window.select_pays('.selectPays');

        window.numberTel('#tva');
        window.numberTelLimit('#tva', 2);

        window.numberTel('#tel');
        window.numberTelLimit('#tel', 10);

        window.numberTel('#code_postal');

        $("#form_magasin").on("submit", function (event) {
            event.preventDefault();

            if (creditUser.magasins < nbre_magasin) {
                showAlert(
                    "Limite de crédit atteinte", 
                    "Le nombre de magasins que vous pouvez créer est limité à " 
                    + creditUser.magasins + 
                    ". Veuillez contacter le support ou acheter de nouveau crédit de magasin.", 
                    "warning"
                );
                return false;
            }

            const data = {
                nom: $('#nom').val(),
                tel: $('#tel').val(),
                email: $('#email').val(),
                pays: $('#floatingSelectPays').val(),
                ville: $('#ville').val(),
                adresse: $('#adresse').val(),
                code_postal: $('#code_postal').val(),
                responsable: $('#responsable').val(),
                horaire_ouverture: $('#horaire_ouverture').val(),
                horaire_fermeture: $('#horaire_fermeture').val(),
                notes: $('#notes').val(),
                actif: $('#checkboxActif').is(':checked') ? 1 : 0,
                tva: $('#tva').val() || 0
            };

            // Vérification des champs obligatoires
            if (!data.nom.trim() || !data.pays.trim() || !data.ville.trim() ||
                !data.adresse.trim() || !data.responsable.trim() || !data.horaire_ouverture.trim() ||
                !data.horaire_fermeture.trim() || !data.tva.trim()) {
                showAlert("Alerte", "Données du formulaire incomplètes", "warning");
                return;
            }

            preloader(0);

            // Envoi via Axios
            let msg = "Une erreur est survenue";
            axios.get(`${url_base}/refresh-csrf`)
            .then(response => {
                const csrfToken = response.data.csrf_token;

                // Met à jour le token dans la balise meta
                csrfMeta.attr('content', csrfToken);

                // Configuration de l'en-tête CSRF d'Axios
                axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

                // Deuxième requête : login
                return axios.post(url_base + '/api/insertMagasin', {
                    nom: data.nom,
                    tel: data.tel,
                    email: data.email,
                    pays: data.pays,
                    ville: data.ville,
                    adresse: data.adresse,
                    code_postal: data.code_postal,
                    responsable: data.responsable,
                    horaire_ouverture: data.horaire_ouverture,
                    horaire_fermeture: data.horaire_fermeture,
                    notes: data.notes,
                    actif: data.actif,
                    tva_vente: data.tva,
                    user_id: user.id,
                });
            })
            .then(function (response) {
                preloader(1);

                const res = response.data;

                if (res.success) {
                    nbre_magasin = nbre_magasin +1;
                    window.incrementCardNbre('magasins');
                    window.refreshChoixMagasin();
                    window.refreshTable();
                    resetForm();
                    showAlert("Alerte", res.message, "success");
                } else if (res.info) {
                    showAlert("Alerte", res.message, "info");
                } else if (res.warning) {
                    showAlert("Alerte", res.message, "warning");
                    console.log(res.error);
                } else if (res.error) {
                    showAlert("Alerte", res.message, "danger");
                } else {
                    showAlert("Alerte", msg, "danger");
                }

            })
            .catch(function (error) {
                preloader(1);

                let er;
                if (error.response && error.response.data && error.response.data.message) {
                    er = error.response.data.message;
                }
                showAlert("Erreur", msg, "error");
                console.error("Erreur Axios :", er);
            });

        });

    }

    function resetForm () {
        const form = $('#form_magasin')[0];

        if (form) {
            form.reset(); // Réinitialise les champs standards
        }

        // Réinitialise aussi les champs Select2
        $('#floatingSelectPays').val(null).trigger('change.select2');

        // Si tu veux réinitialiser une autre select2 avec un placeholder :
        // $('#floatingSelectPays').val('').trigger('change');

        // Réinitialise manuellement les champs si nécessaire
        $('#nom, #tel, #email, #ville, #adresse, #code_postal, #responsable, #horaire_ouverture, #horaire_fermeture, #notes, #tva').val('');

        // Remettre le checkbox à coché (ou décoché selon le comportement voulu)
        $('#checkboxActif').prop('checked', true);
    }

});