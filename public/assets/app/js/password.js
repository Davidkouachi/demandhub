$(document).ready(function () { 

    $('#UpdatePassword').on('click', function() {

        const modalBody = `
            <div class="modal fade zoom" aria-hidden="false" tabindex="-1" id="modalPassword">
                <div class="modal-dialog modal-sm" role="document">
                    <div class="modal-content">
                        <div class="modal-header" style="background: #00008B;">
                            <h5 class="modal-title text-white">Sécurité</h5>
                            <a href="#" class="close text-white" data-bs-dismiss="modal" aria-label="Close">
                                <em class="icon ni ni-cross"></em>
                            </a>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <div class="form-label-group">
                                    <label class="form-label" for="password">Nouveau mot de passe</label>
                                </div>
                                <div class="form-control-wrap">
                                    <input type="password" class="form-control form-control-lg" id="password1" placeholder="Entrer votre mot de passe">
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="form-label-group">
                                    <label class="form-label" for="password">Confirmer le nouveau mot de passe</label>
                                </div>
                                <div class="form-control-wrap">
                                    <input type="password" class="form-control form-control-lg" id="password2" placeholder="Entrer votre mot de passe">
                                </div>
                            </div>
                            <div class="form-group">
                                <a id="btn_updatePassword" class="btn btn-md btn-outline-success btn-block">
                                    Enregistrer
                                </a>
                            </div>
                        </div>
                        <div class="modal-footer bg-light"><span class="sub-text">Mise à jour du mot de passe</span></div>
                    </div>
                </div>
            </div>
        `;

        $('body').append(modalBody);

        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalPassword'));
        modal.show();

        $("#btn_updatePassword").on("click", function (event) {
            event.preventDefault();

            let mdp1 = $("#password1");
            let mdp2 = $("#password2");

            if (!mdp1.val().trim() || !mdp2.val().trim() ) {
                showAlert2("Alert","Veuillez remplir tous les champs obligatoire s'il vous plaît !!!","warning");
                return false;
            }

            if (mdp1.val().trim() != mdp2.val().trim() ) {
                showAlert2("Alert","Mot de Passe incorrect","info");
                return false;
            }

            const modalElement = document.getElementById('modalPassword');
            const modalInstance = bootstrap.Modal.getInstance(modalElement); // ou getOrCreateInstance
            modalInstance.hide(); // Ferme le modal

            // Optionnel : Nettoyage après fermeture
            modalElement.addEventListener('hidden.bs.modal', function () {
                modalElement.remove(); // Supprime le HTML du DOM
            });

            // Ajouter le préchargeur
            preloader();

            $.ajax({
            url: $('#url').attr('content') + "/refresh-csrf",
            method: "GET",
            success: function (response_crsf) {
                $('meta[name="csrf-token"]').attr("content", response_crsf.csrf_token);

                $.ajax({
                    url: $('#url').attr('content') + "/api/update_password",
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": response_crsf.csrf_token,
                    },
                    data: {
                        mdp1: mdp1.val().trim(),
                        login: $("#login").val().trim(),
                    },
                    success: function (response) {
                        $("#preloader_ch").remove();

                        if (response.success) {

                            showAlert("Succès", "Opération éffectuée", "success");

                        } else if (response.error) {

                            showAlert("Alert", "Echec de l\'opération", "error");
                            console.log(response.message);
                        }
                    },
                    error: function () {
                        $("#preloader_ch").remove();
                        showAlert("Erreur", "Erreur est survenu, veuillez réessayer.", "error");
                        console.log(response.message);
                    },
                });

                },
                error: function () {
                    $("#preloader_ch").remove();
                    showAlert("Alert", "Une erreur est survenue ", "error");
                },
            });
        });

    });

});