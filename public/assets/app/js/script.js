$(document).ready(function () {
    let pageTimeout = null;

    // loadPageFromUrl();
    init();

    function init() {
        if (menuRole.length > 0) {
            renderMenus(menuRole, nomRole).then(() => {
                loadPageFromUrl();
            });
        } else {
            $btn = $('#menu-tableau_de_bord');
            if ($btn.length) {
                $btn.trigger("click");
            }
        }
    }

    function pageLoader(dataPage)
    {
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

        // globalPage.html(`
        //     <span class="anim_loader"></span>
        // `);
    }

    function pageTitre(titre, stitle)
    {
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
        // return false;

        if (pageTimeout) clearTimeout(pageTimeout);

        pageTimeout = setTimeout(function () {

            globalPage.empty();
            globalPage.css('height', '');
            pageTimeout = null;

            pageTitre(title,stitle); // titre du bouton

            loadScriptForPage(page); // script spécifique
        }, 1000);

        document.title = title + " | DemandHub";

        if (updateHistory) {
            if (window.history.length <= 1) {
                // Peu ou pas d'historique : remplacer l'état
                window.history.replaceState({ page }, title, url);
            } else {
                // Sinon, ajouter une nouvelle entrée
                window.history.pushState({ page }, title, url);
            }
            localStorage.setItem("lastVisitedPage", page);
        }

        // overDisplay(1);

        // function updatePassword()
        // {
        //     const modalBody =`
        //         <div id="updatePassword" class="modal fade" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
        //             <div class="modal-dialog modal-dialog-centered">
        //                 <div class="modal-content">
        //                     <div class="modal-body">
        //                         <div class="auth-brand text-center mt-n4 mb-n2 position-relative top-0">
        //                             <a href="index.html" class="logo-dark">
        //                                 <span><img src="assets/app/images/logo_bg.png" alt="dark logo" height="150"></span>
        //                             </a>
        //                             <a href="index.html" class="logo-light">
        //                                 <span><img src="assets/app/images/logo_bg_dark.png" alt="logo" height="150"></span>
        //                             </a>
        //                         </div>
        //                         <form class="ps-3 pe-3" id="formUpdatePassword">
        //                             <div class="mb-3">
        //                                 <label for="password-reset" class="form-label">Nouveau mot de passe</label>
        //                                 <input class="form-control" type="password" id="password-reset" placeholder="Entrer votre mot de passe">
        //                             </div>
        //                             <div class="mb-3 text-center">
        //                                 <button class="btn btn-primary btn_mdp_reset" type="submit">
        //                                     Mise à jour
        //                                 </button>
        //                             </div>
        //                         </form>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     `;

        //     $('.modal').remove();

        //     $('body').append(modalBody);
        //     const $modal = $('#updatePassword');
        //     $modal.removeAttr('aria-hidden');
        //     const modal = bootstrap.Modal.getOrCreateInstance($modal[0]);
        //     modal.show();

        //     $("#formUpdatePassword").on("submit", function (event) {
        //         event.preventDefault();

        //         const data = {
        //             mdp: $('#password-reset').val(),
        //         };

        //         // Vérification des champs obligatoires
        //         if (!data.mdp.trim()) {
        //             showAlert("Alerte", "Veuillez saisir le mot de passe", "warning");
        //             return false;
        //         }

        //         if (!verifPassword(data.mdp)) {
        //             showAlert(
        //                 "Alert",
        //                 "Le mot de passe doit comporter au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre.",
        //                 "warning"
        //             );
        //             return false;
        //         }

        //         spinerButton(0, '.btn_mdp_reset', 'Mise à jour en cours');
        //         overDisplay(0);

        //         // Envoi via Axios
                
        //         axios.get(`${url_base}/refresh-csrf`)
        //         .then(response => {
        //             const csrfToken = response.data.csrf_token;

        //             // Met à jour le token dans la balise meta
        //             csrfMeta.attr('content', csrfToken);

        //             // Configuration de l'en-tête CSRF d'Axios
        //             axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

        //             // Deuxième requête : login
        //             return axios.put(url_base + '/api/UpdateMdpUser/' + user.uid, {
        //                 mdp: data.mdp,
        //             });
        //         })
        //         .then(function (response) {
        //             spinerButton(1, '.btn_mdp_reset', 'Mise à jour');
        //             overDisplay(1);

        //             const res = response.data;

        //             if (res.success) {
        //                 user.reset = 1;
        //                 $('#updatePassword').modal('hide');
        //                 showAlert("Alerte", res.message, "success");

        //                 overDisplay(0);
        //                 verifHoraire();  

        //             } else if (res.info) {
        //                 showAlert("Alerte", res.message, "info");
        //             } else if (res.warning) {
        //                 showAlert("Alerte", res.message, "warning");
        //                 console.log(res.error);
        //             } else if (res.error) {
        //                 showAlert("Alerte", res.message, "danger");
        //             } else {
        //                 showAlert("Alerte", msg, "danger");
        //             }

        //         })
        //         .catch(function (error) {
        //             spinerButton(1, '.btn_mdp_reset', 'Mise à jour');
        //             overDisplay(1);

        //             let er;
        //             if (error.response && error.response.data && error.response.data.message) {
        //                 er = error.response.data.message;
        //             }
        //             showAlert("Erreur", msg, "error");
        //             console.error("Erreur Axios :", error);
        //         });

        //     });
        // }

        // Charger le script global UNE fois
        // if (!window.globalScriptLoaded) {
        //     const script = document.createElement("script");
        //     script.src = url_base + "/assets/app/js/page.js";
        //     script.async = false;
        //     script.onload = () => {
        //         console.log("Script global chargé");
        //         window.globalScriptLoaded = true;
                
        //         if (user.reset === 0) {
        //             overDisplay(1);
        //             updatePassword();
        //         } else {
        //           verifHoraire();  
        //         }
                
        //     };
        //     script.onerror = () => console.error("Erreur script global");
        //     document.body.appendChild(script);
        // } else {
        //     if (user.reset === 0) {
        //         overDisplay(1);
        //         updatePassword();
        //     } else {
        //       verifHoraire();  
        //     }
        // }
    }

    function getPageFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get("page");
    }

    function loadPageFromUrl() {
        let page = getPageFromUrl();          // Récupère la page depuis l'URL
        const defaultPage = 'tableau_de_bord';

        // Si page invalide ou absente, on prend la valeur par défaut
        if (!page) {
            page = defaultPage;
            const newUrl = `/?page=${page}`;
            window.history.replaceState({ page }, "", newUrl);
        }

        console.log("Page demandée :", page);

        // Chercher le lien correspondant dans le menu principal ou sous-menu
        let $btn = $(`#menu-${page}`);
        if (!$btn.length) {
            $btn = $(`#submenu-${page}`);
        }

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
            demandes_cours: [
                url_base + "/assets/app/js/pages/mes_demandes/demandes_cours.js",
            ],
            demandes_historique: [
                url_base + "/assets/app/js/pages/mes_demandes/demandes_historique.js",
            ],
        };

        // Supprimer tous les scripts déclarés dans le scriptMap
        Object.values(scriptMap).flat().forEach(scriptUrl => {
            const existingScript = $(`script[src="${scriptUrl}"]`);
            if (existingScript.length > 0) {
                existingScript.remove();
                console.log(`🗑️ Script supprimé : ${scriptUrl}`);
            }
        });

        // Charger uniquement les scripts de la page demandée
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

