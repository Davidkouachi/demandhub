$(document).ready(function () {

    window.selectRefreshIdModal = function (id, placeholder) 
    {
        const $el = $(id);

        // Cherche le parent modal le plus proche
        const parentModal = $el.closest('.modal');

        // Vérifier que l'élément existe
        if ($el.length) {
            // Déterminer le parent pour l'injection du dropdown
            const parent = parentModal.length ? parentModal[0] : document.body;

            new Choices($el[0], {
                searchPlaceholderValue: 'Recherche',
                removeItemButton: true,
                shouldSort: false,
                position: 'bottom',  // 'auto' / 'bottom' / 'top' pour le dropdown
                callbackOnCreateTemplates: function(template) {
                    // permet éventuellement de déplacer le dropdown dans le parent choisi
                    template.list = (className) => `<div class="${className}" style="position: relative;"></div>`;
                }
            });

            // Si besoin de forcer le parent du dropdown, tu peux déplacer le container Choices dans le parent
            const choicesInstance = $el[0].choices; 
            if (choicesInstance) {
                parent.appendChild(choicesInstance.containerOuter);
            }
        }
    };

    window.selectDeleteInstanceId = function (id) {
        const $el = $(id);

        if ($el.length) {

            // ✅ Étape 1 : détruire proprement toute instance Choices existante
            const existingInstance = $el[0]?.choicesInstance;
            if (existingInstance) {
                // console.log("🔄 Destruction de l'ancienne instance Choices");
                existingInstance.destroy();
                $el[0].choicesInstance = null;
            }
        }
    };

    window.selectRefreshId = function (id) {
        const $el = $(id);

        if ($el.length) {

            // ✅ Vérifie s’il y a des options réelles (hors la première "Choisir...")
            const hasOptions = $el.find('option').length > 1;

            // ✅ Si aucune donnée
            if (!hasOptions) {
                $el.empty().append($('<option>', {
                    value: '',
                    text: 'Aucun résultat disponible',
                    disabled: true,
                    selected: true
                }));
            }

            const instance = new Choices($el[0], {
                searchPlaceholderValue: 'Recherche',
                removeItemButton: false,
                shouldSort: false,
                allowHTML: true
            });

            // 🔒 Enregistrer l’instance dans l’élément lui-même
            $el[0].choicesInstance = instance;
            // console.log("✅ Nouvelle instance Choices créée");
        }
    };

    // ----------------------------------------------------------------------

    window.select_annee = function (id) 
    {
        const selectElement = $(id);

        selectDeleteInstanceId(selectElement);

        selectElement.empty();
        
        const currentYear = new Date().getFullYear();
        const startYear = 2000;

        // Ajouter les années en ordre décroissant
        for (let year = currentYear; year >= startYear; year--) {
            const option = $('<option>', {
                value: year,
                text: year,
                selected: year === currentYear
            });

            selectElement.append(option);
        }

        selectRefreshId(selectElement);
    };

    window.select_categories= function (id) 
    {
        const selectElement = $(id);

        selectDeleteInstanceId(selectElement);

        selectElement.empty();

        selectElement.append($('<option>', {
            value: '',
            text: 'Choisir une catégorie...',
        }));

        // Appel API avec Axios
        axios.get(url + '/api/select_categories')
            .then(function(response) {
                const data = response.data.data;

                // Ajouter dynamiquement les options
                data.forEach(function(item) {
                    selectElement.append(
                        $('<option>', {
                            value: item.id,
                            text: item.nom
                        })
                    );
                });
                selectRefreshId(selectElement);
            })
            .catch(function(error) {
                console.error('Impossible de récupérer les catégories', error);
            });
    }

    window.select_traiteur_service= function (id, service_id) 
    {
        const selectElement = $(id);

        selectDeleteInstanceId(selectElement);

        selectElement.empty();

        selectElement.append($('<option>', {
            value: '',
            text: 'Choisir un traiteur...',
        }));

        // Appel API avec Axios
        axios.get(url + '/api/select_traiteur_service/' + service_id)
            .then(function(response) {
                const data = response.data.data;

                // Ajouter dynamiquement les options
                data.forEach(function(item) {
                    selectElement.append(
                        $('<option>', {
                            value: item.id,
                            text: item.name
                        })
                    );
                });
                selectRefreshId(selectElement);
            })
            .catch(function(error) {
                console.error('Impossible de récupérer les traiteurs', error);
            });
    }

    window.select_demande_assign = function (mode, id, service_id, statut) {
        const selectElement = $(id);

        selectDeleteInstanceId(selectElement);

        selectElement.empty();
        selectElement.append($('<option>', {
            value: '',
            text: 'Choisir la demande ...',
        }));

        axios.get(`${url}/api/select_demande_assign/${service_id}/${statut}`)
            .then(function (response) {
                const data = response.data.data || [];
                console.log("📦 Données récupérées :", data);

                // Remplir le select
                data.forEach(function (item) {
                    selectElement.append(
                        $('<option>', {
                            value: item.id,
                            text: `${item.name} - ${item.objet}`,
                        })
                    );
                });

                selectRefreshId(selectElement);

            })
            .catch(function (error) {
                console.error('❌ Impossible de récupérer les demandes', error);
            });
    };

});