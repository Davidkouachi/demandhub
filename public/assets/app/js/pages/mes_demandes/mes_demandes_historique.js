$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";

    let dataTable = [];

    initStart();

    function initStart()  {

        globalePage.append(ListeMesDemdandes());
        selectRefreshId('#statut');
        tableListe();

        $(document).on("click", ".btnActualiser", function() {
            tableListe();
        });
 
    }

    function tableListe() {

        $('#tableMesDemande tbody').empty();

        loadingTable('#tableMesDemande', '#pagination', 1);

        const urlAxios = `${url}/api/ListeMesDemandes/${user.id}`;

        reqAxios(0, urlAxios,'GET')
            .then(res => {

                loadingTable('#tableMesDemande', '#pagination', 0);
                dataTable = res.data.data ?? [];
                renderDynamicTable("#tableMesDemande", "#statut", "#searchInput", "#pagination", agentRowRenderer, dataTable);

                // dataTable.forEach(item => {
                //     console.log(`Demande ID: ${item.id}, Objet: ${item.objet}, Statut: ${item.statut}`);

                //     // 🔹 Vérification si fichiers est un tableau
                //     if (Array.isArray(item.fichiers) && item.fichiers.length > 0) {
                //         console.log("Fichiers liés :");
                //         item.fichiers.forEach(file => {
                //             console.log(` - ${file.chemin} (${file.nom_original})`);
                //         });
                //     } else {
                //         console.log("Aucun fichier lié.");
                //     }
                // });
            }); 

        // Fonction de rendu des lignes
        function agentRowRenderer(item, index, start) {
            return $(`
                <tr>
                    <td class="text-center" >${start + index + 1}</td>
                    <td class="text-center" >
                        <span class="text-dark fw-medium fs-15">${item.uid}</span>
                    </td>
                    <td class="text-center" >${item.categorie}</td>
                    <td class="text-center" >${item.service}</td>
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
                              item.statut === 'traitee'    ? 'Tratée' :
                              item.statut === 'rejete'     ? 'Rejétée' :
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
                            ${item.statut == 'en_attente' ? `
                                <a href="#!" class="btn btn-soft-danger btn-sm btn-delete rounded-2" data-id="${item.id}">
                                    <i class="ri-delete-bin-line align-middle fs-18"></i>
                                </a>
                            ` : ` `}
                            ${item.traiter == 1 ? `
                                <a href="#!" class="btn btn-info btn-sm btn-motif rounded-2" data-id="${item.id}">
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

            const demande = dataTable.find(item => item.id == id);

            if (!demande) {
                console.warn("⚠️ Aucune demande trouvée pour cet ID.");
                return;
            }

            let html = `
                <div class="p-2">
                   <div class="card-body">
                        <div class="row my-2">
                            <div class="col-lg-3 my-2">
                                  <h4 class="card-title mb-2 text-dark fw-semibold">Identifiant :</h4>
                                  <p class="mb-0">${demande.uid}</p>
                             </div>
                             <div class="col-lg-3 my-2">
                                  <p class="text-dark fw-semibold fs-16 mb-1">Catégorie :</p>
                                  <p class="mb-0">${demande.categorie}</p>
                             </div>
                             <div class="col-lg-3 my-2">
                                  <p class="text-dark fw-semibold fs-16 mb-1">Date d'envoi :</p>
                                  <p class="mb-0">${formatDateHeure(demande.created_at)}</p>
                             </div>
                            <div class="col-12 my-2">
                                  <h4 class="card-title mb-2 text-dark fw-semibold">Statut :</h4>
                                  <p class="mb-0">
                                    <span class="badge bg-${demande.statut === 'en_attente' ? 'primary' :
                                              demande.statut === 'en_cours'   ? 'warning' :
                                              demande.statut === 'traitee'    ? 'success' :
                                              demande.statut === 'rejete'     ? 'danger' :
                                              demande.statut} text-white fs-14 px-2 py-1">
                                        ${demande.statut === 'en_attente' ? 'En attente' :
                                              demande.statut === 'en_cours'   ? 'En cours' :
                                              demande.statut === 'traitee'    ? 'Tratée' :
                                              demande.statut === 'rejete'     ? 'Rejétée' :
                                              demande.statut}
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

        $(document).off("click", ".btn-delete").on("click", ".btn-delete", function (e) {
            e.preventDefault();
            const id = $(this).data("id");
            
            confirmAction().then((result) => {
                if (result.isConfirmed) {

                    preloader(1);

                    const urlAxios = `${url}/api/DeleteMesDemandes/${user.id}/${id}`;

                    reqAxios(1, urlAxios,'DELETE')
                        .then(res => {

                            preloader(0);

                            if (res.success) {

                                tableListe();

                            }
                        });
                }
            });

        });

        $(document).off("click", ".btn-motif").on("click", ".btn-motif", function (e) {
            e.preventDefault();

            const id = $(this).data("id");
            const demande = dataTable.find(item => item.id == id);

            if (!demande) {
                console.warn("⚠️ Aucune demande trouvée pour cet ID.");
                return;
            }

            let actionsHtml = '';

            if (demande.actions && demande.actions.length > 0) {
                demande.actions.forEach(action => {
                    actionsHtml += `
                        <div class="border-bottom pb-3">  
                            <div class="d-flex align-items-center gap-1 mb-2">
                                <div class="position-relative">
                                    <img src="assets/app/images/user.png" class="avatar rounded-circle flex-shrink-0 border border-2">
                                </div>
                                <div class="d-block ms-2 flex-grow-1">
                                    <span class="text-dark">
                                        <a href="#!" class="text-dark fw-medium">${action.traiteur}</a>
                                    </span>
                                    <p class="text-muted mb-0">
                                        <i class="ti ti-calendar-due"></i> ${formatDateHeure(action.date)}
                                    </p>
                                </div>
                                <div class="ms-auto">
                                    <span class="badge px-2 py-1 fs-16 bg-${action.type == 0 ? 'danger' : 'success'}">
                                        ${action.type == 0 ? 'Rejétée' : 'Traitée'}
                                    </span>
                                </div>
                            </div>
                            <p class="text-dark fw-semibold fs-16 ">Commentaire :</p>
                            <p class="mt-2 text-muted">${action.commentaire || 'Aucun commentaire'}</p>
                        </div>
                    `;
                });
            } else {
                actionsHtml = `
                    <div class="border-bottom pb-3">
                        <p class="text-muted mb-0">Aucune action trouvée pour cette demande.</p>
                    </div>
                `;
            }


            let html = `
                <div class="p-2">
                   <div class="card-body">
                        ${actionsHtml}
                    </div>
                </div>`;

            const $overlay = showDynamicModal(html, { title: "Détails traitement", size: "xl" });

        });

    }

});

