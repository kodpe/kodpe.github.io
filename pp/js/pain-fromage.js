// Nom de la base de données et de l'objet de stockage
const DB_NAME = "compteursDB";
const STORE_NAME = "compteurs";
let db;
let cnt_nb_pain = 0;
let cnt_nb_fromage = 0;
let cnt_nb_bras = 0;
CntTab = document.getElementById('tab');
CntTab.classList.add('disabled');

// Ouvrir la base de données IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = function (event) {
            let db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };

        request.onsuccess = function (event) {
            db = event.target.result;
            resolve(db);
        };

        request.onerror = function (event) {
            reject("Erreur IndexedDB : " + event.target.errorCode);
        };
    });
}

// Sauvegarde des compteurs dans IndexedDB avec gestion des erreurs
function saveCounters(nb_pain, nb_fromage, nb_bras) {
    console.warn("saveCounters()");
    if (!db) {
        console.error("IndexedDB non initialisé !");
        return;
    }

    try {
        let transaction = db.transaction(STORE_NAME, "readwrite");
        let store = transaction.objectStore(STORE_NAME);
        let data = { id: 1, nb_pain, nb_fromage, nb_bras };

        let request = store.put(data);

        request.onsuccess = function () {
            console.log("Compteurs sauvegardés avec succès :", data);
        };

        request.onerror = function (event) {
            console.error("Erreur lors de la sauvegarde dans IndexedDB :", event.target.error);
        };
    } catch (error) {
        console.error("Exception capturée lors de la sauvegarde :", error);
    }
}

// Chargement des compteurs depuis IndexedDB
function loadCounters() {
    return new Promise((resolve) => {
        if (!db) {
            resolve({ nb_pain: 0, nb_fromage: 0, nb_bras: 0 });
            return;
        }

        let transaction = db.transaction(STORE_NAME, "readonly");
        let store = transaction.objectStore(STORE_NAME);
        let request = store.get(1);

        request.onsuccess = function (event) {
            let data = event.target.result;
            resolve(data ? data : { nb_pain: 0, nb_fromage: 0, nb_bras: 0 });
        };

        request.onerror = function () {
            resolve({ nb_pain: 0, nb_fromage: 0, nb_bras: 0 });
        };
    });
}

// Initialisation : Ouverture de la DB et chargement des compteurs
openDB().then(() => {
    loadCounters().then(({ nb_pain, nb_fromage, nb_bras }) => {
        document.getElementById("cnt-pain").textContent = nb_pain;
        document.getElementById("cnt-fromage").textContent = nb_fromage;
        document.getElementById("cnt-bras").textContent = nb_bras;
        cnt_nb_pain = nb_pain;
        cnt_nb_fromage = nb_fromage;
        cnt_nb_bras = nb_bras;
    });
});

const story = new Audio("sounds/painfromage.mp3");
story.loop = true;
isGameON = false;
//
isFromage = true;
isPain = true;
isOuille = true;
//

CntPain = document.getElementById('cnt-pain');
CntFromage = document.getElementById('cnt-fromage');
CntBras = document.getElementById('cnt-bras');

function playAtSecond(seconds) {
    story.currentTime = seconds;
    story.play();
}

function ouille_et_cest_lerreur() {
    if (isOuille === false)
        return;
    isOuille = false;
    isFromage = true;
    isPain = true;
    playAtSecond(14.5);
    setTimeout(function () {
        isOuille = true;
    }, 16000);
}

function ouille_aieuh_oooh() {
    if (isOuille === false)
        return;
    isOuille = false;
    isFromage = true;
    isPain = true;
    playAtSecond(81.2);
    setTimeout(function () {
        isOuille = true;
    }, 12000);
}

function le_fromage() {
    if (isFromage === false)
        return;
    isFromage = false;
    isOuille = true;
    isPain = true;
    playAtSecond(36);
    setTimeout(function () {
        isFromage = true;
    }, 15000);
}

function le_pain() {
    if (isPain === false)
        return;
    isPain = false;
    isOuille = true;
    isFromage = true;
    playAtSecond(76.3);
    setTimeout(function () {
        isPain = true;
        // playAtSecond(0);
    }, 5000);
}

function do_nothing() {
}

function play_sound_effect(message) {
    if (message === 'fromage') {
        cnt_nb_fromage++;
        var fnct = [le_fromage];
        var r = fnct[Math.floor(Math.random() * fnct.length)];
        r();
    }
    if (message === 'pain') {
        cnt_nb_pain++;
        var fnct = [le_pain];
        var r = fnct[Math.floor(Math.random() * fnct.length)];
        r();
    }
    if (message === 'bras') {
        cnt_nb_bras++;
        var fnct = [ouille_et_cest_lerreur, ouille_aieuh_oooh];
        var r = fnct[Math.floor(Math.random() * fnct.length)];
        r();
    }
    CntFromage.innerHTML = cnt_nb_fromage;
    CntPain.innerHTML = cnt_nb_pain;
    CntBras.innerHTML = cnt_nb_bras;
    saveCounters(cnt_nb_pain, cnt_nb_fromage, cnt_nb_bras);
}

let timeouts = []; // Stocke les setTimeout actifs
story.addEventListener("play", () => {
    // Annule tous les timeouts précédents
    timeouts.forEach(clearTimeout);
    timeouts = [];
    // Planifie les nouvelles actions
    timeouts.push(setTimeout(() => addBras(), 14500));
    timeouts.push(setTimeout(() => addFromage(), 36000));
    timeouts.push(setTimeout(() => addPain(), 76300));
    timeouts.push(setTimeout(() => addBras(), 81200));
});

function addPain() {
    cnt_nb_pain++;
    CntFromage.innerHTML = cnt_nb_fromage;
    CntPain.innerHTML = cnt_nb_pain;
    CntBras.innerHTML = cnt_nb_bras;
    saveCounters(cnt_nb_pain, cnt_nb_fromage, cnt_nb_bras);
}

function addFromage() {
    cnt_nb_fromage++;
    CntFromage.innerHTML = cnt_nb_fromage;
    CntPain.innerHTML = cnt_nb_pain;
    CntBras.innerHTML = cnt_nb_bras;
    saveCounters(cnt_nb_pain, cnt_nb_fromage, cnt_nb_bras);
}

function addBras() {
    cnt_nb_bras++;
    CntFromage.innerHTML = cnt_nb_fromage;
    CntPain.innerHTML = cnt_nb_pain;
    CntBras.innerHTML = cnt_nb_bras;
    saveCounters(cnt_nb_pain, cnt_nb_fromage, cnt_nb_bras);
}

function chargerSVG(fichier, containerId, message) {
    fetch(fichier)
        .then(response => response.text())
        .then(svgText => {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
            const paths = svgDoc.querySelectorAll('path');
            const svgContainer = document.getElementById(containerId);
            if (svgContainer)
                svgContainer.appendChild(svgDoc.documentElement);

            // Ajout d'un écouteur de clic sur chaque path
            paths.forEach(path => {
                path.addEventListener('click', function (event) {
                    console.log("Path cliqué !");
                    // alert(message);
                    play_sound_effect(message);
                    event.stopPropagation(); // Empêche la propagation de l'événement
                });
            });
            console.log("Détection de clics sur les paths activée !");
        })
        .catch(error => {
            console.error('Erreur lors du chargement du SVG :', error);
        });
}

function init() {
    chargerSVG('img/lefromage.svg', 'svgContainer', 'fromage');
    chargerSVG('img/lepain.svg', 'svgContainer2', 'pain'); ``


    cursor = document.getElementById("cursor");
    if (cursor)
        cursor.classList.add("disabled");
    svg1 = document.getElementById("svgContainer");
    svg2 = document.getElementById("svgContainer2");
    if (svg1)
        svg1.classList.add("disabled");
    if (svg2)
        svg2.classList.add("disabled");

    btnStart = document.getElementById("btn-start");
    bg = document.getElementById("bg-img");
    if (bg)
        bg.classList.add("disabled");

    btnStart.addEventListener("click", function () {
        loadGame();
    });

}

function loadGame() {
    cursor = document.getElementById("cursor");
    cursor.classList.remove("disabled");
    CntTab.classList.remove('disabled');

    btnStart.classList.add("disabled");
    if (bg)
        bg.classList.remove("disabled");
    if (svg1)
        svg1.classList.remove("disabled");
    if (svg2)
        svg2.classList.remove("disabled");
    story.play();
    // Détecter un clic global sur la page (en dehors des path)
    document.addEventListener('click', function (event) {
        const clickedOnFromage = event.target.closest('#svgContainer') && event.target.closest('#svgContainer').querySelector('#fromagePath');
        const clickedOnPain = event.target.closest('#svgContainer2') && event.target.closest('#svgContainer2').querySelector('#painPath');

        if (!clickedOnFromage && !clickedOnPain && isGameON) {
            play_sound_effect('bras');
            // alert("Vous avez coupé votre bas !");
        }
    });
    setTimeout(function () {
        isGameON = true;
    }, 200);

    document.addEventListener('mousemove', function (event) {
        var cursor = document.querySelector('.cursor');
        var cursorImg = cursor.querySelector('img');

        // Calcule la position de la souris pour centrer l'image dessus
        var cursorX = event.pageX - cursorImg.width / 2;
        var cursorY = event.pageY - cursorImg.height / 2;

        // Met à jour la position du curseur
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
    });
}

init();

img1 = document.getElementById("t1");
img2 = document.getElementById("t2");
img3 = document.getElementById("t3");
img4 = document.getElementById("t4");
img5 = document.getElementById("t5");
img6 = document.getElementById("t6");
img7 = document.getElementById("t7");
img8 = document.getElementById("t8");
img9 = document.getElementById("t9");
var imgsTV = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

function tv_roll() {
    console.log('tv_roll()');
    for (var i = 0; i < imgsTV.length; i++) {
        imgsTV[i].classList.add('disabled');
    }
    var randomId = Math.floor(Math.random() * imgsTV.length);
    imgsTV[randomId].classList.remove('disabled');
    setTimeout(function () {
        tv_roll();
    }, 3000);
}

tv_roll();