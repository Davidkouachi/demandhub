$(document).ready(function () {

    window.ListData = function (id, data) 
    {
        const datas = data;

        const tableau = $(id);
        if ($.fn.DataTable.isDataTable(tableau)) {
            tableau.DataTable().destroy();
        }

        tableau.find("tbody").empty();

        data_pdf = [];
        data_pdf = datas;

        let rowsHtml = '';

        if (datas.length > 0) {

            $.each(datas, function(index, item) {

                rowsHtml += `
                    <tr class="nk-tb-item">
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${item.ordre ? item.ordre : ""}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${item.nomassure}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${item.matricule}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${formatDate(item.datenais)}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${item.libfiliation}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${formatDate(item.dateincorp)}
                            </span>
                        </td>
                        <td class="nk-tb-col">
                            <span class="tb-amount">
                                ${item.client}
                            </span>
                        </td>
                    </tr>
                `;

            }); 

            tableau.find("tbody").append(rowsHtml);

            initializeDataTable(id, { responsive: { details: true } });
        } else {
            initializeDataTable(id, { responsive: { details: true } });
        }
    }

    window.PdfDataMagasin = function (data) 
    {
        preloader();

        var anne_pdf = $("#year").val();

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

        const pdfFilename = "Etat des assurés par famille par client";
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
            const title = "ASSURES PAR FAMILLE PAR CLIENT Année " + anne_pdf;
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

            yPoss = yPos + 30;

            // Regrouper les données par client
			const groupedData = data_pdf.reduce((acc, item) => {
			    if (!acc[item.client]) {
			        acc[item.client] = [];
			    }
			    acc[item.client].push(item);
			    return acc;
			}, {});

			Object.keys(groupedData).forEach((clientName) => {
			    const clientData = groupedData[clientName];

			    // Centrer le nom du client
			    doc.setFontSize(10);
		   		doc.setFont("helvetica", "bold");
				const pageWidth = doc.internal.pageSize.width;
				const clientTitle = `${clientName}`;
				const textWidth = doc.getTextWidth(clientTitle);
				const centerX = (pageWidth - textWidth) / 2;
				doc.text(clientTitle, centerX, yPoss - 5);
			    yPoss += 10; // Ajouter un espace

			    let tempTable = []; // Tableau temporaire pour stocker les données du tableau en cours
				let currentOrdre = 0; // Stocke l'ordre actuel
				let nameOrdre = null;

				clientData.forEach((item, index) => {
				    // Si un nouvel ordre est rencontré (différent de vide et différent de l'ordre en cours)
				    if (item.numembr === 1 || item.numembr === 21) {
				        if (tempTable.length > 0) {
				            afficherTableau(doc, tempTable, nameOrdre, yPoss, item.ordre);
				            yPoss = doc.lastAutoTable.finalY + 10;
				            tempTable = [];
				            let currentOrdre = item.ordre;
				        }
				        nameOrdre = item.nomassure; // Mettre à jour l'ordre courant
				    }

				    tempTable.push(item);
				});
			});

        }

        // Fonction pour afficher un tableau
		function afficherTableau(doc, data, ordre, yStart, num) {
		    // Titre de la famille
		    doc.setFontSize(10);
		    doc.setFont("helvetica", "bold");
		    const familleTitle = `Famille : ${ordre}`;
		    const textWidth = doc.getTextWidth(familleTitle);
		    const centerX = (doc.internal.pageSize.width - textWidth) / 2;
		    doc.text(familleTitle, centerX, yStart);

		    // Générer le tableau
		    doc.autoTable({
                startY: yStart + 5,
                head: [['N°', 'Assuré', 'Filiation', 'Date de naissance']],
                body: data.map((row, index) => [
                    index === 0 ? num - 1 : '', // Affiche `num - 1` uniquement sur la première ligne
                    row.nomassure || '',
                    row.libfiliation || '',
                    formatDate(row.datenais),
                ]),
                theme: 'grid',
                // tableWidth: 'auto',
                tableWidth: 'wrap',
                margin: { left: 10, right: 10 },
                styles: {
                    fontSize: 8,
                    overflow: 'linebreak',
                    halign: 'center', // Centre le texte du contenu
                    valign: 'middle',
                },
                headStyles: {
                    fillColor: [200, 200, 200], // Gris foncé pour l'en-tête
                    textColor: 0,
                    fontStyle: 'bold',
                    halign: 'center', // Centre le texte du head
                    valign: 'middle',
                },
                columnStyles: {
                    0: { cellWidth: 8, halign: 'center' }, // Num (-1)
                    1: { cellWidth: 80, halign: 'center' }, // Assuré
                    2: { cellWidth: 49, halign: 'center' }, // Matricule
                    3: { cellWidth: 48, halign: 'center' }, // Filiation
                },
                alternateRowStyles: {
                    fillColor: [240, 240, 240], // Gris clair
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

                doc.setFontSize(8);
                doc.setFont("helvetica", "normal");
                const title_footer = "ETAT DES ASSURES PAR FAMILLE PAR CLIENT";
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