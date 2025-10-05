$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";

    let dataTable = [];

    initStart();

    function initStart()  {

        globalePage.append(ListeMesDemdandesEnCours());

        loadingTable(function() {
            tableListe();
        }, 2000, '#agentTable', '#pagination');

        $(document).on("click", ".btnActualiser", function() {
            loadingTable(function() {
                tableListe();
            }, 2000, '#agentTable', '#pagination');
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
                <tr 
                    data-id="${item.id}" 
                    data-name="${item.name}" 
                    data-photo="${item.photo}"
                    data-address="${item.address}"
                    data-email="${item.email}"
                    data-contact="${item.contact}"
                    data-experience="${item.experience}"
                    data-date="${item.date}"
                    data-status="${item.status}"
                    style="cursor: pointer;"
                >
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
                </tr>
            `);
        }

        // Appel du tableau dynamique
        renderDynamicTable("#agentTable", null, "#searchInput", "#pagination", agentRowRenderer, extendedDataTable);

        // Gestion des clics sur les lignes
        $(document).off("click", "#agentTable tbody tr"); // éviter doublons
        $(document).on("click", "#agentTable tbody tr", function() {
            const $tr = $(this);
            const data = {
                id: $tr.data("id"),
                name: $tr.data("name"),
                status: $tr.data("status"),
            };

            // Boutons dynamiques selon statut
            const allButtons = [
                { text: "Détails", class: "btn-view btn-warning", icon: "ri-user-6-line", showFor: ["Active", "Inactive"] },
                { text: "Mise à jour", class: "btn-edit btn-success", icon: "ri-pencil-line", showFor: ["Active"] },
                { text: "Supprimer", class: "btn-delete btn-danger", icon: "ri-delete-bin-line", showFor: ["Active"] },
                { text: "Réactiver", class: "btn-activate btn-primary", icon: "ri-refresh-line", showFor: ["Inactive"] }
            ];
            const buttons = allButtons.filter(btn => btn.showFor.includes(data.status));

            // Afficher overlay d’action
            const $overlay = window.showDynamicActionModal(data, buttons);

            // Gestion clic sur les boutons
            $overlay.find("a").on("click", function(e) {
                e.preventDefault();
                const id = $(this).data("id");
                const action = $(this).attr("class").split(' ')[1];
                console.log("Action:", action, "ID:", id, "Status:", data.status);

                if (typeof window.handleModalAction === "function") {
                    window.handleModalAction(action, id, data);
                }

                $overlay.remove(); // fermer après action
            });
        });
    }


});

