const DB_VERSION = 13;
const DB_NAME = 'ulmedDB';

/* ------ ------ ----- -----
    STORE DES USERS DATA SUR LES DOMAINES MEDICAUX
*/
const DB_STORE_USER_DOMAINS = 'domains';

const DB_STORE_USER_DOMAINS_RECORDS = [
    "anatomy",
    "hematology",
    "dermatology",
    "histology",
    "cell_biology",
    "immunology",
    "genetics",
    "oncology",
    "pathology",
    "traumatology",
    "epidemiology",
    "various",
    "psychiatry",
    "toxicology",
    "neurology",
    "endocrinology",
    "nephrology",
    "gastroenterology",
    "nutrition",
    "orl_hns",
    "pneumology",
    "cardiology",
    "rheumatology",
    "physiology",
    "TOTAL",
];
    //
    // "surgery",
    // "pharmacology",

const DB_NB_QUESTIONS_QUIZ = {
    anatomy: 40,
    hematology: 20,
    dermatology: 20,
    histology: 20,
    cell_biology: 20,
    immunology: 20,
    //
    genetics: 40,
    oncology: 53,
    pathology: 53,
    traumatology: 0,
    epidemiology: 30,
    various: 61,
    //
    psychiatry: 0,
    toxicology: 0,
    neurology: 40,
    endocrinology: 30,
    nephrology: 0,
    gastroenterology: 21,
    //
    nutrition: 20,
    orl_hns: 100,
    pneumology: 20,
    cardiology: 15,
    rheumatology: 20,
    physiology: 60,

    // surgery: 30,
    // pharmacology: 48,
};


const DB_STORE_USER_DOMAINS_DATA = {
    nbAnswered: 0,
    nbCorrectAnswers: 0,
    rowRecord: 0,
    currentRow: 0,
    islastAnswerCorrect: false,
    gameWinrateRecord: 0,
    nbClassicGames: 0,
    nbMarathonGames: 0,
    nbPelerinageGames: 0,
};

/* ------ ------ ----- -----
    STORE DES USERS DATA PRINCIPALES
*/
const DB_STORE_USER = 'user';

const DB_STORE_USER_RECORDS = [
    "xp",               // amount: 0
    "badges",           // amount: 0
    "gameMode",         // value: classic, marathon, pelerinage
];

/* ------ ------ ----- -----
    STORE DES USERS PLAYED DAYS
*/
const DB_STORE_USER_DAYS = 'days';

/* ------ ------ ----- -----
    STORE DES GAME FILTERS ON/OFF
*/
const DB_STORE_GAME_FILTERS = 'filters';

const DB_STORE_GAME_FILTERS_RECORDS = [
    "data",             // object with all filters data true/false
];

const DB_STORE_GAME_FILTERS_DATA = {
    anatomy: false,
    hematology: false,
    dermatology: false,
    histology: false,
    cell_biology: false,
    immunology: false,
    genetics: false,
    oncology: false,
    pathology: false,
    traumatology: false,
    epidemiology: false,
    various: false,
    psychiatry: false,
    toxicology: false,
    neurology: false,
    endocrinology: false,
    nephrology: false,
    gastroenterology: false,
    nutrition: false,
    orl_hns: false,
    pneumology: false,
    cardiology: false,
    rheumatology: false,
    physiology: false,
    //
    etiology: false,
    diagnosis: false,
    treatment: false,
    research: false,
    surgery: false,
    emergency: false,
    imagery: false,
    pharmacology: false,
    obstetrics: false,
    pediatrics: false,
    geriatrics: false,
    autopsy: false,
    //
    tp53: false,
    apr_246: false,
    civd: false,
    vih: false,
};

/* ------ ------ ----- -----
    IndexedDB MAIN OPEN AND UPDATE ROUTINE
*/
let db = {};
async function openDATABASE() {
    db = await openDB();
}
openDATABASE();

async function openDB() {

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        // console.log("IndexedDB: > myindexDB.js version: " + DB_VERSION + " PLEASE OPEN");

        request.onsuccess = (event) => {
            const db = event.target.result;
            // console.log("IndexedDB: real [" + DB_NAME + "] version: " + db.version + " : SUCCESS OPEN");
            resolve(db); // ok is async promise return
        };

        request.onerror = (event) => {
            console.error("IndexedDB: FAIL OPEN : ", event.target.errorCode);
            reject(event.target.error); // what is that shit please
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            console.warn("IndexedDB: real " + DB_NAME + " version: " + db.version + " : PLEASE UPGRADE");

            /* ------ ------ ----- -----
                STORE DES USERS DATA SUR LES DOMAINES MEDICAUX
            */
            try {
                const storeName = DB_STORE_USER_DOMAINS;
                console.warn("IndexedDB: store [" + storeName + "] PLEASE UPGRADE");

                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: "name" });
                    console.warn("IndexedDB: store [" + storeName + "] CREATED");
                }

                const objectStore = event.target.transaction.objectStore(storeName);

                // Récupérez toutes les clés existantes
                const existingKeysRequest = objectStore.getAllKeys();
                existingKeysRequest.onsuccess = () => {
                    const existingKeys = existingKeysRequest.result;

                    // Supprimez les clés obsolètes
                    for (const key of existingKeys) {
                        if (!DB_STORE_USER_DOMAINS_RECORDS.includes(key)) {
                            objectStore.delete(key);
                            console.warn("IndexedDB: store [" + storeName + "] record [" + key + "] DELETED");
                        }
                    }

                    // Ajoutez ou mettez à jour les enregistrements actuels
                    for (const name of DB_STORE_USER_DOMAINS_RECORDS) {
                        const getRequest = objectStore.get(name);
                        getRequest.onsuccess = () => {
                            if (!getRequest.result) {
                                objectStore.add({ name, ...DB_STORE_USER_DOMAINS_DATA }).onerror = (e) => {
                                    console.error("IndexedDB: store [" + storeName + "] record [" + name + "] ERROR CANT ADD ", e.target.error);
                                };
                                console.warn("IndexedDB: store [" + storeName + "] record [" + name + "] ADDED");
                            }
                        };
                    }
                }
            } catch (e) {
                console.error("IndexedDB: store [" + storeName + "] UPGRADE ERROR: " + e);
            }

            /* ------ ------ ----- -----
                STORE DES USERS DATA PRINCIPALES
            */
            try {
                const storeName = DB_STORE_USER;
                console.warn("IndexedDB: store [" + storeName + "] PLEASE UPGRADE");

                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: "id" });
                    console.warn("IndexedDB: store [" + storeName + "] CREATED");
                }

                const objectStore = event.target.transaction.objectStore(storeName);

                // Récupérez toutes les clés existantes
                const existingKeysRequest = objectStore.getAllKeys();
                existingKeysRequest.onsuccess = () => {
                    const existingKeys = existingKeysRequest.result;

                    // Supprimez les clés obsolètes
                    for (const key of existingKeys) {
                        if (!DB_STORE_USER_RECORDS.includes(key)) {
                            objectStore.delete(key);
                            console.warn("IndexedDB: store [" + storeName + "] record [" + key + "] DELETED");
                        }
                    }

                    // Ajoutez ou mettez à jour les enregistrements actuels
                    {
                        const name = DB_STORE_USER_RECORDS[0]; // xp
                        const getRequest = objectStore.get(name);
                        getRequest.onsuccess = () => {
                            if (!getRequest.result) {
                                objectStore.add({ id: name, amount: 0 });
                                console.warn("IndexedDB: store [" + storeName + "] record [" + name + "] ADDED");
                            }
                        };
                    }
                    {
                        const name = DB_STORE_USER_RECORDS[1]; // badges
                        const getRequest = objectStore.get(name);
                        getRequest.onsuccess = () => {
                            if (!getRequest.result) {
                                objectStore.add({ id: name, amount: 0 });
                                console.warn("IndexedDB: store [" + storeName + "] record [" + name + "] ADDED");
                            }
                        };
                    }
                    {
                        const name = DB_STORE_USER_RECORDS[2]; // gameMode : classic, marathon, pelerinage
                        const getRequest = objectStore.get(name);
                        getRequest.onsuccess = () => {
                            if (!getRequest.result) {
                                objectStore.add({ id: name, value: "classic" });
                                console.warn("IndexedDB: store [" + storeName + "] record [" + name + "] ADDED");
                            }
                        };
                    }
                };
            } catch (e) {
                console.error("IndexedDB: store [" + storeName + "] UPGRADE ERROR: " + e);
            }

            /* ------ ------ ----- -----
                STORE DES USERS PLAYED DAYS
            */
            try {
                const storeName = DB_STORE_USER_DAYS;
                console.warn("IndexedDB: store [" + storeName + "] PLEASE UPGRADE");

                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: "date" });
                    console.warn("IndexedDB: store [" + storeName + "] CREATED");

                    const objectStore = event.target.transaction.objectStore(storeName);
                    objectStore.createIndex("date", "date", { unique: true });
                    console.warn("IndexedDB: store [" + storeName + "] INDEX [date] CREATED");
                }
            } catch (e) {
                console.error("IndexedDB: store [" + storeName + "] UPGRADE ERROR: " + e);
            }

            /* ------ ------ ----- -----
                STORE DES GAME FILTERS ON/OFF
            */
            try {
                const storeName = DB_STORE_GAME_FILTERS;
                console.warn("IndexedDB: store [" + storeName + "] PLEASE UPGRADE");

                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: "id" });
                    console.warn("IndexedDB: store [" + storeName + "] CREATED");
                }

                const objectStore = event.target.transaction.objectStore(storeName);

                // Récupérez toutes les clés existantes
                const existingKeysRequest = objectStore.getAllKeys();
                existingKeysRequest.onsuccess = () => {
                    const existingKeys = existingKeysRequest.result;

                    // Supprimez les clés obsolètes
                    for (const key of existingKeys) {
                        if (!DB_STORE_GAME_FILTERS_RECORDS.includes(key)) {
                            objectStore.delete(key);
                            console.warn("IndexedDB: store [" + storeName + "] record [" + key + "] DELETED");
                        }
                    }

                    // Ajoutez ou mettez à jour les enregistrements actuels
                    for (const name of DB_STORE_GAME_FILTERS_RECORDS) {
                        const getRequest = objectStore.get(name);
                        getRequest.onsuccess = () => {
                            if (!getRequest.result) {
                                objectStore.add({ id: name, ...DB_STORE_GAME_FILTERS_DATA }).onerror = (e) => {
                                    console.error("IndexedDB: store [" + storeName + "] record [" + name + "] ERROR CANT ADD ", e.target.error);
                                };
                                console.warn("IndexedDB: store [" + storeName + "] record [" + name + "] ADDED");
                            }
                        };
                    }
                }
            } catch (e) {
                console.error("IndexedDB: store [" + storeName + "] UPGRADE ERROR: " + e);
            }
            console.warn("IndexedDB: real " + DB_NAME + " version: " + db.version + " : UPGRADE DONE");
        };
    });
}

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

function addGameDB(db, domainName, winrate, isTen) {
    const transaction = db.transaction("domains", "readwrite");
    const store = transaction.objectStore("domains");

    // Mettre à jour le domaine spécifique
    const domainRequest = store.get(domainName);  // Clé primaire 'domainName'
    domainRequest.onsuccess = (event) => {
        const domainObj = event.target.result;
        if (domainObj) {
            if (isTen) {
                __setNbClassicGames(domainObj, domainObj.nbClassicGames + 1);
            }
            else {
                __setNbMarathonGames(domainObj, domainObj.nbMarathonGames + 1);
            }
            if (domainObj.gameWinrateRecord < winrate) {
                __setWinrateRecord(domainObj, winrate);
            }
            console.log(domainObj);
            store.put(domainObj);
        } else {
            console.error(`Domaine [${domainName}] non trouvé.`);
        }
    };
    domainRequest.onerror = (event) => {
        console.error("Erreur lors de la récupération du domaine : ", event.target.error);
    };
    transaction.oncomplete = () => {
        console.log("Transaction réussie : Réponses mises à jour.");
    };

    transaction.onerror = (event) => {
        console.error("Erreur sur la transaction : ", event.target.error);
    };
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
        // console.log(obj);
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


/* DATES PLAY HISTORY FUNCTIONS */

function addPlayDayToday() {
    const today = new Date().toISOString().split("T")[0];  // Format YYYY-MM-DD
    addPlayDay(today);  // Ajouter le jour actuel comme jour joué
}

function addPlayDay(date) {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("days", "readwrite");
        const objectStore = transaction.objectStore("days");

        // Ajouter un nouvel enregistrement avec la date actuelle
        const playRecord = { date: date };

        const addRequest = objectStore.add(playRecord);
        addRequest.onsuccess = function () {
            console.log("Play day added:", date);
        };

        addRequest.onerror = function (event) {
            console.log("Error adding play day:", event.target.error);
        };
    };
}

async function isTodayInDB() {
    try {
        const isInDB = await isDayInDB(new Date());
        if (isInDB) {
            // console.log("TODAY EXISTS");
            return true;
        } else {
            // console.log("TODAY DOES NOT EXIST");
            return false;
        }
    } catch (error) {
        console.error("An error occurred while checking the database:", error);
        return false;
    }
}

function isDayInDB(date) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction("days", "readonly");
            const objectStore = transaction.objectStore("days");

            // Recherche de l'entrée avec la date spécifiée
            const dateKey = date.toISOString().split("T")[0];  // Format YYYY-MM-DD pour la clé
            const getRequest = objectStore.get(dateKey);  // Utilise la date comme clé

            getRequest.onsuccess = function () {
                if (getRequest.result) {
                    // Si un enregistrement existe pour cette date, renvoie 'true'
                    resolve(true);
                } else {
                    // Si aucun enregistrement n'est trouvé, renvoie 'false'
                    resolve(false);
                }
            };

            getRequest.onerror = function (event) {
                reject(event.target.error);  // Rejeter la promesse en cas d'erreur
            };
        };

        request.onerror = function (event) {
            reject(event.target.error);  // Rejeter la promesse en cas d'erreur d'ouverture de la DB
        };
    });
}

function getPlayDays() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction("days", "readonly");
            const objectStore = transaction.objectStore("days");

            const allRecords = objectStore.getAll();

            allRecords.onsuccess = function () {
                resolve(allRecords.result);  // Résoudre la promesse avec les dates récupérées
            };

            allRecords.onerror = function (event) {
                reject(event.target.error);  // Rejeter la promesse en cas d'erreur
            };
        };
    });
}

// const dateToCheck = new Date('2024-11-09');
// isDayInDB(dateToCheck).then(isInDB => {
//     if (isInDB) {
//         console.log(`Le jour ${dateToCheck.toISOString().split("T")[0]} existe déjà dans la base de données.`);
//     } else {
//         console.log(`Le jour ${dateToCheck.toISOString().split("T")[0]} n'existe pas dans la base de données.`);
//     }
// }).catch(error => {
//     console.error("Erreur lors de la vérification de la date:", error);
// });
