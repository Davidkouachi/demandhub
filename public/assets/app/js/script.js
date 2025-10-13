$(document).ready(function () {
    let pageTimeout = null;

    // loadPageFromUrl();
    init();

    function init() {
        if (menuRole.length > 0) {
            renderMenus(menuRole, nomRole).then(() => {
                loadPageFromUrl(user);
            });
        } else {
            $btn = $('#menu-tableau_de_bord');
            if ($btn.length) {
                $btn.trigger("click");
            }
        }
    }

    function pageLoader(dataPage) {
        globalPage.attr('data-page', dataPage);
        globalPage.empty();
        globalPage.css('height', '100%');

        globalPage.html(`
            <div id="pageLoader active">
                <div class="loader-overlay"></div>
                <div class="facebook-spinner">
                    <div class="spinner-block block-1"></div>
                    <div class="spinner-block block-2"></div>
                    <div class="spinner-block block-3"></div>
                </div>
            </div>
        `);
    }

    function pageTitre(titre, stitle) {
        globalPage.append(`
            <div class="row">
                <div class="col-12">
                    <div class="page-title-box">
                        <ol class="breadcrumb mb-0">
                            ${stitle != null ? `<li class="breadcrumb-item">${stitle}</li>` : ``}
                            <li class="breadcrumb-item active">${titre}</li>
                        </ol>
                    </div>
                </div>
            </div>
        `);
    }

    function showPageFromClick({ page, title, stitle, url, data, breadcrumbItems, updateHistory = true }) {
        if (!page) return;

        pageLoader(data);

        if (pageTimeout) clearTimeout(pageTimeout);

        pageTimeout = setTimeout(function () {
            globalPage.empty();
            globalPage.css('height', '');
            pageTimeout = null;

            pageTitre(title, stitle);
            loadScriptForPage(page);
        }, 1000);

        document.title = `${title} | DemandHub`;

        // ✅ NOUVELLE LOGIQUE D’HISTORIQUE LISIBLE
        if (updateHistory) {
            const readableUrl = `/?page=${encodeURIComponent(title)}`;
            const stateData = { page, title };

            if (window.history.length <= 1) {
                window.history.replaceState(stateData, title, readableUrl);
            } else {
                window.history.pushState(stateData, title, readableUrl);
            }

            localStorage.setItem("lastVisitedPage", JSON.stringify({
                page,
                title,
                url: readableUrl,
                userId: user.id,
            }));
        }
    }

    function getPageFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get("page");
    }

    // ✅ NOUVELLE VERSION DE loadPageFromUrl
    function loadPageFromUrl(user) {
        const defaultPage = "tableau_de_bord";
        const defaultTitle = "Tableau de bord";

        // 1️⃣ - Récupère les infos du localStorage
        const allVisited = JSON.parse(localStorage.getItem("lastVisitedPage")) || null;

        // 2️⃣ - Filtre par userId
        const lastVisited = allVisited?.userId === user.id ? allVisited : null;

        // 3️⃣ - Lit le paramètre "page" visible dans l’URL (ex: ?page=Tableau de bord)
        const titleFromUrl = getPageFromUrl();

        // 4️⃣ - Détermine le titre et le slug interne
        const title = titleFromUrl || lastVisited?.title || defaultTitle;
        const page = lastVisited?.page || defaultPage;

        // 5️⃣ - Corrige l’URL si besoin
        const expectedUrl = `/?page=${encodeURIComponent(title)}`;
        if (window.location.search !== `?page=${encodeURIComponent(title)}`) {
            window.history.replaceState({ page, title, userId: user.id }, title, expectedUrl);
        }

        // 6️⃣ - Met à jour le titre de l’onglet
        document.title = `${title} | DemandHub`;

        // 7️⃣ - Trouve le bouton dans le menu
        let $btn = $(`#menu-${page}`);
        if (!$btn.length) {
            $btn = $(`#submenu-${page}`);
        }

        // 8️⃣ - Déclenche le clic
        if ($btn.length) {
            $btn.trigger("click");
            console.warn("Page trouvée dans le menu :", page);
        } else {
            console.warn("Page non trouvée dans le menu :", page);
        }
    }

    function loadScriptForPage(page) {
        const scriptMap = {
            tableau_de_bord: [
                url_base + "/assets/app/js/pages/tableau_de_bord/index.js",
            ],

            creer_demande: [
                url_base + "/assets/app/librairies/sheetjs/xlsx.full.min.js",
                url_base + "/assets/app/js/pages/mes_demandes/creer_demande.js",
            ],
            mes_demandes_cours: [
                url_base + "/assets/app/js/pages/mes_demandes/mes_demandes_cours.js",
            ],
            mes_demandes_historique: [
                url_base + "/assets/app/js/pages/mes_demandes/mes_demandes_historique.js",
            ],

            toutes_demandes_recu: [
                url_base + "/assets/app/js/pages/demande_recu/toutes_demandes_recu.js",
            ],

            affecter_demande: [
                url_base + "/assets/app/js/pages/assign_demande/index.js",
            ],

            toutes_assign_demandes: [
                url_base + "/assets/app/js/pages/demande_assign/toutes_assign_demandes.js",
            ],

            ajouter_employe: [
                url_base + "/assets/app/js/pages/utilisateur/ajouter_employe.js",
            ],
            affecter_employe_service: [
                url_base + "/assets/app/js/pages/utilisateur/affecter_employe_service.js",
            ],
        };

        // Supprime tous les anciens scripts
        Object.values(scriptMap).flat().forEach(scriptUrl => {
            const existingScript = $(`script[src="${scriptUrl}"]`);
            if (existingScript.length > 0) {
                existingScript.remove();
                console.log(`🗑️ Script supprimé : ${scriptUrl}`);
            }
        });

        // Charge uniquement les scripts de la page demandée
        const scripts = scriptMap[page];
        if (!scripts) return;

        scripts.forEach(scriptUrl => {
            const script = document.createElement("script");
            script.src = scriptUrl;
            script.async = true;
            script.onload = () => console.log(`✅ Script chargé : ${scriptUrl}`);
            script.onerror = () => console.error(`❌ Erreur chargement script : ${scriptUrl}`);
            document.body.appendChild(script);
        });
    }

    // Gestion du clic sur tous les liens avec data-data (même sous-menu)
    $(document).on("click", ".globalMenu [id^='menu-'], .globalMenu [id^='submenu-']", function(e) {
        e.preventDefault();

        const $menuContainer = $(".globalMenu");
        const $clicked = $(this);

        // 1. Nettoyer tous les actifs dans ce menu seulement
        $menuContainer.find("li.nav-item, li.sub-nav-item").removeClass("active");
        $menuContainer.find("a.nav-link, a.sub-nav-link, a.menu-arrow").removeClass("active subdrop").attr("aria-expanded", "false");
        $menuContainer.find(".collapse").removeClass("show");

        // 2. Mettre actif le lien cliqué
        $clicked.addClass("active");

        // 3. Mettre actif le li parent du lien cliqué
        $clicked.closest("li.nav-item, li.sub-nav-item").addClass("active");

        // 4. Vérifier si c’est un sous-menu
        if ($clicked.closest("ul.sub-navbar-nav").length) {
            const $collapseDiv = $clicked.closest("ul.sub-navbar-nav").parent(".collapse");

            if ($collapseDiv.length) {
                // Ouvrir le collapse
                $collapseDiv.addClass("show");

                // Li parent du menu
                const $parentLi = $collapseDiv.closest("li.nav-item");
                $parentLi.addClass("active");

                // Lien qui a data-bs-toggle
                const $toggleLink = $parentLi.children("a.nav-link.menu-arrow[data-bs-toggle='collapse']");
                $toggleLink.addClass("active subdrop").attr("aria-expanded", "true");
            }
        }

        // 5. Gestion du titre et du fil d’Ariane
        const { titre, stitre, breadcrumb } = extractMenuInfo($clicked); 

        // 6. Chargement de la page
        showPageFromClick({
            page: $clicked.data("page"),
            title: titre,
            stitle: stitre,
            url: $clicked.attr("href"),
            id: $clicked.attr("id"),
            breadcrumbItems: breadcrumb,
            updateHistory: true,
        });
    });

    function extractMenuInfo($clickedLink) {
        // Vérifier si le lien est dans un sous-menu
        const $parentSubMenu = $clickedLink.closest("ul.sub-navbar-nav");

        if ($parentSubMenu.length) {
            // Sous-menu
            const $parentMenuLink = $parentSubMenu.closest("div.collapse").siblings("a.nav-link.menu-arrow");
            const parentText = $parentMenuLink.find(".nav-text").text().trim();
            const childText = $clickedLink.find(".nav-text").text().trim() || $clickedLink.text().trim();
            const childHref = $clickedLink.attr("href") || "#";

            return {
                titre: childText,
                stitre: parentText,
                breadcrumb: [
                    { text: parentText },
                    { text: childText, href: childHref }
                ]
            };
        } else {
            // Menu principal
            const menuText = $clickedLink.find(".nav-text").text().trim() || $clickedLink.text().trim();
            const menuHref = $clickedLink.attr("href") || "#";

            return {
                titre: menuText,
                stitre: null,
                breadcrumb: [
                    { text: menuText, href: menuHref }
                ]
            };
        }
    }

    // Gestion retour navigateur
    window.addEventListener("popstate", function (event) {
        let page = event.state?.page || getPageFromUrl();

        if (!page) {
            page = "tableau_de_bord";
        }

        $(`[data-page="${page}"]`).trigger("click");
    });

    $(document).off('click', '.btnLogout').on('click', '.btnLogout', function(e) {
        e.preventDefault();

        confirmAction('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?').then((result) => {
            if (result.isConfirmed) {
                // window.location.href = $(this).attr('href');

                const ModalDeco = `
                    <div id="preloaderLogout" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                        background: rgba(255,255,255,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                        <div style="text-align: center;">
                            <div class="spinner-border text-danger" role="status"></div>
                            <p style="margin-top: 10px; font-weight: bold;">Déconnexion en cours...</p>
                        </div>
                    </div>`;

                // Ajoute le préloader
                $('body').append(ModalDeco);

                // Optionnel : petit délai pour voir le préloader
                setTimeout(function () {
                    window.location.href = $('.btnLogout').attr('href');
                }, 1000);
            }
        });
    });

});

