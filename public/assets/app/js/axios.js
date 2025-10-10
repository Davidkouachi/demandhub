$(document).ready(function() {

    window.reqAxios = async function (
        alerte = 1,
        urlReq,
        method = 'POST',
        data = {},
        btnId = null,
        btnLabel = null,
        fileInputId = null
    ) {
        try {
            // 🔄 Rafraîchir le token CSRF
            const csrfResponse = await axios.get(`${url}/refresh-csrf`);
            const csrfToken = csrfResponse.data.csrf_token;
            axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
            axios.defaults.withCredentials = true;

            // 🧩 Gestion des fichiers
            let hasFile = false;
            let formData = null;

            if (fileInputId) {
                const fileInput = $(`#${fileInputId}`)[0];
                if (fileInput && fileInput.files && fileInput.files.length > 0) {
                    hasFile = true;
                    formData = new FormData();

                    // Ajout des données classiques
                    for (const key in data) {
                        formData.append(key, data[key]);
                    }

                    // Ajout des fichiers
                    for (let i = 0; i < fileInput.files.length; i++) {
                        formData.append(`${fileInputId}[]`, fileInput.files[i]);
                    }
                }
            }

            // 📨 Requête principale
            const response = await axios({
                method,
                url: urlReq,
                data: hasFile ? formData : (data || {}),
                headers: hasFile ? { 'Content-Type': 'multipart/form-data' } : {},
            });

            const { status, data: res } = response;

            // 🔁 Restaure le bouton si présent
            if (btnId && btnLabel) spinerButton(1, btnId, btnLabel);

            // 🎯 Gestion des alertes uniquement si alerte == 1
            if (alerte === 1) {
                switch (status) {
                    case 200:
                    	showAlert("Succès", res.msg || "Opération réussie.", "success");
                        break;
                    case 201:
                        showAlert("Alerte", res.msg || "Processus interrompu.", "warning");
                        break;
                    case 204:
                        showAlert("Information", "Aucune donnée trouver.", "info");
                        break;
                    default:
                        // pas d’alerte pour d’autres statuts
                        break;
                }
            }

            return { success: true, status, data: res, msg: res?.msg || null };

        } catch (error) {
            // 🔁 Restaure le bouton si présent
            if (btnId && btnLabel) spinerButton(1, btnId, btnLabel);

            // ⚠️ Erreur réseau
            if (!error.response) {
                if (alerte === 1)
                    showAlert("Erreur réseau", "Impossible de contacter le serveur.", "error");
                return { success: false, status: 0, msg: "Erreur réseau" };
            }

            const { status, data } = error.response;
            const msg = data?.message || "Une erreur est survenue.";

            // 🧠 Gestion automatique du 401 (même sans alerte)
            if (status === 401) {
                // console.warn("Session expirée (401)");
                showAlert("Information", "Session expirée.", "info", function () {

                	const ModalDeco = `
	                    <div id="preloaderLogout" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;
	                        background: rgba(255,255,255,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center;">
	                        <div style="text-align: center;">
	                            <div class="spinner-border text-danger" role="status"></div>
	                            <p style="margin-top: 10px; font-weight: bold;">Rédirection en cours...</p>
	                        </div>
	                    </div>`;

	                // Ajoute le préloader
	                $('body').append(ModalDeco);

                    window.location.href = "/deconnecter";
                });
                return { success: false, status, msg };
            }

            // 🎯 Alertes uniquement si alerte == 1
            if (alerte === 1) {
                switch (status) {
                    case 400:
                        showAlert("Échec", msg, "warning");
                        break;
                    case 403:
                        showAlert("Interdit", msg || "Action non autorisée.", "error");
                        break;
                    case 404:
                        showAlert("Information", msg || "Aucune donnée trouvée.", "info");
                        break;
                    case 422:
                        if (data?.errors) {
                            const details = Object.values(data.errors).flat().join('<br>');
                            showAlert("Erreur de validation", details, "warning");
                        } else {
                            showAlert("Erreur de validation", msg, "warning");
                        }
                        break;
                    case 500:
                        showAlert("Erreur serveur", data.details || "Erreur interne du serveur.", "error");
                        break;
                    default:
                        showAlert("Erreur inattendue", msg || `Erreur ${status}`, "error");
                        break;
                }
            }

            return { success: false, status, msg, data };
        }
    };

});
