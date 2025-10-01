$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    const url_base = $('#url').attr('content');
    const csrfMeta = $('meta[name="csrf-token"]');

    window.afficherCardCreditInfo = function () 
    {
        $('.contenu_creditInfo').empty().addClass('mb-3');

        divChargement('.contenu_creditInfo', 'Recherche en cours');

        axios.get(`${url_base}/api/affiche-creditUser`, {
            params: {
                user_id: user.id,
            },
            withCredentials: true,
        })
        .then(function(response) {

            overDisplay(1);

            const res = response.data;

            if (res.success) {

                const credits = res.credits;

                const contenu = divCreditUser(credits, nbre_magasin);

                $('.contenu_creditInfo').hide().empty().append(contenu).show('slow');
                $('.contenu_creditInfo').removeClass('mb-3');

                OffClick('.btnBordCredit', afficherCardCreditInfo);

                return false;
            } 

            $('.contenu_creditInfo').empty();

            if (res.info) {
                showAlert2(".div_alert_creditUser", "information-line", res.message, "info", "0");
            } else if (res.warning) {
                showAlert2(".div_alert_creditUser", "information-line", res.message, "warning", "0");
            } else if (res.error) {
                showAlert2(".div_alert_creditUser", "information-line", res.message, "danger", "0");
            } else {
                showAlert2(
                    ".div_alert_creditUser",
                    "information-line",
                    "Désolé, une erreur est survenue. Veuillez rafraîchir la page ou revenir plus tard.",
                    "danger",
                    "0"
                );
            }

        })
        .catch(function(error) {
            overDisplay(1);
            $('.contenu_creditInfo').empty();

            showAlert2(
                ".div_alert_creditUser",
                "information-line",
                'Une erreur c\'est produite, veuillez rafraîchir la page',
                "danger",
                "0",
            );

            console.error('Erreur mise à jour session', error);
        });

    }

    function incrementCardNbre(cardKey) {
        const $h3 = $(`#nbre-${cardKey}`);
        if ($h3.length === 0) return;

        const text = $h3.text();
        const parts = text.split(' / ');

        let currentNbre = parseInt(parts[0], 10);
        if (isNaN(currentNbre)) currentNbre = 0;

        const newNbre = currentNbre + 1;

        updateCardDisplay(cardKey, newNbre);
    }

    function updateCardDisplay(cardKey, newNbre) {
        const $h3 = $(`#nbre-${cardKey}`);
        if ($h3.length === 0) return;

        // Récupérer la limite max à droite du slash
        const text = $h3.text();
        const parts = text.split(' / ');
        const maxValue = parseInt(parts[1], 10) || 0;

        // Gérer l'affichage du badge "Limite atteinte"
        const $card = $h3.closest('.card');

        if (newNbre > maxValue) {
            // S’il n’y a pas déjà un badge, l’ajouter
            if ($card.find('.badge-limite').length === 0) {
                const badgeHtml = `
                    <span class="badge badge-limite bg-danger position-absolute top-0 start-50 mt-n1 mx-n1 p-1 fs-11"
                          style="transform: rotate(45deg);">
                        Limite atteinte
                    </span>
                `;
                $card.find('.avatar-xl').append(badgeHtml);
            }

            if (maxValue < newNbre) {
                showAlert(
                    "Limite de crédit atteinte", 
                    "Le nombre de magasins que vous pouvez créer est limité à " 
                    + creditUser.magasins + 
                    ". Veuillez contacter le support ou acheter de nouveau crédit de magasin.", 
                    "warning"
                );
                return false;
            }

        } else {
            // Sinon, supprimer le badge s’il existe
            $card.find('.badge-limite').remove();

            // Mettre à jour le texte du h3
            $h3.text(`${newNbre} / ${maxValue}`);
        }
    }

});