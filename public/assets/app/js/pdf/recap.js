$(document).ready(function () { 

    let data_pdf = [];

    let perPage = 10;
    let totalCount = 0;
    let totalPages = 0;

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

            var host = $("#db_host").val();
            var db = $("#db_database").val();
            var user = $("#db_username").val();
            var mdp = $("#db_password").val();

            if (!date1.trim() || !date2.trim()) {
                showAlert("Alert", "Veuillez vérifier les dates.", "info");
                return false;
            }

            preloaderBar();

            const countResponse = await fetchCount(date1, date2, etat, host, db, user, mdp);
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
                const pageData = await fetchPage(page, date1, date2, etat, host, db, user, mdp, perPage);
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

    function fetchCount(date1, date2, etat, host, db, user, mdp) {
        return $.ajax({
            url: $('#url').attr('content') + '/api/count_recap_exercice',
            method: 'GET',
            data: { date1, date2, etat, host, db, user, mdp }
        });
    }

    function fetchPage(page, date1, date2, etat, host, db, user, mdp, perPage) {
        return $.ajax({
            url: $('#url').attr('content') + '/api/liste_recap_exercice_page',
            method: 'GET',
            data: { date1, date2, etat, host, db, user, mdp, page, perPage }
        });
    }

    function renderData(data) {
        const clients = data;

        // Détruire l'instance DataTable existante (si elle existe)
        const table = $('.table_exercice');
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().destroy();
        }

        // Effacer le contenu du tableau
        table.find("tbody").empty();

        if (clients.length > 0) {

            data_pdf = clients;
            date1_pdf = date1;
            date2_pdf = date2;

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
                                ${(parseInt(item.montEncaisse, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0')}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${(parseInt(item.montEncaisse, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0')}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${(parseInt(item.montSinistre, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0')}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${(parseInt(item.mtRemb, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0')}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${(parseInt(item.mtExclu, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0')}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${(parseInt(item.comi18, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0')}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${(parseInt(item.comi20, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0')}
                            </span>
                        </td>
                    </tr>
                `);

                table.find("tbody").append(row);
            });

            initializeDataTable(".table_exercice", { responsive: { details: true } });
        } else {
            initializeDataTable(".table_exercice", { responsive: { details: true } });
        }
    }

    function PDF_Facturation() 
    {
        preloader();

        var date1_pdf = $("#date1").val();
        var date2_pdf = $("#date2").val();

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });

        const pdfFilename = "Etat récapitulatif de l'exercice du " + formatDate(date1_pdf) + " au " + formatDate(date2_pdf);
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
            const title = "RECAPITULATIF DE L'EXERCICE DU " + formatDate(date1_pdf) + " AU " + formatDate(date2_pdf);
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
                        'Emission prime',
                        'Montant encaissé', 
                        'Facture recue',
                        'Facture payée', 
                        'Exclusion',
                        'Commission 18%',
                        'Commission 20%',
                    ]
                ],
                body: data_pdf.map((item, index) => [
                    index + 1,
                    item.nomcli || '',
                    (parseInt(item.montEncaisse, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0'),
                    (parseInt(item.montEncaisse, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0'),
                    (parseInt(item.montSinistre, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0'),
                    (parseInt(item.mtRemb, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0'),
                    (parseInt(item.mtExclu, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0'),
                    (parseInt(item.comi18, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0'),
                    (parseInt(item.comi20, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0'),
                ]),
                theme: 'striped',
                tableWidth: 'auto',
                styles: {
                    fontSize: 7,
                    overflow: 'linebreak',
                },
                columnStyles: {
                    2: { halign: 'center' }, // 3ᵉ colonne (index 2)
                    3: { halign: 'center' }, // 4ᵉ colonne (index 3)
                    4: { halign: 'center' }, // 5ᵉ colonne (index 4)
                    5: { halign: 'center' }, // 6ᵉ colonne (index 5)
                    6: { halign: 'center' }, // 7ᵉ colonne (index 6)
                    7: { halign: 'center' }, // 8ᵉ colonne (index 7)
                    8: { halign: 'center' }, // 9ᵉ colonne (index 8)
                },
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
                const title_footer = "ETAT RECAPITULATIF DE L'EXERCICE DU " + formatDate(date1_pdf) + " AU " + formatDate(date2_pdf);
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

});