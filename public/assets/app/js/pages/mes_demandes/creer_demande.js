$(document).ready(function() {
    const globalePage = $('.contenuGlobal');
    
    let msg = "Une erreur est survenue";
    let filesArray = [];
    let maxFileSize = 5 * 1024 * 1024;   // 5 Mo
    let maxTotalSize = 20 * 1024 * 1024; // 20 Mo

    initStart();

    function initStart()  {

        globalePage.append(FomulaireDemdande());
        select_categories('#categorie_id');
        renderPreviewFiles();
        
    }

    function renderPreviewFiles() {

        const $input = $('#piece_jointe');
        const $fileChosen = $('#file-chosen');

        // 🔁 Gestion du changement de fichiers
        $input.on('change', function (e) {
            var newFiles = Array.from(e.target.files);
            var rejectedFiles = [];
            var totalSize = filesArray.reduce((sum, f) => sum + f.size, 0);

            const files = this.files;
            if (files.length === 0) {
                $fileChosen.text("Aucun fichier sélectionné");
            } else if (files.length === 1) {
                $fileChosen.text(files[0].name);
            } else {
                $fileChosen.text(files.length + " fichiers sélectionnés");
            }

            newFiles.forEach(file => {
                // 🔁 Vérifie si le fichier existe déjà dans filesArray
                var exists = filesArray.some(f => f.name === file.name && f.size === file.size);
                if (exists) {
                    rejectedFiles.push(file.name + " (déjà sélectionné)");
                    return; // passe au fichier suivant
                }

                // ✅ Le reste de ton code reste inchangé
                if (file.size > maxFileSize) {
                    rejectedFiles.push(file.name + " (=" + (file.size / 1024 / 1024).toFixed(2) + " Mo)");
                } else {
                    totalSize += file.size;
                    if (totalSize <= maxTotalSize) {
                        filesArray.push(file);
                    } else {
                        rejectedFiles.push(file.name + " (dépasse la limite totale)");
                        totalSize -= file.size;
                    }
                }
            });

            if (rejectedFiles.length > 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Certains fichiers ont été ignorés ⚠️',
                    html: `
                        <b>Les fichiers suivants n'ont pas été ajoutés :</b>
                        <ul style="text-align:left; margin-top:8px">
                            ${rejectedFiles.map(name => `<li>${name}</li>`).join('')}
                        </ul>
                        <p class="mt-2 text-danger">
                            Limite individuelle : <b>5 Mo</b><br>
                            Limite totale : <b>20 Mo</b>
                        </p>
                    `,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#d33'
                });
                return;
            }

            renderPreview();
        });

        // 🧩 Détection du type de fichier
        function getFileType(file) {
            var ext = file.name.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
            if (['pdf'].includes(ext)) return 'pdf';
            if (['xls', 'xlsx'].includes(ext)) return 'excel';
            if (['doc', 'docx'].includes(ext)) return 'word';
            return 'other';
        }

        // 📏 Convertit les octets en Mo lisibles
        function formatBytes(bytes) {
            return (bytes / (1024 * 1024)).toFixed(2) + " Mo";
        }

        // 🎨 Rafraîchit l’aperçu
        function renderPreview() {
            var $preview = $('#preview_files');
            $preview.empty();

            $.each(filesArray, function (index, file) {
                var fileType = getFileType(file);
                var $col = $('<div class="col-lg-2 col-md-3 col-sm-4 col-6 mb-3"></div>');
                var $card = $('<div class="file-card position-relative text-center p-2 border rounded shadow-sm"></div>');
                var $previewZone = $('<div class="file-preview"></div>');
                var $name = $('<div class="file-name small text-truncate"></div>').text(file.name);

                const ext = file.name.split('.').pop().toLowerCase();

                // 👁️ Prévisualisation selon le type
                if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
                    const $img = $('<img style="max-width:100%; max-height:100%; object-fit:cover;">');
                    const reader = new FileReader();
                    reader.onload = e => $img.attr('src', e.target.result);
                    reader.readAsDataURL(file);
                    $previewZone.append($img);
                } else if (ext === 'pdf') {
                    // const $iframe = $('<iframe style="width:100%; height:100%; border:none;"></iframe>');
                    // const reader = new FileReader();
                    // reader.onload = e => $iframe.attr('src', e.target.result);
                    // reader.readAsDataURL(file);
                    // $previewZone.append($iframe);

                    const blobURL = URL.createObjectURL(file);
                    const $embed = $('<embed type="application/pdf" style="width:100%; height:200px;">');
                    $embed.attr('src', blobURL);
                    $previewZone.append($embed);

                } else if (['xls', 'xlsx'].includes(ext)) {
                    const $excelPreview = $('<div class="text-center w-100"><b>📊 Aperçu Excel</b><br><small>Chargement...</small></div>');
                    $previewZone.append($excelPreview);
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const firstSheetName = workbook.SheetNames[0];
                        const sheet = workbook.Sheets[firstSheetName];
                        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                        let previewHTML = `<table class="table table-sm table-bordered mt-1 mb-0" style="font-size:11px">`;
                        rows.slice(0, 3).forEach(row => {
                            previewHTML += `<tr>${row.map(cell => `<td>${cell ?? ''}</td>`).join('')}</tr>`;
                        });
                        previewHTML += `</table>`;
                        $excelPreview.html(previewHTML);
                    };
                    reader.readAsArrayBuffer(file);
                } else {
                    $previewZone.text('📁 ' + file.name);
                }

                // ❌ Suppression du fichier
                var $btn = $('<button type="button" class="btn btn-sm btn-outline-danger btn-remove rounded-pill position-absolute top-0 end-0 m-1">✖</button>');
                $btn.on('click', function () {
                    filesArray.splice(index, 1);
                    renderPreview();
                });

                $card.append($btn, $previewZone, $name);
                $col.append($card);
                $preview.append($col);
            });

            // 🔹 Met à jour le texte $fileChosen
            if (filesArray.length === 0) {
                $fileChosen.text("Aucun fichier sélectionné");
            } else if (filesArray.length === 1) {
                $fileChosen.text(filesArray[0].name);
            } else {
                $fileChosen.text(filesArray.length + " fichiers sélectionnés");
            }

            // 📊 Calcul de la taille totale
            // ✅ Gestion de la taille totale uniquement si au moins 1 fichier
            if (filesArray.length > 0) {
                var totalSize = filesArray.reduce((sum, f) => sum + f.size, 0);
                var percent = (totalSize / maxTotalSize) * 100;
                var isTooLarge = totalSize > maxTotalSize;

                var $sizeInfo = $(`
                    <div class="col-12 mt-2">
                        <div class="progress" style="height: 8px;">
                            <div class="progress-bar ${isTooLarge ? 'bg-danger' : 'bg-primary'}" 
                                role="progressbar" style="width: ${Math.min(percent, 100)}%"></div>
                        </div>
                        <div class="text-center small mt-1 ${isTooLarge ? 'text-danger fw-bold' : ''}">
                            Taille totale des fichiers: <b>${formatBytes(totalSize)}</b> / 20.00 Mo
                            ${isTooLarge ? '<br>⚠️ Trop volumineux ! Supprimez des fichiers avant d’envoyer.' : ''}
                        </div>
                    </div>
                `);

                $preview.append($sizeInfo);
            }

            // 🧩 Réassigner les fichiers à l’input
            var dataTransfer = new DataTransfer();
            $.each(filesArray, function (_, file) {
                dataTransfer.items.add(file);
            });
            $input[0].files = dataTransfer.files;
        }

    }

    $('#formDemande').on('submit', function(e) {
        e.preventDefault();

        const btnId = $('.btnForm');
        const btnLabel = $('.btnForm').text(); 

        var totalSize = filesArray.reduce((sum, f) => sum + f.size, 0);

        if (totalSize > maxTotalSize / 5) {

            Swal.fire({
                icon: 'warning',
                title: 'Envoi impossible',
                html: `
                    <p>La taille totale des fichiers dépasse la limite autorisée de <b>20 Mo</b>.</p>
                    <p>Veuillez retirer certains fichiers avant de soumettre le formulaire.</p>
                `,
                confirmButtonColor: '#d33'
            });

            const text = 'La taille totale des fichiers dépasse la limite autorisée de 20 mo, Veuillez retirer certains fichiers avant de soumettre le formulaire.';

            if (text !== "") {
                voixLocalIA(text);
            }

            return;
        }

        const objet = $('#objet');
        const categorie_id = $('#categorie_id');
        const description = $('#description');
        const piece_jointe = $('#piece_jointe');
        const validation = $('#validation');

        if (!objet.val().trim() || !categorie_id.val().trim() || !description.val().trim()) {

            showAlert(
                "Attention", 
                "Veuillez bien remplir tous les champs s'il vous plaît", 
                "info"
            );

            return;
        }

        if (!validation.is(':checked')) {

            showAlert(
                "Confirmation requise ⚠️", 
                "Vous devez confirmer que toutes les informations renseignées sont exactes.", 
                "warning"
            );

            return;
        }

        const data = {
            objet: $('#objet').val(),
            categorie_id: $('#categorie_id').val(),
            description: $('#description').val(),
            validation: validation.is(':checked') ? 1 : 0,
        };

        spinerButton(0, btnId, 'Vérification en cours');

        const urlAxios = `${url}/api/InsertDemandes/${user.id}`;

        reqAxios(1, urlAxios,'POST',data,btnId,btnLabel,'piece_jointe')
            .then(res => {
                if (res.success) {
                    resetForm();
                }
            });   
    });

    function resetForm() {
        // Réinitialise les champs texte
        $('#objet').val(null);
        $('#categorie_id').val(null).trigger('change.select2');
        $('#description').val(null);

        // Réinitialise la case à cocher ou le switch
        $('#validation').prop('checked', false);

        // Réinitialise le champ de fichier
        const $fileInput = $('#piece_jointe');
        $fileInput.val(null);

        // Vide le tableau global des fichiers sélectionnés
        if (typeof filesArray !== 'undefined') {
            filesArray = [];
        }

        // Supprime tous les aperçus
        $('#preview_files').empty();

        // Réinitialise le texte d’indication de fichier
        $('#file-chosen').text('Aucun fichier sélectionné');

        // Réinitialise la barre de progression ou les messages éventuels
        $('.progress-bar').css('width', '0%').removeClass('bg-danger').addClass('bg-primary');
        $('.progress-bar').parent().next('.text-center').remove();
    }

});
