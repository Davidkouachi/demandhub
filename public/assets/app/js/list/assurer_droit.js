$(document).ready(function () {

	// select_client("#client");
    select_recap_souscrit_client('#client');
    select_annee("#year")

	$("#btn_rech").on("click", loadAllData);
	$("#btn_printer").on("click", PDF_Facturation);

	let data_pdf = [];

    let perPage = 10;
    let totalCount = 0;
    let totalPages = 0;

    async function loadAllData() {
        try {

            $('#d_table').stop(true, true).slideUp();
            $('#btn_printer').stop(true, true).slideUp();

            var an_inco = $("#an_inco").val();
            var year = $("#year").val();
            var client = $("#client").val();

            var host = $("#db_host").val();
            var db = $("#db_database").val();
            var user = $("#db_username").val();
            var mdp = $("#db_password").val();

            if (!year.trim() || year.length != 4) {
                showAlert("Alert", "Veuillez vérifier l'année.", "info");
                return false;
            }

            if (an_inco == 1 && (year.length != 4 || !year.trim())) {
                showAlert("Alert", "Veuillez vérifier l'année.", "info");
                return false;
            }

            if (client == 'tout') {
                showAlert("Alert", "Veuillez choisir un client.", "info");
                return false;
            }

            preloaderBar();

            const countResponse = await fetchCount(year, an_inco, client, host, db, user, mdp);
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
                const pageData = await fetchPage(page, year, an_inco, client, host, db, user, mdp, perPage);
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

    function fetchCount(year, an_inco, client, host, db, user, mdp) {
        return $.ajax({
            url: $('#url').attr('content') + '/api/count_liste_assurer_droit_por',
            method: 'GET',
            data: { year, an_inco, client, host, db, user, mdp }
        });
    }

    function fetchPage(page, year, an_inco, client, host, db, user, mdp, perPage) {
        return $.ajax({
            url: $('#url').attr('content') + '/api/liste_assurer_droit_por_page',
            method: 'GET',
            data: { page, year, an_inco, client, host, db, user, mdp, perPage }
        });
    }

    function renderData(data) {
        const clients = data;

        // Détruire l'instance DataTable existante (si elle existe)
        const table = $('.table_assurer_droit');
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().destroy();
        }

        // Effacer le contenu du tableau
        table.find("tbody").empty();

        data_pdf = [];
        data_pdf = clients;

        let rowsHtml = '';

        if (clients.length > 0) {

            $.each(clients, function(index, item) {

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

            table.find("tbody").append(rowsHtml);

            initializeDataTable(".table_assurer_droit", { responsive: { details: true } });
        } else {
            initializeDataTable(".table_assurer_droit", { responsive: { details: true } });
        }
    }

    function PDF_Facturation() 
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