$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";

    let dataTable = [];

    initStart();

    function initStart()  {

        globalePage.append(ListeService());
        tableListe();

        $(document).on("click", ".btnActualiser", function() {
            tableListe();
        });
 
    }

    function tableListe() {

        $('#tableService tbody').empty();

        loadingTable('#tableService', '#pagination', 1);

        const urlAxios = `${url}/api/ListeService`;

        reqAxios(0, urlAxios,'GET')
            .then(res => {

                loadingTable('#tableService', '#pagination', 0);
                dataTable = res.data.data ?? []; 
                renderDynamicTable("#tableService", null, "#searchInput", "#pagination", agentRowRenderer, dataTable);
            }); 

        // Fonction de rendu des lignes
        function agentRowRenderer(item, index, start) {
            return $(`
                <tr>
                    <td class="text-center" >${start + index + 1}</td>
                    <td class="text-center" >
                        <span class="text-dark fw-medium fs-15">${item.description}</span>
                    </td>
                    <td class="text-center" >
                        ${item.nbre_traiteur}
                    </td>
                    <td class="text-center" >
                        ${item.nbre_categ}
                    </td>
                    <td class="text-center" >${formatDateHeure(item.created_at)}</td>
                    <td class="text-center" >
                        <div class="d-flex align-items-center justify-content-center gap-2">
                            <a href="#" class="btn btn-primary btn-sm btn-categ rounded-2" data-id="${item.id}">
                                <i class="ri-menu-line align-middle fs-14"></i>
                            </a>
                            <a href="#" class="btn btn-warning btn-sm btn-edit rounded-2" data-id="${item.id}">
                                <i class="ri-edit-line align-middle fs-14"></i>
                            </a>
                            ${item.nbre_traiteur == 0 && item.nbre_categ == 0 ? `
                            <a href="#" class="btn btn-danger btn-sm btn-delete rounded-2" data-id="${item.id}">
                                <i class="ri-delete-bin-line align-middle fs-14"></i>
                            </a>
                            ` : `` }
                        </div>
                    </td>
                </tr>
            `);
        }

        // ✅ Gérer directement les clics sur les boutons du tableau
        $(document).off("click", ".btn-categ").on("click", ".btn-categ", function (e) {
            e.preventDefault();

            const id = $(this).data("id");
            const service = dataTable.find(item => item.id == id);

            if (!service) {
                console.warn("⚠️ Aucune demande trouvée pour cet ID.");
                return;
            }

            let traiteurHtml = '';
            let categorieHtml = '';

            if (service.traiteur && service.traiteur.length > 0) {
                service.traiteur.forEach(item => {
                    traiteurHtml += `
                        <div class="border-bottom pb-3 mt-3">  
                            <div class="d-flex align-items-center gap-1 mb-2">
                                <div class="position-relative">
                                    <img src="assets/app/images/user2.png" class="avatar rounded-circle flex-shrink-0 border border-2">
                                </div>
                                <div class="d-block ms-2 flex-grow-1">
                                    <span class="text-dark">
                                        <a href="#!" class="text-dark fw-medium">${item.name}</a>
                                    </span>
                                </div>
                                <div class="ms-auto">
                                    <div class="d-flex gap-1">
                                        <a href="javascript: void(0);" class="btn btn-warning avatar-sm d-flex align-items-center justify-content-center fs-20">
                                            <i class="ri-edit-fill"></i>
                                        </a>
                                        <a href="javascript: void(0);" class="btn btn-danger avatar-sm d-flex align-items-center justify-content-center fs-20">
                                            <i class="ri-delete-bin-line"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
            } else {
                traiteurHtml = `
                    <div class="pb-3">
                        <p class="text-danger text-center mb-0">Aucun traiteur pour l'instant.</p>
                    </div>
                `;
            }

            if (service.categories && service.categories.length > 0) {
                service.categories.forEach(item => {
                    categorieHtml += `
                        <div class="border-bottom pb-3 mt-3">  
                            <div class="d-flex align-items-center gap-1 mb-2">
                                <div class="position-relative">
                                    <img src="assets/app/images/categ.png" class="avatar rounded-circle flex-shrink-0 border border-2">
                                </div>
                                <div class="d-block ms-2 flex-grow-1">
                                    <span class="text-dark">
                                        <a href="#!" class="text-dark fw-medium">${item.nom}</a>
                                    </span>
                                    <p class="text-muted mb-0">
                                        <i class="ti ti-calendar-due"></i> ${formatDateHeure(item.created_at)}
                                    </p>
                                </div>
                                <div class="ms-auto">
                                    <div class="d-flex gap-1">
                                        <a href="javascript: void(0);" class="btn btn-warning avatar-sm d-flex align-items-center justify-content-center fs-20">
                                            <i class="ri-edit-fill"></i>
                                        </a>
                                        <a href="javascript: void(0);" class="btn btn-danger avatar-sm d-flex align-items-center justify-content-center fs-20">
                                            <i class="ri-delete-bin-line"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
            } else {
                categorieHtml = `
                    <div class="pb-3">
                        <p class="text-danger text-center mb-0">Aucune catégorie n'à été trouvée.</p>
                    </div>
                `;
            }


            let html = `
                <div class="p-2">
                   <div class="card-body">
                        <div class="row my-2">
                            <div class="col-lg-3 my-2">
                                  <h4 class="card-title mb-2 text-dark fw-semibold">Identifiant :</h4>
                                  <p class="mb-0">${service.uid}</p>
                             </div>
                             <div class="col-lg-3 my-2">
                                  <p class="text-dark fw-semibold fs-16 mb-1">Service :</p>
                                  <p class="mb-0">${service.description}</p>
                             </div>
                            <div class="col-lg-3 my-2">
                                  <p class="text-dark fw-semibold fs-16 mb-1">Nbre de Traiteur :</p>
                                  <p class="mb-0">${service.nbre_traiteur}</p>
                             </div>
                            <div class="col-lg-3 my-2">
                                  <p class="text-dark fw-semibold fs-16 mb-1">Nbre de Catégorie :</p>
                                  <p class="mb-0">${service.nbre_categ}</p>
                             </div>
                             <div class="col-lg-3 my-2">
                                  <p class="text-dark fw-semibold fs-16 mb-1">Date de création :</p>
                                  <p class="mb-0">${formatDateHeure(service.created_at)}</p>
                             </div>
                        </div>
                        <div class="row my-2">
                            <div class="col-lg-3 my-2">
                                  <h4 class="card-title mb-2 text-dark fw-semibold">Responsable :</h4>
                             </div>
                        </div>
                        ${service.responsable != null ? `
                        <div class="border-bottom pb-3 mt-3">  
                            <div class="d-flex align-items-center gap-1 mb-2">
                                <div class="position-relative">
                                    <img src="assets/app/images/user.png" class="avatar rounded-circle flex-shrink-0 border border-2">
                                </div>
                                <div class="d-block ms-2 flex-grow-1">
                                    <span class="text-dark">
                                        <a href="#!" class="text-dark fw-medium">${service.responsable.name}</a>
                                    </span>
                                </div>
                                <div class="ms-auto">
                                    <div class="d-flex gap-1">
                                        <a href="javascript: void(0);" class="btn btn-warning avatar-sm d-flex align-items-center justify-content-center fs-20">
                                            <i class="ri-edit-fill"></i>
                                        </a>
                                        <a href="javascript: void(0);" class="btn btn-danger avatar-sm d-flex align-items-center justify-content-center fs-20">
                                            <i class="ri-delete-bin-line"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` : `
                        <div class="pb-3">
                            <p class="text-danger text-center mb-0">Pas de responsable pour l'instant.</p>
                        </div>
                        `}
                        <div class="row my-2">
                            <div class="col-lg-3 my-2">
                                  <h4 class="card-title mb-2 text-dark fw-semibold">Traiteurs :</h4>
                             </div>
                        </div>
                        ${traiteurHtml}
                        <div class="row my-2">
                            <div class="col-lg-3 my-2">
                                  <h4 class="card-title mb-2 text-dark fw-semibold">Categories :</h4>
                             </div>
                        </div>
                        ${categorieHtml}
                    </div>
                </div>`;

            const $overlay = showDynamicModal(html, { title: "Détails", size: "xl" });
        });

        $(document).off("click", ".btn-edit").on("click", ".btn-edit", function (e) {
            e.preventDefault();

            const id = $(this).data("id");

            let html = `
                <div class="row g-3" >
                    <div class="col-md-6">
                        <label class="form-label">Désignation</label>
                        <input type="text" class="form-control" disabled value="SERVICE">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Nom du nouveau service</label>
                        <input type="text" class="form-control" id="nameModif" placeholder="Ex : Réclamation ...">
                    </div>
                    <div class="col-12">
                        <button class="btn btn-success btnUpdate" >Enregistrer</button>
                    </div>
                </div>
            `;

            const $overlay = showDynamicModal(html, { title: "Mise à jour", size: "lg" });
            textMajuscule('#nameModif');    

            $(document).off("click", ".btnUpdate").on("click", ".btnUpdate", function (e) {
                e.preventDefault();

                const btnId = $('.btnUpdate');
                const btnLabel = $('.btnUpdate').text(); 

                const name = $('#nameModif');

                if (!name.val().trim()) {

                    showAlert(
                        "Attention", 
                        "Veuillez saisir le nom du nouveau du service s'il vous plaît", 
                        "info"
                    );

                    return;
                }

                const data = {
                    name: name.val(),
                };

                spinerButton(0, btnId, 'Vérification en cours');

                const urlAxios = `${url}/api/UpdateService/${id}`;

                reqAxios(1, urlAxios,'PUT',data,btnId,btnLabel)
                    .then(res => {
                        if (res.success) {
                            $overlay.remove();
                            tableListe();
                        }
                    });   

            });
        });

        $(document).off("click", ".btn-delete").on("click", ".btn-delete", function (e) {
            e.preventDefault();
            const id = $(this).data("id");
            
            confirmAction().then((result) => {
                if (result.isConfirmed) {

                    preloader(1);

                    const urlAxios = `${url}/api/DeleteService/${id}`;

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

  