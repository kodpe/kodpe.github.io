/* ------ ------ ----- -----
    IndexedDB : STORE I/O
*/
const storeName_gf = DB_STORE_GAME_FILTERS;
const recordName_gf = DB_STORE_GAME_FILTERS_RECORDS[0]; // data
/* ------ ------ ----- ----- */

async function saveGameFilters(data) {
    const db = await openDB();
    const transaction = db.transaction(storeName_gf, "readwrite");
    const store = transaction.objectStore(storeName_gf);
    try {
        // console.warn("data: ", data);
        store.put({ id: recordName_gf, ...data }).onerror = (e) => {
            console.error("IndexedDB: store [" + storeName_gf + "] record [" + recordName_gf + "] ERROR CANT PUT ", e.target.error);
        };
    } catch (e) {
        console.error("IndexedDB: store [" + storeName_gf + "] SAVE ERROR: " + e);
    }
    return transaction.complete;
}

async function getGameFilters() {
    const db = await openDB();
    const transaction = db.transaction(storeName_gf, "readonly");
    const store = transaction.objectStore(storeName_gf);
    const request = store.get(recordName_gf);
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

// getGameFilters()
//     .then((data) => {
//         let gameFilters = data;
//         console.log("Booleans loaded:", data);
//     })
//     .catch((error) => {
//         console.error("Error loading booleans:", error);
//     });
