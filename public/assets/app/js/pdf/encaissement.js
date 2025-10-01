$(document).ready(function () { 

    let data_pdf = [];
    let fac_mt_pdf = 0;

    let perPage = 10;
    let totalCount = 0;
    let totalPages = 0;

    let selectedItems = new Set();

    $("#btn_rech").on("click", loadAllData);
    $("#btn_printer").on("click", PDF_Facturation);

    $('#date1').on('change', function() {
        const date1 = $(this).val();
        
        if (date1) {
            $('#date2').val(date1);
            $('#date2').attr('min', date1);
        }
    });

    $('#date2').on('change', function() {
        const date2 = $(this).val();
        const date1 = $('#date1').val();

        if (date2 && date1 && new Date(date2) < new Date(date1)) {
            alert('La date de sortie probable ne peut pas être antérieure à la date d\'entrée.');
            $(this).val(date1);
        }
    });

    async function loadAllData() {
        try {

            $('#d_table').stop(true, true).slideUp();
            $('#btn_printer').stop(true, true).slideUp();

            var date1 = $("#date1").val();
            var date2 = $("#date2").val();
            var etat = $("#etat").val();
            var fonc = $("#fonc").val();

            var host = $("#db_host").val();
            var db = $("#db_database").val();
            var user = $("#db_username").val();
            var mdp = $("#db_password").val();

            if (!date1.trim() || !date2.trim()) {
                showAlert("Alert", "Veuillez vérifier les dates.", "info");
                return false;
            }

            preloaderBar();

            const countResponse = await fetchCount(date1, date2, etat, fonc, host, db, user, mdp);
            totalCount = countResponse.total;
            perPage = determinePerPage(totalCount);
            totalPages = Math.ceil(totalCount / perPage);

            if (totalCount === 0) {
                $("#preloader_ch").remove();
                showAlert("Alert", "Aucune données n'a été trouvées.", "info");
                return;
            }

            let totalProcessed = 0;
            preloaderBarContenu(0,totalProcessed,totalCount);

            $('.datatable-init').find("tbody").empty();
            $('#d_table').stop(true, true).slideDown();

            data_pdf = [];
            for (let page = 1; page <= totalPages; page++) {
                const pageData = await fetchPage(page, date1, date2, etat, fonc, host, db, user, mdp, perPage);
                data_pdf = data_pdf.concat(pageData.data);

                totalProcessed = data_pdf.length;

                // Met à jour la barre de progression
                const progress = Math.round((page / totalPages) * 100);

                renderData(data_pdf);

                preloaderBarContenu(progress, totalProcessed, totalCount);

            }

            $('#btn_printer').stop(true, true).slideDown();

            // 👉 Forcer le DOM à se mettre à jour
            await new Promise(resolve => setTimeout(resolve, 0));

        } catch (err) {
            $("#preloader_ch").remove();
            console.log('Erreur de chargement : ' + err.message);
        }
    }

    function fetchCount(date1, date2, etat, fonc, host, db, user, mdp) {
        return $.ajax({
            url: $('#url').attr('content') + '/api/count_liste_encaissement',
            method: 'GET',
            data: { date1, date2, etat, fonc, host, db, user, mdp }
        });
    }

    function fetchPage(page, date1, date2, etat, fonc, host, db, user, mdp, perPage) {
        return $.ajax({
            url: $('#url').attr('content') + '/api/liste_encaissement_page',
            method: 'GET',
            data: { date1, date2, etat, fonc, host, db, user, mdp, page, perPage }
        });
    }

    function renderData(data) {
        const clients = data;

        // Détruire l'instance DataTable existante (si elle existe)
        const table = $('.table_encaisse1');
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().destroy();
        }

        // Effacer le contenu du tableau
        table.find("tbody").empty();

        if (clients.length > 0) {

            // Calculer la somme totale des nombres
            let total1 = 0;

            total1 = clients.reduce((sum, item) => sum + (parseInt(item.montantencaisse) || 0), 0);

            fac_mt_pdf = total1;

            $.each(clients, function(index, item) {

                const row = $(`
                    <tr class="nk-tb-item">
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${index + 1}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${item.nomcli ?? ''}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${(item.montantencaisse.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0')}
                            </span>
                        </td>
                    </tr>
                `);

                table.find("tbody").append(row);
            });

            // <td class="nk-tb-col">
            //                 <div class="custom-control custom-control-sm custom-checkbox notext">
            //                     <input type="checkbox" value="${item.numcli}" class="custom-control-input" id="pid-${index + 1}">
            //                     <label class="custom-control-label" for="pid-${index + 1}"></label>
            //                 </div>
            //             </td>

            // Vérifier si le <tfoot> existe déjà, sinon l'ajouter
            if (table.find("tfoot").length === 0) {
                table.append("<tfoot></tfoot>");
            }

            // Ajouter une ligne pour afficher la somme totale dans <tfoot>
            const totalRow = $(`
                <tr style="font-weight: bold; background-color: #808080; border: 2px solid blo; color: white;">
                    <td colspan="2" class="nk-tb-col">
                        <span class="tb-amount">Total</span>
                    </td>
                    <td class="nk-tb-col">
                        <span class="tb-amount">${(fac_mt_pdf.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0') }</span>
                    </td>
                </tr>
            `);

            table.find("tfoot").html(totalRow); 

            initializeDataTable(".table_encaisse1", { responsive: { details: true } });
        } else {
            initializeDataTable(".table_encaisse1", { responsive: { details: true } });
        }
    }

    function PDF_Facturation() 
    {
        preloader();

        var date1_pdf = $("#date1").val();
        var date2_pdf = $("#date2").val();

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

        const pdfFilename = "Etat de gestions des budgets sinistré des clients du " + formatDate(date1_pdf) + " au " + formatDate(date2_pdf);
        doc.setProperties({
            title: pdfFilename,
        });

        let yPos = 20;

        function drawConsultationSection(yPos) {
            rightMargin = 15;
            leftMargin = 15;
            pdfWidth = doc.internal.pageSize.getWidth();

            const logoSrc = "assets/images/logo.gif";
            const logoWidth = 30;
            const logoHeight = 15;
            doc.addImage(logoSrc, 'GIF', leftMargin, yPos - 7 , logoWidth, logoHeight);

            // Informations de l'entreprise
            doc.setFontSize(8);
            doc.setTextColor(0, 0, 0);
            doc.setFont("Helvetica", "bold");

            // Texte de l'entreprise
            const title = "BUDGETS SINISTRES DES CLIENTS DU " + formatDate(date1_pdf) + " AU " + formatDate(date2_pdf);
            const titleWidth = doc.getTextWidth(title);
            const padding = 5; // Padding uniforme
            const textHeight = doc.getFontSize() / 2; // Hauteur approximative du texte
            const boxHeight = textHeight + 2 * padding; // Hauteur totale du cadre
            const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
            const titleY = yPos + padding; // Ajustement pour bien centrer

            // Dessiner le cadre (rectangle)
            doc.setDrawColor(0); // Couleur du cadre (noir)
            doc.setLineWidth(0.5); // Épaisseur du cadre
            doc.setFillColor(230, 230, 230); // Couleur de fond du cadre (gris clair)
            doc.rect(titleX - padding, yPos - padding, titleWidth + 2 * padding, boxHeight, "FD");

            // Ajouter le texte au centre du cadre
            doc.setTextColor(0, 0, 0);
            doc.text(title, titleX, yPos + textHeight / 2);

            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            const date = "Abidjan le " + new Date().toLocaleDateString();
            drawRightAlignedText(doc, date, yPos + 2);

            yPoss = yPos + 20;

            doc.autoTable({
                startY: yPoss,
                head: [
                    [
                        'N°',
                        'Client', 
                        'Montant sinistré',
                    ]
                ],
                body: data_pdf.map((item, index) => [
                    index + 1,
                    item.nomcli || '',
                    (item.montantencaisse.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') || '0') + ' Fcfa',
                ]),
                theme: 'striped',
                tableWidth: 'auto',
                styles: {
                    fontSize: 7,
                    overflow: 'linebreak',
                },
                foot: [[
                    { content: 'Totals', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
                    { content: fac_mt_pdf.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' Fcfa', styles: { fontStyle: 'bold' } },
                ]]
            });

        }

        function drawRightAlignedText(doc, text, yPosition, marginRight = 15) {
            const pageWidth = doc.internal.pageSize.width; // Largeur de la page
            const textWidth = doc.getTextWidth(text); // Largeur du texte
            const xPosition = pageWidth - textWidth - marginRight; // Position X alignée à droite

            doc.text(text, xPosition, yPosition);
        }


        function addFooter() {
            // Add footer with current date and page number in X/Y format
            const pageCount = doc.internal.getNumberOfPages();
            const footerY = doc.internal.pageSize.getHeight() - 2; // 10 mm from the bottom

            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(0, 0, 0);
                const pageText = `Page ${i} sur ${pageCount}`;
                const pageTextWidth = doc.getTextWidth(pageText);
                const centerX = (doc.internal.pageSize.getWidth() - pageTextWidth) / 2;
                doc.text(pageText, centerX, footerY);
                doc.text("Imprimé le : " + new Date().toLocaleDateString() + " à " + new Date().toLocaleTimeString(), 15, footerY);

                doc.setFontSize(5);
                doc.setFont("helvetica", "normal");
                const title_footer = "ETAT DES BUDGETS SINISTRE DES CLIENTS" + formatDate(date1_pdf) + " AU " + formatDate(date2_pdf);
                drawRightAlignedText(doc, title_footer, footerY);
            }

        }

        drawConsultationSection(yPos);

        addFooter();

        $("#preloader_ch").remove();

        doc.output('dataurlnewwindow');

        // var blob = doc.output('blob');
        // var blobURL = URL.createObjectURL(blob);
        // window.open(blobURL);
    } 







    // function updateCounter() {
    //     let total = $(".table_encaisse1").DataTable().rows().count(); // Nombre total d'entrées dans DataTable
    //     let selected = selectedItems.size; // Nombre d'éléments sélectionnés globalement

    //     $("#selectedCount").text(selected);
    //     $("#totalCount").text(total);

    //     // Afficher ou masquer la balise <p> en fonction de la sélection
    //     if (total > 0) {
    //         $("#selectionStatus").show();
    //         $('#selectionStatusCheckbox').show();
    //     } else {
    //         $("#selectionStatus").hide();
    //         $('#selectionStatusCheckbox').hide();
    //     }
    // }

    // $(document).on("change", ".table_encaisse1 tbody input[type='checkbox']", function () {
    //     let itemId = $(this).attr("id"); // ID unique de chaque checkbox

    //     if ($(this).is(":checked")) {
    //         selectedItems.add(itemId); // Ajouter l'élément sélectionné
    //     } else {
    //         selectedItems.delete(itemId); // Retirer l'élément si décoché
    //     }

    //     updateCounter();
    // });

    // $(document).on("change", "#pid-all", function () {
    //     let table = $(".table_encaisse1").DataTable(); // Obtenir l'instance de DataTable
    //     let allCheckboxes = $(".table_encaisse1 tbody input[type='checkbox']"); // Récupérer toutes les cases à cocher

    //     if (this.checked) {
    //         // Si la case 'tout sélectionner' est cochée, ajouter tous les éléments du tableau au Set
    //         table.rows().every(function () { // Parcours de toutes les lignes, visibles et non visibles
    //             let itemId = this.node().querySelector('input[type="checkbox"]').id;
    //             selectedItems.add(itemId);
    //         });
    //         allCheckboxes.prop("checked", true); // Cocher toutes les cases à cocher
    //     } else {
    //         // Si la case 'tout sélectionner' est décochée, enlever tous les éléments du Set
    //         table.rows().every(function () {
    //             let itemId = this.node().querySelector('input[type="checkbox"]').id;
    //             selectedItems.delete(itemId);
    //         });
    //         allCheckboxes.prop("checked", false); // Décochez toutes les cases à cocher
    //     }

    //     updateCounter();
    // });

    // $('.table_encaisse1').on('draw.dt', function () {
    //     $(".table_encaisse1 tbody input[type='checkbox']").each(function () {
    //         let itemId = $(this).attr("id");
    //         $(this).prop("checked", selectedItems.has(itemId)); // Mettre à jour l'état de chaque case
    //     });
    // });

    // function deselectAll() {
    //     // Désélectionner toutes les cases à cocher dans le tableau
    //     $(".table_encaisse1 tbody input[type='checkbox']").prop("checked", false);

    //     // Si vous avez besoin de mettre à jour les éléments sélectionnés dans le Set ou autre variable
    //     selectedItems.clear();  // Supposons que vous utilisez un Set pour suivre les éléments sélectionnés
    //     updateCounter();  // Mise à jour du compteur ou de l'affichage de sélection
    // }

    // $(document).on('click', '#btn_detail', function () {
    //     event.preventDefault();

    //     var date1 = $("#date1").val();
    //     var date2 = $("#date2").val();

    //     if (!date1.trim() || !date2.trim()) {
    //         showAlert("Alert", "Veuillez vérifier les dates.", "info");
    //         return false;
    //     }

    //     // Récupérer toutes les cases à cocher sélectionnées
    //     const selectedCheckboxes = $(".table_encaisse1 tbody input[type='checkbox']:checked");

    //     // Vérifier s'il y a au moins une case cochée
    //     if (selectedCheckboxes.length === 0) {
    //         showAlert("Alert", "Veuillez sélectionner un ou plusieurs clients.", "info");
    //         return false;
    //     }

    //     // Créer un tableau pour stocker les données des lignes sélectionnées
    //     let selectedClients = [];

    //     // Parcourir les cases sélectionnées et récupérer les données associées
    //     selectedCheckboxes.each(function() {
    //         const row = $(this).closest('tr'); // Trouver la ligne parent de la case cochée
    //         const id = row.find('td').eq(0).text();
    //         const client = row.find('td').eq(1).text();

    //         selectedClients.push({ id, client });
    //     });

    //     voirDetail(selectedClients, date1, date2);
    // });

    // function voirDetail(selectedClients, date1, date2)
    // {
    //     preloader();
    //     var host = $("#db_host").val();
    //     var db = $("#db_database").val();
    //     var user = $("#db_username").val();
    //     var mdp = $("#db_password").val();

    //     $.ajax({
    //         url: $('#url').attr('content') + '/api/liste_recap_souscrit_client_detail',
    //         method: 'GET',
    //         data: {
    //             select: selectedClients,
    //             date1: date1,
    //             date2: date2,
    //             host: host,
    //             db: db,
    //             user: user,
    //             mdp: mdp,
    //         },
    //         dataType: 'json',
    //         success: function(data) {
    //             $("#preloader_ch").remove();
    //             const clients = data.data;

    //             // Détruire l'instance DataTable existante (si elle existe)
    //             const table = $('.table_recap_souscrit_client2');
    //             if ($.fn.DataTable.isDataTable(table)) {
    //                 table.DataTable().destroy();
    //             }

    //             // Effacer le contenu du tableau
    //             table.find("tbody").empty();

    //             if (clients.length > 0) {

    //                 $.each(clients, function(index, item) {

    //                     const row = $(`
    //                         <tr>
    //                             <td class="nk-tb-col">
    //                                 <span class="tb-amount">
    //                                     ${formatDatenum(item.date) ?? ''}
    //                                 </span>
    //                             </td>
    //                             <td class="nk-tb-col">
    //                                 <span class="tb-amount">
    //                                     ${item.nomcli ?? ''}
    //                                 </span>
    //                             </td>
    //                             <td class="nk-tb-col">
    //                                 <span class="tb-amount">
    //                                     ${item.nombre ?? ''}
    //                                 </span>
    //                             </td>
    //                         </tr>
    //                     `);

    //                     table.find("tbody").append(row);
    //                 });


    //                 initializeDataTable(".table_recap_souscrit_client2", { responsive: { details: true } });
    //             } else {
    //                 $('#btn_printer').stop(true, true).slideUp();
    //                 initializeDataTable(".table_recap_souscrit_client2", { responsive: { details: true } });
    //             }
    //         },
    //         error: function() {
    //             $('#btn_printer').stop(true, true).slideUp();
    //             initializeDataTable(".table_recap_souscrit_client2", { responsive: { details: true } });
    //         }
    //     });

    // }
});