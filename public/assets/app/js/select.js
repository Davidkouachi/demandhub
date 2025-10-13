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

    window.selectData = function (id, data = [], options = {}) {
        const $el = $(id);

        if (!$el.length) return;

        const defaultText = options.defaultText || 'Choisir...';
        const noDataText = options.noDataText || 'Aucun résultat disponible';

        // Supprime l'ancienne instance Choices si elle existe
        if ($el[0]?.choicesInstance) {
            $el[0].choicesInstance.destroy();
            $el[0].choicesInstance = null;
        }

        // Vide le select
        $el.empty();

        // Ajoute option par défaut
        $el.append($('<option>', {
            value: '',
            text: defaultText,
            selected: true,
            disabled: false
        }));

        // Si aucune donnée
        if (!data || data.length === 0) {
            $el.append($('<option>', {
                value: '',
                text: noDataText,
                disabled: true,
                selected: true
            }));
        }

        // Crée l'instance Choices
        const instance = new Choices($el[0], {
            searchPlaceholderValue: options.searchPlaceholder || 'Recherche',
            removeItemButton: options.removeItemButton || false,
            shouldSort: options.shouldSort || false,
            allowHTML: options.allowHTML || true
        });

        $el[0].choicesInstance = instance;

        // Ajouter les données via setChoices
        if (data.length > 0) {
            // options.keysMap permet de spécifier dynamiquement les champs pour value/label/customProperties
            const keys = options.keysMap || { value: 'id', label: 'description', customProperties: null };

            const choicesData = data.map(item => {
                const label = typeof keys.label === 'function' ? keys.label(item) : item[keys.label];

                const choice = {
                    value: item[keys.value],
                    label: label,
                    selected: false,
                    disabled: false
                };

                if (keys.customProperties) {
                    choice.customProperties = {};
                    for (const key in keys.customProperties) {
                        if (item.hasOwnProperty(keys.customProperties[key])) {
                            choice.customProperties[key] = item[keys.customProperties[key]];
                        }
                    }
                }

                return choice;
            });

            instance.setChoices(choicesData, 'value', 'label', true); // true = reset existant
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

    window.select_service_all= function (id) {
        const selectElement = $(id);

        selectDeleteInstanceId(selectElement);

        selectElement.empty();

        selectElement.append($('<option>', {
            value: '',
            text: 'Choisir un service...',
        }));

        // Appel API avec Axios
        axios.get(url + '/api/select_service_all')
            .then(function(response) {
                const data = response.data.data;

                console.log(data);

                // Ajouter dynamiquement les options
                data.forEach(function(item) {
                    selectElement.append(
                        $('<option>', {
                            value: item.id,
                            text: item.description,
                            'data-nbre_respo': item.nbre_respo,
                        })
                    );
                });
                selectRefreshId(selectElement);
            })
            .catch(function(error) {
                console.error('Impossible de récupérer les services', error);
            });
    }      

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

    window.selectRefreshNull = function(id) {
        const $el = $(id);
        const instance = $el[0]?.choicesInstance;

        if (!instance) return;

        // Récupère le placeholder actuel
        const placeholder = instance._currentState.choices.find(c => !c.value);

        // Supprime toutes les sélections actives
        instance.removeActiveItems();

        // Si le placeholder existe, le définit comme choix actif
        if (placeholder) {
            instance.setChoiceByValue(placeholder.value);
        }
    };


    // ----------------------------------------------------------------------

    // Fonction générique pour remplir un select avec API ou données locales
    window.genericSelect = function(id, dataOrUrl, defaultText = 'Choisir...', keysMap = { value: 'id', label: 'name', customProperties: null }, searchPlaceholder = null) {
        const selectElement = $(id);

        // Supprime l'ancienne instance Choices
        selectDeleteInstanceId(selectElement);

        // Détecte si dataOrUrl est un tableau de données ou une URL
        if (Array.isArray(dataOrUrl)) {
            selectData(selectElement, dataOrUrl, {
                defaultText,
                noDataText: `Aucun ${defaultText.toLowerCase()} disponible`,
                keysMap,
                searchPlaceholder: searchPlaceholder || `Rechercher ${defaultText.toLowerCase()}`
            });
        } else {
            // Appel API
            axios.get(dataOrUrl)
                .then(response => {
                    const data = response.data.data || [];
                    selectData(selectElement, data, {
                        defaultText,
                        noDataText: `Aucun ${defaultText.toLowerCase()} disponible`,
                        keysMap,
                        searchPlaceholder: searchPlaceholder || `Rechercher ${defaultText.toLowerCase()}`
                    });
                })
                .catch(error => {
                    console.error(`Impossible de récupérer ${defaultText.toLowerCase()}`, error);
                });
        }
    }

    // window.genericSelect = function(id, dataOrUrl, defaultText = 'Choisir...', keysMap = { value: 'id', label: 'name', customProperties: null }, searchPlaceholder = null) {
    //     const selectElement = $(id);

    //     selectDeleteInstanceId(selectElement);

    //     const fillSelect = (data) => {
    //         const formattedData = data.map(item => {
    //             // label dynamique ou champ direct
    //             const label = typeof keysMap.label === 'function' ? keysMap.label(item) : item[keysMap.label];

    //             const choice = {
    //                 value: item[keysMap.value],
    //                 label: label,
    //                 selected: false,
    //                 disabled: false
    //             };

    //             // customProperties dynamiques
    //             if (keysMap.customProperties) {
    //                 choice.customProperties = {};
    //                 for (const key in keysMap.customProperties) {
    //                     if (item.hasOwnProperty(keysMap.customProperties[key])) {
    //                         choice.customProperties[key] = item[keysMap.customProperties[key]];
    //                     }
    //                 }
    //             }

    //             return choice;
    //         });

    //         selectData(selectElement, formattedData, {
    //             defaultText,
    //             noDataText: `Aucun ${defaultText.toLowerCase()} disponible`,
    //             keysMap: { value: 'value', label: 'label' },
    //             searchPlaceholder: searchPlaceholder || `Rechercher ${defaultText.toLowerCase()}`
    //         });
    //     };

    //     // Si dataOrUrl est un tableau de données
    //     if (Array.isArray(dataOrUrl)) {
    //         fillSelect(dataOrUrl);
    //     } else {
    //         axios.get(dataOrUrl)
    //             .then(response => fillSelect(response.data.data || []))
    //             .catch(error => console.error(`Impossible de récupérer ${defaultText.toLowerCase()}`, error));
    //     }
    // }

    window.getSelecteData = function(selectId) {
        const selectEl = document.querySelector(selectId);
        if (!selectEl || !selectEl.choicesInstance) return null;

        const instance = selectEl.choicesInstance;
        const selectedValue = instance.getValue(true); // retourne la valeur sélectionnée

        // Cherche l'objet Choices correspondant
        const selectedObj = instance._currentState.choices.find(c => c.value == selectedValue);

        return selectedObj ? selectedObj.customProperties || {} : {};
    };

    // ---------------------------
    // Exemples d'utilisation pour chaque select

    // Années
    window.select_annee = function(id) {
        const currentYear = new Date().getFullYear();
        const startYear = 2000;
        const data = [];
        for (let year = currentYear; year >= startYear; year--) {
            data.push({ value: year, label: year });
        }
        genericSelect(id, data, 'Choisir une année', { value: 'value', label: 'label' });
    };

    // Catégories
    window.select_categories_all = function(id) {
        genericSelect(id, url + '/api/select_categories', 'Choisir une catégorie', { value: 'id', label: 'nom' });
    };

    // Rôles
    window.select_role_all = function(id) {
        genericSelect(id, url + '/api/select_role_all', 'Choisir un rôle', { value: 'id', label: 'name' });
    };

    // Entreprises
    window.select_entreprise_all = function(id) {
        genericSelect(id, url + '/api/select_entreprise_all', 'Choisir une entreprise', { value: 'id', label: 'nom' });
    };

    // Services
    window.select_service_all = function(id) {
        genericSelect(id, url + '/api/select_service_all', 'Choisir un service', {
            value: 'id',
            label: 'description',
            customProperties: { 
                nbre_respo: 'nbre_respo',
            }
        });
    };

    // Employés
    window.select_employe_all = function(id) {
        genericSelect(id, url + '/api/select_employe_all', 'Choisir un employé', { value: 'id', label: 'name' });
    };

    // Traiteurs par service
    window.select_traiteur_service = function(id, service_id) {
        genericSelect(id, url + '/api/select_traiteur_service/' + service_id, 'Choisir un traiteur', { value: 'id', label: 'name' });
    };

    // Demandes assignées
    window.select_demande_assign = function(id, service_id, statut) {
        genericSelect(id, `${url}/api/select_demande_assign/${service_id}/${statut}`, 'Choisir la demande', {
            value: 'id',
            label: item => `${item.name} - ${item.objet}`
        });
    };

});