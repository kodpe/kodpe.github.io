import { URL } from "./constants.js";
import { setBtnLeftPlace, setBtnRightPlace, setPlaceName } from "./autoDiv.js";
import { setupAudio, setVolume, playSounds, pauseSounds, initPageSoundsArrayVolumeRatio } from "./volume.js";
import { isOnTabUI, isWasInside } from "./knifeCursor.js";
import { sliceAnimation, ActiveKnifeBlood } from "./knifeCursor.js";
import { updateCntValues, addPain, addFromage, incPainWithSlicers, incFromageWithSlicers, incBras } from "./itemsManager.js";
import { getPageById } from "./database.js";
// Nom de la base de données et de l'objet de stockage
window.page = "kitchen";
setPlaceName(window.page);
//
getPageById(3).then(page => { // STREET
    if (page.found)
        setBtnLeftPlace(URL.STREET);
    else
        setBtnLeftPlace(null);
});
//
getPageById(1).then(page => { // PARK
    if (page.found)
        setBtnRightPlace(URL.PARK);
    else
        setBtnRightPlace(null);
});
//
document.getElementById('place-name').classList.add("plainBG-PDA");
//
document.addEventListener("DOMContentLoaded", () => {
    //
    const story = setupAudio("sounds/painfromage.mp3", 0.6, true);
    const bgAmbiant = setupAudio("sounds/casino-ambiance.mp3", 0.4, true);
    initPageSoundsArrayVolumeRatio();
    //
    let isFromage = true;
    let isPain = true;
    let isOuille = true;
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

    function play_sound_effect(message) {
        if (message === 'fromage') {
            sliceAnimation();
            slice_fromage_sound();
            incFromageWithSlicers();
            updateCntValues();
            //
            var fnct = [le_fromage];
            var r = fnct[Math.floor(Math.random() * fnct.length)];
            r();
        }
        if (message === 'pain') {
            sliceAnimation();
            slice_pain_sound();
            incPainWithSlicers();
            updateCntValues();
            //
            var fnct = [le_pain];
            var r = fnct[Math.floor(Math.random() * fnct.length)];
            r();
        }
        if (message === 'bras') {
            //
            sliceAnimation();
            addBras();
            //
            var fnct = [ouille_et_cest_lerreur, ouille_aieuh_oooh];
            var r = fnct[Math.floor(Math.random() * fnct.length)];
            r();
        }
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


    function addBras() {
        ActiveKnifeBlood();
        incBras();
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

    const svg1 = document.getElementById("svgContainer");
    const svg2 = document.getElementById("svgContainer2");
    const bg = document.getElementById("bg-img");

    function loadGame() {
        document.addEventListener('click', function (event) {
            if (isOnTabUI)
                return;
            const clickedOnFromage = event.target.closest('#svgContainer') && event.target.closest('#svgContainer').querySelector('#fromagePath');
            const clickedOnPain = event.target.closest('#svgContainer2') && event.target.closest('#svgContainer2').querySelector('#painPath');
            // Détecter un clic global sur la page, en dehors des path et de l'UI
            if (!clickedOnFromage && !clickedOnPain) {
                play_sound_effect('bras');
                // alert("Vous avez coupé votre bas !");
            }
        });
        setTimeout(function () {
            bgAmbiant.currentTime = 0;
            story.currentTime = 0;
            bgAmbiant.play();
            story.play();
        }, 100);

    }
    function pre_init() {
        chargerSVG('img/lefromage.svg', 'svgContainer', 'fromage');
        chargerSVG('img/lepain.svg', 'svgContainer2', 'pain'); ``
        setTimeout(() => {
            loadGame();
        }, 50);
    }
    pre_init();

});