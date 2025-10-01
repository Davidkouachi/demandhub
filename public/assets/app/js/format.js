$(document).ready(function () {

    window.formatDate = function (dateString) {

        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        return `${day}/${month}/${year}`; // Format as dd/mm/yyyy
    }

    window.formatDateHeure = function (dateString) {

        const date = new Date(dateString);
            
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} à ${hours}:${minutes}:${seconds}`;
    }

    window.calculAge = function (dateString) {
        const birthDate = new Date(dateString);
        const today = new Date();

        let ageYears = today.getFullYear() - birthDate.getFullYear();
        let monthDiff = today.getMonth() - birthDate.getMonth();
        let dayDiff = today.getDate() - birthDate.getDate();

        // Ajustement pour les mois et jours
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            ageYears--;
            monthDiff += 12; // Compte les mois restants de l'année précédente
        }

        // Ajustement des jours pour éviter des mois incomplets
        if (dayDiff < 0) {
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Dernier jour du mois précédent
            dayDiff += prevMonth.getDate();
            monthDiff--;
        }

        // Si l'âge est inférieur à un an, retourner les mois et jours
        if (ageYears === 0) {
            if (monthDiff === 0) {
                return `${dayDiff} jour${dayDiff > 1 ? 's' : ''}`; // Retourne les jours si < 1 mois
            }
            return `${monthDiff} mois${dayDiff > 0 ? ` et ${dayDiff} jour${dayDiff > 1 ? 's' : ''}` : ''}`;
        }

        // Retourne l'âge en années
        return `${ageYears} an${ageYears > 1 ? 's' : ''}`;
    };

    window.timeAgo = function (date) {
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now - past) / 1000);

        const intervals = [
            { label: "an", seconds: 31536000 },
            { label: "mois", seconds: 2592000 },
            { label: "semaine", seconds: 604800 },
            { label: "jour", seconds: 86400 },
            { label: "heure", seconds: 3600 },
            { label: "minute", seconds: 60 },
            { label: "seconde", seconds: 1 }
        ];

        for (const interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);
            if (count >= 1) {
                return `Il y a ${count} ${interval.label}${count > 1 ? "" : ""}`;
            }
        }
        return "À l'instant";
    }

    window.numberTel = function (id) {
        var inputElement = $(id); // Sélectionner l'élément avec son ID

        // Permettre uniquement les chiffres lors de la saisie
        inputElement.on('keypress', function (event) {
            const key = event.which || event.keyCode; // Récupérer le code de la touche
            // Vérifier si la touche n'est pas un chiffre ou les touches spéciales (backspace, delete, tab, etc.)
            if (
                (key < 48 || key > 57) && // Chiffres (0-9)
                key !== 8 && // Backspace
                key !== 46 && // Delete
                key !== 9 // Tab
            ) {
                event.preventDefault();
            }
        });

        // Écouter l'événement 'input' pour valider et nettoyer la saisie
        inputElement.on('input', function () {
            $(this).val($(this).val().replace(/[^0-9]/g, '')); // Remplacer tout ce qui n'est pas un chiffre
        });
    };

    window.numberTelLimit = function (id, int = 0) {
        var inputElement = $(id); // Sélectionner l'élément avec son ID

        inputElement.on('input', function () {
            let value = $(this).val(); // Récupérer la valeur actuelle
            if (value.length > int) {
                value = value.substring(0, int); // Limiter à 10 caractères
            }
            $(this).val(value); // Mettre à jour la valeur nettoyée et limitée
        });
    };

    window.formatPrice = function (prix) {
        // Remove all non-numeric characters except the comma
        prix = prix.replace(/[^\d,]/g, '');

        // Convert comma to dot for proper float conversion
        prix = prix.replace(',', '.');

        // Convert to float and round to the nearest whole number
        let number = Math.round(parseInt(prix));
        if (isNaN(number)) {
            return '';
        }

        // Format the number with dot as thousands separator
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    window.confirmAction = function (title = "Confirmation requise", text = "Cette opération est irréversible. Êtes-vous sûr de vouloir effectuer cette action ? .")
    {
        return Swal.fire({
            title: title,
            text: text,
            icon: "warning",
            showCancelButton: !0,
            customClass: {
                confirmButton: "btn btn-success me-2 mt-2",
                cancelButton: "btn btn-danger mt-2"
            },
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
            buttonsStyling: !1,
            showCloseButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false, // facultatif
        });
    }

    window.confirmActionAuto = function (title = "Confirmation requise", text = "Cette opération est irréversible. Êtes-vous sûr de vouloir effectuer cette action ? .", btn = "oui", color = "success")
    {
        return Swal.fire({
            title: title,
            text: text,
            icon: "warning",
            showCancelButton: false,
            confirmButtonText: btn,
            buttonsStyling: false,
            showCloseButton: false,
            customClass: {
                confirmButton: "btn btn-" + color + " me-2 mt-2",
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false, // facultatif
        });
    }

    window.OffClick = function (selector, fonction) {
        $(document).off('click', selector).on('click', selector, fonction);
    }

    window.OffChange = function (selector, fonction) {
        $(document).off('change', selector).on('change', selector, fonction);
    }

    window.overDisplay = function (mode) {

        if (mode === 1) {
            // Créer et afficher l'overlay si non présent
            if ($('#global-spinner-overlay').length === 0) {
                $('body').append(`
                    <div id="global-spinner-overlay" style="
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        background: rgba(255, 255, 255, 0);
                        z-index: 9999;
                        cursor: not-allowed;
                    "></div>
                `);
            }
        } else {
            // Supprimer l'overlay
            $('#global-spinner-overlay').remove();
        }
    }

    window.spinerButton = function (mode, buttonId, label) {
        const $button = $(buttonId);

        if (mode === 0) {
            overDisplay(1);
            $button.prop('disabled', true).html(`
                <i class="bx bx-hourglass bx-spin font-size-16 align-middle me-2"></i>
                ${label}...
            `);
        } else {
            overDisplay(0);
            $button.prop('disabled', false).html(label);
        }

        // <i class="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>
    }

    window.successCompteUser = function (id, message) {
        const $id = $(id);

        // $id.hide('slow');
        $id.empty();
        $id.append(`
            <div class="d-flex align-items-center justify-content-center" style="margin-top: -70px;">
                <div class="alert alert-success text-bg-success alert-dismissible" role="alert">
                    <i class="ri-information-line fs-14 text-white"></i>
                    <strong>${message}</strong>
                </div>
            </div>
        `);
        $id.show('slow');
    }

    window.divChargement = function (id, message) {
        const $id = $(id);

        if ($id.length === 0) {
            console.warn(`⚠️ Élément "${id}" introuvable dans le DOM.`);
            return;
        }

        $id.empty();
        $id.append(`
            <div class="d-flex align-items-center justify-content-center text-warning">
                <button class="btn btn-warning" type="button" disabled="">
                    <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    ${message}...
                </button>
            </div>
        `);
        $id.show('slow');
        // <div class="spinner-border text-warning m-2" role="status"></div>
        // <div class="d-flex align-items-center justify-content-center text-warning">
        //     <strong>...</strong>
        //     <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
        // </div>
    };

    window.preloader = function (type) {

        if (type === 0) {
            
            let preloader_ch = `
                <div id="preloader_ch">
                    <div class="spinner_preloader_ch">
                        <div></div><div></div><div></div><div></div>
                        <div></div><div></div><div></div><div></div>
                    </div>
                </div>
            `;
            $("body").append(preloader_ch);

        } else if (type === 1) {

            $("#preloader_ch").remove();

        }
        
    }

    window.modalAllClose = function(currentModal) {
        $('.modal').not(currentModal).remove();
    };

    window.verifPassword = function (motDePasse) {

        if (motDePasse.length < 8) {
            return false;
        }

        if (!/[A-Z]/.test(motDePasse)) {
            return false;
        }

        if (!/[a-z]/.test(motDePasse)) {
            return false;
        }

        if (!/\d/.test(motDePasse)) {
            return false;
        }

        return true;
    }

    window.verifEmail = function (email) {

        const test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!test.test(email)) {
            return false;
        }

        return true;
    }

});
