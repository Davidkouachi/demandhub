$(document).ready(function () {

    window.select_server = function (id,id_server) 
    {
        const selectElement2 = $(id);
        selectElement2.empty();
        selectElement2.append($('<option>', {
            value: '',
            text: '',
        }));

        $.ajax({
            url: $('#url').attr('content') + '/api/select_server',
            method: 'GET',
            success: function(response) {
                let data = response.data;

                // Vérifier si data est une chaîne et la convertir
                // if (typeof data === 'string') {
                //     data = JSON.parse(data);
                // }

                data.forEach(function(item, index) {
                    selectElement2.append($('<option>', {
                        value: item.id,
                        text: item.name,
                        selected: id_server != 0 && item.id == id_server,
                        'data-name': item.name,
                        'data-host': item.ip,
                        'data-database': item.bd,
                        'data-username': item.username,
                        'data-password': item.password
                    }));
                });
            },
            error: function() {
                console.error('Erreur lors du chargement des serveurs.');
            }
        });
    }

    window.select_users = function (id,id_font) 
    {
        const selectElement2 = $(id);
        selectElement2.empty();
        selectElement2.append($('<option>', {
            value: '',
            text: '',
        }));

        $.ajax({
            url: $('#url').attr('content') + '/api/list_users',
            method: 'GET',
            success: function(response) {
                let data = response.data;

                data.forEach(function(item, index) {
                    selectElement2.append($('<option>', {
                        value: item.id,
                        text: item.name,
                        selected: id_font != 0 && item.id == id_font,
                        'data-name': item.name,
                        'data-login': item.login,
                        'data-g_users': item.g_users,
                        'data-g_servers': item.g_servers,
                        'data-actif': item.actif
                    }));
                });
            },
            error: function() {
                console.error('Erreur lors du chargement des serveurs.');
            }
        });
    }

    window.select_client= function (id) 
    {
        const selectElement2 = $(id);
        selectElement2.empty();
        selectElement2.append($('<option>', {
            value: 'tout',
            text: 'Tout',
        }));

        var host = $("#db_host").val();
        var db = $("#db_database").val();
        var user = $("#db_username").val();
        var mdp = $("#db_password").val();

        $.ajax({
            url: $('#url').attr('content') + '/api/select_client',
            method: 'GET',
            data: {
                host: host,
                db: db,
                user: user,
                mdp: mdp,
            },
            success: function(response) {
                const data = response.data;

                data.forEach(function(item) {
                    selectElement2.append($('<option>', {
                        value: item.numcli,
                        text: item.nomcli,
                    }));
                });
            },
            error: function() {
                // showAlert('danger', 'Impossible de generer le code automatiquement');
            }
        });
    }

    window.select_recap_souscrit_client= function (id) 
    {
        const selectElement2 = $(id);
        selectElement2.empty();
        selectElement2.append($('<option>', {
            value: '',
            text: '',
        }));

        var host = $("#db_host").val();
        var db = $("#db_database").val();
        var user = $("#db_username").val();
        var mdp = $("#db_password").val();

        $.ajax({
            url: $('#url').attr('content') + '/api/liste_recap_souscrit_client',
            method: 'GET',
            data: {
                host: host,
                db: db,
                user: user,
                mdp: mdp,
            },
            success: function(response) {
                const data = response.data;

                data.forEach(function(item) {
                    selectElement2.append($('<option>', {
                        value: item.numcli,
                        text: item.nomcli,
                    }));
                });
            },
            error: function() {
                // showAlert('danger', 'Impossible de generer le code automatiquement');
            }
        });
    }

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
    };

    window.selectRefresh = function () 
    {

        $('.select2').select2({
            placeholder: 'Sélectionner',
            width: '100%',
            language: {
                noResults: function () {
                    return "Aucun résultat trouvé";
                }
            }
        });    

    };

    window.afficherPrestations = function (prestations, targetId) 
    {

        const $select = $(targetId);
        $select.empty();
        $select.append('<option></option>');

        prestations.forEach(presta => {
            const option = `<option 
                value="${presta.codgaran}"
                data-pratique="${presta.pratique}" 
                data-sexe="${presta.sexe}" 
                data-agemin="${presta.agemin}" 
                data-agemax="${presta.agemax}">
                ${presta.libgaran}
            </option>`;

            $select.append(option);
        });

        $('.select2').select2({
            placeholder: 'Sélectionner',
            width: '100%',
            language: {
                noResults: function () {
                    return "Aucun résultat trouvé";
                }
            }
        });    

    };

    window.afficherMedocs = function (medicaments, targetId, targetId2) 
    {

        const medocData = [
            { id: '', text: 'Aucun médicament' }, // Option vide en premier
            ...medicaments.map(m => ({
                id: m.pr_code,
                text: m.pr_nom
            }))
        ];

        $(targetId).select2({
            data: medocData,
            placeholder: 'Sélectionner le médicament',
            width: '100%',
            language: {
                noResults: () => "Aucun résultat trouvé"
            }
        });


        $(targetId2).select2({
            width: '100%',
        });   

    };

    window.afficherMedecinAffection = function (medecins, affections, Idmedecin, Idaffection) 
    {

        const $select1 = $(Idmedecin);
        $select1.empty();
        $select1.append('<option></option>');

        medecins.forEach(item => {
            const option = `<option 
                value="${item.codmed}"
                data-codpresta="${item.codpresta}" 
                data-etat="${item.etat}" 
                data-numordre="${item.numordre}" 
                data-specialitemed="${item.specialitemed}">
                ${item.nomedecin}
            </option>`;

            $select1.append(option);
        });

        const $select2 = $(Idaffection);
        $select2.empty();
        $select2.append('<option></option>');

        affections.forEach(item => {
            const option = `<option 
                value="${item.codeaff}"
                data-numordr="${item.numordr}">
                ${item.libaff}
            </option>`;

            $select2.append(option);
        });

        $('.select2').select2({
            placeholder: 'Sélectionner',
            width: '100%',
            language: {
                noResults: function () {
                    return "Aucun résultat trouvé";
                }
            }
        });    

    };














    // window.selectRefreshId = function (id) 
    // {

    //     $(id).select2({
    //         placeholder: 'Sélectionner',
    //         width: '100%',
    //         language: {
    //             noResults: function () {
    //                 return "Aucun résultat trouvé";
    //             }
    //         }
    //     });    

    // };

    window.selectRefreshId = function (id, placeholder) 
    {
        const $el = $(id);

        // Cherche le parent modal le plus proche
        const parentModal = $el.closest('.modal');

        $el.select2({
            placeholder: placeholder,
            width: '100%',
            dropdownParent: parentModal.length ? parentModal : $('body'),
            language: {
                noResults: function () {
                    return "Aucun résultat trouvé";
                }
            }
        });    
    };


    window.selectRefresh = function () 
    {
        $('.select2').select2({
            placeholder: 'Sélectionner',
            width: '100%',
            language: {
                noResults: function () {
                    return "Aucun résultat trouvé";
                }
            }
        });    
    };

    window.select_pays = function (id, selected = "") {
        const listeDesPays = [
            "Afghanistan", "Afrique du Sud", "Albanie", "Algérie", "Allemagne", "Andorre", "Angola", "Antigua-et-Barbuda",
            "Arabie Saoudite", "Argentine", "Arménie", "Australie", "Autriche", "Azerbaïdjan", "Bahamas", "Bahreïn",
            "Bangladesh", "Barbade", "Belgique", "Belize", "Bénin", "Bhoutan", "Biélorussie", "Birmanie", "Bolivie",
            "Bosnie-Herzégovine", "Botswana", "Brésil", "Brunei", "Bulgarie", "Burkina Faso", "Burundi", "Cambodge",
            "Cameroun", "Canada", "Cap-Vert", "Chili", "Chine", "Chypre", "Colombie", "Comores", "Congo-Brazzaville",
            "Congo-Kinshasa", "Corée du Nord", "Corée du Sud", "Costa Rica", "Côte d'Ivoire", "Croatie", "Cuba", "Danemark",
            "Djibouti", "Dominique", "Égypte", "Émirats Arabes Unis", "Équateur", "Érythrée", "Espagne", "Estonie",
            "Eswatini", "États-Unis", "Éthiopie", "Fidji", "Finlande", "France", "Gabon", "Gambie", "Géorgie", "Ghana",
            "Grèce", "Grenade", "Guatemala", "Guinée", "Guinée-Bissau", "Guinée équatoriale", "Guyana", "Haïti",
            "Honduras", "Hongrie", "Inde", "Indonésie", "Irak", "Iran", "Irlande", "Islande", "Israël", "Italie", "Jamaïque",
            "Japon", "Jordanie", "Kazakhstan", "Kenya", "Kirghizistan", "Kiribati", "Koweït", "Laos", "Lesotho", "Lettonie",
            "Liban", "Libéria", "Libye", "Liechtenstein", "Lituanie", "Luxembourg", "Macédoine du Nord", "Madagascar",
            "Malaisie", "Malawi", "Maldives", "Mali", "Malte", "Maroc", "Marshall", "Maurice", "Mauritanie", "Mexique",
            "Micronésie", "Moldavie", "Monaco", "Mongolie", "Monténégro", "Mozambique", "Namibie", "Nauru", "Népal",
            "Nicaragua", "Niger", "Nigéria", "Norvège", "Nouvelle-Zélande", "Oman", "Ouganda", "Ouzbékistan", "Pakistan",
            "Palaos", "Palestine", "Panama", "Papouasie-Nouvelle-Guinée", "Paraguay", "Pays-Bas", "Pérou", "Philippines",
            "Pologne", "Portugal", "Qatar", "République Centrafricaine", "République Dominicaine", "République Tchèque",
            "Roumanie", "Royaume-Uni", "Russie", "Rwanda", "Saint-Kitts-et-Nevis", "Saint-Marin", "Saint-Vincent-et-les-Grenadines",
            "Sainte-Lucie", "Salvador", "Samoa", "São Tomé-et-Príncipe", "Sénégal", "Serbie", "Seychelles", "Sierra Leone",
            "Singapour", "Slovaquie", "Slovénie", "Somalie", "Soudan", "Soudan du Sud", "Sri Lanka", "Suède", "Suisse",
            "Suriname", "Syrie", "Tadjikistan", "Tanzanie", "Tchad", "Thaïlande", "Timor oriental", "Togo", "Tonga",
            "Trinité-et-Tobago", "Tunisie", "Turkménistan", "Turquie", "Tuvalu", "Ukraine", "Uruguay", "Vanuatu",
            "Vatican", "Venezuela", "Vietnam", "Yémen", "Zambie", "Zimbabwe"
        ];

        const selectElement2 = $(id);
        selectElement2.empty();

        // Ajoute une option vide par défaut
        selectElement2.append($('<option>', {
            value: '',
            text: '-- Sélectionner un pays --'
        }));

        listeDesPays.forEach(function (nomPays) {
            const isSelected = normalize(nomPays) === normalize(selected);

            selectElement2.append($('<option>', {
                value: nomPays,
                text: nomPays,
                selected: isSelected
            }));
        });

        selectRefreshId('.selectPays', '-- Sélectionner un pays --');
    };

    window.normalize = function (str) 
    {
        return str
            .normalize("NFD")                                // Décompose les caractères accentués
            .replace(/[\u2019\u2018\u0060\u00B4\u02BC]/g, "'") // Remplace toutes les formes d’apostrophes par une simple
            .replace(/[\u0300-\u036f]/g, '')                 // Supprime les accents
            .toLowerCase()                                   // Optionnel : ignore les majuscules/minuscules
            .trim();                                         // Supprime les espaces autour
    }








    window.selectDataMutation = function (magasin_id, user_id, role_id) {
        const selectMagasin = $(magasin_id);
        const selectUser = $(user_id);
        const selectRole = $(role_id);

        // Reset des selects
        selectMagasin.empty().append($('<option>', { value: '', text: '' }));
        selectUser.empty().append($('<option>', { value: '', text: '' }));
        selectRole.empty().append($('<option>', { value: '', text: '' }));

        axios.get(url_base + '/api/selectMutation', {
            params: {
                user_id: user.id,
            }
        })
        .then(function (response) {
            overDisplay(1);
            const res = response.data;

            res.magasin.forEach(function (item) {
                selectMagasin.append($('<option>', {
                    value: item.id,
                    text: item.nom,
                    'data-lock': item.lock,
                    'data-actif': item.actif,
                    'data-suppr': item.suppr,
                }));
            });

            res.user.forEach(function (item) {
                selectUser.append($('<option>', {
                    value: item.id,
                    text: item.nom,
                    'data-lock': item.lock,
                    'data-actif': item.actif,
                    'data-suppr': item.suppr,
                }));
            });

            res.role.forEach(function (item) {
                selectRole.append($('<option>', {
                    value: item.id,
                    text: item.nom
                }));
            });

            selectRefreshId(magasin_id, '-- Sélectionner un magasin --');
            selectRefreshId(user_id, '-- Sélectionner un utilisateur --');
            selectRefreshId(role_id, '-- Sélectionner un role --');
        })
        .catch(function (error) {
            overDisplay(1);
            const msg = error.response?.data?.message || "Une erreur est survenue";
            showAlert("Erreur", msg, "error");
            console.error("Erreur Axios :", msg);
        });
    }


});