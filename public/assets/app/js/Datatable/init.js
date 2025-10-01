$(document).ready(function () {

    // window.initializeDataTable = function (selector) {
    //     const tableSelector = $(selector);

    //     if (tableSelector.length) {
    //         tableSelector.each(function () {
    //             const $table = $(this);

    //             if ($.fn.DataTable.isDataTable($table)) {
    //                 $table.DataTable().clear().destroy();
    //             }

    //             const defaultDOM = "<'row'<'col-sm-6'l><'col-sm-6'f>>" +
    //                                "<'row'<'col-sm-12'tr>>" +
    //                                "<'row'<'col-sm-5'i><'col-sm-7'p>>";

    //             const defaultOptions = {
    //                 pagingType: "simple_numbers",
    //                 ordering: false, // ✅ désactive les petits boutons de tri
    //                 dom: $table.hasClass("is-separate") ? defaultDOM : defaultDOM,
    //                 language: {
    //                     search: "",
    //                     searchPlaceholder: "Recherche",
    //                     lengthMenu: "<div class='form-control-select mb-2'>Afficher _MENU_ ligne(s)</div>",
    //                     info: "_START_ - _END_ sur _TOTAL_ Page(s)",
    //                     infoEmpty: "0",
    //                     infoFiltered: "(Total _MAX_)",
    //                     paginate: {
    //                         first: "Premier",
    //                         last: "Dernier",
    //                         next: "Suivant",
    //                         previous: "Précédent",
    //                     },
    //                     zeroRecords: "<div class='text-center no-data'>Aucune donnée trouvée</div>",
    //                     emptyTable: "<div class='text-center no-data'>Aucune donnée disponible dans le tableau</div>"
    //                 },
    //                 width: '100%',
    //                 scrollX: true,
    //             };

    //             const dt = $table.DataTable(defaultOptions);
    //             $table.closest('.dataTables_wrapper').find('.dataTables_filter').addClass('mb-2');

    //             setTimeout(() => {
    //                 dt.columns.adjust().draw();
    //             }, 1000);
    //         });
    //     }
    // };

    window.initializeDataTable = function (selector) {
        return new Promise((resolve, reject) => {
            const tableSelector = $(selector);

            if (!tableSelector.length) {
                return reject(new Error("Aucun tableau trouvé pour le sélecteur fourni."));
            }

            const initializations = [];

            tableSelector.each(function () {
                const $table = $(this);

                if ($.fn.DataTable.isDataTable($table)) {
                    $table.DataTable().clear().destroy();
                }

                const defaultDOM = "<'row'<'col-sm-6'l><'col-sm-6'f>>" +
                                   "<'row'<'col-sm-12'tr>>" +
                                   "<'row'<'col-sm-5'i><'col-sm-7'p>>";

                const defaultOptions = {
                    pagingType: "simple_numbers",
                    ordering: false,
                    dom: $table.hasClass("is-separate") ? defaultDOM : defaultDOM,
                    language: {
                        search: "",
                        searchPlaceholder: "Recherche",
                        lengthMenu: "<div class='form-control-select mb-2'>Afficher _MENU_ ligne(s)</div>",
                        info: "_START_ - _END_ sur _TOTAL_ Page(s)",
                        infoEmpty: "0",
                        infoFiltered: "(Total _MAX_)",
                        paginate: {
                            first: "Premier",
                            last: "Dernier",
                            next: "Suivant",
                            previous: "Précédent",
                        },
                        zeroRecords: "<div class='text-center no-data'>Aucune donnée trouvée</div>",
                        emptyTable: "<div class='text-center no-data'>Aucune donnée disponible dans le tableau</div>"
                    },
                    width: '100%',
                    scrollX: true,
                };

                const dt = $table.DataTable(defaultOptions);
                $table.closest('.dataTables_wrapper').find('.dataTables_filter').addClass('mb-2');

                // On utilise une promesse différée pour attendre l'ajustement des colonnes
                const deferred = new Promise((res) => {
                    setTimeout(() => {
                        dt.columns.adjust().draw();
                        res($table); // résout la promesse pour ce tableau
                    }, 1000);
                });

                initializations.push(deferred);
            });

            // Une fois que toutes les promesses internes sont résolues, on résout la principale
            Promise.all(initializations)
                .then(resolve)
                .catch(reject);
        });
    };


});

