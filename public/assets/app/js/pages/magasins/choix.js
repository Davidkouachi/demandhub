$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    // const url_base = $('#url').attr('content');
    // const csrfMeta = $('meta[name="csrf-token"]');
    
    let data_list_employe = [];
    let msg = "Une erreur est survenue";

    initStart();

    function initStart() 
    {

        globalePage.append(divMagasin(user.type));

        afficherCard0();

        if (user.type === 1) {
            afficherCardCreditInfo();

            afficherCardNew();
            afficherCardNewEmploye();

            afficherCardTable();
            afficherCardTableEmploye();

            afficherCardAffectation();
        }
        
    }

    // credit de l'utilisateur--------------------------------------------------------------------

    function afficherCardCreditInfo() 
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

            const res = response.data;

            if (res.success) {

                const credits = res.credits;

                const contenu = divCreditUser(credits, nbre_magasin, nbre_user);

                $('.contenu_creditInfo').hide().empty().append(contenu).show('slow');
                $('.contenu_creditInfo').removeClass('mb-3');

                OffClick('.btnBordCredit', afficherCardCreditInfo);

            } else if (res.info) {
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
        if ($h3.length === 0) return false;

        const text = $h3.text();
        const parts = text.split(' / ');

        let currentNbre = parseInt(parts[0], 10);
        if (isNaN(currentNbre)) currentNbre = 0;

        const newNbre = currentNbre + 1;

        updateCardDisplay(cardKey, newNbre);
    }

    function updateCardDisplay(cardKey, newNbre) {
        const $h3 = $(`#nbre-${cardKey}`);
        if ($h3.length === 0) return false;

        // Récupérer la limite max à droite du slash
        const text = $h3.text();
        const parts = text.split(' / ');
        const maxValue = parseInt(parts[1], 10) || 0;

        // Gérer l'affichage du badge "Limite atteinte"
        const $card = $h3.closest('.card');

        if (newNbre >= maxValue) {
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

            if (maxValue <= newNbre) {
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

    // choix magasin-------------------------------------

    function afficherCard0() 
    {
        $('#choix_magasin').append(divSelectMagasin());

        afficherMagasin() 
    }

    function afficherMagasin(type = 0) 
    {
        $('.contenu_magasin').empty();

        divChargement('.contenu_magasin', 'Recherche en cours');

        overDisplay(0);

        axios.get(`${url_base}/api/affiche-select-magasin`, {
            params: {
                user_id: user.id,
            },
            withCredentials: true,
        })
        .then(function(response) {

            overDisplay(1);

            const res = response.data;

            if (res.success) {

                const magasins = res.magasins;

                const magasinId = magasin ? magasin.id : 0;
                const contenu = divSelectMagasin2(magasins, magasinId);

                if (type === 0) {
                    $('.contenu_magasin').hide().empty().append(contenu).show('slow');
                } else {
                    $('.contenu_magasin').empty().append(contenu);
                }

                $(document).on('change', 'input[name="selectMagasin"]', function (e) {
                    e.preventDefault();

                    const selectedId = parseInt($(this).val());
                    const isFerme = $(this).data('ferme') == 1;
                    const isActif = $(this).data('actif') == 0;

                    if (selectedId === magasin.id) {
                        // Déselectionner
                        $(this).prop('checked', false);

                        // Afficher un message
                        showAlert("Alert", "Vous êtes déjà connecté à ce magasin. Veuillez choisir un autre magasin s'il vous plaît !!!", "info");
                        return false;
                    }

                    if (isFerme && user.type === 2) {
                        // Si le magasin est fermé
                        $(this).prop('checked', false);

                        showAlert("Fermé", "Ce magasin est actuellement fermé. Vous ne pouvez pas vous y connecter.", "warning");
                        return false;
                    }

                    if (isActif) {
                        // Si le magasin est fermé
                        $(this).prop('checked', false);

                        showAlert("Fermé", "Ce magasin est hors service, veuillez contacter votre employeur.", "warning");
                        return false;
                    }

                });

                OffClick('.btnRefreshBoutique', refreshChoixMagasin);
                OffClick('.btnTerminerBoutique', choix_Magasin);

                scrollCarousel();

            } else if (res.info) {
                showAlert2(".div_alert_global", "information-line", res.message, "info", "0");
            } else if (res.warning) {
                showAlert2(".div_alert_global", "information-line", res.message, "warning", "0");
            } else if (res.error) {
                showAlert2(".div_alert_global", "information-line", res.message, "danger", "0");
            } else {
                showAlert2(
                    ".div_alert_global",
                    "information-line",
                    "Désolé, une erreur est survenue. Veuillez rafraîchir la page ou revenir plus tard.",
                    "danger",
                    "0"
                );
            }

        })
        .catch(function(error) {
            overDisplay(1);

            showAlert2(
                ".div_alert_global",
                "information-line",
                'Une erreur c\'est produite, veuillez rafraîchir la page',
                "danger",
                "0",
            );

            console.error('Erreur mise à jour session', error);
        });

    }

    function scrollCarousel()
    {
        const $carousel = $('#carouselMagasin');
        const $card = $carousel.find('.carousel-card').first();
        const cardWidth = $card.outerWidth(true); // Inclut margin

        $('#btnNextMagasin').on('click', function () {
            $carousel.animate({
                scrollLeft: $carousel.scrollLeft() + cardWidth
            }, 1);
        });

        $('#btnPrevMagasin').on('click', function () {
            $carousel.animate({
                scrollLeft: $carousel.scrollLeft() - cardWidth
            }, 1);
        });

        // ▶ Glisser-déposer (drag scroll)
        let isDragging = false;
        let startX;
        let scrollLeft;

        $carousel.on('mousedown', function (e) {
            isDragging = true;
            startX = e.pageX - $carousel.offset().left;
            scrollLeft = $carousel.scrollLeft();
            $carousel.addClass('dragging');
        });

        $(document).on('mouseup', function () {
            isDragging = false;
            $carousel.removeClass('dragging');
        });

        $carousel.on('mouseleave', function () {
            isDragging = false;
            $carousel.removeClass('dragging');
        });

        $carousel.on('mousemove', function (e) {
            if (!isDragging) return false;
            e.preventDefault();
            const x = e.pageX - $carousel.offset().left;
            const walk = (x - startX) * 1; // facteur de vitesse
            $carousel.scrollLeft(scrollLeft - walk);
        });
    }

    function choix_Magasin()
    {

        const selectedRadio = $('input[name="selectMagasin"]:checked');

        const selectedMagasinId = selectedRadio.val();
        const selectedRoleId = selectedRadio.data('role_id');

        if (selectedRadio.length === 0) {
            showAlert("Alert","Veuillez sélectionner un magasin s'il vous plaît !!!","warning");
            return false;
        }

        spinerButton(0, '.btnTerminerBoutique', 'Verification en cours');
        overDisplay(0);

        axios.get(`${url_base}/api/select-magasin`, {
            params: {
                magasin_id: selectedMagasinId,
                role_id: selectedRoleId,
            },
            withCredentials: true,
        })
        .then(function(response) {

            // spinerButton(1, '.btnTerminerBoutique', 'Terminer');
            // overDisplay(1);

            $('input[name="selectMagasin"]').prop('checked', false);

            const res = response.data;

            if (res.success) {

                $('.btn_group').hide('slow');
                overDisplay(0);

                showAlert2(
                    ".div_alert_choix_magasin",
                    "information-line",
                    res.message,
                    "success",
                    1
                );

                // Redirection après 2 secondes
                setTimeout(() => {
                    window.location.href = url_base + "/";
                }, 2000);

                return false; // On quitte ici, inutile d'exécuter la suite
            }

            // Réactiver le bouton et masquer le sur-affichage
            spinerButton(1, '.btnTerminerBoutique', 'Connexion');
            overDisplay(1);

            // Affichage des messages selon le type de retour
            if (res.info) {
                showAlert2(".div_alert_global", "information-line", res.message, "info", "0");
            } else if (res.warning) {
                showAlert2(".div_alert_global", "information-line", res.message, "warning", "0");
            } else if (res.error) {
                showAlert2(".div_alert_global", "information-line", res.message, "danger", "0");
            } else {
                showAlert2(
                    ".div_alert_global",
                    "information-line",
                    "Désolé, une erreur est survenue. Veuillez rafraîchir la page ou revenir plus tard.",
                    "danger",
                    "0"
                );
            }

        })
        .catch(function(error) {
            spinerButton(1, '.btnTerminerBoutique', 'Connexion');
            overDisplay(1);

            showAlert2(
                ".div_alert_global",
                "information-line",
                'Une erreur c\'est produite, veuillez réessayer',
                "danger",
                "0",
            );

            console.error('Erreur mise à jour session', error);
        });

    }

    function refreshChoixMagasin()
    {

        afficherMagasin();

    }

    // liste des magasins------------------------------------------

    function afficherCardTable() {

        $('#list_magasin').append(divListMagasin());

        divChargement('.contenu_liste', 'Recherche en cours');
        afficheTableau();

        OffClick('.btn_refresh', refreshTable);

    }

    function refreshTable() {

        divChargement('.contenu_liste', 'Recherche en cours');
        afficheTableau();
    }

    function afficheTableau()
    {
        overDisplay(0);

        data_list = [];

        // Envoi via Axios
        
        axios.get(url_base + '/api/listMagasin', {
            params: {
                user_id: user.id,
            }
        })
        .then(function (response) {
            overDisplay(1);

            const res = response.data;

            // if (style === 0) {
            //     $('.contenu_liste').hide().empty();
            // } else{
            //     $('.contenu_liste').hide().empty();
            // }
            
            if (res.success) {

                data_list = res.data

                renderData(data_list);

                // if (data_list.length === 0) {
                    
                //     showAlert("Alerte", "Aucunes données n'a été trouvée", "info");
                // }

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
            overDisplay(1);

            let er;
            if (error.response && error.response.data && error.response.data.message) {
                er = error.response.data.message;
            }
            showAlert("Erreur", msg, "error");
            console.error("Erreur Axios :", er);
        });
    }

    function renderStatut(horaire_ouverture, horaire_fermeture)
    {
        const now = new Date();
        let currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

        // Vérifie si les secondes ne sont pas déjà présentes
        if (!/^\d{2}:\d{2}:\d{2}$/.test(currentTime)) {
            currentTime += ':00';
        }

        const heureOuverture = horaire_ouverture ?? null;
        const heureFermeture = horaire_fermeture ?? null;

        let badge = `<span class="badge bg-secondary ms-1 mt-1 p-1">Inconnu</span>`; // Valeur par défaut

        if (heureOuverture && heureFermeture) {
            const current = currentTime;
            const ouvert = heureOuverture <= current && current < heureFermeture;

            badge = ouvert
                ? `<span class="badge bg-success ms-1 mt-1 p-1">Ouvert</span>`
                : `<span class="badge bg-danger ms-1 mt-1 p-1">Fermé</span>`;
        }

        return badge;
    }

    function renderData(data_list)
    {

        let rowsHtml = '';

        $.each(data_list, function(index, item) {

            rowsHtml += `
                <tr ${magasin.id === item.id ? `class="bg-light"` : ``} >
                    <td>${index + 1}</td>
                    <td>${item.nom ?? 'Néant'}</td>
                    <td>${item.code ?? 'Néant'}</td>
                    <td>${item.tel ?? 'Néant'}</td>
                    <td>${item.responsable ?? 'Néant'}</td>
                    <td>de ${item.horaire_ouverture ?? 'Néant'} à ${item.horaire_fermeture ?? 'Néant'}</td>
                    <td>
                        ${item.suppr === 1 ? `
                        <span class="badge bg-danger ms-1 mt-1 p-1">Supprimer</span>
                        ` : `
                            ${item.lock === 1 ? `
                            <span class="badge bg-danger ms-1 mt-1 p-1">Blocqué</span>
                            ` : 
                                `${item.actif === 1 ? `
                                    ${magasin.id == item.id ? `
                                        <span class="badge bg-success ms-1 mt-1 p-1">Connecté</span>
                                        ` : `
                                    ${renderStatut(item.horaire_ouverture, item.horaire_fermeture)}
                                    `}
                                ` : `
                                <span class="badge bg-warning ms-1 mt-1 p-1">hors service</span>
                                `} 
                            `}
                        `}
                    </td>
                    <td>${formatDateHeure(item.created_at) ?? 'Néant'}</td>
                    <td>
                        ${item.lock === 0 ? `
                        <div class="dropdown flex-shrink-0 text-muted table-dropdown">
                            <a href="#" class="dropdown-toggle drop-arrow-none fs-20 link-reset"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="ri-more-2-fill"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end">
                                ${item.suppr === 1 ? `
                                <a data-uid="${item.uid}" data-suppr="0" data-actif="0" href="javascript:void(0);" class="dropdown-item text-warning btn_suppr">
                                    <i class="ri-recycle-line me-1"></i>
                                    Restaurer
                                </a>
                                ` : `
                                <a href="javascript:void(0);" class="dropdown-item text-primary btn_detail"
                                    data-nom="${item.nom ?? ''}"
                                    data-code="${item.code ?? ''}"
                                    data-adresse="${item.adresse ?? ''}"
                                    data-ville="${item.ville ?? ''}"
                                    data-code_postal="${item.code_postal ?? ''}"
                                    data-pays="${item.pays ?? ''}"
                                    data-tel="${item.tel ?? ''}"
                                    data-email="${item.email ?? ''}"
                                    data-responsable="${item.responsable ?? ''}"
                                    data-horaire_ouverture="${item.horaire_ouverture ?? ''}"
                                    data-horaire_fermeture="${item.horaire_fermeture ?? ''}"
                                    data-tva="${item.tva_vente ?? 0}"
                                    data-actif="${item.actif ?? 0}"
                                    data-notes="${item.notes ?? ''}"
                                    data-date_creation="${formatDateHeure(item.created_at) ?? ''}"
                                >
                                    <i class="ri-eye-line me-1"></i> Détails
                                </a>

                                    ${item.actif === 1 ? `
                                    <a data-uid="${item.uid}" data-actif="0" href="javascript:void(0);" class="dropdown-item text-warning btn_actif">
                                        <i class="ri-toggle-line me-1" style="transform: rotate(180deg);"></i> 
                                        Désactivé
                                    </a>
                                    ` : `
                                    <a data-uid="${item.uid}" data-actif="1" href="javascript:void(0);" class="dropdown-item text-success btn_actif">
                                        <i class="ri-toggle-line me-1"></i> 
                                        Activé
                                    </a>
                                    `}
                                <a href="javascript:void(0);" class="dropdown-item text-info btn_update"
                                    data-uid="${item.uid}"
                                    data-nom="${item.nom}"
                                    data-code="${item.code}"
                                    data-adresse="${item.adresse}"
                                    data-ville="${item.ville}"
                                    data-code_postal="${item.code_postal}"
                                    data-pays="${item.pays}"
                                    data-tel="${item.tel}"
                                    data-email="${item.email}"
                                    data-responsable="${item.responsable}"
                                    data-horaire_ouverture="${item.horaire_ouverture}"
                                    data-horaire_fermeture="${item.horaire_fermeture}"
                                    data-tva="${item.tva_vente ?? 0}"
                                    data-notes="${item.notes}"
                                >
                                    <i class="ri-edit-box-line me-1"></i> 
                                    Mise à jour
                                </a>
                                    ${magasin.id === item.id ? `` : `
                                    <a data-uid="${item.uid}" data-suppr="1" data-actif="0" href="javascript:void(0);" class="dropdown-item text-danger btn_suppr">
                                        <i class="ri-delete-bin-line me-1"></i> 
                                        Supprimer
                                    </a>
                                    `}
                                `}
                            </div>
                        </div>
                        ` : `` }
                    </td>
                </tr>
            `;
        }); 

        ListData('.contenu_liste', '.liste_magasin', rowsHtml);

        $(document).off('click', '.btn_detail').on('click', '.btn_detail', function (event) {
            event.preventDefault();

            $(document).trigger('click');

            const modalBody = `
            <div class="modal fade" id="modalDetails" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Détails du Magasin</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                        </div>
                        <div class="modal-body">
                            <div class="d-flex align-items-center justify-content-center mb-2">
                                <div class="avatar-xl">
                                    <span class="avatar-title bg-info text-white rounded-circle fs-42">
                                        <i class="ri-building-line"></i>
                                    </span>
                                </div>
                            </div>
                            <ul class="list-group">
                                <li class="list-group-item d-flex justify-content-between"><strong>Nom :</strong> <span id="d_nom_magasin"></span></li>
                                <li class="list-group-item d-flex justify-content-between"><strong>Code :</strong> <span id="d_code_magasin"></span></li>
                                <li class="list-group-item d-flex justify-content-between"><strong>Adresse :</strong> <span id="d_adresse_magasin"></span></li>
                                <li class="list-group-item d-flex justify-content-between"><strong>Ville / Code postal :</strong> <span id="d_ville_magasin"></span></li>
                                <li class="list-group-item d-flex justify-content-between"><strong>Pays :</strong> <span id="d_pays_magasin"></span></li>
                                <li class="list-group-item d-flex justify-content-between"><strong>Téléphone :</strong> <span id="d_tel_magasin"></span></li>
                                <li class="list-group-item d-flex justify-content-between"><strong>Email :</strong> <span id="d_email_magasin"></span></li>
                                <li class="list-group-item d-flex justify-content-between"><strong>Responsable :</strong> <span id="d_responsable_magasin"></span></li>
                                <li class="list-group-item d-flex justify-content-between"><strong>Horaires :</strong> <span id="d_horaires_magasin"></span></li>
                                <li class="list-group-item d-flex justify-content-between"><strong>TVA sur ventes :</strong> <span id="d_tva_magasin"></span></li>
                                <li class="list-group-item d-flex justify-content-between"><strong>Activité :</strong> <span id="d_actif_magasin"></span></li>
                                <li class="list-group-item d-flex justify-content-between"><strong>Notes :</strong> <span id="d_notes_magasin"></span></li>
                                <li class="list-group-item d-flex justify-content-between"><strong>Date de création :</strong> <span id="d_date_magasin"></span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>`;

            $('.modal').remove();

            $('body').append(modalBody);
            const $modal = $('#modalDetails');
            $modal.removeAttr('aria-hidden');
            const modal = bootstrap.Modal.getOrCreateInstance($modal[0]);
            modal.show();

            // Récupération des données depuis le bouton cliqué
            const $btn = $(this);

            $('#d_nom_magasin').text($btn.data('nom'));
            $('#d_code_magasin').text($btn.data('code'));
            $('#d_adresse_magasin').text($btn.data('adresse'));
            $('#d_ville_magasin').text(($btn.data('ville') || '') + ' ' + ($btn.data('code_postal') || ''));
            $('#d_pays_magasin').text($btn.data('pays'));
            $('#d_tel_magasin').text($btn.data('tel'));
            $('#d_email_magasin').text($btn.data('email'));
            $('#d_responsable_magasin').text($btn.data('responsable'));
            $('#d_horaires_magasin').text('de ' + ($btn.data('horaire_ouverture') || '-') + ' - à ' + ($btn.data('horaire_fermeture') || '-'));
            $('#d_tva_magasin').text($btn.data('tva') + ' %');
            $('#d_actif_magasin').text($btn.data('actif') == 1 ? 'En service' : 'Hors service');
            $('#d_notes_magasin').text($btn.data('notes') || '-');
            $('#d_date_magasin').text($btn.data('date_creation'));
        });

        $(document).off('click', '.btn_update').on('click', '.btn_update', function (event) {
            event.preventDefault();

            $(document).trigger('click'); // Fermer dropdown si ouvert

            const modalBody = `
            <div class="modal fade" id="modalUpdate" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Mise à jour</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                        </div>
                        <div class="modal-body">
                            <form id="form_magasin_update" >

                                <div class="row g-2 mt-2">

                                    <div class="mb-2 col-md-6 col-12">
                                        <label class="form-label">Nom du magasin *</label>
                                        <input type="text" class="form-control" placeholder="Obligatoire" id="modal_nom" oninput="this.value = this.value.toUpperCase()">
                                    </div>

                                    <div class="mb-2 col-md-6 col-12">
                                        <label class="form-label">TVA appliquée aux ventes</label>
                                        <div class="input-group flex-nowrap">
                                            <input type="number" class="form-control" placeholder="Obligatoire" id="modal_tva">
                                            <span class="input-group-text" id="basic-addon1">%</span>
                                        </div>
                                    </div>

                                    <div class="mb-2 col-md-6 col-12">
                                        <label class="form-label">Téléphone</label>
                                        <input type="text" class="form-control" id="modal_tel" placeholder="Pas obligatoire" >
                                    </div>

                                    <div class="mb-2 col-md-6 col-12">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" id="modal_email" placeholder="Pas obligatoire" >
                                    </div>

                                    <div class="mb-2 col-md-6 col-12">
                                        <label for="pays" class="form-label">Pays</label>
                                        <select class="form-select lg select2 selectPays" id="modal_floatingSelectPays" data-toggle="select2">
                                        </select>
                                    </div>

                                    <div class="mb-2 col-md-6 col-12">
                                        <label class="form-label">Ville</label>
                                        <input type="text" class="form-control" id="modal_ville" placeholder="Obligatoire" oninput="this.value = this.value.toUpperCase()">
                                    </div>

                                    <div class="mb-2 col-md-6 col-12">
                                        <label class="form-label">Adresse</label>
                                        <input type="text" class="form-control" id="modal_adresse" placeholder="Obligatoire" >
                                    </div>

                                    <div class="mb-2 col-md-6 col-12">
                                        <label class="form-label">Code postal</label>
                                        <input type="text" class="form-control" id="modal_code_postal" placeholder="Pas obligatoire" >
                                    </div>

                                    <div class="mb-2 col-md-6 col-12">
                                        <label class="form-label">Responsable du magasin</label>
                                        <input type="text" class="form-control" id="modal_responsable" placeholder="Obligatoire" >
                                    </div>

                                    <div class="mb-2 col-md-6 col-12">
                                        <label class="form-label">Heure d'ouverture</label>
                                        <input type="time" class="form-control" id="modal_horaire_ouverture" >
                                    </div>

                                    <div class="mb-2 col-md-6 col-12">
                                        <label class="form-label">Heure de fermeture</label>
                                        <input type="time" class="form-control" id="modal_horaire_fermeture" >
                                    </div>

                                    <div class="mb-2 col-12">
                                        <label class="form-label">Description</label>
                                        <textarea class="form-control" id="modal_notes" rows="3" ></textarea>
                                    </div>

                                </div>

                                <div class="mb-2 text-center">
                                    <button type="submit" class="btn btn-success btn_update_form">
                                        Mise à jour
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>`;

            $('.modal').remove();

            $('body').append(modalBody);
            const $modal = $('#modalUpdate');
            $modal.removeAttr('aria-hidden');
            const modal = bootstrap.Modal.getOrCreateInstance($modal[0]);
            modal.show();

            // Récupération des données depuis le bouton cliqué
            const $btn = $(this);

            select_pays('.selectPays', $btn.data('pays'));

            $('#modal_nom').val($btn.data('nom'));
            $('#modal_adresse').val($btn.data('adresse'));
            $('#modal_ville').val($btn.data('ville'));
            $('#modal_tel').val($btn.data('tel'));
            $('#modal_email').val($btn.data('email'));
            $('#modal_responsable').val($btn.data('responsable'));
            $('#modal_horaire_ouverture').val($btn.data('horaire_ouverture'));
            $('#modal_horaire_fermeture').val($btn.data('horaire_fermeture'));
            $('#modal_tva').val($btn.data('tva'));
            $('#modal_notes').val($btn.data('notes'));

            numberTel('#tva');
            numberTelLimit('#tva', 2);

            numberTel('#tel');
            numberTelLimit('#tel', 10);

            numberTel('#code_postal');

            $("#form_magasin_update").on("submit", function (event) {
                event.preventDefault();

                const data = {
                    nom: $('#modal_nom').val(),
                    tel: $('#modal_tel').val(),
                    email: $('#modal_email').val(),
                    pays: $('#modal_floatingSelectPays').val(),
                    ville: $('#modal_ville').val(),
                    adresse: $('#modal_adresse').val(),
                    code_postal: $('#modal_code_postal').val(),
                    responsable: $('#modal_responsable').val(),
                    horaire_ouverture: $('#modal_horaire_ouverture').val(),
                    horaire_fermeture: $('#modal_horaire_fermeture').val(),
                    notes: $('#modal_notes').val(),
                    tva: $('#modal_tva').val() || 0
                };

                // Vérification des champs obligatoires
                if (!data.nom.trim() || !data.pays.trim() || !data.ville.trim() ||
                    !data.adresse.trim() || !data.responsable.trim() || !data.horaire_ouverture.trim() ||
                    !data.horaire_fermeture.trim() || !data.tva.trim()) {
                    showAlert("Alerte", "Données du formulaire incomplètes", "warning");
                    return false;
                }

                if (data.email.trim() && !verifEmail(data.email)) { 
                    showAlert("Alert","Format Email invalide","warning");
                    return false;
                }

                if (data.tel && data.tel.length < 10) { 
                    showAlert("Alert","Saisir un numéro de téléphone valide","warning");
                    return false;
                }

                if (data.horaire_ouverture > data.horaire_fermeture) {
                    showAlert("Alerte", "L'heure d'ouverture ne peut pas être supérieure à l'heure de fermeture.", "warning");
                    return false;
                }

                spinerButton(0, '.btn_update_form', 'Mise à jour en cours');
                overDisplay(0);

                // Envoi via Axios
                
                axios.get(`${url_base}/refresh-csrf`)
                .then(response => {
                    const csrfToken = response.data.csrf_token;

                    // Met à jour le token dans la balise meta
                    csrfMeta.attr('content', csrfToken);

                    // Configuration de l'en-tête CSRF d'Axios
                    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

                    // Deuxième requête : login
                    return axios.put(url_base + '/api/UpdateMagasinInfo/' + $btn.data('uid'), {
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
                    });
                })
                .then(function (response) {
                    spinerButton(1, '.btn_update_form', 'Mise à jour');
                    overDisplay(1);

                    const res = response.data;

                    if (res.success) {
                        refreshChoixMagasin();
                        refreshTable();
                        $('#modalUpdate').modal('hide');
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
                    spinerButton(1, '.btn_update_form', 'Mise à jour');
                    overDisplay(1);

                    let er;
                    if (error.response && error.response.data && error.response.data.message) {
                        er = error.response.data.message;
                    }
                    showAlert("Erreur", msg, "error");
                    console.error("Erreur Axios :", error);
                });

            });

        });

        $(document).off('click', '.btn_actif').on('click', '.btn_actif', function (event) {
            event.preventDefault();

            const uid = $(this).data('uid');
            const actif = $(this).data('actif');

            confirmAction().then((result) => {
                if (result.isConfirmed) {

                    preloader(0);

                    // Envoi via Axios
                    
                    axios.get(`${url_base}/refresh-csrf`)
                    .then(response => {
                        const csrfToken = response.data.csrf_token;

                        // Met à jour le token dans la balise meta
                        csrfMeta.attr('content', csrfToken);

                        // Configuration de l'en-tête CSRF d'Axios
                        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

                        // Deuxième requête : login
                        return axios.put(url_base + '/api/updateMagasinActif/' + uid, {
                            actif: actif,
                        });
                    })
                    .then(function (response) {
                        preloader(1);

                        const res = response.data;

                        if (res.success) {
                            refreshChoixMagasin();
                            afficheTableau();
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
                }
            });
        });

        $(document).off('click', '.btn_suppr').on('click', '.btn_suppr', function (event) {
            event.preventDefault();

            const uid = $(this).data('uid');
            const suppr = $(this).data('suppr');
            const actif = $(this).data('actif');

            confirmAction().then((result) => {
                if (result.isConfirmed) {

                    preloader(0);

                    // Envoi via Axios
                    
                    axios.get(`${url_base}/refresh-csrf`)
                    .then(response => {
                        const csrfToken = response.data.csrf_token;

                        // Met à jour le token dans la balise meta
                        csrfMeta.attr('content', csrfToken);

                        // Configuration de l'en-tête CSRF d'Axios
                        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

                        // Deuxième requête : login
                        return axios.put(url_base + '/api/updateMagasinSuppr/' + uid, {
                            suppr: suppr,
                            actif: actif,
                        });
                    })
                    .then(function (response) {
                        preloader(1);

                        const res = response.data;

                        if (res.success) {
                            refreshChoixMagasin();
                            afficheTableau();
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
                }
            });
        });

    }

    // liste des employes------------------------------------------------------------------

    function afficherCardTableEmploye() {

        $('#list_employe').append(divListEmploye());

        divChargement('.contenu_liste_employe', 'Recherche en cours');
        afficheTableauEmploye();

        OffClick('.btn_refresh_table_employe', refreshTableEmploye);

    }

    function refreshTableEmploye() {

        divChargement('.contenu_liste_employe', 'Recherche en cours');
        afficheTableauEmploye();
    }

    function afficheTableauEmploye()
    {
        overDisplay(0);

        // Envoi via Axios
        
        axios.get(url_base + '/api/listEmploye', {
            params: {
                user_id: user.id,
            }
        })
        .then(function (response) {
            overDisplay(1);

            const res = response.data;

            // if (style === 0) {
            //     $('.contenu_liste').hide().empty();
            // } else{
            //     $('.contenu_liste').hide().empty();
            // }
            
            if (res.success) {

                data_list_employe = [];
                data_list_employe = res.data;

                renderDataEmploye(data_list_employe);

                // if (data_list_employe.length === 0) {
                    
                //     showAlert("Alerte", "Aucunes données n'a été trouvée", "info");
                // }

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
            overDisplay(1);

            let er;
            if (error.response && error.response.data && error.response.data.message) {
                er = error.response.data.message;
            }
            showAlert("Erreur", msg, "error");
            console.error("Erreur Axios :", er);
        });
    }

    function renderDataEmploye(data_list_employe)
    {

        let rowsHtml = '';

        $.each(data_list_employe, function(index, item) {

            rowsHtml += `
                <tr ${item.suppr === 1 ? `class="bg-danger-subtle"` : ``} >
                    <td>${index + 1}</td>
                    <td>${item.name ?? 'Néant'}</td>
                    <td>${item.email ?? 'Néant'}</td>
                    <td>${item.tel ?? 'Néant'}</td>
                    <td>${item.login ?? 'Néant'}</td>
                    <td>
                        ${item.suppr === 1 ? `
                        <span class="badge bg-danger ms-1 mt-1 p-1">Compte supprimer</span>
                        ` : `
                            ${item.lock === 0 ? `
                                ${item.actif === 1 ? `
                                    <span class="badge bg-success ms-1 mt-1 p-1">Compte activé</span>
                                    ` : `
                                    <span class="badge bg-warning ms-1 mt-1 p-1">Compte désactivé</span>
                                    `}
                            ` : `
                            <span class="badge bg-danger ms-1 mt-1 p-1">Compte bloqué</span>
                            `}
                        `}
                    </td>
                    <td>${formatDateHeure(item.created_at) ?? 'Néant'}</td>
                    <td>
                        ${item.actif === 1 ? `
                        <div class="dropdown flex-shrink-0 text-muted table-dropdown">
                            <a href="#" class="dropdown-toggle drop-arrow-none fs-20 link-reset"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="ri-more-2-fill"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end">
                                ${item.suppr === 1 ? `
                                <a data-uid="${item.uid}" data-suppr="0" data-lock="0" href="javascript:void(0);" class="dropdown-item text-warning btn_suppr_user">
                                    <i class="ri-recycle-line me-1"></i>
                                    Restaurer
                                </a>
                                ` : `
                                <a href="javascript:void(0);" class="dropdown-item text-primary btn_detail_user"
                                    data-name="${item.name ?? ''}"
                                    data-email="${item.email ?? ''}"
                                    data-tel="${item.tel ?? ''}"
                                    data-login="${item.login ?? ''}"
                                    data-date_creation="${formatDateHeure(item.created_at) ?? ''}"
                                >
                                    <i class="ri-eye-line me-1"></i> Détails
                                </a>
                                    ${item.lock === 1 ? `
                                    <a data-uid="${item.uid}" data-lock="0" href="javascript:void(0);" class="dropdown-item text-success btn_lock_user">
                                        <i class="ri-toggle-line me-1" style="transform: rotate(180deg);"></i> 
                                        Débloqué
                                    </a>
                                    ` : `
                                    <a data-uid="${item.uid}" data-lock="1" href="javascript:void(0);" class="dropdown-item text-warning btn_lock_user">
                                        <i class="ri-toggle-line me-1"></i> 
                                        bloqué
                                    </a>
                                    `}
                                <a href="javascript:void(0);" class="dropdown-item text-info btn_update_user"
                                    data-uid="${item.uid}"
                                    data-name="${item.name}"
                                    data-email="${item.email}"
                                    data-tel="${item.tel}"
                                    data-login="${item.login}"
                                >
                                    <i class="ri-edit-box-line me-1"></i> 
                                    Mise à jour
                                </a>
                                <a data-uid="${item.uid}" data-suppr="1" data-lock="0" href="javascript:void(0);" class="dropdown-item text-danger btn_suppr_user">
                                    <i class="ri-delete-bin-line me-1"></i> 
                                    Supprimer
                                </a>
                                `}
                            </div>
                        </div>
                        ` : ``}
                    </td>
                </tr>
            `;
        }); 

        ListDataEmploye('.contenu_liste_employe', '.liste_employe', rowsHtml);

        $(document).off('click', '.btn_detail_user').on('click', '.btn_detail_user', function (event) {
            event.preventDefault();

            $(document).trigger('click');

            const modalBody = `
            <div class="modal fade" id="modalDetails" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Détails de l'utilisateur</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                        </div>
                        <div class="modal-body">
                            <div class="d-flex align-items-center justify-content-center mb-2">
                                <div class="avatar-xl">
                                    <span class="avatar-title bg-info text-white rounded-circle fs-42">
                                        <i class="ri-user-line"></i>
                                    </span>
                                </div>
                            </div>
                            <ul class="list-group">
                                <li class="list-group-item d-flex justify-content-between"><strong>Nom :</strong> <span id="d_nom_user"></span></li>
                                <li class="list-group-item d-flex justify-content-between"><strong>Email :</strong> <span id="d_email_user"></span></li>
                                <li class="list-group-item d-flex justify-content-between"><strong>Login :</strong> <span id="d_login_user"></span></li>
                                <li class="list-group-item d-flex justify-content-between"><strong>Contact :</strong> <span id="d_tel_user"></span></li>
                                <li class="list-group-item d-flex justify-content-between"><strong>Date de création :</strong> <span id="d_date_user"></span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>`;

            $('.modal').remove();

            $('body').append(modalBody);
            const $modal = $('#modalDetails');
            $modal.removeAttr('aria-hidden');
            const modal = bootstrap.Modal.getOrCreateInstance($modal[0]);
            modal.show();

            // Récupération des données depuis le bouton cliqué
            const $btn = $(this);

            $('#d_nom_user').text($btn.data('name'));
            $('#d_email_user').text($btn.data('email'));
            $('#d_tel_user').text($btn.data('tel'));
            $('#d_login_user').text($btn.data('login'));
            $('#d_date_user').text($btn.data('date_creation'));
        });

        $(document).off('click', '.btn_update_user').on('click', '.btn_update_user', function (event) {
            event.preventDefault();

            $(document).trigger('click'); // Fermer dropdown si ouvert

            const modalBody = `
            <div class="modal fade" id="modalUpdate" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Mise à jour</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                        </div>
                        <div class="modal-body">
                            <form id="form_user_update" >

                                <div class="row g-2 mt-2">

                                    <div class="mb-2 col-md-6 col-12">
                                        <label class="form-label">Nom et Prénoms</label>
                                        <input type="text" class="form-control" placeholder="Obligatoire" id="modal_nom_user" oninput="this.value = this.value.toUpperCase()">
                                    </div>

                                    <div class="mb-2 col-md-6 col-12">
                                        <label class="form-label">Login</label>
                                        <input type="text" class="form-control" placeholder="Obligatoire" id="modal_login_user" oninput="this.value = this.value.toUpperCase()">
                                    </div>

                                    <div class="mb-2 col-md-6 col-12">
                                        <label class="form-label">Téléphone</label>
                                        <input type="text" class="form-control" id="modal_tel_user" placeholder="Obligatoire" >
                                    </div>

                                    <div class="mb-2 col-md-6 col-12">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" id="modal_email_user" placeholder="Pas obligatoire" >
                                    </div>

                                    <div class="mb-2 col-md-6 col-12">
                                        <label class="form-label">Nouveau mot de passe</label>
                                        <input type="password" id="modal_password_user" class="form-control" placeholder="Pas obligatoire" value="">
                                    </div>

                                </div>

                                <div class="mb-2 text-center">
                                    <button type="submit" class="btn btn-success btn_update_form_user">
                                        Mise à jour
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>`;

            $('.modal').remove();

            $('body').append(modalBody);
            const $modal = $('#modalUpdate');
            $modal.removeAttr('aria-hidden');
            const modal = bootstrap.Modal.getOrCreateInstance($modal[0]);
            modal.show();

            // Récupération des données depuis le bouton cliqué
            const $btn = $(this);

            select_pays('.selectPays', $btn.data('pays'));

            $('#modal_nom_user').val($btn.data('name'));
            $('#modal_login_user').val($btn.data('login'));
            $('#modal_email_user').val($btn.data('email'));
            $('#modal_tel_user').val($btn.data('tel'));
            $('#modal_password_user').val(null);

            numberTel('#modal_tel_user');
            numberTelLimit('#modal_tel_user', 10);

            $("#form_user_update").on("submit", function (event) {
                event.preventDefault();

                const data = {
                    nom: $('#modal_nom_user').val(),
                    login: $('#modal_login_user').val(),
                    email: $('#modal_email_user').val(),
                    tel: $('#modal_tel_user').val(),
                    password: $('#modal_password_user').val() || null,
                };

                // Vérification des champs obligatoires
                if (!data.nom.trim() || !data.login.trim() || !data.tel.trim()) {
                    showAlert("Alerte", "Données du formulaire incomplètes", "warning");
                    return false;
                }

                if (data.email.trim() && !verifEmail(data.email)) { 
                    showAlert("Alert","Format Email invalide","warning");
                    return false;
                }

                if (data.tel.length < 10) { 
                    showAlert("Alert","Saisir un numéro de téléphone valide","warning");
                    return false;
                }

                if (!verifPassword(data.password)) {
                    showAlert(
                        "Alert",
                        "Le mot de passe doit comporter au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre.",
                        "warning"
                    );
                    return false;
                }

                spinerButton(0, '.btn_update_form_user', 'Mise à jour en cours');
                overDisplay(0);

                // Envoi via Axios
                
                axios.get(`${url_base}/refresh-csrf`)
                .then(response => {
                    const csrfToken = response.data.csrf_token;

                    // Met à jour le token dans la balise meta
                    csrfMeta.attr('content', csrfToken);

                    // Configuration de l'en-tête CSRF d'Axios
                    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

                    // Deuxième requête : login
                    return axios.put(url_base + '/api/UpdateUserInfo/' + $btn.data('uid'), {
                        nom: data.nom,
                        tel: data.tel,
                        email: data.email,
                        login: data.login,
                        password: data.password,
                    });
                })
                .then(function (response) {
                    spinerButton(1, '.btn_update_form_user', 'Mise à jour');
                    overDisplay(1);

                    const res = response.data;

                    if (res.success) {
                        refreshTableEmploye();
                        $('#modalUpdate').modal('hide');
                        showAlert("Alerte", res.message, "success");
                    } else if (res.info) {
                        showAlert("Alerte", res.message, "info");
                    } else if (res.warning) {
                        showAlert("Alerte", res.message, "warning");
                        console.log(res.message);
                    } else if (res.error) {
                        showAlert("Alerte", res.message, "danger");
                    } else {
                        showAlert("Alerte", msg, "danger");
                    }

                })
                .catch(function (error) {
                    spinerButton(1, '.btn_update_form_user', 'Mise à jour');
                    overDisplay(1);

                    let er;
                    if (error.response && error.response.data && error.response.data.message) {
                        er = error.response.data.message;
                    }
                    showAlert("Erreur", msg, "error");
                    console.error("Erreur Axios :", error);
                });

            });

        });

        $(document).off('click', '.btn_lock_user').on('click', '.btn_lock_user', function (event) {
            event.preventDefault();

            const uid = $(this).data('uid');
            const lock = $(this).data('lock');

            confirmAction().then((result) => {
                if (result.isConfirmed) {

                    preloader(0);

                    // Envoi via Axios
                    
                    axios.get(`${url_base}/refresh-csrf`)
                    .then(response => {
                        const csrfToken = response.data.csrf_token;

                        // Met à jour le token dans la balise meta
                        csrfMeta.attr('content', csrfToken);

                        // Configuration de l'en-tête CSRF d'Axios
                        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

                        // Deuxième requête : login
                        return axios.put(url_base + '/api/updateUserLock/' + uid, {
                            lock: lock,
                        });
                    })
                    .then(function (response) {
                        preloader(1);

                        const res = response.data;

                        if (res.success) {
                            refreshTableEmploye();
                            showAlert("Alerte", res.message, "success");
                        } else if (res.info) {
                            showAlert("Alerte", res.message, "info");
                        } else if (res.warning) {
                            showAlert("Alerte", msg, "warning");
                            console.log(res.message);
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
                }
            });
        });

        $(document).off('click', '.btn_suppr_user').on('click', '.btn_suppr_user', function (event) {
            event.preventDefault();

            const uid = $(this).data('uid');
            const suppr = $(this).data('suppr');
            const lock = $(this).data('lock');

            confirmAction().then((result) => {
                if (result.isConfirmed) {

                    preloader(0);

                    // Envoi via Axios
                    
                    axios.get(`${url_base}/refresh-csrf`)
                    .then(response => {
                        const csrfToken = response.data.csrf_token;

                        // Met à jour le token dans la balise meta
                        csrfMeta.attr('content', csrfToken);

                        // Configuration de l'en-tête CSRF d'Axios
                        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

                        // Deuxième requête : login
                        return axios.put(url_base + '/api/updateUserSuppr/' + uid, {
                            suppr: suppr,
                            lock: lock,
                        });
                    })
                    .then(function (response) {
                        preloader(1);

                        const res = response.data;

                        if (res.success) {
                            refreshTableEmploye();
                            showAlert("Alerte", res.message, "success");
                        } else if (res.info) {
                            showAlert("Alerte", res.message, "info");
                        } else if (res.warning) {
                            showAlert("Alerte", msg, "warning");
                            console.log(res.message);
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
                }
            });
        });

    }

    // enregistrer un magasin------------------------------------------------------------------

    function afficherCardNew() {

        $('#new_magasin').append(divNewMagasin());

        select_pays('.selectPays');

        numberTel('#tva');
        numberTelLimit('#tva', 2);

        numberTel('#tel');
        numberTelLimit('#tel', 10);

        numberTel('#code_postal');

        $("#form_magasin").on("submit", function (event) {
            event.preventDefault();

            if (creditUser.magasins <= nbre_magasin) {
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
                return false;
            }

            if (data.email.trim() && !verifEmail(data.email)) { 
                showAlert("Alert","Format Email invalide","warning");
                return false;
            }

            if (data.tel.trim() && data.tel.length < 10) { 
                showAlert("Alert","Saisir un numéro de téléphone valide","warning");
                return false;
            }

            if (data.horaire_ouverture > data.horaire_fermeture) {
                showAlert("Alerte", "L'heure d'ouverture ne peut pas être supérieure à l'heure de fermeture.", "warning");
                return false;
            }

            preloader(0);

            // Envoi via Axios
            
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
                    incrementCardNbre('magasins');
                    refreshChoixMagasin();
                    refreshTable();
                    resetForm();
                    selectDataMutation('.selectMagasinA','.selectUserA','.selectRoleA');
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

    function resetForm() {
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

    // enregistrer un utilisateur--------------------------------------------------------------------

    function afficherCardNewEmploye() {

        $('#new_employe').append(divNewEmploye());

        numberTel('#tel_user');
        numberTelLimit('#tel_user', 10);

        $("#form_magasin_user").on("submit", function (event) {
            event.preventDefault();

            if (creditUser.users <= nbre_user) {
                showAlert(
                    "Limite de crédit atteinte", 
                    "Le nombre d'utilisateur que vous pouvez créer est limité à " 
                    + creditUser.users + 
                    ". Veuillez contacter le support ou acheter de nouveau crédit d'utilisateur.", 
                    "warning"
                );
                return false;
            }

            const data = {
                nom: $('#nom_user').val(),
                tel: $('#tel_user').val(),
                email: $('#email_user').val(),
                login: $('#login_user').val(),
                password: $('#password_user').val(),
            };

            // Vérification des champs obligatoires
            if (!data.nom.trim() || !data.login.trim() || !data.tel.trim() || !data.password.trim()) {
                showAlert("Alerte", "Données du formulaire incomplètes", "warning");
                return false;
            }

            if (data.email.trim() && !verifEmail(data.email)) { 
                showAlert("Alert","Format Email invalide","warning");
                return false;
            }

            if (data.tel.length < 10) { 
                showAlert("Alert","Saisir un numéro de téléphone valide","warning");
                return false;
            }

            if (!verifPassword(data.password)) {
                showAlert(
                    "Alert",
                    "Le mot de passe doit comporter au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre.",
                    "warning"
                );
                return false;
            }

            preloader(0);

            // Envoi via Axios
            
            axios.get(`${url_base}/refresh-csrf`)
            .then(response => {
                const csrfToken = response.data.csrf_token;

                // Met à jour le token dans la balise meta
                csrfMeta.attr('content', csrfToken);

                // Configuration de l'en-tête CSRF d'Axios
                axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

                // Deuxième requête : login
                return axios.post(url_base + '/api/insertUser', {
                    name: data.nom,
                    tel: data.tel,
                    email: data.email,
                    login: data.login,
                    password: data.password,
                    user_id: user.id,
                });
            })
            .then(function (response) {
                preloader(1);

                const res = response.data;

                if (res.success) {
                    nbre_user = nbre_user +1;
                    incrementCardNbre('utilisateurs');
                    refreshTableEmploye();
                    resetFormEmploye();
                    selectDataMutation('.selectMagasinA','.selectUserA','.selectRoleA');
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

    function resetFormEmploye() {
        const form = $('#form_magasin_user')[0];

        if (form) {
            form.reset(); // Réinitialise les champs standards
        }

        // Réinitialise manuellement les champs si nécessaire
        $('#nom_user, #tel_user, #email_user').val('');
        $('#password_user').val('Password@01');
    }

    // --------------------------------------------------------------------

    function afficherCardAffectation()
    {
        selectDataMutation('.selectMagasinA','.selectUserA','.selectRoleA');

        $("#form_affectation").on("submit", function (event) {
            event.preventDefault();

            const data = {
                magasin: $('#selectMagasinA').val(),
                user: $('#selectUserA').val(),
                role: $('#selectRoleA').val(),
            };

            // Vérification des champs obligatoires
            if (!data.magasin.trim() || !data.user.trim() || !data.role.trim()) {
                showAlert("Alerte", "Données du formulaire incomplètes", "warning");
                return false;
            }

            preloader(0);

            // Envoi via Axios
            
            axios.get(`${url_base}/refresh-csrf`)
            .then(response => {
                const csrfToken = response.data.csrf_token;

                // Met à jour le token dans la balise meta
                csrfMeta.attr('content', csrfToken);

                // Configuration de l'en-tête CSRF d'Axios
                axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

                // Deuxième requête : login
                return axios.post(url_base + '/api/insertMutation', {
                    magasin: data.magasin,
                    user: data.user,
                    role: data.role,
                    user_id: user.id,
                });
            })
            .then(function (response) {
                preloader(1);

                const res = response.data;

                if (res.success) {
                    refreshTable();
                    refreshTableEmploye();
                    resetFormMutation();
                    showAlert("Alerte", res.message, "success");
                } else if (res.info) {
                    showAlert("Alerte", res.message, "info");
                } else if (res.warning) {
                    showAlert("Alerte", msg, "warning");
                    console.log(res.message);
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
                console.error("Erreur Axios :", error);
            });

        });
    }

    function resetFormMutation() {

        $('#selectMagasinA').val(null).trigger('change.select2');
        $('#selectUserA').val(null).trigger('change.select2');
        $('#selectRoleA').val(null).trigger('change.select2');
    }

    // --------------------------------------------------------------------

    // Fonction centrale pour gérer le chargement d’un tab donné
    function handleTabChange(target) {
        switch (target) {
            // case "#choix_magasin":
            //     console.log("Chargement : Choix magasin");
            //     loadChoixMagasin(); // 👈 ta fonction personnalisée
            //     break;

            case "#list_global":
                chargerListeEmploye();
                chargerListeMagasins(); // 👈 ta fonction personnalisée
                break;
            case "#list_magasin":
                chargerListeMagasins(); // 👈 ta fonction personnalisée
                break;
            case "#list_employe":
                chargerListeEmploye(); // 👈 ta fonction personnalisée
                break;

            case "#new_global":
                resetForm(); // 👈 ta fonction personnalisée
                break;
            case "#new_magasin":
                resetForm(); // 👈 ta fonction personnalisée
                break;
            case "#new_employe":
                resetFormEmploye(); // 👈 ta fonction personnalisée
                break;
            // ajoute d'autres onglets ici si nécessaire
        }
    }

    // ▶ 1. Exécuter au chargement (pills ou tabs actifs)
    const activeTab = $('a[data-bs-toggle="pill"].active, a[data-bs-toggle="tab"].active');
    if (activeTab.length) {
        const target = activeTab.attr('href');
        handleTabChange(target);
    }

    // ▶ 2. Exécuter à chaque changement d’onglet (clic utilisateur)
    $('a[data-bs-toggle="pill"], a[data-bs-toggle="tab"]').on('shown.bs.tab shown.bs.pill', function (e) {
        const target = $(e.target).attr('href');
        handleTabChange(target);
    });

    function chargerListeMagasins() {
        const $table = $('.liste_magasin');

        $table.hide();

        const dt = $table.DataTable();

        setTimeout(() => {
            dt.columns.adjust().draw();
        }, 100);

        $table.show('slow');
    }

    function chargerListeEmploye() {
        const $table = $('.liste_employe');

        $table.hide();

        const dt = $table.DataTable();

        setTimeout(() => {
            dt.columns.adjust().draw();
        }, 100);

        $table.show('slow');
    }

});