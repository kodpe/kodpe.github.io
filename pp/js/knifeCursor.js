import { mouseStates } from "./autoDiv.js";

// -------------------- DESACTIVER LE COUTEAU AU DESSUS DE L'UI ----
export let isOnTabUI = false;
export let isWasInside = false;
const tab = document.getElementById("tab");
const tvContainer = document.getElementById("container-tv");
const knife = document.getElementById("knife");
const knifeBlood = document.getElementById("knife-blood");

document.addEventListener("mousemove", (event) => {
    const rect = tab.getBoundingClientRect();
    const hoverTab = (
        event.clientX >= rect.left -50 &&
        event.clientX <= rect.right +50 &&
        event.clientY >= rect.top -50 &&
        event.clientY <= rect.bottom +50
    );
    const rect3 = tvContainer.getBoundingClientRect();
    const hoverTv = (
        event.clientX >= rect3.left -50 &&
        event.clientX <= rect3.right +50 &&
        event.clientY >= rect3.top -50 &&
        event.clientY <= rect3.bottom +50
    );

    if (hoverTab || hoverTv || mouseStates.hoverUI) {
        isOnTabUI = true;
        isWasInside = true;
        document.body.classList.add("show-cursor");
        knife.classList.add("disabled");
        knifeBlood.classList.add("disabled");
    }
    else {
        if (isWasInside) {
            isOnTabUI = false;
            document.body.classList.remove("show-cursor");
            knife.classList.remove("disabled");
            knifeBlood.classList.add("disabled");
            isWasInside = false;
        }
    }
});
// --- DESACTIVER LE COUTEAU SUR UI END ---------//

export function sliceAnimation() {
    knife.classList.add("tremble");
    knifeBlood.classList.add("tremble");
    setTimeout(() => {
        knife.classList.remove("tremble");
        knifeBlood.classList.remove("tremble");
    }, 2000);
}

export function ActiveKnifeBlood() {
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