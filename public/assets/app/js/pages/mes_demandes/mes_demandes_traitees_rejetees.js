$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";

    let dataTable = [];

    initStart();

    function initStart()  {

        globalePage.append(ListeMesDemdandesTraiter());
        selectRefreshId('#statut');
        tableListe();

        $(document).on("click", ".btnActualiser", function() {
            tableListe();
        });
 
    }

    function tableListe() {
        
        $('#tableDemandeTraiter tbody').empty();

        loadingTable('#tableDemandeTraiter', '#pagination', 1);

        const urlAxios = `${url}/api/ListeMesDemandes/${user.id}/0/1`;

        reqAxios(0, urlAxios,'GET')
            .then(res => {

                loadingTable('#tableDemandeTraiter', '#pagination', 0);
                dataTable = res.data.data ?? []; 
                renderDynamicTable("#tableDemandeTraiter", '#statut', "#searchInput", "#pagination", agentRowRenderer, dataTable);

            }); 

        function agentRowRenderer(item, index, start) {
            return $(`
                <tr data-id="${item.id}" data-statut="${item.statut}" style="cursor: pointer;">
                    <td class="text-center" >${start + index + 1}</td>
                    <td class="text-center" >
                        <span class="text-dark fw-medium fs-15">${item.uid}</span>
                    </td>
                    <td class="text-center" >${item.categorie}</td>
                    <td class="text-center" >${item.service}</td>
                    <td class="text-center">
                        <span class="badge 
                            ${item.statut === 'traitee'    ? 'bg-success' :
                              item.statut === 'rejete'     ? 'bg-danger' :
                              'bg-secondary-subtle text-secondary'} 
                            py-1 px-2 fs-13">
                            ${item.statut === 'traitee'    ? 'Tratée' :
                              item.statut === 'rejete'     ? 'Rejétée' :
                              item.statut}
                        </span>
                    </td>
                </tr>
            `);
        }
    }


});

