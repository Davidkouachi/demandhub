$(document).ready(function () {

    window.showAlert = function (title, message, icon) {

        if ($('.div_alert_global').length > 0 && $.trim($('.div_alert_global').html()) !== '') {
            $('.div_alert_global').hide('slow', function () {
                $(this).empty();
            });
        }

        Swal.fire({
            title: title,
            text: message,
            icon: icon,
        });
    }

    window.showAlert2 = function (id, message, color, btn = '0') {

        if ($('.div_alert_global').length > 0 && $.trim($('.div_alert_global').html()) !== '') {
            $('.div_alert_global').hide('slow', function () {
                $(this).empty();
            });
        }

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

});
