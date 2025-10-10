$(document).ready(function() {

	// Fonction globale de chargement
	window.loadingTable = function(id, page, mode) {

		if (mode == 1) {

			$(page).empty();
			const $tableBody = $(id + " tbody");
			const colspan = $(id + " thead th").length;
		    $tableBody.empty().append(`
		    	<tr>
	                <td colspan="${colspan}" class="text-center text-danger py-3">
	                    <button class="btn btn-warning me-1" type="button" disabled>
						    <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
						    Chargement de données...
						</button>
	                </td>
	            </tr>
		    `);

		} else {

			$(id + " tbody").empty();
			$(page).empty();
		}		
	};

    window.renderDynamicTable = function(tableId, statutSelect = null, searchInputId, paginationId, rowRenderer, data) {
	    const $tableBody = $(tableId + " tbody");
	    const $pagination = $(paginationId);
	    const $searchInput = $(searchInputId);
	    const $statutSelect = $(statutSelect);

	    let filteredData = [...data];
	    let currentPage = 1;
	    const rowsPerPage = 10;

	    function renderTable() {
	        $tableBody.empty();

	        if (!filteredData.length) {
	            const colspan = $(tableId + " thead th").length;
	            $tableBody.append(`
	                <tr>
	                    <td colspan="${colspan}" class="text-center text-danger py-3">
	                        Aucun résultat trouvé
	                    </td>
	                </tr>
	            `);
	            $pagination.empty();
	            return;
	        }

	        const start = (currentPage - 1) * rowsPerPage;
	        const end = start + rowsPerPage;
	        const pageData = filteredData.slice(start, end);

	        $.each(pageData, function(index, item) {
	            const trHtml = rowRenderer(item, index, start);
	            $tableBody.append(trHtml);
	        });

	        renderPagination();
	    }

	    function renderPagination() {
	        $pagination.empty();
	        const pageCount = Math.ceil(filteredData.length / rowsPerPage);
	        if (pageCount <= 1) return;

	        const maxVisible = 5;
	        const createPageLi = (num, isActive = false) => {
	            const li = $(`<li class="page-item ${isActive ? 'active' : ''}"><a class="page-link" href="javascript:void(0)">${num}</a></li>`);
	            li.on("click", function() { currentPage = num; renderTable(); });
	            return li;
	        };

	        const prevLi = $(`<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="javascript:void(0)">Précédent</a></li>`);
	        prevLi.on("click", function() { if (currentPage > 1) { currentPage--; renderTable(); } });
	        $pagination.append(prevLi);

	        if (pageCount <= maxVisible) {
	            for (let i = 1; i <= pageCount; i++) {
	                $pagination.append(createPageLi(i, currentPage === i));
	            }
	        } else {
	            const visiblePages = [];
	            if (currentPage <= 3) visiblePages.push(1,2,3,'...',pageCount-1,pageCount);
	            else if (currentPage >= pageCount-2) visiblePages.push(1,2,'...',pageCount-2,pageCount-1,pageCount);
	            else visiblePages.push(1,'...',currentPage-1,currentPage,currentPage+1,'...',pageCount);

	            visiblePages.forEach(p => {
	                if (p === '...') $pagination.append(`<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`);
	                else $pagination.append(createPageLi(p, currentPage === p));
	            });
	        }

	        const nextLi = $(`<li class="page-item ${currentPage === pageCount ? 'disabled' : ''}"><a class="page-link" href="javascript:void(0)">Suivant</a></li>`);
	        nextLi.on("click", function() { if (currentPage < pageCount) { currentPage++; renderTable(); } });
	        $pagination.append(nextLi);
	    }

	    // Fonction unique pour appliquer les filtres
	    function applyFilters() {
	        const query = $searchInput.val().toLowerCase();
	        const statutValue = ($statutSelect && $statutSelect.length) ? $statutSelect.val() : "0";

	        filteredData = data.filter(item => {
	            // Recherche globale
	            const matchSearch = Object.values(item).some(val => String(val).toLowerCase().includes(query));
	            
	            // Filtrage par statut
	            let matchStatut = true;
	            if (statutValue !== "0") matchStatut = item.statut === statutValue;

	            return matchSearch && matchStatut;
	        });

	        currentPage = 1;
	        renderTable();
	    }

	    // Appliquer immédiatement
	    applyFilters();

	    // Événements
	    $searchInput.on("input", applyFilters);
	    if ($statutSelect && $statutSelect.length) $statutSelect.on("change", applyFilters);
	};

	// Fonction globale pour afficher un "modal custom"
	window.showDynamicActionModal = function(data = {}, buttons = [], size = "xs") {
	    const uniqueId = "customActionBox_" + Date.now();

	    // Définir les classes de taille possibles
	    const sizeClasses = {
            xs: "custom-box-xs",
            sm: "custom-box-sm",
            md: "custom-box-md",
            lg: "custom-box-lg",
            xl: "custom-box-xl",
            xxl: "custom-box-xxl",
            full: "custom-box-full"
        };

	    // Taille choisie (par défaut : md)
	    const sizeClass = sizeClasses[size] || sizeClasses.md;

	    const overlayHtml = `
	        <div class="custom-overlay" id="${uniqueId}">
	            <div class="custom-box ${sizeClass}">
	                <div class="d-flex flex-column gap-2 custom-box-body" id="${uniqueId}_body">
	                    <!-- Boutons dynamiques -->
	                </div>
	            </div>
	        </div>
	    `;

	    $('body').append(overlayHtml);

	    console.log('of');

	    const $overlay = $(`#${uniqueId}`);
	    const $boxBody = $(`#${uniqueId}_body`);

	    // Ajouter dynamiquement les boutons
	    buttons.forEach(btn => {
	        const $b = $(`
	            <a href="#" class="btn ${btn.class} d-flex align-items-center gap-2" data-id="${data.id}">
	                <i class="${btn.icon}"></i> ${btn.text}
	            </a>
	        `);
	        $boxBody.append($b);
	    });

	    // Clic à l’extérieur pour fermer
	    $overlay.on("click", function(e) {
	        if ($(e.target).is($overlay)) {
	            $overlay.remove();
	        }
	    });

	    return $overlay; // retourne l’overlay pour d’autres manipulations
	};

});
