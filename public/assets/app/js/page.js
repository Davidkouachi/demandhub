$(document).ready(function () {

    window.pageTitre = function () {

        const data = JSON.parse(localStorage.getItem("pageHeader")) || null;

        globalPage.append(`
            <div class="row">
                <div class="col-12">
                    <div class="page-title-box">
                        <ol class="breadcrumb mb-0">
                            ${data.stitle != null ? `<li class="breadcrumb-item">${data.stitle}</li>` : ``}
                            <li class="breadcrumb-item active">${data.titre}</li>
                        </ol>
                    </div>
                </div>
            </div>
        `);
    }

    window.pageMaintenance = function () {
        
        const div = `        
            <div class="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-xl-12">
                            <div class="card auth-card">
                                <div class="card-body p-0">
                                    <div class="row align-items-center g-0">
                                        <div class="col-12">
                                            <div class="p-4">
                                                <div class="mx-auto mb-5 text-center auth-logo">
                                                    <img height="250" width="250" class="img-fluid" src="assets/images/maintenance.svg"/>
                                                </div>
                                                <h2 class="fw-bold text-center lh-base">
                                                    En cours de maintenance ...
                                                </h2>
                                                <p class="text-muted text-center mt-1 mb-4">
                                                    Veuillez patienter ou revenir plutard.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return div;
    }
    
    window.Dashboard = function () {

        pageTitre();
        
        const div = `        
            <div class="row">
                 <div class="col-md-6 col-xl-3">
                      <div class="card">
                           <div class="card-body">
                                <div class="row align-items-center justify-content-between">
                                     <div class="col-6">
                                          <div class="avatar-md bg-light bg-opacity-50 rounded">
                                               <iconify-icon icon="solar:buildings-2-broken" class="fs-32 text-primary avatar-title"></iconify-icon>
                                          </div>
                                          <p class="text-muted mb-2 mt-3">No. of Properties</p>
                                          <h3 class="text-dark fw-bold d-flex align-items-center gap-2 mb-0">2,854 <span class="badge text-success bg-success-subtle fs-12"><i class="ri-arrow-up-line"></i>7.34%</span></h3>
                                     </div> <!-- end col -->
                                     <div class="col-6">
                                          <div id="total_customers" class="apex-charts"></div>
                                     </div> <!-- end col -->
                                </div> <!-- end row-->
                           </div> <!-- end card body -->
                      </div> <!-- end card -->
                 </div> <!-- end col -->
                 <div class="col-md-6 col-xl-3">
                      <div class="card">
                           <div class="card-body">
                                <div class="row align-items-center justify-content-between">
                                     <div class="col-6">
                                          <div class="avatar-md bg-light bg-opacity-50 rounded">
                                               <iconify-icon icon="solar:users-group-two-rounded-broken" class="fs-32 text-primary avatar-title"></iconify-icon>
                                          </div>
                                          <p class="text-muted mb-2 mt-3">Regi. Agents</p>
                                          <h3 class="text-dark fw-bold d-flex align-items-center gap-2 mb-0">705 <span class="badge text-success bg-success-subtle fs-12"><i class="ri-arrow-up-line"></i>76.89%</span></h3>
                                     </div> <!-- end col -->
                                     <div class="col-6 text-end">
                                          <div id="invoiced_customers" class="apex-charts"></div>
                                     </div> <!-- end col -->
                                </div> <!-- end row-->
                           </div> <!-- end card body -->
                      </div> <!-- end card -->
                 </div> <!-- end col -->
                 <div class="col-md-6 col-xl-3">
                      <div class="card">
                           <div class="card-body">
                                <div class="row align-items-center justify-content-between">
                                     <div class="col-5">
                                          <div class="avatar-md bg-light bg-opacity-50 rounded">
                                               <iconify-icon icon="solar:shield-user-broken" class="fs-32 text-primary avatar-title"></iconify-icon>
                                          </div>
                                          <p class="text-muted mb-2 mt-3">Customers</p>
                                          <h3 class="text-dark fw-bold d-flex align-items-center gap-2 mb-0">9,431 <span class="badge text-danger bg-danger-subtle fs-12"><i class="ri-arrow-down-line"></i>45.00%</span></h3>
                                     </div> <!-- end col -->
                                     <div class="col-6 text-end">
                                          <div id="new_sale" class="apex-charts"></div>
                                     </div> <!-- end col -->
                                </div> <!-- end row-->
                           </div> <!-- end card body -->
                      </div> <!-- end card -->
                 </div> <!-- end col -->
                 <div class="col-md-6 col-xl-3">
                      <div class="card">
                           <div class="card-body">
                                <div class="row align-items-center justify-content-between">
                                     <div class="col-5">
                                          <div class="avatar-md bg-light bg-opacity-50 rounded">
                                               <iconify-icon icon="solar:money-bag-broken" class="fs-32 text-primary avatar-title"></iconify-icon>
                                          </div>
                                          <p class="text-muted mb-2 mt-3">Revenue</p>
                                          <h3 class="text-dark fw-bold d-flex align-items-center gap-2 mb-0">$78.3M <span class="badge text-success bg-success-subtle fs-12"><i class="ri-arrow-up-line"></i>8.76%</span></h3>
                                     </div> <!-- end col -->
                                     <div class="col-6 text-end">
                                          <div id="invoiced_sales" class="apex-charts"></div>
                                     </div> <!-- end col -->
                                </div> <!-- end row-->
                           </div> <!-- end card body -->
                      </div> <!-- end card -->
                 </div> <!-- end col -->
            </div>
        `;

        return div;
    }

    // Mes demandes -------------------------------------------------------------------------------------------

    window.FomulaireDemdande = function () {

        pageTitre();
        
        const div = `        
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title mb-1 anchor">
                                Formulaire
                            </h5>
                            <p class="text-muted">Veuillez renseigner tous les champs du formulaire et vérifier vos informations avant de l’envoyer.</p>
                            <div class="mb-3">
                                <form class="row g-3" id="formDemande">

                                    <div class="col-md-8">
                                        <label for="objet" class="form-label">Objet de la demande</label>
                                        <input type="text" class="form-control" id="objet" placeholder="Ex : Demande de matériel, Réclamation service...">
                                    </div>

                                    <div class="col-md-4">
                                        <label class="form-label">Catégorie</label>
                                        <select class="form-control" data-choices id="categorie_id"></select>
                                    </div>

                                    <div class="col-12">
                                        <label for="description" class="form-label">Description détaillée</label>
                                        <textarea class="form-control" id="description" rows="4" placeholder="Décrivez votre demande ou réclamation..."></textarea>
                                    </div>

                                    <div class="col-12">
                                        <label for="piece_jointe" class="form-label">Pièce jointe (Image, PDF, Excel, Word)</label>

                                        <!-- Bouton stylé -->
                                        <div class="d-flex align-items-center">
                                            <label class="btn btn-primary me-2 mb-0" for="piece_jointe">
                                                <i class="ri-upload-line me-1"></i> Choisir des fichiers
                                            </label>
                                            <span id="file-chosen" class="text-muted">Aucun fichier sélectionné</span>
                                        </div>

                                        <input class="form-control d-none" type="file" id="piece_jointe" name="piece_jointe[]" 
                                               accept=".jpg,.jpeg,.png,.pdf,.xls,.xlsx,.doc,.docx" multiple>

                                        <!-- Conteneur pour l'aperçu -->
                                        <div id="preview_files" class="row mt-3"></div>
                                    </div>

                                    <div class="col-12">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" id="validation">
                                            <label class="form-check-label" for="validation">
                                                Je confirme que toutes les informations renseignées sont exactes.
                                            </label>
                                        </div>
                                    </div>

                                    <div class="col-12">
                                        <button class="btn btn-primary btnForm" type="submit">Envoyer la demande</button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return div;
    }

    window.ListeMesDemdandesEnCours = function () {

        pageTitre();
        
        const div = `        
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center border-bottom">
                            <div>
                                <h4 class="card-title">
                                    Liste des demandes en cours
                                </h4>
                            </div>
                        </div>
                        <div class="card-header d-flex justify-content-between align-items-center border-bottom">
                            <div>
                                <div class="app-search me-auto">
                                   <div class="position-relative">
                                        <input type="search" id="searchInput" class="form-control form-control-sm border-1 rounded-3" placeholder="Rechercher..." autocomplete="off" value="">
                                        <i class="ri-search-line search-widget-icon"></i>
                                   </div>
                              </div>
                            </div>
                            <div>
                                <a class="btn btn-outline-warning rounded-pill btnActualiser">
                                    Actualiser
                                    <i class="ri-refresh-line"></i>
                                </a>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table align-middle text-nowrap table-hover table-centered mb-0" id="tableDemandeCours">
                                    <thead class="table-dark">
                                        <tr>
                                            <th class="text-center" >N°</th>
                                            <th class="text-center" >Objet</th>
                                            <th class="text-center" >Catégorie</th>
                                            <th class="text-center" >Service</th>
                                            <th class="text-center" >Statuts</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="card-footer">
                            <nav aria-label="Page navigation example">
                                <ul class="pagination justify-content-end mb-0" id="pagination"></ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return div;
    }

    window.ListeMesDemdandesTraiter = function () {

        pageTitre();
        
        const div = `        
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center border-bottom">
                            <div>
                                <h4 class="card-title">
                                    Liste des demandes Traitées
                                </h4>
                            </div>
                        </div>
                        <div class="card-header d-flex justify-content-between align-items-center border-bottom">
                            <div>
                                <div class="app-search me-auto">
                                   <div class="position-relative">
                                        <input type="search" id="searchInput" class="form-control form-control-sm border-1 rounded-3" placeholder="Rechercher..." autocomplete="off" value="">
                                        <i class="ri-search-line search-widget-icon"></i>
                                   </div>
                              </div>
                            </div>
                            <div>
                                <a class="btn btn-outline-warning rounded-pill btnActualiser">
                                    Actualiser
                                    <i class="ri-refresh-line"></i>
                                </a>
                            </div>
                        </div>
                        <div class="card-header border-bottom">
                            <div class="row g-3 paraTable" >
                                <div class="col-md-3">
                                    <label class="form-label">Statut</label>
                                    <select class="form-control" data-choices id="statut">
                                        <option selected value="0">Tout</option>
                                        <option value="traitee" >Traitée</option>
                                        <option value="rejete" >Rejété</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table align-middle text-nowrap table-hover table-centered mb-0" id="tableDemandeTraiter">
                                    <thead class="table-dark">
                                        <tr>
                                            <th class="text-center" >N°</th>
                                            <th class="text-center" >Objet</th>
                                            <th class="text-center" >Catégorie</th>
                                            <th class="text-center" >Service</th>
                                            <th class="text-center" >Statuts</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="card-footer">
                            <nav aria-label="Page navigation example">
                                <ul class="pagination justify-content-end mb-0" id="pagination"></ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return div;
    }

    window.ListeMesDemdandes = function () {

        pageTitre();
        
        const div = `        
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center border-bottom">
                            <div>
                                <h4 class="card-title">
                                    Historique des demandes
                                </h4>
                            </div>
                        </div>
                        <div class="card-header d-flex justify-content-between align-items-center border-bottom">
                            <div>
                                <div class="app-search me-auto">
                                   <div class="position-relative">
                                        <input type="search" id="searchInput" class="form-control form-control-sm border-1 rounded-3" placeholder="Rechercher..." autocomplete="off" value="">
                                        <i class="ri-search-line search-widget-icon"></i>
                                   </div>
                              </div>
                            </div>
                            <div>
                                <a class="btn btn-outline-warning rounded-pill btnActualiser">
                                    Actualiser
                                    <i class="ri-refresh-line"></i>
                                </a>
                            </div>
                        </div>
                        <div class="card-header border-bottom">
                            <div class="row g-3 paraTable" >
                                <div class="col-md-3">
                                    <label class="form-label">Statut</label>
                                    <select class="form-control" data-choices id="statut">
                                        <option selected value="0">Tout</option>
                                        <option value="en_attente" >En attente</option>
                                        <option value="en_cours" >En cours</option>
                                        <option value="traitee" >Terminé</option>
                                        <option value="rejete" >Rejété</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table align-middle text-nowrap table-hover table-centered mb-0" id="tableMesDemande">
                                    <thead class="table-dark">
                                        <tr>
                                            <th class="text-center" >N°</th>
                                            <th class="text-center" >Identifiant</th>
                                            <th class="text-center" >Catégorie</th>
                                            <th class="text-center" >Service</th>
                                            <th class="text-center" >Statuts</th>
                                            <th class="text-center" >Fichier(s)</th>
                                            <th class="text-center" >Date</th>
                                            <th class="text-center" >Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="card-footer">
                            <nav aria-label="Page navigation example">
                                <ul class="pagination justify-content-end mb-0" id="pagination"></ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return div;
    }

    // Demande recu -------------------------------------------------------------------------------------------

    window.ListeDemdandesRecu = function () {

        pageTitre();
        
        const div = `        
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center border-bottom">
                            <div>
                                <h4 class="card-title">
                                    Liste des demandes reçues
                                </h4>
                            </div>
                        </div>
                        <div class="card-header d-flex justify-content-between align-items-center border-bottom">
                            <div>
                                <div class="app-search me-auto">
                                   <div class="position-relative">
                                        <input type="search" id="searchInput" class="form-control form-control-sm border-1 rounded-3" placeholder="Rechercher..." autocomplete="off" value="">
                                        <i class="ri-search-line search-widget-icon"></i>
                                   </div>
                              </div>
                            </div>
                            <div>
                                <a class="btn btn-outline-warning rounded-pill btnActualiser">
                                    Actualiser
                                    <i class="ri-refresh-line"></i>
                                </a>
                            </div>
                        </div>
                        <div class="card-header border-bottom">
                            <div class="row g-3 paraTable" >
                                <div class="col-md-3">
                                    <label class="form-label">Statut</label>
                                    <select class="form-control" data-choices id="statut">
                                        <option selected value="0">Tout</option>
                                        <option value="en_attente" >En attente</option>
                                        <option value="en_cours" >En cours</option>
                                        <option value="traitee" >Terminé</option>
                                        <option value="rejete" >Rejété</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table align-middle text-nowrap table-hover table-centered mb-0" id="tableDemandeRecu">
                                    <thead class="table-dark">
                                        <tr>
                                            <th class="text-center" >N°</th>
                                            <th class="text-center" >Nom et Prénoms</th>
                                            <th class="text-center" >Objet</th>
                                            <th class="text-center" >Catégorie</th>
                                            <th class="text-center" >Statuts</th>
                                            <th class="text-center" >Fichier(s)</th>
                                            <th class="text-center" >Date</th>
                                            <th class="text-center" >Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="card-footer">
                            <nav aria-label="Page navigation example">
                                <ul class="pagination justify-content-end mb-0" id="pagination"></ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return div;
    }

    // Assigner demande-------------------------------------------------------------------------------------------

    window.FomulaireAssignDemdande = function () {

        pageTitre();
        
        const div = `        
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title mb-1 anchor">
                                Formulaire
                            </h5>
                            <p class="text-muted">Veuillez renseigner tous les champs du formulaire et vérifier vos informations avant de valider.</p>
                            <div class="mb-3">
                                <form class="row g-3" id="formAssignDemande">
                                    <div class="col-md-6">
                                        <label class="form-label">Statut</label>
                                        <select class="form-control" data-choices id="statut">
                                            <option selected value="en_attente" >En Attente</option>
                                            <option value="en_cours" >En cours</option>
                                        </select>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label">Demandes</label>
                                        <select class="form-control" data-choices id="demande_id"></select>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label">Traiteur</label>
                                        <select class="form-control" data-choices id="traiteur_id"></select>
                                    </div>

                                    <div class="col-md-6">
                                        <label for="objet" class="form-label">Date limite de traitement</label>
                                        <input type="datetime-local" class="form-control" id="date">
                                    </div>

                                    <div class="col-12 text-center">
                                        <button class="btn btn-primary btnForm" type="submit">Valider l'affectation</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;


        return div;
    }

    // Demande assigner -------------------------------------------------------------------------------------------

    window.ListeDemdandesAssign = function () {

        pageTitre();
        
        const div = `        
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center border-bottom">
                            <div>
                                <h4 class="card-title">
                                    Liste des demandes assignées
                                </h4>
                            </div>
                        </div>
                        <div class="card-header d-flex justify-content-between align-items-center border-bottom">
                            <div>
                                <div class="app-search me-auto">
                                   <div class="position-relative">
                                        <input type="search" id="searchInput" class="form-control form-control-sm border-1 rounded-3" placeholder="Rechercher..." autocomplete="off" value="">
                                        <i class="ri-search-line search-widget-icon"></i>
                                   </div>
                              </div>
                            </div>
                            <div>
                                <a class="btn btn-outline-warning rounded-pill btnActualiser">
                                    Actualiser
                                    <i class="ri-refresh-line"></i>
                                </a>
                            </div>
                        </div>
                        <div class="card-header border-bottom">
                            <div class="row g-3 paraTable" >
                                <div class="col-md-3">
                                    <label class="form-label">Statut</label>
                                    <select class="form-control" data-choices id="statut">
                                        <option selected value="0">Tout</option>
                                        <option value="en_cours" >En cours</option>
                                        <option value="traitee" >Terminé</option>
                                        <option value="rejete" >Rejété</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table align-middle text-nowrap table-hover table-centered mb-0" id="tableDemandeAssign">
                                    <thead class="table-dark">
                                        <tr>
                                            <th class="text-center" >N°</th>
                                            <th class="text-center" >Agent traiteur</th>
                                            <th class="text-center" >Identifiant</th>
                                            <th class="text-center" >Catégorie</th>
                                            <th class="text-center" >Statuts</th>
                                            <th class="text-center" >Fichier(s)</th>
                                            <th class="text-center" >Date Limite</th>
                                            <th class="text-center" >Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="card-footer">
                            <nav aria-label="Page navigation example">
                                <ul class="pagination justify-content-end mb-0" id="pagination"></ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return div;
    }

    window.ListeDemdandesAssignEnCours = function () {

        pageTitre();
        
        const div = `        
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center border-bottom">
                            <div>
                                <h4 class="card-title">
                                    Liste des demandes en cours
                                </h4>
                            </div>
                        </div>
                        <div class="card-header d-flex justify-content-between align-items-center border-bottom">
                            <div>
                                <div class="app-search me-auto">
                                   <div class="position-relative">
                                        <input type="search" id="searchInput" class="form-control form-control-sm border-1 rounded-3" placeholder="Rechercher..." autocomplete="off" value="">
                                        <i class="ri-search-line search-widget-icon"></i>
                                   </div>
                              </div>
                            </div>
                            <div>
                                <a class="btn btn-outline-warning rounded-pill btnActualiser">
                                    Actualiser
                                    <i class="ri-refresh-line"></i>
                                </a>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table align-middle text-nowrap table-hover table-centered mb-0" id="tableDemandeAssignEnCours">
                                    <thead class="table-dark">
                                        <tr>
                                            <th class="text-center" >N°</th>
                                            <th class="text-center" >Nom et Prénoms</th>
                                            <th class="text-center" >Objet</th>
                                            <th class="text-center" >Catégorie</th>
                                            <th class="text-center" >Statuts</th>
                                            <th class="text-center" >Fichier(s)</th>
                                            <th class="text-center" >Date</th>
                                            <th class="text-center" >Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="card-footer">
                            <nav aria-label="Page navigation example">
                                <ul class="pagination justify-content-end mb-0" id="pagination"></ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return div;
    }

    // users -------------------------------------------------------------------------------------------

    window.FormulaireNewEmploye = function () {

        pageTitre();

        const div = `
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title mb-1 anchor">Création d'un employé</h5>
                        <p class="text-muted">Veuillez renseigner tous les champs et vérifier les informations avant de créer l'utilisateur.</p>

                        <div class="mb-3">
                            <form class="row g-3" id="formUser">

                                <div class="col-md-4">
                                    <label for="name" class="form-label">Nom complet</label>
                                    <input type="text" class="form-control" id="name" placeholder="Ex : David Kouachi">
                                </div>

                                <div class="col-md-4">
                                    <label for="tel" class="form-label">Contact</label>
                                    <input type="tel" class="form-control" id="tel" placeholder="Ex : 0102030405">
                                </div>

                                <div class="col-md-4">
                                    <label for="email" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="email" placeholder="exemple@domaine.com">
                                </div>

                                <div class="col-md-4">
                                    <label for="login" class="form-label">Login</label>
                                    <input type="text" class="form-control" id="login" placeholder="Identifiant unique">
                                </div>

                                <div class="col-md-4">
                                    <label for="password" class="form-label">Mot de passe</label>
                                    <input type="password" class="form-control" id="password" value="password">
                                </div>

                                <div class="col-12 row">
                                    <div class="col-md-2 col-sm-3 col-6">
                                        <div class="form-check form-switch mt-4">
                                            <input class="form-check-input" type="checkbox" id="suppr">
                                            <label class="form-check-label" for="suppr">Supprimé</label>
                                        </div>
                                    </div>

                                    <div class="col-md-2 col-sm-3 col-6">
                                        <div class="form-check form-switch mt-4">
                                            <input class="form-check-input" type="checkbox" id="lock">
                                            <label class="form-check-label" for="lock">Verrouillé</label>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <button class="btn btn-primary btnUserForm" type="submit">Créer l'utilisateur</button>
                                </div>

                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        `;

        return div;
    }

    window.FormulaireAffecterEmploye = function () {

        pageTitre();

        const div = `
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title mb-1 anchor">Formulaire</h5>
                        <p class="text-muted">Veuillez renseigner tous les champs et vérifier les informations avant de valider.
                         NB: Lorsque l'on affecte un employé a un service, automatiquement celui-ci devient un traiteur de demande dans le service en question.</p>

                        <div class="mb-3">
                            <form class="row g-3" id="formulaire">

                                <div class="col-md-6">
                                    <label class="form-label">Employé</label>
                                    <select class="form-control" data-choices id="employe_id"></select>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Service</label>
                                    <select class="form-control" data-choices id="service_id"></select>
                                </div>

                                <div class="col-12">
                                    <button class="btn btn-primary btnForm" type="submit">Valider</button>
                                </div>

                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        `;

        return div;
    }

    window.FormulaireChangerRespo = function () {

        pageTitre();

        const div = `
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title mb-1 anchor">Formulaire</h5>
                        <p class="text-muted">Veuillez renseigner tous les champs et vérifier les informations avant de valider.
                         NB: Lorsque l'on change de responsable, l'ancien responsable deviendra un traiteur de demandes.</p>

                        <div class="mb-3">
                            <form class="row g-3" id="formulaire">

                                <div class="col-md-6">
                                    <label class="form-label">Service</label>
                                    <select class="form-control" data-choices id="service_id"></select>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Traiteur</label>
                                    <select class="form-control" data-choices id="traiteur_id"></select>
                                </div>

                                <div class="col-12">
                                    <button class="btn btn-primary btnForm" type="submit">Valider</button>
                                </div>

                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        `;

        return div;
    }

    // ---------------------------------------------------------------------

    window.structureMenus = function (menus) {
        const parents = menus.filter(m => m.parent_id === null);
        const children = menus.filter(m => m.parent_id !== null);

        return parents.map(parent => {
            const submenus = children.filter(c => c.parent_id === parent.id);
            return {
                ...parent,
                submenus
            };
        });
    }

    window.renderMenus = function (structuredMenus, role) {
        return new Promise(resolve => {
            const menuContainer = $('.globalMenu'); // ul.navbar-nav
            menuContainer.empty();

            structuredMenus.forEach(menu => {
                if (!menu.parent_id) {
                    if (menu.submenus && menu.submenus.length > 0) {
                        // ID unique pour le collapse
                        const collapseId = `sidebar-${menu.slug}`;

                        const menuItem = $(`
                            <li class="nav-item">
                                <a class="nav-link menu-arrow" href="#${collapseId}" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="${collapseId}">
                                    <span class="nav-icon">
                                        <i class="${menu.icon}"></i>
                                    </span>
                                    <span class="nav-text">${menu.name}</span>
                                </a>
                                <div class="collapse" id="${collapseId}">
                                    <ul class="nav sub-navbar-nav"></ul>
                                </div>
                            </li>
                        `);

                        // Ajouter les sous-menus avec id unique
                        menu.submenus.forEach(submenu => {
                            const subMenuId = `submenu-${submenu.data_data || submenu.slug || Math.random().toString(36).substr(2,5)}`;

                            const subMenuItem = $(`
                                <li class="sub-nav-item">
                                    <a class="sub-nav-link" 
                                       id="${subMenuId}" 
                                       href="${submenu.href}" 
                                       title="${submenu.title}" 
                                       data-page="${submenu.data_page}"
                                       style="display: block; word-wrap: break-word; white-space: normal; overflow-wrap: break-word;">
                                        ${submenu.name}
                                    </a>
                                </li>
                            `);
                            menuItem.find('.sub-navbar-nav').append(subMenuItem);
                        });

                        menuContainer.append(menuItem);
                    } else {
                        // Menu simple sans sous-menu
                        const menuId = `menu-${menu.data_data || menu.slug || Math.random().toString(36).substr(2,5)}`;

                        const menuItem = $(`
                            <li class="nav-item">
                                <a class="nav-link" id="${menuId}" href="${menu.href}" title="${menu.title}" data-page="${menu.data_page}">
                                    <span class="nav-icon">
                                        <i class="${menu.icon}"></i>
                                    </span>
                                    <span class="nav-text">${menu.name}</span>
                                </a>
                            </li>
                        `);
                        menuContainer.append(menuItem);
                    }
                }
            });

            resolve();
        });
    };



});
