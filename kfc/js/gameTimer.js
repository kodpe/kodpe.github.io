let startTime = null;
let timerInterval = null;

export function startGameTimer() {
    startTime = Date.now(); // Enregistre l'heure de début
    // Commence le chronomètre
    timerInterval = setInterval(updateTimer, 1000); // Met à jour toutes les secondes
}

function updateTimer() {
    const elapsedTime = Date.now() - startTime; // Temps écoulé en millisecondes
    const seconds = Math.floor(elapsedTime / 1000) % 60; // Secondes
    const minutes = Math.floor(elapsedTime / 60000); // Minutes

    // Affiche le temps sous le format MM:SS
    document.getElementById("game-timer").innerText = 
        `${pad(minutes)}:${pad(seconds)}`;
}

// Fonction pour ajouter un 0 devant si le nombre est inférieur à 10
function pad(number) {
    return number < 10 ? "0" + number : number;
}

export function stopGameTimer() {
    clearInterval(timerInterval); // Arrête le chronomètre
    console.log("Partie terminée !");
}

// Appel pour démarrer le chronomètre quand la partie commence
// startGameTimer();
