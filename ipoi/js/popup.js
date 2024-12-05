const popupOverlay = document.getElementById("popup-overlay");
const confirmButton = popupOverlay.querySelector(".confirm");
const cancelButton = popupOverlay.querySelector(".cancel");
const popupContent = popupOverlay.querySelector(".popup");

function showPopup() {
    let popupWarning = document.getElementById("popup-warning");
    if (!popupWarning) {
        console.error("L'élément 'popup-warning' n'a pas été trouvé dans le DOM.");
        return;
    }
    popupWarning.innerHTML = ``;
    if (currentSite.icon.includes("nsfw")) {
        popupWarning.innerHTML += `
        <div class="warntitle">NSFW WARNING</div>This site contains sexually explicit images or references and may not be suitable for all audiences.<br><br>
        `;
    }
    if (currentSite.icon.includes("photowarning")) {
        popupWarning.innerHTML += `
        <div class="warntitle">MEDICAL WARNING</div>This site contains flashing lights or images that may trigger seizures in people with photosensitive epilepsy.<br><br>
        `;
    }
    popupOverlay.classList.add("visible");
}

function hidePopup() {
    popupOverlay.classList.remove("visible");
    currentSite = {};
}

cancelButton.addEventListener("click", hidePopup);

confirmButton.addEventListener("click", () => {
    window.open(currentSite.url, "_blank");
    currentSite = {};
    hidePopup();
});

popupOverlay.addEventListener("click", (e) => {
    if (!popupContent.contains(e.target)) { // Si le clic est en dehors du contenu
        hidePopup();
    }
});
