$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";

    let dataTable = [];

    initStart();

    function initStart()  {

        globalePage.append(ListeDemdandesAssign());
        selectRefreshId('#statut');
        tableListe();

        $(document).on("click", ".btnActualiser", function() {
            tableListe();
        });
 
    }

    function tableListe() {

        $('#tableDemandeAssign tbody').empty();

        loadingTable('#tableDemandeAssign', '#pagination', 1);

        const urlAxios = `${url}/api/ListeDemandesAssign/${user.id}/${user.service_id}`;

        reqAxios(0, urlAxios,'GET')
            .then(res => {

                loadingTable('#tableDemandeAssign', '#pagination', 0);
                dataTable = res.data.data ?? []; 
                renderDynamicTable("#tableDemandeAssign", "#statut", "#searchInput", "#pagination", agentRowRenderer, dataTable);
            }); 

        // Fonction de rendu des lignes
        function agentRowRenderer(item, index, start) {
            return $(`
                <tr>
                    <td class="text-center" >${start + index + 1}</td>
                    <td class="text-center" >${item.traiteur_name}</td>
                    <td class="text-center" >${item.uid}</td>
                    <td class="text-center" >${item.categorie}</td>
                    <td class="text-center">
                        <span class="badge 
                            ${item.statut === 'en_attente' ? 'bg-warning' :
                              item.statut === 'en_cours'   ? 'bg-primary' :
                              item.statut === 'traitee'    ? 'bg-success' :
                              item.statut === 'rejete'     ? 'bg-danger' :
                              'bg-secondary-subtle text-secondary'} 
                            py-1 px-2 fs-13">
                            ${item.statut === 'en_attente' ? 'En attente' :
                              item.statut === 'en_cours'   ? 'En cours' :
                              item.statut === 'traitee'    ? 'Terminé' :
                              item.statut === 'rejete'     ? 'Rejété' :
                              item.statut}
                        </span>
                    </td>
                    <td class="text-center" >
                        ${(Array.isArray(item.fichiers) && item.fichiers.length > 0) ? `
                                ${item.fichiers.length}
                            ` : `0` }
                    </td>
                    <td class="text-center">
                        <span class="badge 
                            ${(() => {
                                const now = new Date();
                                const limite = new Date(item.date_limite);

                                return limite > now ? 'bg-success' : 
                                    limite == now ? 'bg-warning' : 
                                    'bg-danger';
                            })()} 
                            py-1 px-2 fs-13">
                            ${formatDateHeure(item.date_limite)}
                        </span>
                    </td>
                    <td class="text-center" >
                        <div class="d-flex align-items-center justify-content-center gap-2">
                            <a href="#!" class="btn btn-warning btn-sm btn-view rounded-2" data-id="${item.id}">
                                <i class="ri-eye-line align-middle fs-18"></i>
                            </a>
                            ${item.statut == 'en_attente' ? `
                                <a href="#!" class="btn btn-soft-dark btn-sm btn-option rounded-pill"
                                    data-id="${item.id}"
                                    data-statut="${item.statut}">
                                    <i class="ri-settings-4-line align-middle fs-18"></i>
                                </a>
                            ` : ` `}
                            ${item.statut == 'en_cours' && item.traiteur_id == user.id ? `
                                <a href="#!" class="btn btn-info btn-sm btn-view rounded-2" data-id="${item.id}">
                                    <i class="ri-message-line align-middle fs-18"></i>
                                </a>
                            ` : ` `}
                        </div>
                    </td>
                </tr>
            `);
        }

        // ✅ Gérer directement les clics sur les boutons du tableau
        $(document).off("click", ".btn-view").on("click", ".btn-view", function (e) {
            e.preventDefault();

            const id = $(this).data("id");
            console.log("👁️ Voir détails de la demande ID:", id);

            const demande = dataTable.find(item => item.id === id);

            if (!demande) {
                console.warn("⚠️ Aucune demande trouvée pour cet ID.");
                return;
            }

            let html = `
                <div class="p-3">
                    <h3 class="fw-bold mb-2">${demande.objet}</h3>
                    <h4><strong>Catégorie :</strong> ${demande.categorie}</h4>
                    <h4><strong>Date :</strong> ${formatDateHeure(demande.created_at)}</h4>
                    <h4><strong>Statut :</strong> ${demande.statut === 'en_attente' ? 'En attente' :
                              demande.statut === 'en_cours'   ? 'En cours' :
                              demande.statut === 'traitee'    ? 'Terminé' :
                              demande.statut === 'rejete'     ? 'Rejété' :
                              demande.statut}</h4>
                    <h4><strong>Description :</strong> ${demande.description}</h4>
                    <hr>
                    <h4>Fichiers liés :</h4>
            `;

            if (Array.isArray(demande.fichiers) && demande.fichiers.length > 0) {
                const grouped = demande.fichiers.reduce((acc, file) => {
                    acc[file.type] = acc[file.type] || [];
                    acc[file.type].push(file);
                    return acc;
                }, {});

                for (const [type, files] of Object.entries(grouped)) {
                    const icon = getFileIcon(type);
                    html += `
                        <div class="mt-3">
                            <h5 class="text-primary d-flex align-items-center gap-1">
                                - <i class="${icon}"></i> ${type.toUpperCase()} :
                            </h5>
                            <ul style="list-style:none; padding:0;">
                    `;
                    files.forEach(file => {
                        const fileUrl = `${url}/storage/${file.chemin}`;
                        html += `
                            <li class="d-flex justify-content-between align-items-center border-bottom py-2">
                                <span>${file.nom_original}</span>
                                <a href="${fileUrl}" target="_bank" download class="btn btn-sm btn-outline-primary d-flex align-items-center gap-1">
                                    <i class="bi bi-download"></i> Télécharger
                                </a>
                            </li>
                        `;
                    });
                    html += `</ul></div>`;
                }
            } else {
                html += `<p class="text-danger mt-2">❌ Aucun fichier lié à cette demande.</p>`;
            }

            html += `</div>`;

            showDynamicModal(html, { title: "Détails demande", size: "xl" });
        });

        function getFileIcon(type) {
            switch (type) {
                case "pdf":
                    return "ri-file-pdf-2-line text-danger";
                case "word":
                    return "ri-file-word-2-line text-primary";
                case "excel":
                    return "ri-file-excel-2-line text-success";
                case "image":
                    return "ri-image-2-line text-warning";
                case "zip":
                    return "ri-file-zip-line text-orange";
                case "txt":
                    return "ri-file-text-line text-secondary";
                case "ppt":
                    return "ri-file-ppt-2-line text-danger";
                default:
                    return "ri-file-line text-muted";
            }
        }

        $(document).off("click", ".btn-option").on("click", ".btn-option", function (e) {
            e.preventDefault();

            const data = {
                id: $(this).data("id"),
                statut: $(this).data("statut"),
            };

            if (data.id) {
                // Boutons dynamiques selon statut
                const allButtons = [
                    { text: "Désigner un traiteur", class: "btn-optionModal-assigne btn-primary", icon: "ri-refresh-line", showFor: ["en_attente"] },
                    { text: "Traiter la demande", class: "btn-optionModal-traitement btn-warning", icon: "ri-pencil-line", showFor: ["en_attente"] },
                    { text: "Traitement terminer", class: "btn-optionModal-terminer btn-success", icon: "ri-check-line", showFor: ["en_cours"] },
                    { text: "Demande rejèter", class: "btn-optionModal-rejeter btn-danger", icon: "ri-close-line", showFor: ["en_cours"] }
                ];
                const buttons = allButtons.filter(btn => btn.showFor.includes(data.statut));

                // Afficher overlay d’action
                const $overlay = showDynamicActionModal(data, buttons);

                // Gestion clic sur les boutons
                $overlay.find("a").on("click", function(e) {
                    e.preventDefault();
                    const id = $(this).data("id");
                    const action = $(this).attr("class").split(' ')[1];
                    // console.log("Action:", action, "ID:", id, "Statut:", data.statut);

                    if (action == 'btn-optionModal-assigne') {

                        designeTraiteur(id);

                    } else if (action == 'btn-optionModal-traitement') {
                        console.log("Traiter la demande");
                    } else if (action == 'btn-optionModal-terminer') {
                        console.log("Traitement terminer");
                    } else if (action == 'btn-optionModal-rejeter') {
                        console.log("Demande rejèter");
                    }

                    if (typeof window.handleModalAction === "function") {
                        window.handleModalAction(action, id, data);
                    }

                    $overlay.remove(); // fermer après action
                });

            }

        });

    }

    function designeTraiteur(id) {

        let html = `
            <div class="row g-3" >
                <div class="col-12">
                    <label class="form-label">Traiteur</label>
                    <select class="form-control" data-choices id="traiteur_id"></select>
                </div>
                <div class="col-12">
                    <label for="objet" class="form-label">Date limite de traitement</label>
                    <input type="datetime-local" class="form-control" id="date">
                </div>
                <div class="col-12">
                    <button class="btn btn-success btnChoixTraiteur" >Valider</button>
                </div>
            </div>
        `;

        const $form = showDynamicModal(html, { title: "Désigner un traiteur", size: "md" }, 1);

        select_traiteur_service("#traiteur_id", user.service_id);

        $(document).off("click", ".btnChoixTraiteur").on("click", ".btnChoixTraiteur", function (e) {
            e.preventDefault();

            const btnId = $('.btnChoixTraiteur');
            const btnLabel = $('.btnChoixTraiteur').text(); 

            const traiteur_id = $('#traiteur_id');
            const date = $('#date');

            if (!traiteur_id.val().trim() || !date.val().trim()) {

                showAlert(
                    "Attention", 
                    "Veuillez remplir tous les champs s'il vous plaît", 
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

            const urlAxios = `${url}/api/InsertDesigneTraiteur/${user.id}/${id}`;

            reqAxios(1, urlAxios,'POST',data,btnId,btnLabel)
                .then(res => {
                    if (res.success) {
                        $form.remove();
                        tableListe();
                    }
                });   

        });
    }

});

