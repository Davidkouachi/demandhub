$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    const url_base = $('#url').attr('content');
    const csrfMeta = $('meta[name="csrf-token"]');
    
    let data_list_employe = [];

    window.afficherCardTable = function() {

        $('#list_magasin').append(divListMagasin());

        divChargement('.contenu_liste', 'Recherche en cours');
        afficheTableau();

        OffClick('.btn_refresh', refreshTable);

    }

    window.refreshTable = function() {

        divChargement('.contenu_liste', 'Recherche en cours');
        afficheTableau();
    }

    function afficheTableau()
    {
        overDisplay(0);

        data_list = [];

        // Envoi via Axios
        let msg = "Une erreur est survenue";
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
            console.error("Erreur Axios :", error);
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
                <tr ${(magasin && magasin.id === item.id) ? `class="bg-light"` : ``} >
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
                            ${item.actif === 1 ? `
                                ${magasin.id == item.id ? `
                                    <span class="badge bg-success ms-1 mt-1 p-1">Connecté</span>
                                    ` : `
                                        ${renderStatut(item.horaire_ouverture, item.horaire_fermeture)}
                                    `}
                            ` : `
                            <span class="badge bg-warning ms-1 mt-1 p-1">hors service</span>
                            `}
                        `}
                    </td>
                    <td>${formatDateHeure(item.created_at) ?? 'Néant'}</td>
                    <td>
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
                    </td>
                </tr>
            `;
        }); 

        ListData('.contenu_liste', '.liste_magasin', rowsHtml);

        $(document).off('click', '.btn_detail').on('click', '.btn_detail', function (event) {
            event.preventDefault();

            $(document).trigger('click');

            const modalBody = `
            <div class="modal fade" id="modalDetails" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
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

            $('.modal').remove(); // Supprime modals précédents

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
            <div class="modal fade" id="modalUpdate" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
                <div class="modal-dialog modal-lg modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Détails du Magasin</h4>
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
                                        <input type="text" class="form-control" id="modal_tel" placeholder="Facultatif" >
                                    </div>

                                    <div class="mb-2 col-md-6 col-12">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" id="modal_email" placeholder="Facultatif" >
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
                                        <input type="text" class="form-control" id="modal_code_postal" placeholder="Facultatif" >
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

            $('.modal').remove(); // Supprime modals précédents

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
                    return;
                }

                spinerButton(0, '.btn_update_form', 'Mise à jour en cours');
                overDisplay(0);

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
                        window.refreshChoixMagasin();
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
                    let msg = "Une erreur est survenue";
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
                            window.refreshChoixMagasin();
                            window.afficheTableau();
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
                        console.error("Erreur Axios :", error);
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
                    let msg = "Une erreur est survenue";
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
                            window.refreshChoixMagasin();
                            window.afficheTableau();
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

    // ------------------------------------------------------------------

    window.afficherCardTableEmploye = function() {

        $('#list_employe').append(divListEmploye());

        divChargement('.contenu_liste_employe', 'Recherche en cours');
        afficheTableauEmploye();

        OffClick('.btn_refresh_table_employe', refreshTableEmploye);

    }

    window.refreshTableEmploye = function() {

        divChargement('.contenu_liste_employe', 'Recherche en cours');
        afficheTableauEmploye();
    }

    function afficheTableauEmploye()
    {
        overDisplay(0);

        // Envoi via Axios
        let msg = "Une erreur est survenue";
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
                        ${item.suppr === 0 ? `
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
                        ` : ``}
                    </td>
                </tr>
            `;
        }); 

        ListDataEmploye('.contenu_liste_employe', '.liste_employe', rowsHtml);

        $(document).off('click', '.btn_detail').on('click', '.btn_detail', function (event) {
            event.preventDefault();

            $(document).trigger('click');

            const modalBody = `
            <div class="modal fade" id="modalmodal-dialog-scrollableDetails" tabindex="-1">
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
                            <h4 class="modal-title">Détails du Magasin</h4>
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
                                        <label class="form-label">Code unique magasin *</label>
                                        <input type="text" class="form-control" id="modal_code" placeholder="Obligatoire" >
                                    </div>

                                    <div class="mb-2 col-md-6 col-12">
                                        <label class="form-label">Téléphone</label>
                                        <input type="text" class="form-control" id="modal_tel" placeholder="Facultatif" >
                                    </div>

                                    <div class="mb-2 col-md-6 col-12">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" id="modal_email" placeholder="Facultatif" >
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
                                        <input type="text" class="form-control" id="modal_code_postal" placeholder="Facultatif" >
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
            $('#modal_code').val($btn.data('code'));
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
                    code: $('#modal_code').val(),
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
                if (!data.nom.trim() || !data.code.trim() || !data.pays.trim() || !data.ville.trim() ||
                    !data.adresse.trim() || !data.responsable.trim() || !data.horaire_ouverture.trim() ||
                    !data.horaire_fermeture.trim() || !data.tva.trim()) {
                    showAlert("Alerte", "Données du formulaire incomplètes", "warning");
                    return;
                }

                spinerButton(0, '.btn_update_form', 'Mise à jour en cours');
                overDisplay(0);

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
                    return axios.put(url_base + '/api/UpdateMagasinInfo/' + $btn.data('uid'), {
                        nom: data.nom,
                        code: data.code,
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
                        refreshTableEmploye();
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
                    let msg = "Une erreur est survenue";
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
                            afficheTableauEmploye();
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
                    let msg = "Une erreur est survenue";
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
                            afficheTableauEmploye();
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