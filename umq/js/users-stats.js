// USER XP LEVEL DATABASE CALL + USER STATS + NB BADGES
const GAME_XP_GAP = 400;
const GAME_XP_COEFFICIENT = 1.03;
const GAME_XP_FOR_WIN = 5;
const GAME_XP_FOR_FAIL = 1;

function addUserXP(value) {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("user", "readwrite");
        const store = transaction.objectStore("user");
        const getRequest = store.get("xp");

        getRequest.onsuccess = function () {
            let data = getRequest.result;

            if (data) {
                // Ajouter la valeur à l'XP existant
                data.amount += value;
                // Mettre à jour les données dans le store
                store.put(data);
                // console.log(`XP mis à jour : ${data.amount}`);
            } else {
                // Si l'objet "xp" n'existe pas, on le crée
                store.put({ id: "xp", amount: value });
                // console.log(`XP ajouté pour la première fois : ${value}`);
            }
        };

        getRequest.onerror = function () {
            console.error("Erreur lors de la récupération des données XP");
        };

        transaction.oncomplete = function () {
            // console.log("Transaction terminée avec succès.");
        };

        transaction.onerror = function () {
            console.error("Erreur lors de la transaction :", transaction.error);
        };
    };

    request.onerror = function () {
        console.error("Erreur lors de l'ouverture de la base de données :", request.error);
    };
}

// promise donc utiliser then ou async/await comme la recuperation des donnees est asynchrone
function getUserXP() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction("user", "readonly");
            const store = transaction.objectStore("user");
            const getRequest = store.get("xp");

            getRequest.onsuccess = function () {
                const data = getRequest.result;

                if (data) {
                    resolve(data.amount);
                } else {
                    resolve(0); // Si aucune donnée n'existe, retourner 0 comme valeur par défaut
                }
            };

            getRequest.onerror = function () {
                reject("Erreur lors de la récupération de l'XP");
            };

            transaction.onerror = function () {
                reject("Erreur lors de la transaction");
            };
        };

        request.onerror = function () {
            reject("Erreur lors de l'ouverture de la base de données");
        };
    });
}

function computeXPPercentageToNextLevel(xp) {
    let level = 1;
    let currentXP = 0;
    let gapXP = GAME_XP_GAP;
    let coefficient = GAME_XP_COEFFICIENT;

    // Trouver le niveau actuel
    while (xp >= currentXP + gapXP) {
        currentXP += gapXP;
        level++;
        gapXP = Math.ceil(gapXP * coefficient);
    }

    // Calculer le pourcentage d'XP manquant
    const nextLevelXP = currentXP + gapXP; // XP nécessaire pour atteindre le prochain niveau
    const xpNeeded = nextLevelXP - xp; // XP restant pour atteindre le prochain niveau
    const xpToNextLevelPercentage = (xpNeeded / gapXP) * 100;

    return xpToNextLevelPercentage;
}


function computePlayerLevel(xp) {
    let level = 1;
    let currentXP = 0;
    let gapXP = GAME_XP_GAP;
    let coefficient = GAME_XP_COEFFICIENT;

    while (xp >= currentXP + gapXP) {
        currentXP += gapXP;
        level++;
        gapXP = Math.ceil(gapXP * coefficient);
    }
    return level;
}

function generateLevelThresholds(maxLevel) {
    let thresholds = [0]; // Niveau 1 commence à 0 XP
    let gapXP = GAME_XP_GAP;  // Pas initial
    let coefficient = GAME_XP_COEFFICIENT;

    for (let i = 2; i <= maxLevel; i++) {
        thresholds.push(thresholds[thresholds.length - 1] + gapXP);
        gapXP = Math.ceil(gapXP * coefficient);
    }
    return thresholds;
}
// console.log(generateLevelThresholds(100));

function getTitleForLevel(level) {
    if (level <= 0) {
        return lvlTitles[0];
    }
    else if (level > lvlTitles.length) {
        return lvlTitles[lvlTitles.length - 1]; // Retourne le dernier titre pour les niveaux >= 100
    }
    else {
        return lvlTitles[level - 1];
    }
}

function testlvltitles() {
    for (let i = 1; i <= 110; i++) {
        console.log(i +' : '+ getTitleForLevel(i));
    }
}
// testlvltitles();

// promise donc utiliser then ou async/await comme la recuperation des donnees est asynchrone
function getUserWinrate() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction("domains", "readonly");
            const store = transaction.objectStore("domains");
            const getRequest = store.get("TOTAL");

            getRequest.onsuccess = function () {
                const data = getRequest.result;

                if (data) {
                    let winrate = Math.ceil((data.nbCorrectAnswers / data.nbAnswered) * 100);
                    resolve(winrate);
                } else {
                    resolve(0); // Si aucune donnée n'existe, retourner 0 comme valeur par défaut
                }
            };

            getRequest.onerror = function () {
                reject("Erreur lors de la récupération de l'XP");
            };

            transaction.onerror = function () {
                reject("Erreur lors de la transaction");
            };
        };

        request.onerror = function () {
            reject("Erreur lors de l'ouverture de la base de données");
        };
    });
}

// promise donc utiliser then ou async/await comme la recuperation des donnees est asynchrone
function getUserNbGames() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction("domains", "readonly");
            const store = transaction.objectStore("domains");
            const getRequest = store.get("TOTAL");

            getRequest.onsuccess = function () {
                const data = getRequest.result;

                if (data) {
                    let nbGames = data.nbClassicGames + data.nbMarathonGames;
                    resolve(nbGames);
                } else {
                    resolve(0); // Si aucune donnée n'existe, retourner 0 comme valeur par défaut
                }
            };

            getRequest.onerror = function () {
                reject("Erreur lors de la récupération de l'XP");
            };

            transaction.onerror = function () {
                reject("Erreur lors de la transaction");
            };
        };

        request.onerror = function () {
            reject("Erreur lors de l'ouverture de la base de données");
        };
    });
}

function addUserBadge(value) {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("user", "readwrite");
        const store = transaction.objectStore("user");
        const getRequest = store.get("badges");

        getRequest.onsuccess = function () {
            let data = getRequest.result;

            if (data) {
                data.amount += value;
                store.put(data);
                // console.log(`nb Badges updated : ${data.amount}`);
            } else {
                store.put({ id: "badges", amount: value });
                // console.log(`nb Badges data creation`);
            }
        };

        getRequest.onerror = function () {
            console.error("Erreur lors de la récupération des données badges");
        };

        transaction.oncomplete = function () {
            // console.log("Transaction terminée avec succès.");
        };

        transaction.onerror = function () {
            console.error("Erreur lors de la transaction :", transaction.error);
        };
    };

    request.onerror = function () {
        console.error("Erreur lors de l'ouverture de la base de données :", request.error);
    };
}

// promise donc utiliser then ou async/await comme la recuperation des donnees est asynchrone
function getUserNbBadges() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction("user", "readonly");
            const store = transaction.objectStore("user");
            const getRequest = store.get("badges");

            getRequest.onsuccess = function () {
                const data = getRequest.result;

                if (data) {
                    let nbBadges = data.amount;
                    resolve(nbBadges);
                } else {
                    resolve(0); // Si aucune donnée n'existe, retourner 0 comme valeur par défaut
                }
            };

            getRequest.onerror = function () {
                reject("Erreur lors de la récupération de l'XP");
            };

            transaction.onerror = function () {
                reject("Erreur lors de la transaction");
            };
        };

        request.onerror = function () {
            reject("Erreur lors de l'ouverture de la base de données");
        };
    });
}

function mapValue(A) {
    const A_min = 0;
    const A_max = 100;

    const B_min = 360;
    const B_max = 36;

    // Mappage linéaire
    const B = ((A - A_min) * (B_max - B_min)) / (A_max - A_min) + B_min;
    return Math.round(B);
}

function updateLevelCircle(pourcent) {
    const meter = document.querySelector('.meter-1');
    const value = mapValue(pourcent);
    meter.style.strokeDashoffset = value;
    document.documentElement.style.setProperty('--dash-offset', value);
}

async function updateUserProfil() {
    const userXpElement = document.getElementById('user-xp');
    const userLvlElement = document.getElementById('user-lvl');
    const userTitleElement = document.getElementById('user-title');
    const userGamesElement = document.getElementById('user-games');
    const userWinrateElement = document.getElementById('user-winrate');
    const userBadgesElement = document.getElementById('user-badges');

    if (!userXpElement)
        return;

    const xp = await getUserXP();
    userXpElement.innerHTML = xp;
    const xpPercentToNextLvl = 100 - Math.round(computeXPPercentageToNextLevel(xp));
    updateLevelCircle(xpPercentToNextLvl);
    const lvl = computePlayerLevel(xp);
    userLvlElement.innerHTML = lvl;
    userTitleElement.innerText = getTitleForLevel(lvl);
    const nbBadges = await getUserNbBadges();
    userBadgesElement.innerHTML = 'Asclepius shards ' + nbBadges + '/10';
    const nbGames = await getUserNbGames();
    userGamesElement.innerHTML = 'Played games &nbsp &nbsp ' + nbGames;
    const winrate = await getUserWinrate();
    userWinrateElement.innerHTML = 'Winrate &nbsp&nbsp &nbsp &nbsp &nbsp ' + winrate + '%';

}

addPlayDay('2024-09-03');
addPlayDay('2024-09-07');
addPlayDay('2024-09-08');
addPlayDay('2024-09-15');
addPlayDay('2024-09-20');
addPlayDay('2024-09-30');
addPlayDay('2024-09-26');
addPlayDay('2024-10-01');
addPlayDay('2024-10-04');
addPlayDay('2024-10-07');
addPlayDay('2024-10-12');
addPlayDay('2024-10-26');
addPlayDay('2024-10-29');
addPlayDay('2024-10-22');
// addPlayDay('2024-11-01');
// addPlayDay('2024-11-02');
// addPlayDay('2024-11-04');
// addPlayDay('2024-11-10');
// addPlayDay('2024-11-11');
// addPlayDay('2024-11-13');
// addPlayDayToday(); console.log('addPlayDayToday()');
addUserBadge(0); console.log('addUserBadge(0)');
addUserXP(0); console.log('addUserXP(0)');
updateUserProfil();
