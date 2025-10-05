$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";

    let dataTable = [];

    initStart();

    function initStart()  {

        globalePage.append(ListeMesDemdandes());
        selectRefreshId('#statut');

        loadingTable(function() {
            tableListe();
        }, 2000, '#tableDemande', '#pagination');

        $(document).on("click", ".btnActualiser", function() {
            loadingTable(function() {
                tableListe();
            }, 2000, '#tableDemande', '#pagination');
        });
 
    }

    function tableListe() {
        // Données de base
        let dataTable = [
            { id: 1, name: "Michael A. Miner", photo: "assets/images/users/avatar-2.jpg", address: "Lincoln Drive Harrisburg, PA 17101 U.S.A", email: "michaelminer@dayrep.com", contact: "+787 608-360-0464", experience: "5 Year", date: "21 May 2018", status: "Active" },
            { id: 2, name: "Alice Johnson", photo: "assets/images/users/avatar-1.jpg", address: "New York, NY", email: "alice@example.com", contact: "+123 456 7890", experience: "3 Year", date: "15 Mar 2020", status: "Inactive" },
            { id: 3, name: "Bob Smith", photo: "assets/images/users/avatar-3.jpg", address: "Los Angeles, CA", email: "bob@example.com", contact: "+987 654 3210", experience: "7 Year", date: "01 Jan 2015", status: "Active" }
        ];

        // Étendre les données pour remplir la table
        const duplicationCount = 5;
        let extendedDataTable = [];
        for (let i = 0; i < duplicationCount; i++) {
            dataTable.forEach(item => {
                extendedDataTable.push({
                    ...item,
                    id: item.id + i * dataTable.length // ID unique
                });
            });
        }

        // Fonction de rendu des lignes
        function agentRowRenderer(item, index, start) {
            return $(`
                <tr>
                    <td>${start + index + 1}</td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <div><img src="${item.photo}" alt="" class="avatar-sm rounded-circle"></div>
                            <div><a href="#!" class="text-dark fw-medium fs-15">${item.name}</a></div>
                        </div>
                    </td>
                    <td>${item.email}</td>
                    <td>${item.contact}</td>
                    <td>${item.experience}</td>
                    <td>${item.date}</td>
                    <td>
                        <span class="badge ${item.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} py-1 px-2 fs-13">
                            ${item.status}
                        </span>
                    </td>
                    <td>
                        <div class="d-flex gap-2">
                            <a href="#!" class="btn btn-light btn-sm btn-view" data-id="${item.id}">
                                <i class="ri-user-6-line align-middle fs-18"></i>
                            </a>
                            ${item.status === 'Active' ? `
                                <a href="#!" class="btn btn-soft-primary btn-sm btn-edit" data-id="${item.id}">
                                    <i class="ri-pencil-line align-middle fs-18"></i>
                                </a>
                                <a href="#!" class="btn btn-soft-danger btn-sm btn-delete" data-id="${item.id}">
                                    <i class="ri-delete-bin-line align-middle fs-18"></i>
                                </a>
                            ` : `
                                <a href="#!" class="btn btn-soft-success btn-sm btn-activate" data-id="${item.id}">
                                    <i class="ri-refresh-line align-middle fs-18"></i>
                                </a>
                            `}
                        </div>
                    </td>
                </tr>
            `);
        }

        // Appel du tableau dynamique
        renderDynamicTable("#tableDemande", "#statut", "#searchInput", "#pagination", agentRowRenderer, extendedDataTable);

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

