/**************** */
// VOLUME
const volumeContainer = document.createElement('div');
volumeContainer.id = 'volume-container';
volumeContainer.classList.add('PDA');

const volumeIcon = document.createElement('span');
volumeIcon.classList.add('material-icons');

const svgVolume = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svgVolume.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
svgVolume.setAttribute('height', '24px');
svgVolume.setAttribute('viewBox', '0 -960 960 960');
svgVolume.setAttribute('width', '24px');
svgVolume.setAttribute('fill', '#e8eaed');

const pathVolume = document.createElementNS('http://www.w3.org/2000/svg', 'path');
pathVolume.setAttribute('d', 'M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320Z');
svgVolume.appendChild(pathVolume);
volumeIcon.appendChild(svgVolume);
volumeContainer.appendChild(volumeIcon);

const volumeSlider = document.createElement('input');
volumeSlider.setAttribute('type', 'range');
volumeSlider.setAttribute('id', 'volumeSlider');
volumeSlider.setAttribute('min', '0');
volumeSlider.setAttribute('max', '100');
volumeSlider.setAttribute('value', '50');
volumeContainer.appendChild(volumeSlider);

// Ajout du container de volume au body
document.body.appendChild(volumeContainer);

/**************** */
// PLACE NAME

// Création du nom de l'endroit
const placeName = document.createElement('div');
placeName.id = 'place-name';
placeName.classList.add('PDA');
placeName.textContent = '';
document.body.appendChild(placeName);

export function setPlaceName(name) {
    if (window.page === "kitchen") {
        placeName.textContent = "la cuisine";
    }
    else if (window.page === "park") {
        placeName.textContent = "le parc";
    }
    else if (window.page === "domain") {
        placeName.textContent = "le domaine";
    }
    else if (window.page === "street") {
        placeName.textContent = "la rue";
    }
    else
        placeName.textContent = "nan";
}


/**************** */
// BUTTONS PLACES

// Création des boutons
const btnPlaceLeft = document.createElement('button');
btnPlaceLeft.id = 'btn-place-left';
btnPlaceLeft.classList.add('btn-place');

const svgLeft = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svgLeft.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
svgLeft.setAttribute('height', '40px');
svgLeft.setAttribute('viewBox', '0 -960 960 960');
svgLeft.setAttribute('width', '40px');
svgLeft.setAttribute('fill', '#121218');

const pathLeft = document.createElementNS('http://www.w3.org/2000/svg', 'path');
pathLeft.setAttribute('d', 'm313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z');
svgLeft.appendChild(pathLeft);
btnPlaceLeft.appendChild(svgLeft);

document.body.appendChild(btnPlaceLeft);

const btnPlaceRight = document.createElement('button');
btnPlaceRight.id = 'btn-place-right';
btnPlaceRight.classList.add('btn-place');

const svgRight = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svgRight.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
svgRight.setAttribute('height', '40px');
svgRight.setAttribute('viewBox', '0 -960 960 960');
svgRight.setAttribute('width', '40px');
svgRight.setAttribute('fill', '#121218');

const pathRight = document.createElementNS('http://www.w3.org/2000/svg', 'path');
pathRight.setAttribute('d', 'M673-446.67H160v-66.66h513l-240-240L480-800l320 320-320 320-47-46.67 240-240Z');
svgRight.appendChild(pathRight);
btnPlaceRight.appendChild(svgRight);

document.body.appendChild(btnPlaceRight);

function listener() {
    window.location.href = newUrl;
}
function updateEventListener(btn, newUrl) {
    function listener() {
        window.location.href = newUrl;
    }
    btn.removeEventListener('click', listener);
    btn.addEventListener('click', listener);
}

btnPlaceLeft.classList.add('btn-lock');
btnPlaceRight.classList.add('btn-lock');

export function setBtnLeftPlace(url) {
    if (url === null) {
        btnPlaceLeft.removeEventListener('click', listener);
        return;
    }
    updateEventListener(btnPlaceLeft, url);
    btnPlaceLeft.classList.remove('btn-lock');
}

export function setBtnRightPlace(url) {
    if (url === null) {
        btnPlaceRight.removeEventListener('click', listener);
        return;
    }
    updateEventListener(btnPlaceRight, url);
    btnPlaceRight.classList.remove('btn-lock');
}

// États des survols
export const mouseStates = {
    hoverUI: false,
    leftButtonHover: false,
    rightButtonHover: false,
    volumeHover: false,
    placeNameHover: false,
};

document.addEventListener("mousemove", (event) => {
    const rect0 = btnPlaceLeft.getBoundingClientRect();
    const inside0 = (
        event.clientX >= rect0.left - 100 &&
        event.clientX <= rect0.right + 100 &&
        event.clientY >= rect0.top - 100 &&
        event.clientY <= rect0.bottom + 100
    );
    mouseStates.leftButtonHover = inside0;
    const rect1 = btnPlaceRight.getBoundingClientRect();
    const inside1 = (
        event.clientX >= rect1.left - 100 &&
        event.clientX <= rect1.right + 100 &&
        event.clientY >= rect1.top - 100 &&
        event.clientY <= rect1.bottom + 100
    );
    mouseStates.rightButtonHover = inside1;
    const rect2 = volumeContainer.getBoundingClientRect();
    const inside2 = (
        event.clientX >= rect2.left - 100 &&
        event.clientX <= rect2.right + 100 &&
        event.clientY >= rect2.top - 100 &&
        event.clientY <= rect2.bottom + 100
    );
    mouseStates.volContainer = inside2;
    const rect4 = placeName.getBoundingClientRect();
    const inside3 = (
        event.clientX >= rect4.left - 100 &&
        event.clientX <= rect4.right + 100 &&
        event.clientY >= rect4.top - 100 &&
        event.clientY <= rect4.bottom + 100
    );
    mouseStates.placeNameHover = inside3;
    mouseStates.hoverUI = inside0 || inside1 || inside2 || inside3;
});

/**************** */
// DEFAULT ZOOM BLOCKER
document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) &&
        (e.key === '+' || e.key === '-' || e.key === '0')) {
        e.preventDefault(); // Empêche le zoom
    }
});

document.addEventListener('wheel', function (e) {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault(); // Empêche le zoom
    }
}, { passive: false });

/**************** */
// HIDDEN MODE
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        console.log('L’utilisateur a quitté la page (changement d’onglet ou fenêtre minimisée)');
    } else {
        console.log('L’utilisateur est revenu sur la page');
    }
});