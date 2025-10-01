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

                        // Ajouter les sous-menus
                        menu.submenus.forEach(submenu => {
                            const subMenuItem = $(`
                                <li class="sub-nav-item">
                                    <a class="sub-nav-link" href="${submenu.href}" title="${submenu.title}" data-page="${submenu.data_page}" data-data="${submenu.data_data}">
                                        ${submenu.name}
                                    </a>
                                </li>
                            `);
                            menuItem.find('.sub-navbar-nav').append(subMenuItem);
                        });

                        menuContainer.append(menuItem);
                    } else {
                        // Menu simple sans sous-menu
                        const menuItem = $(`
                            <li class="nav-item">
                                <a class="nav-link" href="${menu.href}" title="${menu.title}" data-page="${menu.data_page}" data-data="${menu.data_data}">
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
