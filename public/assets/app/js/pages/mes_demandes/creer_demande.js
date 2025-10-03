$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";

    initStart();

    function initStart()  {

        globalePage.append(FomulaireDemdande());
        select_categories('#categorie');
        renderPreviewFiles();
        
    }

    function renderPreviewFiles() {

        var filesArray = [];

        $('#piece_jointe').on('change', function(e) {
            var newFiles = e.target.files;
            for (var i = 0; i < newFiles.length; i++) {
                filesArray.push(newFiles[i]);
            }
            renderPreview();
        });

        function getFileIcon(file) {
            var ext = file.name.split('.').pop().toLowerCase();
            if(['jpg','jpeg','png','gif'].includes(ext)) return '🖼️';
            if(['pdf'].includes(ext)) return '📄';
            if(['xls','xlsx'].includes(ext)) return '📊';
            if(['doc','docx'].includes(ext)) return '📃';
            return '📁';
        }

        function renderPreview() {
            var $preview = $('#preview_files');
            $preview.empty();

            $.each(filesArray, function(index, file) {
                var $col = $('<div class="col-md-2 col-sm-3 col-4 d-flex"></div>'); // d-flex pour égaliser hauteur des colonnes

                var $card = $('<div class="file-card w-100"></div>');

                var $icon = $('<div class="file-icon"></div>').text(getFileIcon(file));
                var $name = $('<div class="file-name"></div>').text(file.name);

                var $btn = $('<button type="button" class="btn btn-sm btn-outline-danger btn-remove rounded-pill">✖</button>');
                $btn.on('click', function() {
                    filesArray.splice(index, 1);
                    renderPreview();
                });

                $card.append($btn, $icon, $name);
                $col.append($card);
                $preview.append($col);
            });

            // Réassigner les fichiers au input pour l'envoi
            var dataTransfer = new DataTransfer();
            $.each(filesArray, function(_, file) {
                dataTransfer.items.add(file);
            });
            $('#piece_jointe')[0].files = dataTransfer.files;
        }

    }
});
