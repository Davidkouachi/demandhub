function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convertit jours → ms
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = $.trim(ca[i]);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
}

$(document).ready(function () {
    if (!getCookie("cookies_accepted_sogemadetat")) {
        const $cookieBanner = $(`
            <div class="modal fade" tabindex="-1" id="modalBottom" data-bs-backdrop="static" data-bs-keyboard="false">
                <div class="modal-dialog modal-lg modal-dialog-bottom" role="document">
                    <div class="modal-content">
                        <div class="modal-body d-flex flex-column align-items-center justify-content-center">
                            <p class="text-center">
                                Afin d’assurer le bon fonctionnement de cette application et d’améliorer continuellement votre expérience utilisateur, nous utilisons des cookies internes. 
                                Ces cookies permettent de sécuriser les accès, de maintenir votre session active, et de recueillir des données techniques à des fins statistiques. 
                                Aucune information sensible ou à caractère personnel n’est exploitée.
                            </p>
                            <button id="acceptCookies" class="btn btn-round btn-primary mt-3" data-bs-dismiss="modal">
                                Ok, J’accepte
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `);

        // Ajouter le modal au DOM
        $('body').append($cookieBanner);

        // Afficher le modal
        const modal = new bootstrap.Modal(document.getElementById('modalBottom'));
        modal.show();

        // Gérer l’acceptation des cookies
        $(document).on('click', '#acceptCookies', function () {
            setCookie("cookies_accepted_sogemadetat", "true", 365);
            modal.hide();
            $('#modalBottom').remove();
        });
    }
});



