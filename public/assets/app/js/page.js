$(document).ready(function () {

    window.Dashboard = function () {
        
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

    window.FomulaireDemdande = function () {
        
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
                                        <select class="form-control" data-choices id="categorie_id">
                                            <option value="">Choisir une catégorie...</option>
                                            <option>Matériel</option>
                                            <option>Ressources humaines</option>
                                            <option>Finances</option>
                                            <option>Service client</option>
                                            <option>Autres</option>
                                        </select>
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
                                <input type="text" id="searchInput" class="form-control form-control-sm" placeholder="Rechercher...">
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
                                <table class="table align-middle text-nowrap table-hover table-centered mb-0" id="agentTable">
                                    <thead class="table-dark">
                                        <tr>
                                            <th class="text-center" >N°</th>
                                            <th class="text-center" >Name</th>
                                            <th class="text-center" >Email</th>
                                            <th class="text-center" >Contact</th>
                                            <th class="text-center" >Experience</th>
                                            <th class="text-center" >Date</th>
                                            <th class="text-center" >Status</th>
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
                                            <th class="text-center" >Objet</th>
                                            <th class="text-center" >Catégorie</th>
                                            <th class="text-center" >Service</th>
                                            <th class="text-center" >Statuts</th>
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
                                    <a class="sub-nav-link" id="${subMenuId}" href="${submenu.href}" title="${submenu.title}" data-page="${submenu.data_page}">
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
