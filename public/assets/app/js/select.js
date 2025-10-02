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

    window.selectRefreshId = function (id)
    {
        const $el = $(id);

        if ($el.length) {
            new Choices($el[0], {
                searchPlaceholderValue: 'Recherche', // optionnel
                removeItemButton: false, // bouton pour supprimer un élément choisi
                shouldSort: false       // garder l'ordre original des options
            });
        }
    };

    // ----------------------------------------------------------------------

    window.select_annee = function (id) 
    {
        const selectElement = $(id);
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
                            value: item.uid,
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

});