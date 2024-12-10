const rc = document.getElementById('rc');
const rcCheck = document.getElementById('rc-check');

const userElement = document.getElementById('user-mouse-tracking');
const coords = document.getElementById('coords');

const resultDisplay = document.getElementById('chrono');
let startTime = 0;
let running = false;

rc.addEventListener('mouseenter', function (event) {
    rcCheck.classList.add("rc-check-hover");
    // userElement.classList.remove("disabled");
    if (!running) {
        startTime = performance.now();
        running = true;
        requestAnimationFrame(updateChronometer);
    }
});

rc.addEventListener('mouseleave', function (event) {
    // userElement.classList.add("disabled");
    rcCheck.classList.remove("rc-check-hover");
    running = false;
});

function resetUserElement() {
    userElement.classList.add("disabled");
}

rc.addEventListener('click', () => {
    running = false;
    userElement.classList.remove("disabled");
    setTimeout(resetUserElement, 3000);
    setTimeout(showPopup, 1000);
});

function isMouseInsideRect(event, rect) {
    const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
    return isInside;
}

rc.addEventListener('mousemove', function (event) {
    let rect = rcCheck.getBoundingClientRect();
    if (!isMouseInsideRect(event, rect))
        rect = rc.getBoundingClientRect();

    // Calculer le centre du div
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculer les coordonnées de la souris par rapport au centre du div
    const x = Math.floor(event.clientX - centerX);
    const y = Math.floor(event.clientY - centerY);

    // Mettre à jour le texte des coordonnées
    coords.textContent = `x ${x} y ${y}`;
});

function updateChronometer() {
    if (running) {
        const now = performance.now();
        const elapsedMicroseconds = Math.round((now - startTime)); // Convertir en µs
        resultDisplay.innerHTML = `${elapsedMicroseconds} ms`;
        requestAnimationFrame(updateChronometer); // Continuer la mise à jour
    }
}
