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
                        <span class="text-dark fw-medium fs-15">${item.objet}</span>
                    </td>
                    <td class="text-center" >${item.categorie}</td>
                    <td class="text-center" >${item.service}</td>
                    <td class="text-center">
                        <span class="badge 
                            ${item.statut === 'en_attente' ? 'bg-warning-subtle text-warning' :
                              item.statut === 'en_cours'   ? 'bg-primary-subtle text-primary' :
                              item.statut === 'traitee'    ? 'bg-success-subtle text-success' :
                              item.statut === 'rejete'     ? 'bg-danger-subtle text-danger' :
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
                            ${item.statut == 'en_attente' ? `
                                <a href="#!" class="btn btn-soft-danger btn-sm btn-delete rounded-pill" data-id="${item.id}">
                                    <i class="ri-delete-bin-line align-middle fs-18"></i>
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

            const demande = dataTable.find(item => item.id === id);

            if (!demande) {
                console.warn("⚠️ Aucune demande trouvée pour cet ID.");
                return;
            }

            let html = `
                <div class="p-3">
                    <h3 class="fw-bold mb-2">${demande.objet}</h3>
                    <h4><strong>Catégorie :</strong> ${demande.categorie}</h4>
                    <h4><strong>Service :</strong> ${demande.service}</h4>
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

        $(document).off("click", ".btn-delete").on("click", ".btn-delete", function (e) {
            e.preventDefault();
            const id = $(this).data("id");
            console.log("🗑️ Supprimer agent ID:", id);
            
            confirmAction().then((result) => {
                if (result.isConfirmed) {

                    preloader(1);

                    const urlAxios = `${url}/api/DeleteMesDemandes/${user.id}`;

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

    }

});

