$(document).ready(function() {

    window.reqAxios = async function (alerte, urlReq, method = 'POST', data = {}, btnId = null, btnLabel = null, fileInputId = null) {
        try {
            // 🔄 Rafraîchir le token CSRF
            const csrfResponse = await axios.get(`${url}/refresh-csrf`);
            const csrfToken = csrfResponse.data.csrf_token;
            axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

            // 🧩 Vérifie si un input file est fourni et contient des fichiers
            let hasFile = false;
            let formData = null;

            if (fileInputId) {
                const fileInput = $(`#${fileInputId}`)[0];
                console.log(fileInput);
                if (fileInput && fileInput.files && fileInput.files.length > 0) {
                    hasFile = true;
                    formData = new FormData();

                    // Ajoute les données standards
                    for (const key in data) {
                    	console.log(key);
                        formData.append(key, data[key]);
                    }

                    // Ajoute les fichiers
                    for (let i = 0; i < fileInput.files.length; i++) {
                    	console.log(fileInput.files[i]);
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

            if (btnId && btnLabel) {
                spinerButton(1, btnId, btnLabel);
            }

            if (alerte == 1) {
            	// ✅ Gestion des statuts standards
	            switch (status) {
	                case 200:
	                    showAlert("Succès", res.msg || "Opération réussie.", "success");
	                    break;
	                case 201:
	                    showAlert("Succès", res.msg || "Opération réussie.", "success");
	                    break;
	                case 204:
	                    showAlert("Information", "Aucune donnée à afficher.", "info");
	                    break;
	                default:
	                    // showAlert("Information", res.msg || "Opération effectuée.", "info");
	                    break;
	            }
            }
	            
            return { success: true, status, data: res };

        } catch (error) {
            if (btnId && btnLabel) {
                spinerButton(1, btnId, btnLabel);
            }

            if (alerte == 1) {

            	if (!error.response) {
	                showAlert("Erreur réseau", "Impossible de contacter le serveur.", "error");
	                return { success: false, status: 0, message: "Erreur réseau" };
	            }

	            const { status, data } = error.response;
	            const msg = data?.message || "Une erreur est survenue.";

	            // ⚠️ Gestion détaillée des erreurs
	            switch (status) {
	                case 400:
	                    showAlert("Échec", msg, "warning");
	                    break;
	                case 401:
	                    showAlert("Non authentifié", msg || "Session expirée.", "warning");
	                    break;
	                case 403:
	                    showAlert("Interdit", msg || "Action non autorisée.", "error");
	                    break;
	                case 404:
	                    showAlert("Information", msg || "Aucune données n'à été trouver.", "info");
	                    break;
	                case 422:
	                    if (data.errors) {
	                        const details = Object.values(data.errors).flat().join('<br>');
	                        showAlert("Erreur de validation", details, "warning");
	                    } else {
	                        showAlert("Erreur de validation", msg, "warning");
	                    }
	                    break;
	                case 500:
	                    showAlert("Erreur serveur", msg || "Erreur interne du serveur.", "error");
	                    break;
	                default:
	                    showAlert("Erreur inattendue", msg || `Erreur ${status}`, "error");
	                    break;
	            }
            }
	            
            // console.error("⚠️ Erreur Axios :", error.response);
            return { success: false, status, data };
        }
    };

});
