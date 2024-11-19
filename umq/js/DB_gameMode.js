/* ------ ------ ----- -----
    IndexedDB : STORE I/O
*/
const storeName_gm = DB_STORE_USER;
const recordName_gm = DB_STORE_USER_RECORDS[2]; // gameMode
// "gameMode",         // value: classic, marathon, pelerinage
/* ------ ------ ----- ----- */

async function saveGameModeDB(currentGameMode) {
    // console.log("HEY", currentGameMode);
    const db = await openDB();
    const transaction = db.transaction(storeName_gm, "readwrite");
    const store = transaction.objectStore(storeName_gm);
    try {
        store.put({ id: recordName_gm, value: currentGameMode }).onerror = (e) => {
            console.error("IndexedDB: store [" + storeName_gm + "] record [" + recordName_gm + "] ERROR CANT PUT ", e.target.error);
        };
    } catch (e) {
        console.error("IndexedDB: store [" + storeName_gm + "] SAVE ERROR: " + e);
    }
    return transaction.complete;
}

async function getGameModeDB() {
    const db = await openDB();
    const transaction = db.transaction(storeName_gm, "readonly");
    const store = transaction.objectStore(storeName_gm);
    const request = store.get(recordName_gm);
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

// getGameModeDB()
//     .then((data) => {
//         let gameModeSaved = data;
//         console.log("gameModeSaved:", data);
//         console.log("gameModeSaved:", gameModeSaved);
//     })
//     .catch((error) => {
//         console.error("Error loading:", error);
//     });
