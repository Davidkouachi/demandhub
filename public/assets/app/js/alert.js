$(document).ready(function () {

    function deleteDivAlerteGlobal() {
        if ($('.div_alert_global').length > 0 && $.trim($('.div_alert_global').html()) !== '') {
            $('.div_alert_global').hide('slow', function () {
                $(this).empty();
            });
        }
    }

    window.showAlert = function (title, message, icon, callback = null) {

        deleteDivAlerteGlobal();

        Swal.fire({
            title: title,
            text: message,
            icon: icon,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
        }).then((result) => {
            if (result.isConfirmed && typeof callback === "function") {
                callback(); // ✅ Exécute la fonction passée
            }
        });
    };

    window.showAlert2 = function (id, message, color, btn = '0') {

        deleteDivAlerteGlobal();

        let icon;

        if (color === 'success') {
            icon = `<i class="mdi mdi-check-all label-icon"></i>`;
        } else if (color === 'info') {
            icon = `<i class="mdi mdi-alert-circle-outline label-icon"></i>`;
        } else if (color === 'warning') {
            icon = `<i class="mdi mdi-alert-outline label-icon"></i>`;
        } else if (color === 'danger') {
            icon = `<i class="mdi mdi-block-helper label-icon"></i>`;
        }

        const alertDiv = `
            <div class="alert alert-${color} alert-border-left alert-dismissible fade show" role="alert">
                ${icon}
                ${message}
                ${btn == '0' ? `` : `
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                `}
            </div>
        `;

        $(id).stop(true, true).hide().empty().append(alertDiv).fadeIn('slow');
    };

    window.showAlert3 = function (title, message, icon = 'info') {

        deleteDivAlerteGlobal();

        // 🎨 Couleurs et icônes selon le type d’alerte
        const alertStyles = {
            success: { color: 'bg-success text-white', icon: '✅' },
            danger: { color: 'bg-danger text-white', icon: '❌' },
            warning: { color: 'bg-warning text-dark', icon: '⚠️' },
            info: { color: 'bg-info text-dark', icon: 'ℹ️' },
        };

        // 🧩 Défaut si type inconnu
        const { color, icon: emoji } = alertStyles[icon] || { color: 'bg-primary text-white', icon: '🔔' };

        // 🔹 Identifiant unique du toast
        const toastId = `toast-${Date.now()}`;

        // 🔹 Création dynamique du toast Bootstrap
        const $toastContainer = $(`

            <div class="toast-container position-fixed end-0 top-0 p-3">
                <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header ${color}">
                        <div class="auth-logo me-auto">
                            <strong>🔔 ${title}</strong>
                        </div>
                        <button type="button" class="btn-close ${color.includes('text-dark') ? '' : 'btn-close-white'}" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        ${message}
                    </div>
                </div>
            </div>
        `);

        // 🔹 Ajout au body
        $('body').append($toastContainer);

        // 🔹 Initialisation du toast Bootstrap
        const $toast = $toastContainer.find('.toast');
        const toastInstance = new bootstrap.Toast($toast[0], { delay: 2000 });

        // 🔹 Suppression propre après fermeture
        $toast.on('hidden.bs.toast', function () {
            $toastContainer.fadeOut(300, function () {
                $(this).remove();
            });
        });

        // 🔹 Animation d’apparition + affichage
        $toastContainer.hide().fadeIn(200, function () {
            toastInstance.show();
        });
    };


});
