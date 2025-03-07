import { URL } from "./constants.js";
import { cnt_machine_pain, cnt_machine_fromage } from "./itemsManager.js";
import { setupAudio, setVolume, playSounds, pauseSounds, initPageSoundsArrayVolumeRatio } from "./volume.js";
import { updatePageDB } from "./database.js";
// TELEVISION ROLL
// TODO faire nouvelle television plus belle
const imgsTV = Array.from({ length: 15 }, (_, i) => document.getElementById(`t${i + 1}`));

let currentIndex = Math.floor(Math.random() * imgsTV.length); // Image de départ aléatoire

function tv_roll() {
    // Désactiver toutes les images
    imgsTV.forEach(img => img.classList.add('disabled'));

    // Activer l'image actuelle
    imgsTV[currentIndex].classList.remove('disabled');

    // Passer à l'image suivante (boucle infinie)
    currentIndex = (currentIndex + 1) % imgsTV.length;
    if ((currentIndex === 5 || currentIndex === 9) && (cnt_machine_pain === 0 || cnt_machine_fromage === 0))
        currentIndex++;

    // Relancer le roulement
    setTimeout(tv_roll, 2000);
}
tv_roll();

const button = setupAudio('sounds/old-button.mp3', 1, false);

let btnTV = document.getElementById('btn-tv');
btnTV.addEventListener('click', function () {
    console.log('click on tv:', currentIndex);
    button.play();
    if (currentIndex === 5) {
        console.log("GOTO TV STREET");
        updatePageDB(3, { found: true });
        window.location.href = URL.STREET;
    }
    else if (currentIndex === 9) {
        console.log("GOTO TV PARK");
        updatePageDB(1, { found: true });
        window.location.href = URL.PARK;
    }
    else {
    }

});