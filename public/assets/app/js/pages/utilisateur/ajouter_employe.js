$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";
    let filesArray = [];
    let maxFileSize = 5 * 1024 * 1024;   // 5 Mo
    let maxTotalSize = 20 * 1024 * 1024; // 20 Mo

    initStart();

    function initStart()  {

        globalePage.append(FormulaireUser());
        
    }
});