import { computeTartipodFormuleNeed, createTartipod, getHoursBetween, getMoodOfDay, getTartinePensee } from "./tartinoide-data.js";
/* DO NOT EDIT BELOW */
const DATABASE_NAME = "Kodp";
const DATABASE_VERSION = 1;
const STORE_PAGES = "pages";
const STORE_INVENTORY = "items";
const STORE_TARTIPODS = "tartipods";
/* DO NOT EDIT END */
let db;
/* GAME SETTINGS */
const NB_INITIAL_TARTIPODS = 15;
//
// indexedDB.databases().then((databases) => {
//   console.log("Bases de données existantes :", databases);
// });
//

function createIndexStoreDB(store) {
    let createIndexRequest = store.createIndex("index", "id", { unique: true });
    createIndexRequest.onsuccess = function () {
        console.log("DB: Index 'index' créé avec succès dans le store 'inventory'.");
    };
    createIndexRequest.onerror = function (event) {
        console.error("DB: Erreur lors de la création de l'index 'index' dans le store 'inventory'.", event.target.error);
    };
}

function createStoresDB() {
    if (db.objectStoreNames.contains(STORE_PAGES) === false) {
        const store = db.createObjectStore(STORE_PAGES, { keyPath: "id", autoIncrement: true });
        createIndexStoreDB(store);
        addPageDB({ id: 0, name: "Cuisine", found: true, volume: 0.5 });
        addPageDB({ id: 1, name: "Parc", found: false, volume: 0.5 });
        addPageDB({ id: 2, name: "Domaine", found: false, volume: 0.5 });
        addPageDB({ id: 3, name: "Rue", found: false, volume: 0.5 });
    }
    if (db.objectStoreNames.contains(STORE_INVENTORY) === false) {
        const store = db.createObjectStore(STORE_INVENTORY, { keyPath: "id", autoIncrement: true });
        createIndexStoreDB(store);
        addItemDB({ id: 0, name: "pain", amount: "0" });
        addItemDB({ id: 1, name: "fromage", amount: "0" });
        addItemDB({ id: 2, name: "bras", amount: "0" });
        addItemDB({ id: 3, name: "tartine", amount: "0" });
        addItemDB({ id: 4, name: "slicer_pain", amount: "0" });
        addItemDB({ id: 5, name: "slicer_fromage", amount: "0" });
        addItemDB({ id: 6, name: "machine_pain", amount: "0" });
        addItemDB({ id: 7, name: "machine_fromage", amount: "0" });
        addItemDB({ id: 8, name: "tartipods", amount: "0", timeLeft: "600" });
    }
    if (db.objectStoreNames.contains(STORE_TARTIPODS) === false) {
        const store = db.createObjectStore(STORE_TARTIPODS, { keyPath: "id", autoIncrement: true });
        createIndexStoreDB(store);
        for (let i = 0; i < NB_INITIAL_TARTIPODS; i++) {
            addTartipodDB(createTartipod(i));
        }
    }
}

const OLD_DB_NAME = "compteursDB";
const OLD_DB_VERSION = 4;
let old_db;
function mergeOldDB() {
    console.warn("MergeOldDB");

    function openOldDB() {
        return new Promise((resolve, reject) => {
            let request = indexedDB.open(OLD_DB_NAME, OLD_DB_VERSION);
            request.onsuccess = function (event) {
                old_db = event.target.result;
                resolve(old_db);
            };
            request.onerror = function (event) {
                reject("Erreur Old IndexedDB : " + event.target.errorCode);
            };
        });
    }

    function loadCounters() {
        return new Promise((resolve) => {
            if (!old_db) {
                console.error("no old_db");
                return;
            }
            let transaction = old_db.transaction("compteurs", "readonly");
            let store = transaction.objectStore("compteurs");
            let request = store.get(1);
            request.onsuccess = function (event) {
                let data = event.target.result;
                resolve(data);
            };
            request.onerror = function () {
                console.error("loadCounters() data");
            };
        });
    }
    openOldDB().then(() => {
        loadCounters().then(({ nb_pain, nb_fromage, nb_bras, nb_tartine, nb_sl_pain, nb_sl_fromage, nb_ma_pain, nb_ma_fromage }) => {
            console.warn("nb_pain:", nb_pain);
            console.warn("nb_fromage:", nb_fromage);
            console.warn("nb_bras:", nb_bras);
            console.warn("nb_tartine:", nb_tartine);
            console.warn("nb_sl_pain:", nb_sl_pain);
            console.warn("nb_sl_fromage:", nb_sl_fromage);
            console.warn("nb_ma_pain:", nb_ma_pain);
            console.warn("nb_ma_fromage:", nb_ma_fromage);
            putItemDB({ id: 0, name: "pain", amount: nb_pain });
            putItemDB({ id: 1, name: "fromage", amount: nb_fromage });
            putItemDB({ id: 2, name: "bras", amount: nb_bras });
            putItemDB({ id: 3, name: "tartine", amount: nb_tartine });
            putItemDB({ id: 4, name: "slicer_pain", amount: nb_sl_pain });
            putItemDB({ id: 5, name: "slicer_fromage", amount: nb_sl_fromage });
            putItemDB({ id: 6, name: "machine_pain", amount: nb_ma_pain });
            putItemDB({ id: 7, name: "machine_fromage", amount: nb_ma_fromage });
            console.warn("MERGE OLD DB DONE");
        });
    });
}

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            console.log(`DB: Migration de la version ${event.oldVersion} vers ${DATABASE_VERSION}`);
            createStoresDB();
            mergeOldDB();
        };
        request.onsuccess = (event) => {
            db = event.target.result;
            // console.log("DB: Base ouverte avec succès.");
            resolve(db);
        };
        request.onerror = (event) => {
            console.error("DB: Erreur d'ouverture de la base :", event.target.error);
            reject(event.target.error);
        };
        request.onblocked = () => {
            console.warn("DB: Mise à jour est bloquée. Fermez les autres onglets utilisant cette base.");
        };
    });
}


// PAGE MODEL
/*
let page = {
    id: 0,
    name: 'Cuisine',
    found: true,
    volume: 0.8,
}
*/
function validationPageDB(page) {
    if (typeof page.id !== 'number' || page.id < 0) {
        throw new Error("DB: VALIDATION: page.id");
    }
    if (typeof page.name !== 'string' || page.name.trim() === '') {
        throw new Error("DB: VALIDATION: page.name");
    }
    if (typeof page.found !== 'boolean') {
        throw new Error("DB: VALIDATION: page.found");
    }
    if (typeof page.volume !== 'number' || page.volume < 0 || page.volume > 1) {
        throw new Error("DB: VALIDATION: page.volume");
    }
}

async function addPageDB(page) {
    try {
        await openDB();
        validationPageDB(page);
        const transaction = db.transaction(STORE_PAGES, "readwrite");
        const store = transaction.objectStore(STORE_PAGES);
        const request = store.add(page);
        request.onsuccess = () => {
            console.log("DB: Page ajoutée avec l'ID :", request.result);
        };
        transaction.onerror = (event) => {
            console.warn("DB: Erreur lors de l'ajout de la page :", event.target.error);
        };
    } catch (error) {
        console.error("DB: Erreur lors de l'ajout :", error);
    }
}

export async function getAllPagesDB() {
    await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_PAGES, "readonly");
        const store = transaction.objectStore(STORE_PAGES);
        const request = store.getAll();
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            console.error("Erreur lors de la récupération des pages :", event.target.error);
            reject(event.target.error);
        };
    });
}

export async function getPageById(pageId) {
    const pages = await getAllPagesDB();
    return pages.find(page => page.id === pageId) || null;
}

export function getCurrentPageIndexDB() {
    if (window.page === null) {
        console.error("getCurrentPageIndexDB: window.page null");
        return -1;
    }
    else if (window.page === "kitchen") {
        return 0;
    }
    else if (window.page === "park") {
        return 1;
    }
    else if (window.page === "domaine") {
        return 2;
    }
    else if (window.page === "street") {
        return 3;
    }
    console.error("getCurrentPageIndexDB: window.page invalid:", window.page);
    return -1;
}

export async function updatePageDB(pageId, updatedData) {
    if (pageId === -1) {
        pageId = getCurrentPageIndexDB();
    }
    await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_PAGES, "readwrite");
        const store = transaction.objectStore(STORE_PAGES);
        const request = store.get(pageId);

        request.onsuccess = (event) => {
            const page = event.target.result;
            if (page) {
                Object.assign(page, updatedData);
                const updateRequest = store.put(page);
                updateRequest.onsuccess = () => {
                    console.log("Page mise à jour avec succès !");
                    resolve(page);
                };
                updateRequest.onerror = (event) => {
                    console.error("Erreur lors de la mise à jour de la page :", event.target.error);
                    reject(event.target.error);
                };
            } else {
                console.log("Page non trouvée pour l'ID :", pageId);
                resolve(null);
            }
        };
        request.onerror = (event) => {
            console.error("Erreur lors de la récupération de la page :", event.target.error);
            reject(event.target.error);
        };
    });
}

// ITEM MODEL
/*
let item = {
    id: 0,
    name: 'pain',
    amout: 100,
}
*/
function validationItemDB(item) {
    if (typeof item.id !== 'number' || item.id < 0) {
        throw new Error("DB: VALIDATION: item.id");
    }
    if (typeof item.name !== 'string' || item.name.trim() === '') {
        throw new Error("DB: VALIDATION: item.name");
    }
    if (typeof item.amount !== 'string') {
        throw new Error("DB: VALIDATION: item.amount");
    }
}

async function addItemDB(item) {
    try {
        await openDB();
        validationItemDB(item);
        const transaction = db.transaction(STORE_INVENTORY, "readwrite");
        const store = transaction.objectStore(STORE_INVENTORY);
        const request = store.add(item);
        request.onsuccess = () => {
            console.log("DB: Item ajoutée avec l'ID :", request.result);
        };
        transaction.onerror = (event) => {
            console.warn("DB: Erreur lors de l'ajout de la item :", event.target.error);
        };
    } catch (error) {
        console.error("DB: Erreur lors de l'ajout :", error);
    }
}

async function putItemDB(item) {
    try {
        await openDB();
        validationItemDB(item);
        const transaction = db.transaction(STORE_INVENTORY, "readwrite");
        const store = transaction.objectStore(STORE_INVENTORY);
        const request = store.put(item);
        request.onsuccess = () => {
            console.log("DB: Item ajoutée avec l'ID :", request.result);
        };
        transaction.onerror = (event) => {
            console.warn("DB: Erreur lors de l'ajout de la item :", event.target.error);
        };
    } catch (error) {
        console.error("DB: Erreur lors de l'ajout :", error);
    }
}

export async function getAllItemsDB() {
    await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_INVENTORY, "readonly");
        const store = transaction.objectStore(STORE_INVENTORY);
        const request = store.getAll();
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            console.error("Erreur lors de la récupération des items :", event.target.error);
            reject(event.target.error);
        };
    });
}

export async function updateAllItemsDB(itemsDataTab) {
    await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_INVENTORY, "readwrite");
        const store = transaction.objectStore(STORE_INVENTORY);
        const request = store.getAll();
        request.onsuccess = (event) => {
            const items = event.target.result;
            items.forEach(item => {
                validationItemDB(item);
                if (itemsDataTab[item.id]) {
                    Object.assign(item, itemsDataTab[item.id]);
                }
                store.put(item);
            });
            // console.log("Tous les items ont été mis à jour.");
            resolve(items);
        };
        request.onerror = (event) => {
            console.error("Erreur lors de la récupération des items :", event.target.error);
            reject(event.target.error);
        };
    });
}

// TARTIPOD MODEL
/*
  let tartipod = {
    id: tartipodId,
    name: getTartineName(),
    age: 0,
    status: getTartineEtat(8),
    think: getTartinePensee(),
    favorite: getTartineAime(),
    need: randomNumberMinMax(100, 1000),
    lvl: 1,
    xp: 0,
  }
*/
function validationTartipodDB(tartipod) {
    if (typeof tartipod.id !== 'number' || tartipod.id < 0) {
        throw new Error("DB: VALIDATION: tartipod.id");
    }
    if (typeof tartipod.name !== 'string' || tartipod.name.trim() === '') {
        throw new Error("DB: VALIDATION: tartipod.name");
    }
    if (typeof tartipod.age !== 'number') {
        throw new Error("DB: VALIDATION: tartipod.age");
    }
    if (typeof tartipod.status !== 'string' || tartipod.status.trim() === '') {
        throw new Error("DB: VALIDATION: tartipod.status");
    }
    if (typeof tartipod.think !== 'string' || tartipod.think.trim() === '') {
        throw new Error("DB: VALIDATION: tartipod.think");
    }
    if (typeof tartipod.favorite !== 'string' || tartipod.favorite.trim() === '') {
        throw new Error("DB: VALIDATION: tartipod.favorite");
    }
    if (typeof tartipod.need !== 'number' || tartipod.need < 0) {
        throw new Error("DB: VALIDATION: tartipod.need");
    }
    if (typeof tartipod.lvl !== 'number' || tartipod.lvl < 0) {
        throw new Error("DB: VALIDATION: tartipod.lvl");
    }
    if (typeof tartipod.xp !== 'number' || tartipod.xp < 0) {
        throw new Error("DB: VALIDATION: tartipod.xp");
    }
}

export async function addTartipodDB(tartipod) {
    try {
        await openDB();
        validationTartipodDB(tartipod);
        const transaction = db.transaction(STORE_TARTIPODS, "readwrite");
        const store = transaction.objectStore(STORE_TARTIPODS);
        const request = store.add(tartipod);
        request.onsuccess = () => {
            console.log("DB: Tartipod ajoutée avec l'ID :", request.result);
        };
        transaction.onerror = (event) => {
            console.warn("DB: Erreur lors de l'ajout du Tartipod :", event.target.error);
        };
    } catch (error) {
        console.error("DB: Erreur lors de l'ajout :", error);
    }
}

async function getAllTartipodsDB() {
    await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_TARTIPODS, "readonly");
        const store = transaction.objectStore(STORE_TARTIPODS);
        const request = store.getAll();
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            console.error("Erreur lors de la récupération des Tartipods :", event.target.error);
            reject(event.target.error);
        };
    });
}

export async function getTartipodByIdDB(tartipodId) {
    await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_TARTIPODS, "readonly");
        const store = transaction.objectStore(STORE_TARTIPODS);
        const request = store.get(tartipodId); // Recherche par clé primaire (id)
        request.onsuccess = (event) => {
            if (event.target.result) {
                resolve(event.target.result);
            } else {
                reject(new Error("Aucun Tartipod trouvé avec l'id " + tartipodId));
            }
        };
        request.onerror = (event) => {
            console.error("Erreur lors de la récupération du Tartipod :", event.target.error);
            reject(event.target.error);
        };
    });
}

export async function updateTartipodDB(tartipod) {
    await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_TARTIPODS], "readwrite");
        const store = transaction.objectStore(STORE_TARTIPODS);
        const request = store.put(tartipod);
        request.onsuccess = () => {
            // console.log("Tartipod mis à jour :", tartipod);
            resolve();
        };
        request.onerror = (event) => {
            console.error("Erreur lors de la mise à jour du Tartipod :", event.target.error);
            reject(event.target.error);
        };
    });
}

export async function getTartipodCountDB() {
    await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_TARTIPODS, "readonly");
        const store = transaction.objectStore(STORE_TARTIPODS);
        const request = store.count(); // Utilise la méthode count() pour obtenir le nombre total
        request.onsuccess = (event) => {
            resolve(event.target.result); // Renvoie le nombre total de Tartipods
        };
        request.onerror = (event) => {
            console.error("Erreur lors de la récupération du nombre de Tartipods :", event.target.error);
            reject(event.target.error);
        };
    });
}

export async function getTartipodsNeedByFavorite(favoriteType) {
    try {
        const allTartipods = await getAllTartipodsDB();
        const filteredTartipods = allTartipods.filter(tartipod => tartipod.favorite === favoriteType);
        const totalNeed = filteredTartipods.reduce((sum, tartipod) => sum + computeTartipodFormuleNeed(tartipod), 0);
        return totalNeed; // Retourne la somme des 'needs' pour les tartipods favoris
    } catch (error) {
        console.error(`Erreur lors du calcul de la somme des 'needs' pour ${favoriteType}:`, error);
        return 0; // Retourne 0 en cas d'erreur
    }
}

// TARTIPOD DAY ROUTINE
export async function tartipodDayUpdate() {
    await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_TARTIPODS], "readwrite");
        const store = transaction.objectStore(STORE_TARTIPODS);
        const request = store.getAll();
        request.onsuccess = (event) => {
            const tartipods = event.target.result;
            const today = new Date().getTime();
            tartipods.forEach(tartipod => {
                tartipod.age = getHoursBetween(tartipod.birthdate, today);
                tartipod.status = getMoodOfDay(tartipod.id, tartipod.age, tartipod.lvl);
                tartipod.think = getTartinePensee();
                store.put(tartipod);
            });
            transaction.oncomplete = () => {
                console.log("Âge des Tartipods mis à jour !");
                resolve();
            };
            transaction.onerror = (event) => {
                console.error("Erreur lors de la mise à jour des âges :", event.target.error);
                reject(event.target.error);
            };
        };
        request.onerror = (event) => {
            console.error("Erreur lors de la récupération des Tartipods :", event.target.error);
            reject(event.target.error);
        };
    });
}

//
function tryOpenDB() {
    openDB();
}
tryOpenDB();
tartipodDayUpdate();
//
// console.log(getAllPagesDB());
// console.log(getAllItemsDB());
// console.log(getAllTartipodsDB());
/*
getTartipodByIdDB(3).then((tartipod) => {
    console.log("Tartipod trouvé :", tartipod);
}).catch((error) => {
    console.error(error.message);
});
*/
