$(document).ready(function () { 

    // numberTel("#r_year");
    select_annee("#r_year");

    $("#btn_rech").on("click", loadAllData);
    $("#btn_printer").on("click", PDF_Facturation);

    let data_pdf = [];
    let annee_pdf = 0;

    let perPage = 10;
    let totalCount = 0;
    let totalPages = 0;

    async function loadAllData() {
        try {

            $('#d_table').stop(true, true).slideUp();
            $('#btn_printer').stop(true, true).slideUp();

            let annee = $("#r_year").val();
            let choix = $("#r_option").val();

            var host = $("#db_host").val();
            var db = $("#db_database").val();
            var user = $("#db_username").val();
            var mdp = $("#db_password").val();

            if (!annee.trim()) {
                showAlert("Alert", "Veuillez saisir l'année.", "info");
                return;
            }

            if (annee.length < 4) {
                showAlert("Alert", "Saisir une année valide.", "info");
                return;
            }

            preloaderBar();

            const countResponse = await fetchCount(annee, choix, host, db, user, mdp);
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
                const pageData = await fetchPage(page, annee, choix, host, db, user, mdp, perPage);
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

    function fetchCount(annee, choix, host, db, user, mdp) {
        return $.ajax({
            url: '/api/count_stat_bord',
            method: 'GET',
            data: { annee, choix, host, db, user, mdp }
        });
    }

    function fetchPage(page, annee, choix, host, db, user, mdp, perPage) {
        return $.ajax({
            url: '/api/stat_bord_page',
            method: 'GET',
            data: { page, annee, choix, host, db, user, mdp, perPage }
        });
    }

    function renderData(data) {
        const clients = data;

        // Détruire l'instance DataTable existante (si elle existe)
        const table = $('.table_bord');
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().destroy();
        }

        // Effacer le contenu du tableau
        table.find("tbody").empty();

        data_pdf = [];
        data_pdf = clients;

        // <td class="nk-tb-col">
        //     <span class="tb-amount">
        //         ${item.numcli ?? ''}
        //     </span>
        // </td>

        if (clients.length > 0) {

            $.each(clients, function(index, item) {

                const row = $(`
                    <tr class="nk-tb-item">
                        <td class="nk-tb-col">
                            <span class="tb-amount">${index + 1}</span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${item.nomcli ?? ''}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${item.nbre ?? ''}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${(item.montant_encaisse.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0')}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${(item.montant_prestation.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0')}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${(item.ratio ?? '0').toFixed(2)}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${item.nbre_benef ?? ''}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${formatDate(item.date_effet) ?? ''}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${formatDate(item.date_echeance) ?? ''}
                            </span>
                        </td>
                    </tr>
                `);

                table.find("tbody").append(row);
            });

            initializeDataTable(".table_bord", { responsive: { details: true } });
        } else {
            initializeDataTable(".table_bord", { responsive: { details: true } });
        }
    }

    function PDF_Facturation() 
    {
        preloader();

        var annee_pdf = $("#r_year").val();

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });

        const pdfFilename = "Tableau de bord";
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
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            doc.setFont("Helvetica", "bold");

            // Texte de l'entreprise
            const title = "TABLEAU DE BORD DES EXERCICES DE " + annee_pdf;
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
                        'Employeur', 
                        'Nbre Employés couverts', 
                        'Montant des fonds gérés', 
                        'Montant des Prestations', 
                        'Prestation / Mt fonds gérés (%)', 
                        'Nbre Béneficiaire', 
                        'Date de prise d\'effet', 
                        'Date d\'écheance'
                    ]
                ],
                body: data_pdf.map((item, index) => [
                    index + 1,
                    item.nomcli || '',
                    item.nbre || '0',
                    (item.montant_encaisse.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') || '0'),
                    (item.montant_prestation.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') || '0'),
                    (parseFloat(item.ratio) || 0).toFixed(2),
                    item.nbre_benef || '0',
                    formatDate(item.date_effet) || '',
                    formatDate(item.date_echeance) || '',
                ]),
                theme: 'striped',
                tableWidth: 'auto',
                styles: {
                    fontSize: 7,
                    overflow: 'linebreak',
                },
                // bodyStyles: {
                //     halign: 'center',
                // },
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
                const title_footer = "TABLEAU DE BORD DES EXERCICES DE " + annee_pdf;
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