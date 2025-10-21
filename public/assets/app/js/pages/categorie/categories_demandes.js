$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";

    let dataTable = [];

    initStart();

    function initStart()  {

        globalePage.append(ListeCategorie());
        tableListe();

        $(document).off("click", ".btnActualiser").on("click", ".btnActualiser", function() {
            tableListe();
        });

        $(document).off("click", ".btnAjouter").on("click", ".btnAjouter", function() {
            formNew();
        });
 
    }

    function formNew() {

       let html = `
            <div class="row g-3" >
                <div class="col-12">
                    <label class="form-label">Service</label>
                    <select class="form-control" data-choices id="service_id"></select>
                </div>
                <div class="col-12">
                    <label class="form-label">Nouvelle catégorie</label>
                    <input type="text" class="form-control" id="name" placeholder="Ex : Problème de matériel ...">
                </div>
                <div class="col-12">
                    <button class="btn btn-success btnEng" >Enregistrer</button>
                </div>
            </div>
        `;

        const $overlay = showDynamicModal(html, { title: "Nouvelle catégorie", size: "md" }, 1);
        select_service_all('#service_id');
        textMajuscule('#name');

        $(document).off("click", ".btnEng").on("click", ".btnEng", function (e) {
            e.preventDefault();   

            const btnId = $('.btnEng');
            const btnLabel = $('.btnEng').text(); 

            const name = $('#name');
            const service_id = $('#service_id');

            const props = selectExtraitData(service_id.val());

            if (!name.val().trim() || service_id.val() == '0') {

                showAlert(
                    "Attention", 
                    "Veuillez bien remplir tous les champs s'il vous plaît", 
                    "info"
                );

                return;
            }

            const data = {
                name: name.val(),
                service_id: props.id,
            };

            spinerButton(0, btnId, 'Vérification en cours');

            const urlAxios = `${url}/api/InsertCategorie`;

            reqAxios(1, urlAxios,'POST',data,btnId,btnLabel)
                .then(res => {
                    if (res.success) {
                        $overlay.remove();
                        tableListe();
                    }
                });
        });
    }

    function tableListe() {

        $('#tablecategorie tbody').empty();

        loadingTable('#tablecategorie', '#pagination', 1);

        const urlAxios = `${url}/api/ListeCategorie`;

        reqAxios(0, urlAxios,'GET')
            .then(res => {

                loadingTable('#tablecategorie', '#pagination', 0);
                dataTable = res.data.data ?? []; 
                renderDynamicTable("#tablecategorie", null, "#searchInput", "#pagination", agentRowRenderer, dataTable);
            }); 

        // Fonction de rendu des lignes
        function agentRowRenderer(item, index, start) {
            return $(`
                <tr>
                    <td class="text-center" >${start + index + 1}</td>
                    <td class="text-center" >
                        <span class="text-dark fw-medium fs-15">${item.nom}</span>
                    </td>
                    <td class="text-center" >
                        <span class="text-dark fw-medium fs-15">${item.service.description}</span>
                    </td>
                    <td class="text-center" >${formatDateHeure(item.created_at)}</td>
                    <td class="text-center" >
                        <div class="d-flex align-items-center justify-content-center gap-2">
                            <a href="#" class="btn btn-warning btn-sm btn-edit rounded-2" data-id="${item.id}">
                                <i class="ri-edit-line align-middle fs-14"></i>
                            </a>
                            ${item.nbre_demande == 0 ? `
                            <a href="#" class="btn btn-danger btn-sm btn-delete rounded-2" data-id="${item.id}">
                                <i class="ri-delete-bin-line align-middle fs-14"></i>
                            </a>
                            ` : `` }
                        </div>
                    </td>
                </tr>
            `);
        }

        $(document).off("click", ".btn-edit").on("click", ".btn-edit", function (e) {
            e.preventDefault();

            const id = $(this).data("id");

            let html = `
                <div class="row g-3" >
                    <div class="col-12">
                        <label class="form-label">Nouvelle catégorie</label>
                        <input type="text" class="form-control" id="nameModif" placeholder="Ex : Problème de matériel ...">
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
                        "Veuillez saisir le nom de la nouvelle catégorie s'il vous plaît", 
                        "info"
                    );

                    return;
                }

                const data = {
                    name: name.val(),
                };

                spinerButton(0, btnId, 'Vérification en cours');

                const urlAxios = `${url}/api/UpdateCategorie/${id}`;

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

            console.log(id);
            
            confirmAction().then((result) => {
                if (result.isConfirmed) {

                    preloader(1);

                    const urlAxios = `${url}/api/DeleteCategorie/${id}`;

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

  