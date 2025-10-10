$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";

    let dataTable = [];

    initStart();

    function initStart()  {

        globalePage.append(ListeMesDemdandesEnCours());
        tableListe();

        $(document).on("click", ".btnActualiser", function() {
            tableListe();
        });
 
    }

    function tableListe() {
        
        $('#tableDemandeCours tbody').empty();

        loadingTable('#tableDemandeCours', '#pagination', 1);

        const urlAxios = `${url}/api/ListeMesDemandes/${user.id}/en_cours`;

        reqAxios(0, urlAxios,'GET')
            .then(res => {

                loadingTable('#tableDemandeCours', '#pagination', 0);
                dataTable = res.data.data ?? []; 
                renderDynamicTable("#tableDemandeCours", null, "#searchInput", "#pagination", agentRowRenderer, dataTable);

            }); 

        function agentRowRenderer(item, index, start) {
            return $(`
                <tr data-id="${item.id}" data-statut="${item.statut}" style="cursor: pointer;">
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
                </tr>
            `);
        }

        // Gestion des clics sur les lignes
        $(document).off("click", "#tableDemandeCours tbody tr"); // éviter doublons
        $(document).on("click", "#tableDemandeCours tbody tr", function() {
            const $tr = $(this);
            const data = {
                id: $tr.data("id"),
                statut: $tr.data("statut"),
            };

            if (data.id) {
                // Boutons dynamiques selon statut
                const allButtons = [
                    { text: "Détails", class: "btn-view btn-warning", icon: "ri-eye-line", showFor: ["en_cours"] },
                    { text: "Mise à jour", class: "btn-edit btn-success", icon: "ri-pencil-line", showFor: ["Active"] },
                    { text: "Supprimer", class: "btn-delete btn-danger", icon: "ri-delete-bin-line", showFor: ["Active"] },
                    { text: "Réactiver", class: "btn-activate btn-primary", icon: "ri-refresh-line", showFor: ["Inactive"] }
                ];
                const buttons = allButtons.filter(btn => btn.showFor.includes(data.statut));

                // Afficher overlay d’action
                const $overlay = window.showDynamicActionModal(data, buttons);

                // Gestion clic sur les boutons
                $overlay.find("a").on("click", function(e) {
                    e.preventDefault();
                    const id = $(this).data("id");
                    const action = $(this).attr("class").split(' ')[1];
                    console.log("Action:", action, "ID:", id, "Statut:", data.statut);

                    if (typeof window.handleModalAction === "function") {
                        window.handleModalAction(action, id, data);
                    }

                    $overlay.remove(); // fermer après action
                });

            }
        });
    }


});

