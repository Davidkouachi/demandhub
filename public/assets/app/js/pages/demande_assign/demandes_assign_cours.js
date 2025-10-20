$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";

    let dataTable = [];

    initStart();

    function initStart()  {

        globalePage.append(ListeDemdandesAssignEnCours());
        tableListe();

        $(document).on("click", ".btnActualiser", function() {
            tableListe();
        });
 
    }

    function tableListe() {

        $('#tableDemandeAssignEnCours tbody').empty();

        loadingTable('#tableDemandeAssignEnCours', '#pagination', 1);

        const urlAxios = `${url}/api/ListeDemandesAssign/${user.id}/${user.service_id}/en_cours/${user.id}`;

        reqAxios(0, urlAxios,'GET')
            .then(res => {

                loadingTable('#tableDemandeAssignEnCours', '#pagination', 0);
                dataTable = res.data.data ?? []; 
                renderDynamicTable("#tableDemandeAssignEnCours", null, "#searchInput", "#pagination", agentRowRenderer, dataTable);
            }); 

        // Fonction de rendu des lignes
        function agentRowRenderer(item, index, start) {
            return $(`
                <tr>
                    <td class="text-center" >${start + index + 1}</td>
                    <td class="text-center" >${item.name}</td>
                    <td class="text-center" >
                        <span class="text-dark fw-medium fs-15">${item.objet}</span>
                    </td>
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
                    <td class="text-center" >${formatDateHeure(item.created_at)}</td>
                    <td class="text-center" >
                        <div class="d-flex align-items-center justify-content-center gap-2">
                            <a href="#!" class="btn btn-warning btn-sm btn-view rounded-2" data-id="${item.id}">
                                <i class="ri-eye-line align-middle fs-18"></i>
                            </a>
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

            const demande = dataTable.find(item => item.id == id);

            if (!demande) {
                console.warn("⚠️ Aucune demande trouvée pour cet ID.");
                return;
            }

            let btnOption = ``;

            if (demande.traiteur_id == user.id) {
                btnOption = `
                    <div class="d-flex flex-wrap align-items-start justify-content-between gap-3 mt-3"> 
                        <div>
                            <a href="#" class="btn btn-warning btnMotif">
                                <i class="ri-chat-1-fill"></i> 
                                Reprondre
                            </a>
                            <a href="#" class="btn btn-outline-danger btnRejet">
                                <i class="ri-close-line"></i> 
                                Rejeter
                            </a>
                        </div>
                        <div class="d-flex gap-1">
                            <a href="javascript: void(0);" class="btn btn-dark avatar-sm d-flex align-items-center justify-content-center fs-20">
                                <i class="ri-edit-fill"></i>
                            </a>
                            <a href="javascript: void(0);" class="btn btn-primary avatar-sm d-flex align-items-center justify-content-center fs-20">
                                <i class="ri-share-fill"></i>
                            </a>
                        </div>
                    </div>
                `;
            }

            let html = `
                <div class="p-2">
                   <div class="card-body">
                        ${btnOption}
                        <div class="row my-2">
                            <div class="col-12 my-2">
                                  <h4 class="card-title mb-2 text-dark fw-semibold">Identifiant :</h4>
                                  <p class="mb-0">${demande.uid}</p>
                             </div>
                             <div class="col-lg-3 my-2">
                                  <p class="text-dark fw-semibold fs-16 mb-1">Email :</p>
                                  <p class="mb-0">${demande.email}</p>
                             </div>
                             <div class="col-lg-3 my-2">
                                  <p class="text-dark fw-semibold fs-16 mb-1">Contact :</p>
                                  <p class="mb-0">+225 ${demande.tel}</p>
                             </div>
                             <div class="col-lg-3 my-2">
                                  <p class="text-dark fw-semibold fs-16 mb-1">Catégorie :</p>
                                  <p class="mb-0">${demande.categorie}</p>
                             </div>
                             <div class="col-lg-3 my-2">
                                  <p class="text-dark fw-semibold fs-16 mb-1">Date de réception :</p>
                                  <p class="mb-0">${formatDateHeure(demande.created_at)}</p>
                             </div>
                            <div class="col-12 my-2">
                                  <h4 class="card-title mb-2 text-dark fw-semibold">Statut :</h4>
                                  <p class="mb-0">
                                    <span class="badge bg-${demande.statut === 'en_cours' ? 'warning' : demande.statut} 
                                    text-white fs-14 px-2 py-1">
                                        ${demande.statut === 'en_cours' ? 'En cours' : demande.statut}
                                    </span>
                                  </p>
                             </div>
                            <div class="col-12 my-2">
                                  <h4 class="card-title mb-2 text-dark fw-semibold">Objet :</h4>
                                  <p class="mb-0">${demande.objet}</p>
                             </div>
                             <div class="col-12 my-2">
                                  <h4 class="card-title mb-2 text-dark fw-semibold">Description :</h4>
                                  <p class="mb-0">${demande.description}</p>
                             </div>
                        </div>

                        <div class="row my-2">
                            <div class="col-12">
                                  <h4 class="card-title mb-4 text-dark fw-semibold text-left">Fichiers liés :</h4>
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
                            <h4 class="card-title mb-2 text-dark fw-semibold text-center">
                                <i class="${icon}"></i> ${type.toUpperCase()} :
                            </h4>
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
                    html += `</ul> </div> </div>`;
                }
            } else {
                html += `<h4 class="card-title mb-2 text-dark fw-semibold">
                            ❌ Aucun fichier lié à cette demande.
                        </h4> </div> </div>`;
            }

            html += `</div></div>`;

            const $overlay = showDynamicModal(html, { title: "Détails demande", size: "xl" });

            $(document).off("click", ".btnMotif").on("click", ".btnMotif", function (e) {
                e.preventDefault();

                $overlay.remove();
                reponseDemande(demande, 1);

            });

            $(document).off("click", ".btnRejet").on("click", ".btnRejet", function (e) {
                e.preventDefault();

                $overlay.remove();
                reponseDemande(demande, 0);

            });
        });

    }

    function reponseDemande(demande, mode) {

        let html = `
            <div class="row g-3" >
                <div class="col-12">
                    <label class="form-label">Objet de la demande</label>
                    <input type="text" class="form-control" disabled value="${demande.objet}">
                </div>
                <div class="col-12">
                    <label for="motif" class="form-label">Motif détaillée</label>
                    <textarea class="form-control" id="motif" rows="4" placeholder="Saisir le motif complet du traitement de la demande"></textarea>
                </div>
                <div class="col-12">
                    <button class="btn btn-success btntraitement" >Valider</button>
                </div>
            </div>
        `;

        const $form = showDynamicModal(html, { title: "Motif", size: "lg" }, 1);

        $(document).off("click", ".btntraitement").on("click", ".btntraitement", function (e) {
            e.preventDefault();

            const btnId = $('.btntraitement');
            const btnLabel = $('.btntraitement').text(); 

            const motif = $('#motif');

            if (!motif.val().trim()) {

                showAlert(
                    "Attention", 
                    "Veuillez renseigner le motif s'il vous plaît", 
                    "info"
                );

                return;
            }

            const data = {
                motif: motif.val(),
            };

            spinerButton(0, btnId, 'Vérification en cours');

            const urlAxios = `${url}/api/InsertTraitement/${user.id}/${demande.id}/${mode}`;

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

