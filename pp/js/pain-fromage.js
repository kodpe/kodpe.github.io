// Nom de la base de données et de l'objet de stockage
const DB_NAME = "compteursDB";
const STORE_NAME = "compteurs";
const DB_VERSION = 4;
let db;
let cnt_nb_pain = BigInt("0");
let cnt_nb_fromage = BigInt("0");
let cnt_nb_bras = BigInt("0");
let cnt_nb_tartine = BigInt("0");
//
let cnt_slicer_pain = BigInt("0");
let cnt_slicer_fromage = BigInt("0");
let cnt_machine_pain = BigInt("0");
let cnt_machine_fromage = BigInt("0");
//
cursor = document.getElementById("cursor");
knife = document.getElementById("knife");
knifeBlood = document.getElementById("knife-blood");
btnTartine = document.getElementById("cnt-tartine-btn");
//
btnSlicerPain = document.getElementById("cnt-slicer-pain-btn");
btnSlicerFromage = document.getElementById("cnt-slicer-fromage-btn");
btnMachinePain = document.getElementById("cnt-machine-pain-btn");
btnMachineFromage = document.getElementById("cnt-machine-fromage-btn");
//
CntTab = document.getElementById('tab');
CntTab.classList.add('disabled');

// Ouvrir la base de données IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(DB_NAME, DB_VERSION);

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
function saveCounters(nb_pain, nb_fromage, nb_bras, nb_tartine, nb_sl_pain, nb_sl_fromage, nb_ma_pain, nb_ma_fromage) {
    // console.warn("saveCounters()");
    if (!db) {
        console.error("IndexedDB non initialisé !");
        return;
    }

    try {
        let transaction = db.transaction(STORE_NAME, "readwrite");
        let store = transaction.objectStore(STORE_NAME);
        let data = { id: 1, nb_pain, nb_fromage, nb_bras, nb_tartine, nb_sl_pain, nb_sl_fromage, nb_ma_pain, nb_ma_fromage };

        let request = store.put(data);

        request.onsuccess = function () {
            // console.log("Compteurs sauvegardés avec succès :", data);
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
            resolve({ nb_pain: "0",
                    nb_fromage: "0",
                    nb_bras: "0",
                    nb_tartine: "0",
                    nb_sl_pain: "0",
                    nb_sl_fromage: "0",
                    nb_ma_pain: "0",
                    nb_ma_fromage: "0",
                });
            return;
        }

        let transaction = db.transaction(STORE_NAME, "readonly");
        let store = transaction.objectStore(STORE_NAME);
        let request = store.get(1);

        request.onsuccess = function (event) {
            let data = event.target.result;
            resolve(data ? data : {
                    nb_pain: "0",
                    nb_fromage: "0",
                    nb_bras: "0",
                    nb_tartine: "0",
                    nb_sl_pain: "0",
                    nb_sl_fromage: "0",
                    nb_ma_pain: "0",
                    nb_ma_fromage: "0",
                });
        };

        request.onerror = function () {
            resolve({
                    nb_pain: "0",
                    nb_fromage: "0",
                    nb_bras: "0",
                    nb_tartine: "0",
                    nb_sl_pain: "0",
                    nb_sl_fromage: "0",
                    nb_ma_pain: "0",
                    nb_ma_fromage: "0",
                });
        };
    });
}

// Initialisation : Ouverture de la DB et chargement des compteurs
openDB().then(() => {
    loadCounters().then(({ nb_pain, nb_fromage, nb_bras, nb_tartine, nb_sl_pain, nb_sl_fromage, nb_ma_pain, nb_ma_fromage }) => {
        document.getElementById("cnt-pain").textContent = BigInt(nb_pain);
        document.getElementById("cnt-fromage").textContent = BigInt(nb_fromage);
        document.getElementById("cnt-bras").textContent = BigInt(nb_bras);
        document.getElementById("cnt-tartine").textContent = BigInt(nb_tartine);
        document.getElementById("cnt-slicer-pain").textContent = BigInt(nb_sl_pain);
        document.getElementById("cnt-slicer-fromage").textContent = BigInt(nb_sl_fromage);
        document.getElementById("cnt-machine-pain").textContent = BigInt(nb_ma_pain);
        document.getElementById("cnt-machine-fromage").textContent = BigInt(nb_ma_fromage);
        cnt_nb_pain = BigInt(nb_pain);
        cnt_nb_fromage = BigInt(nb_fromage);
        cnt_nb_bras = BigInt(nb_bras);
        cnt_nb_tartine = BigInt(nb_tartine);
        cnt_slicer_pain = BigInt(nb_sl_pain);
        cnt_slicer_fromage = BigInt(nb_sl_fromage);
        cnt_machine_pain = BigInt(nb_ma_pain);
        cnt_machine_fromage = BigInt(nb_ma_fromage);
        updateCntValues();
    });
});

// --------------------
isOnTabUI = false;
const tab = document.getElementById("tab");
isWasInside = false;

document.addEventListener("mousemove", (event) => {
    const rect = tab.getBoundingClientRect();
    const inside = (
        event.clientX >= rect.left -50 &&
        event.clientX <= rect.right +50 &&
        event.clientY >= rect.top -50 &&
        event.clientY <= rect.bottom +50
    );

    if (inside) {
        // console.log("Souris à l'intérieur !");
        isOnTabUI = true;
        isWasInside = true;
        document.body.classList.add("show-cursor");
        knife.classList.add("disabled");
        knifeBlood.classList.add("disabled");
    } else {
        if (isWasInside) {
            // console.log("Souris à l'extérieur !");
            isOnTabUI = false;
            document.body.classList.remove("show-cursor");
            knife.classList.remove("disabled");
            knifeBlood.classList.add("disabled");
            isWasInside = false;
        }
    }
});

//

const story = new Audio("sounds/painfromage.mp3");
story.loop = true;
isGameON = false;
//
isFromage = true;
isPain = true;
isOuille = true;
//
const bgAmbiant = new Audio("sounds/casino-ambiance.mp3");
bgAmbiant.loop = true;
bgAmbiant.volume = 0.4;

CntPain = document.getElementById('cnt-pain');
CntFromage = document.getElementById('cnt-fromage');
CntBras = document.getElementById('cnt-bras');
CntTartine = document.getElementById('cnt-tartine');
//
CntSlicerPain = document.getElementById('cnt-slicer-pain');
CntSlicerFromage = document.getElementById('cnt-slicer-fromage');
CntMachinePain = document.getElementById('cnt-machine-pain');
CntMachineFromage = document.getElementById('cnt-machine-fromage');
//

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
        playAtSecond(0);
    }, 5000);
}

let slicePainSound = new Audio("sounds/slice-pain.mp3");
slicePainSound.currentTime = 2000;
slicePainSound.volume = 1;
function slice_pain_sound() {
    slicePainSound.play();
    setTimeout(() => {
        slicePainSound.pause();
        slicePainSound.currentTime = 2000;
    }, 2000);
}

let sliceFromageSound = new Audio("sounds/slice-fromage.mp3");
sliceFromageSound.playbackRate = 1.5;
sliceFromageSound.currentTime = 200;
sliceFromageSound.volume = 1;
function slice_fromage_sound() {
    sliceFromageSound.play();
    setTimeout(() => {
        sliceFromageSound.pause();
        sliceFromageSound.currentTime = 200;
    }, 900);
}

function do_nothing() {
}

function play_sound_effect(message) {
    if (message === 'fromage') {
        sliceAnimation();
        slice_fromage_sound();
        //
        addFromage();
        //
        var fnct = [le_fromage];
        var r = fnct[Math.floor(Math.random() * fnct.length)];
        r();
    }
    if (message === 'pain') {
        sliceAnimation();
        slice_pain_sound();
        //
        addPain();
        //
        var fnct = [le_pain];
        var r = fnct[Math.floor(Math.random() * fnct.length)];
        r();
    }
    if (message === 'bras') {
        //
        addBras();
        //
        var fnct = [ouille_et_cest_lerreur, ouille_aieuh_oooh];
        var r = fnct[Math.floor(Math.random() * fnct.length)];
        r();
    }
}

function formatNPT(str) {
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function updateCntValues() {
    CntFromage.innerHTML = formatNPT(cnt_nb_fromage.toString());
    CntPain.innerHTML = formatNPT(cnt_nb_pain.toString());
    CntBras.innerHTML = formatNPT(cnt_nb_bras.toString());
    CntTartine.innerHTML = formatNPT(cnt_nb_tartine.toString());
    CntSlicerPain.innerHTML = formatNPT(cnt_slicer_pain.toString());
    CntSlicerFromage.innerHTML = formatNPT(cnt_slicer_fromage.toString());
    CntMachinePain.innerHTML = formatNPT(cnt_machine_pain.toString());
    CntMachineFromage.innerHTML = formatNPT(cnt_machine_fromage.toString());
    //
    saveCounters(cnt_nb_pain.toString(),
                cnt_nb_fromage.toString(),
                cnt_nb_bras.toString(),
                cnt_nb_tartine.toString(),
                cnt_slicer_pain.toString(),
                cnt_slicer_fromage.toString(),
                cnt_machine_pain.toString(),
                cnt_machine_fromage.toString(),
            );
    //
    if (cnt_nb_pain < 1 || cnt_nb_fromage < 1)
        btnTartine.classList.add('disabled');
    else
        btnTartine.classList.remove('disabled');
    //
    if (cnt_nb_bras < 10) {
        btnSlicerPain.classList.add('disabled');
        btnSlicerFromage.classList.add('disabled');
    }
    else {
        btnSlicerPain.classList.remove('disabled');
        btnSlicerFromage.classList.remove('disabled');
    }
    //
    if (cnt_slicer_pain < 10 || cnt_nb_bras < 10 || cnt_nb_pain < 10 || cnt_nb_tartine < 10) {
        btnMachinePain.classList.add('disabled');
    }
    else {
        btnMachinePain.classList.remove('disabled');
    }
    //
    if (cnt_slicer_fromage < 10 || cnt_nb_bras < 10 || cnt_nb_fromage < 10 || cnt_nb_tartine < 10) {
        btnMachineFromage.classList.add('disabled');
    }
    else {
        btnMachineFromage.classList.remove('disabled');
    }
    //
}

function ActiveKnifeBlood() {
    knife.classList.add("disabled");
    knifeBlood.classList.remove("disabled");
    setTimeout(function () {
        if (isWasInside) {
            knifeBlood.classList.add("disabled");
            knife.classList.add("disabled");
            return;
        }
        knifeBlood.classList.add("disabled");
        knife.classList.remove("disabled");
    }, 10000);
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
    //
    if (cnt_slicer_pain > 0) {
        if (cnt_machine_pain > 0) {
            cnt_nb_pain += 1n * ((1n + cnt_slicer_pain) * 3n) * (cnt_machine_pain * cnt_machine_pain * 9n);
        }
        else {
            cnt_nb_pain += 1n * (cnt_slicer_pain * 3n);
        }
    }
    else {
        cnt_nb_pain += 1n;
    }
    //
    updateCntValues();
}

function addFromage() {
    //
    if (cnt_slicer_fromage > 0) {
        if (cnt_machine_fromage > 0) {
            cnt_nb_fromage += 1n * ((1n + cnt_slicer_fromage) * 3n) * (cnt_machine_fromage * cnt_machine_fromage * 9n);
        }
        else {
            cnt_nb_fromage += 1n * (cnt_slicer_fromage * 3n); // BigInt
        }
    }
    else {
        cnt_nb_fromage += 1n;
    }
    //
    updateCntValues();
}

function addBras() {
    // console.warn('addBras() + ActiveKnifeBlood()');
    ActiveKnifeBlood();
    cnt_nb_bras += 1n;
    //
    updateCntValues();
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
                    if (isOnTabUI)
                        return;
                    // console.log("Path cliqué !");
                    // alert(message);
                    play_sound_effect(message);
                    event.stopPropagation(); // Empêche la propagation de l'événement
                });
            });
            // console.log("Détection de clics sur les paths activée !");
        })
        .catch(error => {
            console.error('Erreur lors du chargement du SVG :', error);
        });
}

function init() {
    chargerSVG('img/lefromage.svg', 'svgContainer', 'fromage');
    chargerSVG('img/lepain.svg', 'svgContainer2', 'pain'); ``



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
    bgAmbiant.play();
    cursor.classList.remove("disabled");
    CntTab.classList.remove('disabled');
    knife.classList.remove("disabled");

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
        if (isOnTabUI)
            return;
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
        var offsetX = 100;  // Décalage vers la gauche
        var offsetY = 100;  // Décalage vers le bas

        // Calcule la position de la souris pour centrer l'image dessus
        var cursorX = event.pageX - cursorImg.width / 2 + offsetX;
        var cursorY = event.pageY - cursorImg.height / 2 + offsetY;

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
img10 = document.getElementById("t10");
img11 = document.getElementById("t11");
img12 = document.getElementById("t12");
img13 = document.getElementById("t13");
var imgsTV = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13];

function tv_roll() {
    // console.log('tv_roll()');
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

function sliceAnimation() {
    knife.classList.add("tremble");
    knifeBlood.classList.add("tremble");
    setTimeout(() => {
        knife.classList.remove("tremble");
        knifeBlood.classList.remove("tremble");
    }, 2000);
}

// ------------ BUTTON MAKE TARTINE
btnTartine.addEventListener("click", function () {
    makeTartine();
});
function makeTartine() {
    if (cnt_nb_pain >= 1000000000n && cnt_nb_fromage >= 1000000000n) {
        cnt_nb_pain -= 1000000n; // BigInt
        cnt_nb_fromage -= 1000000n;
        cnt_nb_tartine += 1000000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_pain >= 100000000n && cnt_nb_fromage >= 100000000n) {
        cnt_nb_pain -= 100000n; // BigInt
        cnt_nb_fromage -= 100000n;
        cnt_nb_tartine += 100000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_pain >= 10000000n && cnt_nb_fromage >= 10000000n) {
        cnt_nb_pain -= 10000n; // BigInt
        cnt_nb_fromage -= 10000n;
        cnt_nb_tartine += 10000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_pain >= 1000000n && cnt_nb_fromage >= 1000000n) {
        cnt_nb_pain -= 1000n; // BigInt
        cnt_nb_fromage -= 1000n;
        cnt_nb_tartine += 1000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_pain >= 10000n && cnt_nb_fromage >= 10000n) {
        cnt_nb_pain -= 10n; // BigInt
        cnt_nb_fromage -= 10n;
        cnt_nb_tartine += 10n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_pain >= 1 && cnt_nb_fromage >= 1) {
        cnt_nb_pain -= 1n; // BigInt
        cnt_nb_fromage -= 1n;
        cnt_nb_tartine += 1n;
        updateCntValues();
        return;
    }
}

// ------------ BUTTON MAKE SLICER PAIN
btnSlicerPain.addEventListener("click", function () {
    makeSlicerPain();
});
function makeSlicerPain() {
    if (cnt_nb_bras >= 10000000000n) {
        cnt_nb_bras -= 10000000000n;
        cnt_slicer_pain += 1000000000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 1000000000n) {
        cnt_nb_bras -= 1000000000n;
        cnt_slicer_pain += 100000000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 100000000n) {
        cnt_nb_bras -= 100000000n;
        cnt_slicer_pain += 10000000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 10000000n) {
        cnt_nb_bras -= 10000000n;
        cnt_slicer_pain += 1000000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 1000000n) {
        cnt_nb_bras -= 1000000n;
        cnt_slicer_pain += 100000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 100000n) {
        cnt_nb_bras -= 100000n;
        cnt_slicer_pain += 10000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 10000n) {
        cnt_nb_bras -= 10000n;
        cnt_slicer_pain += 1000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 1000n) {
        cnt_nb_bras -= 1000n;
        cnt_slicer_pain += 100n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 100n) {
        cnt_nb_bras -= 100n;
        cnt_slicer_pain += 10n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 10n) {
        cnt_nb_bras -= 10n;
        cnt_slicer_pain += 1n;
        updateCntValues();
        return;
    }
}

// ------------ BUTTON MAKE SLICER FROMAGE
btnSlicerFromage.addEventListener("click", function () {
    makeSlicerFromage();
});
function makeSlicerFromage() {
    if (cnt_nb_bras >= 10000000000n) {
        cnt_nb_bras -= 10000000000n;
        cnt_slicer_fromage += 1000000000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 1000000000n) {
        cnt_nb_bras -= 1000000000n;
        cnt_slicer_fromage += 100000000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 100000000n) {
        cnt_nb_bras -= 100000000n;
        cnt_slicer_fromage += 10000000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 10000000n) {
        cnt_nb_bras -= 10000000n;
        cnt_slicer_fromage += 1000000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 1000000n) {
        cnt_nb_bras -= 1000000n;
        cnt_slicer_fromage += 100000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 100000n) {
        cnt_nb_bras -= 100000n;
        cnt_slicer_fromage += 10000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 10000) {
        cnt_nb_bras -= 10000n;
        cnt_slicer_fromage += 1000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 1000) {
        cnt_nb_bras -= 1000n;
        cnt_slicer_fromage += 100n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 100) {
        cnt_nb_bras -= 100n;
        cnt_slicer_fromage += 10n;
        updateCntValues();
        return;
    }
    if (cnt_nb_bras >= 10) {
        cnt_nb_bras -= 10n;
        cnt_slicer_fromage += 1n;
        updateCntValues();
        return;
    }
}

// ------------ BUTTON MAKE MACHINE PAIN
btnMachinePain.addEventListener("click", function () {
    makeMachinePain();
});
function makeMachinePain() {
    if (cnt_slicer_pain >= 100000 && cnt_nb_bras >= 100000 && cnt_nb_pain >= 100000 && cnt_nb_tartine >= 100000) {
        cnt_slicer_pain -= 100000n;
        cnt_nb_bras -= 100000n;
        cnt_nb_pain -= 100000n;
        cnt_nb_tartine -= 100000n;
        cnt_machine_pain += 10000n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_pain >= 10000 && cnt_nb_bras >= 10000 && cnt_nb_pain >= 10000 && cnt_nb_tartine >= 10000) {
        cnt_slicer_pain -= 10000n;
        cnt_nb_bras -= 10000n;
        cnt_nb_pain -= 10000n;
        cnt_nb_tartine -= 10000n;
        cnt_machine_pain += 1000n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_pain >= 1000 && cnt_nb_bras >= 1000 && cnt_nb_pain >= 1000 && cnt_nb_tartine >= 1000) {
        cnt_slicer_pain -= 1000n;
        cnt_nb_bras -= 1000n;
        cnt_nb_pain -= 1000n;
        cnt_nb_tartine -= 1000n;
        cnt_machine_pain += 100n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_pain >= 100 && cnt_nb_bras >= 100 && cnt_nb_pain >= 100 && cnt_nb_tartine >= 100) {
        cnt_slicer_pain -= 100n;
        cnt_nb_bras -= 100n;
        cnt_nb_pain -= 100n;
        cnt_nb_tartine -= 100n;
        cnt_machine_pain += 10n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_pain >= 10 && cnt_nb_bras >= 10 && cnt_nb_pain >= 10 && cnt_nb_tartine >= 10) {
        cnt_slicer_pain -= 10n;
        cnt_nb_bras -= 10n;
        cnt_nb_pain -= 10n;
        cnt_nb_tartine -= 10n;
        cnt_machine_pain += 1n;
        updateCntValues();
        return;
    }
}

// ------------ BUTTON MAKE MACHINE PAIN
btnMachineFromage.addEventListener("click", function () {
    makeMachineFromage();
});
function makeMachineFromage() {
    if (cnt_slicer_fromage >= 100000 && cnt_nb_bras >= 100000 && cnt_nb_fromage >= 100000 && cnt_nb_tartine >= 100000) {
        cnt_slicer_fromage -= 100000n;
        cnt_nb_bras -= 100000n;
        cnt_nb_fromage -= 100000n;
        cnt_nb_tartine -= 100000n;
        cnt_machine_fromage += 10000n;
        updateCntValues();
        return;
    }
    if (cnt_slicer_fromage >= 10000 && cnt_nb_bras >= 10000 && cnt_nb_fromage >= 10000 && cnt_nb_tartine >= 10000) {
        cnt_slicer_fromage -= 10000n;
        cnt_nb_bras -= 10000n;
        cnt_nb_fromage -= 10000n;
        cnt_nb_tartine -= 10000n;
        cnt_machine_fromage += 1000n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_fromage >= 1000 && cnt_nb_bras >= 1000 && cnt_nb_fromage >= 1000 && cnt_nb_tartine >= 1000) {
        cnt_slicer_fromage -= 1000n;
        cnt_nb_bras -= 1000n;
        cnt_nb_fromage -= 1000n;
        cnt_nb_tartine -= 1000n;
        cnt_machine_fromage += 100n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_fromage >= 100 && cnt_nb_bras >= 100 && cnt_nb_fromage >= 100 && cnt_nb_tartine >= 100) {
        cnt_slicer_fromage -= 100n;
        cnt_nb_bras -= 100n;
        cnt_nb_fromage -= 100n;
        cnt_nb_tartine -= 100n;
        cnt_machine_fromage += 10n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_fromage >= 10 && cnt_nb_bras >= 10 && cnt_nb_fromage >= 10 && cnt_nb_tartine >= 10) {
        cnt_slicer_fromage -= 10n;
        cnt_nb_bras -= 10n;
        cnt_nb_fromage -= 10n;
        cnt_nb_tartine -= 10n;
        cnt_machine_fromage += 1n;
        updateCntValues();
        return;
    }
}

function hasChance(pourcentage) {
    return Math.random() * 100 < pourcentage;
}

// ----- MACHINE A PAIN
function AutoMachines() {
    if (isGameON === false)
        return;

    if (cnt_machine_pain >= 1) {
        cnt_nb_pain += 1n * ((1n + cnt_slicer_pain) * 3n) * (cnt_machine_pain * cnt_machine_pain * 9n);
        if (hasChance(10)) {
            cnt_nb_bras += cnt_machine_pain + cnt_slicer_pain / 2n;
            cnt_nb_tartine += cnt_machine_pain;
        }
    }
    if (cnt_machine_fromage >= 1) {
        cnt_nb_fromage += 1n * ((1n + cnt_slicer_fromage) * 3n) * (cnt_machine_fromage * cnt_machine_fromage * 9n);
        if (hasChance(10)) {
            cnt_nb_bras += cnt_machine_fromage + cnt_slicer_fromage / 2n;
            cnt_nb_tartine += cnt_machine_fromage;
        }
    }
    if (cnt_machine_pain >= 1 || cnt_machine_fromage >= 1) {
        updateCntValues();
    }
}

setInterval(AutoMachines, 250);

