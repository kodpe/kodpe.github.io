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

const svgRefresh = popupOverlay.querySelector("#svg-refresh");
svgRefresh.addEventListener('mouseenter', function (event) {
    svgRefresh.setAttribute("fill", "#333");
});
svgRefresh.addEventListener('mouseleave', function (event) {
    svgRefresh.setAttribute("fill", "#777");
});

const svgAudio = popupOverlay.querySelector("#svg-audio");
svgAudio.addEventListener('mouseenter', function (event) {
    svgAudio.setAttribute("fill", "#333");
});
svgAudio.addEventListener('mouseleave', function (event) {
    svgAudio.setAttribute("fill", "#777");
});

const svgHelp = popupOverlay.querySelector("#svg-help");
svgHelp.addEventListener('mouseenter', function (event) {
    svgHelp.setAttribute("fill", "#333");
});
svgHelp.addEventListener('mouseleave', function (event) {
    svgHelp.setAttribute("fill", "#777");
});