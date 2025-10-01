$(document).ready(function () { 

    var data_pdf = [];
    var total_pdf = 0;

    liste_bene_societe();
    $("#btn_printer").on("click", PDF_Facturation);

    function liste_bene_societe()
    {
        var host = $("#db_host").val();
        var db = $("#db_database").val();
        var user = $("#db_username").val();
        var mdp = $("#db_password").val();

        $.ajax({
            url: $('#url').attr('content') + '/api/liste_bene_societe',
            method: 'GET',
            data: {
                host: host,
                db: db,
                user: user,
                mdp: mdp,
            },
            dataType: 'json',
            success: function(data) {
                const clients = data.data;

                // Détruire l'instance DataTable existante (si elle existe)
                const table = $('.table_bene_societe');
                if ($.fn.DataTable.isDataTable(table)) {
                    table.DataTable().destroy();
                }

                // Effacer le contenu du tableau
                table.find("tbody").empty();

                data_pdf = [];
                data_pdf = clients;

                if (clients.length > 0) {

                    $('#btn_printer').stop(true, true).slideDown();

                    // Calculer la somme totale des nombres
                    let totalNombre = clients.reduce((sum, item) => sum + (parseInt(item.nombre) || 0), 0);

                    total_pdf = 0
                    total_pdf = totalNombre;

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
                                        ${item.nombre.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0'}
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
                                <span class="tb-amount">${(totalNombre.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0')}</span>
                            </td>
                        </tr>
                    `);

                    table.find("tfoot").html(totalRow); 

                    initializeDataTable(".table_bene_societe", { responsive: { details: true } });
                } else {
                    $('#btn_printer').stop(true, true).slideUp();
                    initializeDataTable(".table_bene_societe", { responsive: { details: true } });
                }
            },
            error: function() {
                $("#preloader_ch").remove();
                initializeDataTable(".table_bene_societe", { responsive: { details: true } });
            }
        });

    }

    function PDF_Facturation() 
    {

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

        const pdfFilename = "Etat Bénéficiaire Société";
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
            const title = "BENEFICIAIRE SOCIETE";
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
                        'Nombre',
                    ]
                ],
                body: data_pdf.map((item, index) => [
                    index + 1,
                    item.nomcli || '',
                    item.nombre.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') || '0',
                ]),
                theme: 'striped',
                tableWidth: 'auto',
                styles: {
                    fontSize: 7,
                    overflow: 'linebreak',
                },
                foot: [[
                    { content: 'Totals', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
                    { content: total_pdf.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'), styles: { fontStyle: 'bold' } },
                    ''
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

                doc.setFontSize(9);
                doc.setFont("helvetica", "normal");
                const title_footer = "ETAT BENEFICIAIRE SOCIETE";
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