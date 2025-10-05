$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";

    initStart();

    function initStart()  {

        globalePage.append(FomulaireDemdande());
        select_categories('#categorie');
        renderPreviewFiles();
        
    }

    // function renderPreviewFiles() {

    //     var filesArray = [];

    //     $('#piece_jointe').on('change', function(e) {
    //         var newFiles = e.target.files;
    //         for (var i = 0; i < newFiles.length; i++) {
    //             filesArray.push(newFiles[i]);
    //         }
    //         renderPreview();
    //     });

    //     function getFileIcon(file) {
    //         var ext = file.name.split('.').pop().toLowerCase();
    //         if(['jpg','jpeg','png','gif'].includes(ext)) return '🖼️';
    //         if(['pdf'].includes(ext)) return '📄';
    //         if(['xls','xlsx'].includes(ext)) return '📊';
    //         if(['doc','docx'].includes(ext)) return '📃';
    //         return '📁';
    //     }

    //     function renderPreview() {
    //         var $preview = $('#preview_files');
    //         $preview.empty();

    //         $.each(filesArray, function(index, file) {
    //             var $col = $('<div class="col-md-2 col-sm-3 col-4 d-flex"></div>'); // d-flex pour égaliser hauteur des colonnes

    //             var $card = $('<div class="file-card w-100"></div>');

    //             var $icon = $('<div class="file-icon"></div>').text(getFileIcon(file));
    //             var $name = $('<div class="file-name"></div>').text(file.name);

    //             var $btn = $('<button type="button" class="btn btn-sm btn-outline-danger btn-remove rounded-pill">✖</button>');
    //             $btn.on('click', function() {
    //                 filesArray.splice(index, 1);
    //                 renderPreview();
    //             });

    //             $card.append($btn, $icon, $name);
    //             $col.append($card);
    //             $preview.append($col);
    //         });

    //         // Réassigner les fichiers au input pour l'envoi
    //         var dataTransfer = new DataTransfer();
    //         $.each(filesArray, function(_, file) {
    //             dataTransfer.items.add(file);
    //         });
    //         $('#piece_jointe')[0].files = dataTransfer.files;
    //     }

    // }

function renderPreviewFiles() {
    var filesArray = [];

    $('#piece_jointe').on('change', function (e) {
        var newFiles = e.target.files;
        for (var i = 0; i < newFiles.length; i++) {
            filesArray.push(newFiles[i]);
        }
        renderPreview();
    });

    function getFileType(file) {
        var ext = file.name.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
        if (['pdf'].includes(ext)) return 'pdf';
        if (['xls', 'xlsx'].includes(ext)) return 'excel';
        if (['doc', 'docx'].includes(ext)) return 'word';
        return 'other';
    }

    function renderPreview() {
        var $preview = $('#preview_files');
        $preview.empty();

        $.each(filesArray, function (index, file) {
            var fileType = getFileType(file);

            var $col = $('<div class="col-md-3 col-sm-4 col-6 mb-3"></div>');
            var $card = $('<div class="file-card position-relative text-center p-2 border rounded shadow-sm"></div>');
            var $previewZone = $('<div class="file-preview"></div>');
            var $name = $('<div class="file-name small text-truncate"></div>').text(file.name);

            const ext = file.name.split('.').pop().toLowerCase();

            // 🔍 Prévisualisation selon type
            if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
                const $img = $('<img style="max-width:100%; max-height:100%; object-fit:cover;">');
                const reader = new FileReader();
                reader.onload = e => $img.attr('src', e.target.result);
                reader.readAsDataURL(file);
                $previewZone.append($img);
            }
            else if (ext === 'pdf') {
                const $iframe = $('<iframe style="width:100%; height:100%; border:none;"></iframe>');
                const reader = new FileReader();
                reader.onload = e => $iframe.attr('src', e.target.result);
                reader.readAsDataURL(file);
                $previewZone.append($iframe);
            }
            else if (['xls', 'xlsx'].includes(ext)) {
                const $excelPreview = $('<div class="text-center w-100"><b>📊 Aperçu Excel</b><br><small>Chargement...</small></div>');
                $previewZone.append($excelPreview);

                const reader = new FileReader();
                reader.onload = function(e) {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[firstSheetName];
                    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                    // On affiche les 3 premières lignes
                    let previewHTML = `<table class="table table-sm table-bordered mt-1 mb-0" style="font-size:11px">`;
                    rows.slice(0, 3).forEach(row => {
                        previewHTML += `<tr>${row.map(cell => `<td>${cell ?? ''}</td>`).join('')}</tr>`;
                    });
                    previewHTML += `</table>`;
                    $excelPreview.html(previewHTML);
                };
                reader.readAsArrayBuffer(file);
            }
            else {
                $previewZone.text('📁 ' + file.name);
            }
            
            // ❌ Bouton de suppression
            var $btn = $('<button type="button" class="btn btn-sm btn-outline-danger btn-remove rounded-pill position-absolute top-0 end-0 m-1">✖</button>');
            $btn.on('click', function () {
                filesArray.splice(index, 1);
                renderPreview();
            });

            $card.append($btn, $previewZone, $name);
            $col.append($card);
            $preview.append($col);
        });

        // 🔁 Réassigner les fichiers au input
        var dataTransfer = new DataTransfer();
        $.each(filesArray, function (_, file) {
            dataTransfer.items.add(file);
        });
        $('#piece_jointe')[0].files = dataTransfer.files;
    }
}



});
