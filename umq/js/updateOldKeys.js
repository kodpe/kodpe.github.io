
function updateOldKeys(storeName, oldKey, newKey) {
    // Ouvrir une base de données
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = function (event) {
        const db = event.target.result;

        // Démarrer une transaction en lecture/écriture
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        // Lire l'entrée avec l'ancienne clé
        const getRequest = store.get(oldKey);

        getRequest.onsuccess = function () {
            const data = getRequest.result;

            if (data) {
                data.id = "newKey"; // Remplacez 'id' par le nom de la propriété clé de vos données
                // Ajouter une nouvelle entrée avec la nouvelle clé
                const putRequest = store.put(data);

                putRequest.onsuccess = function () {
                    console.log("Nouvelle clé ajoutée avec succès.");

                    // Supprimer l'ancienne entrée
                    const deleteRequest = store.delete(oldKey);

                    deleteRequest.onsuccess = function () {
                        console.log("Ancienne clé supprimée.");
                    };

                    deleteRequest.onerror = function () {
                        console.error("Erreur lors de la suppression de l'ancienne clé.");
                    };
                };

                putRequest.onerror = function () {
                    console.error("Erreur lors de l'ajout de la nouvelle clé.");
                };
            } else {
                console.warn("Aucune donnée trouvée pour la clé spécifiée.");
            }
        };

        getRequest.onerror = function () {
            console.error("Erreur lors de la lecture de l'ancienne clé.");
        };

        transaction.oncomplete = function () {
            console.log("Transaction terminée.");
        };

        transaction.onerror = function () {
            console.error("Erreur dans la transaction.");
        };
    };

    request.onerror = function () {
        console.error("Erreur lors de l'ouverture de la base de données.");
    };

}