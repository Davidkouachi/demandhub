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
                if (res.success) {
                    loadingTable('#tableMesDemande', '#pagination', 0);
                    dataTable = res.data.data; 
                    renderDynamicTable("#tableMesDemande", "#statut", "#searchInput", "#pagination", agentRowRenderer, dataTable);

                    dataTable.forEach(item => {
                        console.log(`Demande ID: ${item.id}, Objet: ${item.objet}, Statut: ${item.statut}`);

                        // 🔹 Vérification si fichiers est un tableau
                        if (Array.isArray(item.fichiers) && item.fichiers.length > 0) {
                            console.log("Fichiers liés :");
                            item.fichiers.forEach(file => {
                                console.log(` - ${file.chemin} (${file.nom_original})`);
                            });
                        } else {
                            console.log("Aucun fichier lié.");
                        }
                    });

                } else {
                    const colspan = $("#tableMesDemande thead th").length;
                    $('#tableMesDemande').append(`
                        <tr>
                            <td colspan="${colspan}" class="text-center text-danger py-3">
                                Aucun résultat trouvé
                            </td>
                        </tr>
                    `);
                    $('#pagination').empty();
                }
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
                    <td class="text-center" >${formatDateHeure(item.created_at)}</td>
                    <td class="text-center" >
                        <div class="d-flex align-items-center justify-content-center gap-2">
                            <a href="#!" class="btn btn-light btn-sm btn-view rounded-pill" data-id="${item.id}">
                                <i class="ri-user-6-line align-middle fs-18"></i>
                            </a>
                            ${(Array.isArray(item.fichiers) && item.fichiers.length > 0) ? `
                                <a href="#!" class="btn btn-soft-warning btn-sm btn-edit rounded-pill" data-id="${item.id}">
                                    <i class="ri-file-line align-middle fs-18"></i>
                                </a>
                            ` : `` }
                            ${item.statut == 'en_attente' ? `
                                <a href="#!" class="btn btn-soft-primary btn-sm btn-edit rounded-pill" data-id="${item.id}">
                                    <i class="ri-pencil-line align-middle fs-18"></i>
                                </a>
                                <a href="#!" class="btn btn-soft-danger btn-sm btn-delete rounded-pill" data-id="${item.id}">
                                    <i class="ri-delete-bin-line align-middle fs-18"></i>
                                </a>
                            ` : ` `}

                        </div>
                    </td>
                </tr>
            `);
        }

        // Désactiver les anciens événements pour éviter doublons
        $(document).off("click", ".btn-view, .btn-edit, .btn-delete, .btn-activate");

        // ✅ Gérer directement les clics sur les boutons du tableau
        $(document).on("click", ".btn-view", function (e) {
            e.preventDefault();
            const id = $(this).data("id");
            console.log("👁️ Voir détails agent ID:", id);
            // Ici tu peux appeler une fonction showDetails(id);
        });

        $(document).on("click", ".btn-edit", function (e) {
            e.preventDefault();
            const id = $(this).data("id");
            console.log("✏️ Modifier agent ID:", id);
            // editAgent(id);
        });

        $(document).on("click", ".btn-delete", function (e) {
            e.preventDefault();
            const id = $(this).data("id");
            console.log("🗑️ Supprimer agent ID:", id);
            // deleteAgent(id);
        });

        $(document).on("click", ".btn-activate", function (e) {
            e.preventDefault();
            const id = $(this).data("id");
            console.log("🔄 Réactiver agent ID:", id);
            // reactivateAgent(id);
        });
    }

});

