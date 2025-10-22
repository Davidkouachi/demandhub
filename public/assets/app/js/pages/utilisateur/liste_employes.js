$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";

    let dataTable = [];

    initStart();

    function initStart()  {

        globalePage.append(ListeEmploye());
        selectRefreshId('#role');
        tableListe();

        $(document).off("click", ".btnActualiser").on("click", ".btnActualiser", function() {
            tableListe();
        });
 
    }

    function tableListe() {

        $('#tableEmploye tbody').empty();

        loadingTable('#tableEmploye', '#pagination', 1);

        const urlAxios = `${url}/api/ListeEmploye`;

        reqAxios(0, urlAxios,'GET')
            .then(res => {

                loadingTable('#tableEmploye', '#pagination', 0);
                dataTable = res.data.data ?? []; 
                renderDynamicTable("#tableEmploye", { id:"#role", key:"role_id" }, "#searchInput", "#pagination", agentRowRenderer, dataTable);
            }); 

        // Fonction de rendu des lignes
        function agentRowRenderer(item, index, start) {
            return $(`
                <tr>
                    <td class="text-center" >${start + index + 1}</td>
                    <td class="text-center" >
                        <div class="d-flex align-items-center gap-2">
                            <div>
                                <img src="assets/app/images/user.png" class="avatar-sm rounded-circle border border-2">
                            </div>
                            <div class="d-flex flex-column align-items-left justify-content-center" >
                                <a href="" class="text-dark fw-medium fs-15">${item.name}</a>
                            </div>
                         </div>
                    </td>
                    <td class="text-center" >
                        ${item.email}
                    </td>
                    <td class="text-center" >
                        ${item.tel ?? 'aucun'}
                    </td>
                    <td class="text-center">
                        <span class="badge 
                            ${item.role_id == '2' ? 'bg-danger' :
                              item.role_id == '3'   ? 'bg-warning' :
                              item.role_id == '4'    ? 'bg-primary' :
                              'bg-secondary'} 
                            py-1 px-2 fs-13">
                            ${item.role_id == '2' ? 'Responsable de service' :
                              item.role_id == '3'   ? 'Traiteur de demande' :
                              item.role_id == '4'    ? 'Employés' :
                              item.role_id}
                        </span>
                    </td>
                    <td class="text-center" >${formatDateHeure(item.created_at)}</td>
                    <td class="text-center" >
                        <div class="d-flex align-items-center justify-content-center gap-2">
                            <a href="#" class="btn btn-warning btn-sm btn-view rounded-2" data-id="${item.id}">
                                <i class="ri-eye-line align-middle fs-14"></i>
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

            const user = dataTable.find(item => item.id == id);

            if (!user) {
                console.warn("⚠️ Aucune demande trouvée pour cet ID.");
                return;
            }

            let html = `
                <div class="p-2">
                   <div class="card-body">
                        <div class="row my-2">
                            <div class="col-12 my-2">
                                <div class="d-flex align-items-center gap-2 mb-3">
                                        <img src="assets/app/images/user.png" alt="" class="avatar-md rounded-circle border border-2">
                                        <div class="d-block">
                                            <h5 class="text-dark fw-medium">${user.name}</h5>
                                            <span class="badge 
                                                ${user.role_id == '2' ? 'bg-danger' :
                                                  user.role_id == '3'   ? 'bg-warning' :
                                                  user.role_id == '4'    ? 'bg-primary' :
                                                  'bg-secondary'} py-1 px-2 fs-13">
                                                ${user.role_id == '2' ? `RESPONSABLE DU ${user.service} ` :
                                                  user.role_id == '3'   ? `TRAITEUR DU ${user.service} ` :
                                                  user.role_id == '4'    ? 'EMPLOYES' :
                                                  user.role_id}
                                            </span>
                                        </div>
                                        <div class="ms-auto">
                                          <div class="d-flex gap-1">
                                                <a href="javascript: void(0);" class="btn btn-primary avatar-sm d-flex align-items-center justify-content-center fs-20">
                                                    <i class="ri-lock-line"></i>
                                                </a>
                                                <a href="javascript: void(0);" class="btn btn-warning avatar-sm d-flex align-items-center justify-content-center fs-20">
                                                    <i class="ri-unlocked-line"></i>
                                                </a>
                                                <a href="javascript: void(0);" class="btn btn-danger avatar-sm d-flex align-items-center justify-content-center fs-20">
                                                    <i class="ri-delete-bin-line"></i>
                                                </a>
                                            </div>
                                        </div>
                                </div>
                             </div>
                            <div class="col-lg-3 my-2">
                                <p class="text-dark fw-semibold fs-16 mb-1">Email :</p>
                                <p class="mb-0">${user.email}</p>
                            </div>
                            <div class="col-lg-3 my-2">
                                <p class="text-dark fw-semibold fs-16 mb-1">Contact :</p>
                                <p class="mb-0">${user.tel}</p>
                            </div>
                            <div class="col-lg-3 my-2">
                                <p class="text-dark fw-semibold fs-16 mb-1">Login :</p>
                                <p class="mb-0">${user.login}</p>
                            </div>
                            <div class="col-lg-3 my-2">
                                <p class="text-dark fw-semibold fs-16 mb-1">Statut du compte :</p>
                                <p class="mb-0">
                                    <span class="badge 
                                        ${user.lock == 0 ? 'bg-success' : 'bg-danger'} py-1 px-2 fs-13">
                                        ${user.lock == 0 ? `Actif` : `Inactif`}
                                    </span>
                                </p>
                            </div>
                            <div class="col-lg-3 my-2">
                                  <p class="text-dark fw-semibold fs-16 mb-1">Date d'enregistrement :</p>
                                  <p class="mb-0">${formatDateHeure(user.created_at)}</p>
                            </div>
                        </div>
                    </div>
                </div>`;

            const $overlay = showDynamicModal(html, { title: "Détails", size: "xl" });

        });

    }

});

  