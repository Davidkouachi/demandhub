$(document).ready(function () { 

    let data_pdf = [];
    let budg_sante_pdf = 0;
    let frais_gest_pdf = 0;
    let total_pdf = 0;

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

            var host = $("#db_host").val();
            var db = $("#db_database").val();
            var user = $("#db_username").val();
            var mdp = $("#db_password").val();

            if (!date1.trim() || !date2.trim()) {
                showAlert("Alert", "Veuillez vérifier les dates.", "info");
                return false;
            }

            preloaderBar();

            const countResponse = await fetchCount(date1, date2, host, db, user, mdp);
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
                const pageData = await fetchPage(page, date1, date2, host, db, user, mdp, perPage);
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

    function fetchCount(date1, date2, host, db, user, mdp) {
        return $.ajax({
            url: $('#url').attr('content') + '/api/count_liste_budg_sante_societe',
            method: 'GET',
            data: { date1, date2, host, db, user, mdp }
        });
    }

    function fetchPage(page, date1, date2, host, db, user, mdp, perPage) {
        return $.ajax({
            url: $('#url').attr('content') + '/api/liste_budg_sante_societe_page',
            method: 'GET',
            data: { date1, date2, host, db, user, mdp, page, perPage }
        });
    }

    function renderData(data) {
        const clients = data;

        // Détruire l'instance DataTable existante (si elle existe)
        const table = $('.table_budg_sante_societe');
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().destroy();
        }

        // Effacer le contenu du tableau
        table.find("tbody").empty();

        data_pdf = [];
        data_pdf = clients;

        budg_sante_pdf = 0;
        frais_gest_pdf = 0;
        total_pdf = 0;

        if (clients.length > 0) {

            // Calculer la somme totale des nombres
            let totalbudg = clients.reduce((sum, item) => sum + (parseInt(item.budget) || 0), 0);
            let totalfrai_ges = clients.reduce((sum, item) => sum + (parseInt(item.budget) || 0), 0);
            let totalsg_cr = clients.reduce((sum, item) => sum + (parseInt(item.budget) || 0), 0);

            budg_sante_pdf = totalbudg;
            frais_gest_pdf = totalfrai_ges;
            total_pdf = totalsg_cr;

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
                                ${(item.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0')}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${(item.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0')}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${(item.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0')}
                            </span>
                        </td>
                    </tr>
                `);

                table.find("tbody").append(row);
            });

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
                        <span class="tb-amount">${(totalbudg.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0')}</span>
                    </td>
                    <td class="nk-tb-col">
                        <span class="tb-amount">${(totalfrai_ges.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0')}</span>
                    </td>
                    <td class="nk-tb-col">
                        <span class="tb-amount">${(totalsg_cr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0')}</span>
                    </td>
                </tr>
            `);

            table.find("tfoot").html(totalRow); 

            initializeDataTable(".table_budg_sante_societe", { responsive: { details: true } });
        } else {
            initializeDataTable(".table_budg_sante_societe", { responsive: { details: true } });
        }
    }

    function PDF_Facturation() 
    {
        preloader();

        var date1_pdf = $("#date1").val();
        var date1_pdf = $("#date2").val();

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

        const pdfFilename = "Etat de gestions des budgets santé des société du " + formatDate(date1_pdf) + " au " + formatDate(date2_pdf);
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
            const title = "BUDGETS SANTE DES SOCIETES DU " + formatDate(date1_pdf) + " AU " + formatDate(date2_pdf);
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
                        'Clients', 
                        'Budget santé',
                        'Frais de gestion',
                        'Charges sinistrés + commission reversées',
                    ]
                ],
                body: data_pdf.map((item, index) => [
                    index + 1,
                    item.nomcli || '',
                    (item.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') || '0'),
                    (item.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') || '0'),
                    (item.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') || '0'),
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
                },
                foot: [[
                    { content: 'Totals', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
                    { content: budg_sante_pdf.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'), styles: { halign: 'center', fontStyle: 'bold' } },
                    { content: frais_gest_pdf.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'), styles: { halign: 'center', fontStyle: 'bold' } },
                    { content: total_pdf.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'), styles: { halign: 'center', fontStyle: 'bold' } },
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
                const title_footer = "ETAT DES BUDGETS SANTE DES SOCIETES" + formatDate(date1_pdf) + " AU " + formatDate(date2_pdf);
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