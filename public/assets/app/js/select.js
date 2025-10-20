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

    window.selectData = function (id, data = [], options = {}) {
        const $el = $(id);

        if (!$el.length) return;

        const defaultText = options.defaultText || 'Choisir...';

        // Vide le select
        $el.empty();        

        if (data.length > 0) {

            $el.append($('<option>', {
                value: '0',
                text: defaultText,
                selected: true,
                disabled: false
            })); 

            const keys = options.keysMap || { value: 'id', label: 'description', customProperties: null };

            const choicesData = data.map(item => {
                // Construction du value avec toutes les infos séparées par "|"
                let valueStr = item[keys.value]; // valeur principale
                if (keys.customProperties) {
                    for (const key in keys.customProperties) {
                        const propName = keys.customProperties[key];
                        if (item.hasOwnProperty(propName)) {
                            valueStr += `|${key}=${item[propName]}`;
                        }
                    }
                }

                const label = typeof keys.label === 'function' ? keys.label(item) : item[keys.label];

                $el.append($('<option>', {
                    value: valueStr,
                    text: label,
                    selected: false,
                    disabled: false
                })); 
            });

        }

        selectRefreshId(id);
    };

    window.selectRefreshNull = function (id) {
        const $el = $(id);
        const instance = $el[0]?.choicesInstance;

        if (!$el.length || !instance) return;

        // ✅ Supprime toutes les sélections actives
        instance.removeActiveItems();

        // ✅ Reset le select natif (option placeholder = "0")
        $el.val('0');

        // ✅ Met à jour l'affichage Choices
        instance.setChoiceByValue('0');
    };

    window.selectExtraitData = function (selectedValue) {
        const props = {};
        const parts = selectedValue.split('|'); // ["1", "nbre_respo=3"]
        props.id = parts[0]; // la valeur principale
        for (let i = 1; i < parts.length; i++) {
            const [key, val] = parts[i].split('=');
            props[key] = val;
        }

        return props;
    };

    // ----------------------------------------------------------------------

    // Fonction générique pour remplir un select avec API ou données locales
    window.genericSelect = function(id, dataOrUrl, defaultText = 'Choisir...', keysMap = { value: 'id', label: 'name', customProperties: null }, searchPlaceholder = null) {
        const selectElement = $(id);

        // Supprime l'ancienne instance Choices

        // Met un indicateur de chargement temporaire
        selectElement.html('<option>Chargement en cours...</option>');
        selectElement.prop('disabled', true);
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
                    selectElement.prop('disabled', false);
                    selectData(selectElement, data, {
                        defaultText,
                        noDataText: `Aucun ${defaultText.toLowerCase()} disponible`,
                        keysMap,
                        searchPlaceholder: searchPlaceholder || `Rechercher ${defaultText.toLowerCase()}`
                    });
                })
                .catch(error => {
                    console.error(`Impossible de récupérer ${defaultText.toLowerCase()}`, error);
                    selectElement.html('<option disabled selected>Erreur de chargement</option>');
                });
        }
    }

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
        genericSelect(id, url + '/api/select_categories_all', 'Choisir une catégorie', { value: 'id', label: 'nom' });
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
                nbre_traiteur: 'nbre_traiteur',
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
            label: item => `${item.uid} - ${item.objet}`
        });
    };

});