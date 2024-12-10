const popupOverlay = document.getElementById("popup-overlay");
const popupContent = popupOverlay.querySelector(".popup");

function showPopup() {
    popupOverlay.classList.add("visible");
}

function hidePopup() {
    popupOverlay.classList.remove("visible");
}

popupOverlay.addEventListener("click", (e) => {
    if (!popupContent.contains(e.target)) { // Si le clic est en dehors du contenu
        hidePopup();
    }
});
