const canvas = document.getElementById('city-canvas');
const ctx = canvas.getContext('2d');

// Taille du canevas
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

// Paramètres de la ville
const maxLines = 20; // Maximum de rues/boulevards à dessiner
const maxParallelLines = 5; // Nombre maximum de lignes parallèles (pour largeur des boulevards)
const maxCurve = 0.3; // Courbure maximale des rues

// Fonction pour générer une rue (ligne droite ou courbe)
function generateStreet() {
    // Position de départ et fin (aléatoire)
    const x1 = Math.random() * canvas.width;
    const y1 = Math.random() * canvas.height;
    const x2 = Math.random() * canvas.width;
    const y2 = Math.random() * canvas.height;

    // Déterminer le nombre de lignes parallèles (plus il y en a, plus c'est un grand boulevard)
    const parallelCount = Math.floor(Math.random() * maxParallelLines) + 1;

    // Dessiner chaque ligne parallèle
    for (let i = 0; i < parallelCount; i++) {
        const offset = i * 10; // Écart entre les lignes parallèles

        // Légère courbure aléatoire
        const curveFactor = (Math.random() - 0.5) * maxCurve;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(
            x1 + (x2 - x1) * curveFactor,
            y1 + (y2 - y1) * curveFactor,
            x2 + offset, y2 + offset
        );
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }
}

// Générer des rues aléatoires
for (let i = 0; i < maxLines; i++) {
    generateStreet();
}
