$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";

    initStart();

    function initStart() 
    {

        globalePage.append(Dashboard());
        
    }
});