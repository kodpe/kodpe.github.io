// -------------------- DESACTIVER LE COUTEAU AU DESSUS DE L'UI ----
let isOnTabUI = false;
let isWasInside = false;
const tab = document.getElementById("tab");
const volumeContainer = document.getElementById("volume-container");
const tvContainer = document.getElementById("container-tv");
const placeCnt = document.getElementById("place-name");

document.addEventListener("mousemove", (event) => {
    const rect = tab.getBoundingClientRect();
    const inside = (
        event.clientX >= rect.left -50 &&
        event.clientX <= rect.right +50 &&
        event.clientY >= rect.top -50 &&
        event.clientY <= rect.bottom +50
    );
    const rect2 = volumeContainer.getBoundingClientRect();
    const inside2 = (
        event.clientX >= rect2.left -100 &&
        event.clientX <= rect2.right +100 &&
        event.clientY >= rect2.top -100 &&
        event.clientY <= rect2.bottom +100
    );
    const rect3 = tvContainer.getBoundingClientRect();
    const inside3 = (
        event.clientX >= rect3.left -50 &&
        event.clientX <= rect3.right +50 &&
        event.clientY >= rect3.top -50 &&
        event.clientY <= rect3.bottom +50
    );
    const rect4 = placeCnt.getBoundingClientRect();
    const inside4 = (
        event.clientX >= rect4.left -100 &&
        event.clientX <= rect4.right +100 &&
        event.clientY >= rect4.top -100 &&
        event.clientY <= rect4.bottom +100
    );

    if (inside || inside2 || inside3 || inside4) {
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