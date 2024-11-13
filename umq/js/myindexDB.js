// Ouvrir (ou créer) une base de données
const request = indexedDB.open("ulmedDB", 1);
let db = {};

// Créer l'object store si la base de données est créée ou mise à jour
request.onupgradeneeded = (event) => {
    const db = event.target.result;
    // Créer un object store avec une clé primaire (ici "name")
    let objectStore = {};
    try {
        objectStore = db.createObjectStore("domains", { keyPath: "name" });
    } catch (e) {
        console.warn("indexedDB: ", e);
    }
    try {
        objectStore.transaction.oncomplete = () => {
            const store = db.transaction("domains", "readwrite").objectStore("domains");
            store.add({ name: "Anatomy", nbAnswered: 0, nbCorrectAnswers: 0, rowRecord: 0, currentRow: 0, islastAnswerCorrect: false, gameWinrateRecord: 0, nbClassicGames: 0, nbMarathonGames: 0 });
            store.add({ name: "Physiology", nbAnswered: 0, nbCorrectAnswers: 0, rowRecord: 0, currentRow: 0, islastAnswerCorrect: false, gameWinrateRecord: 0, nbClassicGames: 0, nbMarathonGames: 0 });
            store.add({ name: "Pathology", nbAnswered: 0, nbCorrectAnswers: 0, rowRecord: 0, currentRow: 0, islastAnswerCorrect: false, gameWinrateRecord: 0, nbClassicGames: 0, nbMarathonGames: 0 });
            store.add({ name: "Surgery", nbAnswered: 0, nbCorrectAnswers: 0, rowRecord: 0, currentRow: 0, islastAnswerCorrect: false, gameWinrateRecord: 0, nbClassicGames: 0, nbMarathonGames: 0 });
            store.add({ name: "Pharmacology", nbAnswered: 0, nbCorrectAnswers: 0, rowRecord: 0, currentRow: 0, islastAnswerCorrect: false, gameWinrateRecord: 0, nbClassicGames: 0, nbMarathonGames: 0 });
            store.add({ name: "Genetics", nbAnswered: 0, nbCorrectAnswers: 0, rowRecord: 0, currentRow: 0, islastAnswerCorrect: false, gameWinrateRecord: 0, nbClassicGames: 0, nbMarathonGames: 0 });
            store.add({ name: "Neurology", nbAnswered: 0, nbCorrectAnswers: 0, rowRecord: 0, currentRow: 0, islastAnswerCorrect: false, gameWinrateRecord: 0, nbClassicGames: 0, nbMarathonGames: 0 });
            store.add({ name: "Epidemiology", nbAnswered: 0, nbCorrectAnswers: 0, rowRecord: 0, currentRow: 0, islastAnswerCorrect: false, gameWinrateRecord: 0, nbClassicGames: 0, nbMarathonGames: 0 });
            store.add({ name: "Endocrinology", nbAnswered: 0, nbCorrectAnswers: 0, rowRecord: 0, currentRow: 0, islastAnswerCorrect: false, gameWinrateRecord: 0, nbClassicGames: 0, nbMarathonGames: 0 });
            store.add({ name: "Miscellaneous", nbAnswered: 0, nbCorrectAnswers: 0, rowRecord: 0, currentRow: 0, islastAnswerCorrect: false, gameWinrateRecord: 0, nbClassicGames: 0, nbMarathonGames: 0 });
            store.add({ name: "Oncology", nbAnswered: 0, nbCorrectAnswers: 0, rowRecord: 0, currentRow: 0, islastAnswerCorrect: false, gameWinrateRecord: 0, nbClassicGames: 0, nbMarathonGames: 0 });
            store.add({ name: "Cardiology", nbAnswered: 0, nbCorrectAnswers: 0, rowRecord: 0, currentRow: 0, islastAnswerCorrect: false, gameWinrateRecord: 0, nbClassicGames: 0, nbMarathonGames: 0 });
            store.add({ name: "TOTAL", nbAnswered: 0, nbCorrectAnswers: 0, rowRecord: 0, currentRow: 0, islastAnswerCorrect: false, gameWinrateRecord: 0, nbClassicGames: 0, nbMarathonGames: 0 });
        };
    } catch (e) {
        console.warn("indexedDB: ", e);
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Base de données ouverte avec succès.");
    console.log(db);
}

request.onerror = (event) => {
    console.error("Erreur lors de l'ouverture de la base de données :", event.target.errorCode);
};

function __setNbAnswered(domObj, nbAnswered) {
    domObj.nbAnswered = nbAnswered;
}

function __setNbCorrectAnswers(domObj, nbCorrectAnswers) {
    domObj.nbCorrectAnswers = nbCorrectAnswers;
}

function __setRowRecord(domObj, rowRecord) {
    domObj.rowRecord = rowRecord;
}

function __setCurrentRow(domObj, currentRow) {
    domObj.currentRow = currentRow;
}

function __setIsLastAnswerCorrect(domObj, islastAnswerCorrect) {
    domObj.islastAnswerCorrect = islastAnswerCorrect;
}

function __setWinrateRecord(domObj, gameWinrateRecord) {
    domObj.gameWinrateRecord = gameWinrateRecord;
}

function __setNbClassicGames(domObj, nbClassicGames) {
    domObj.nbClassicGames = nbClassicGames;
}

function __setNbMarathonGames(domObj, nbMarathonGames) {
    domObj.nbMarathonGames = nbMarathonGames;
}

function addAnswerDB(db, domainName, isCorrectAnswer) {
    const transaction = db.transaction("domains", "readwrite");
    const store = transaction.objectStore("domains");

    // Fonction pour mettre à jour un objet
    const updateDomain = (obj, isCorrectAnswer) => {
        __setNbAnswered(obj, obj.nbAnswered + 1);
        if (isCorrectAnswer) {
            __setIsLastAnswerCorrect(obj, true);
            __setNbCorrectAnswers(obj, obj.nbCorrectAnswers + 1);
            __setCurrentRow(obj, obj.currentRow + 1);
            if (obj.rowRecord < obj.currentRow) {
                __setRowRecord(obj, obj.currentRow);
            }
        } else {
            __setIsLastAnswerCorrect(obj, false);
            __setCurrentRow(obj, 0);  // Réinitialisation de la ligne en cas de mauvaise réponse
        }
        store.put(obj);
    };

    // Mettre à jour le domaine spécifique
    const domainRequest = store.get(domainName);  // Clé primaire 'domainName'
    domainRequest.onsuccess = (event) => {
        const domainObj = event.target.result;
        if (domainObj) {
            updateDomain(domainObj, isCorrectAnswer);
        } else {
            console.error(`Domaine ${domainName} non trouvé.`);
        }
    };
    domainRequest.onerror = (event) => {
        console.error("Erreur lors de la récupération du domaine : ", event.target.error);
    };

    // Mettre à jour le domaine TOTAL
    const totalRequest = store.get('TOTAL');  // Clé primaire 'TOTAL'
    totalRequest.onsuccess = (event) => {
        const totalObj = event.target.result;
        if (totalObj) {
            updateDomain(totalObj, isCorrectAnswer);
        } else {
            console.error("Objet TOTAL non trouvé.");
        }
    };
    totalRequest.onerror = (event) => {
        console.error("Erreur lors de la récupération de TOTAL : ", event.target.error);
    };

    // Assurez-vous que la transaction est complète
    transaction.oncomplete = () => {
        console.log("Transaction réussie : Réponses mises à jour.");
    };

    transaction.onerror = (event) => {
        console.error("Erreur sur la transaction : ", event.target.error);
    };
}
