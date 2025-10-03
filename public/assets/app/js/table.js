$(document).ready(function() {

	window.TableData = function (id, columns, data) {
	    const $id = $(id);

	    if ($id.length) {
	        new gridjs.Grid({
			    columns: columns,
			    data: data,
			    pagination: { limit: 5 },
			    sort: true,
			    search: { enabled: true }, // ou juste `search: true`
			    language: {
			        search: {
			            placeholder: 'Rechercher dans le tableau...'
			        },
			        pagination: {
			            previous: 'Précédent',
			            next: 'Suivant',
			            format: (start, end, total) => `Affichage de ${start} à ${end} sur ${total} résultats`,
			            showing: 'Affichage de',
			            results: () => 'résultats',
			        },
			        noRecordsFound: 'Aucun résultat trouvé',
			        loading: 'Chargement...',
			    }
			}).render($id[0]);
	    }
	};

	// ----------------------------------------------------------------

	window.ListDemandeCours = function (id) {
	    const columns = [
		    { name: "ID", selector: row => row.id, formatter: e => gridjs.html('<span class="fw-semibold">' + e + '</span>') },
		    { name: "Nom", selector: row => row.nom },
		    { name: "Email", selector: row => row.email, formatter: e => gridjs.html('<a href="mailto:' + e + '">' + e + '</a>') },
		    { name: "Position", selector: row => row.position },
		    { name: "Company", selector: row => row.company },
		    {
		        name: "Actions",
		        width: "120px",
		        formatter: (cell, row) => gridjs.html(`
		            <a class="btn btn-soft-primary btn-sm btn-view-row" data-row='${JSON.stringify(row)}'>
		                <iconify-icon icon="solar:pen-2-broken" class="align-middle fs-18 rounded-pill"></iconify-icon>
		            </a>
		        `)
		    }
		];

	    const data = [
	        ["1", "Alice", "alice@example.com", "Software Engineer", "ABC Company", "United States"],
	        ["2", "Bob", "bob@example.com", "Product Manager", "XYZ Inc", "Canada"],
	        ["3", "Charlie", "charlie@example.com", "Data Analyst", "123 Corp", "Australia"],
	        ["4", "David", "david@example.com", "UI/UX Designer", "456 Ltd", "United Kingdom"],
	        ["5", "Eve", "eve@example.com", "Marketing Specialist", "789 Enterprises", "France"],
	        ["6", "Frank", "frank@example.com", "HR Manager", "ABC Company", "Germany"],
	        ["7", "Grace", "grace@example.com", "Financial Analyst", "XYZ Inc", "Japan"],
	        ["8", "Hannah", "hannah@example.com", "Sales Representative", "123 Corp", "Brazil"],
	        ["9", "Ian", "ian@example.com", "Software Developer", "456 Ltd", "India"],
	        ["10", "Jane", "jane@example.com", "Operations Manager", "789 Enterprises", "China"]
	    ];

	    TableData(id, columns, data);
	};

});