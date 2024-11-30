// Initialiser le canvas et le contexte
const canvas = document.getElementById('city-canvas');
const ctx = canvas.getContext('2d');

// Définir la taille du canvas (le plan de la ville)
canvas.width = 1400;
canvas.height = 900;
const numberOfPolygons = 5; // Nombre de polygones convexes
const numberOfBezierCurves = 1;
const numberOfStraightLines = 1; // Nouveau nombre de lignes droites
const lineWidth = 1;

// Tableau pour stocker les données des courbes, des lignes droites et des polygones
const curvesData = [];
const straightLinesData = [];
const polygonsData = [];

// Fonction pour générer un point aléatoire dans le plan
function getRandomPoint() {
    return { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
}

// Fonction pour générer un polygone convexe avec un nombre de côtés entre 3 et 5
function generateConvexPolygon() {
    const sides = Math.floor(Math.random() * 3) + 3;  // 3 à 5 côtés
    const center = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
    const radius = Math.random() * 200 + 50; // Rayon du polygone
    const angleStep = Math.PI * 2 / sides;

    const vertices = [];
    for (let i = 0; i < sides; i++) {
        const angle = angleStep * i;
        const vertex = {
            x: center.x + radius * Math.cos(angle),
            y: center.y + radius * Math.sin(angle)
        };
        vertices.push(vertex);
    }
    return vertices;
}

// Fonction pour dessiner un polygone
function drawPolygon(vertices) {
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.closePath();
    ctx.stroke();
}

// Fonction pour générer une courbe de Bézier cubique dans un polygone
function generateBezierCurveInPolygon(polygonVertices) {
    const P0 = polygonVertices[Math.floor(Math.random() * polygonVertices.length)];
    const P1 = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
    const P2 = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
    const P3 = polygonVertices[Math.floor(Math.random() * polygonVertices.length)];

    curvesData.push({ P0, P1, P2, P3 });

    ctx.beginPath();
    ctx.moveTo(P0.x, P0.y);
    ctx.bezierCurveTo(P1.x, P1.y, P2.x, P2.y, P3.x, P3.y);
    ctx.stroke();
}

// Fonction pour générer une ligne droite dans un polygone
function generateStraightLineInPolygon(polygonVertices) {
    const P0 = polygonVertices[Math.floor(Math.random() * polygonVertices.length)];
    const P1 = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };

    straightLinesData.push({ P0, P1 });

    ctx.beginPath();
    ctx.moveTo(P0.x, P0.y);
    ctx.lineTo(P1.x, P1.y);
    ctx.stroke();
}

// Fonction pour afficher les données des courbes et lignes droites dans la console
function logCurvesAndLinesData() {
    console.log('Données des courbes de Bézier :');
    curvesData.forEach((curve, index) => {
        console.log(`Courbe ${index + 1}:`);
        console.log(`P0: (${curve.P0.x.toFixed(2)}, ${curve.P0.y.toFixed(2)})`);
        console.log(`P1: (${curve.P1.x.toFixed(2)}, ${curve.P1.y.toFixed(2)})`);
        console.log(`P2: (${curve.P2.x.toFixed(2)}, ${curve.P2.y.toFixed(2)})`);
        console.log(`P3: (${curve.P3.x.toFixed(2)}, ${curve.P3.y.toFixed(2)})`);
    });

    console.log('Données des lignes droites :');
    straightLinesData.forEach((line, index) => {
        console.log(`Ligne droite ${index + 1}:`);
        console.log(`P0: (${line.P0.x.toFixed(2)}, ${line.P0.y.toFixed(2)})`);
        console.log(`P1: (${line.P1.x.toFixed(2)}, ${line.P1.y.toFixed(2)})`);
    });
}

// Fonction principale pour initialiser la ville
function initCityPlan() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Nettoyer le canvas
    ctx.strokeStyle = 'black';
    ctx.lineWidth = lineWidth;

    // Générer et dessiner des polygones convexes
    for (let i = 0; i < numberOfPolygons; i++) {
        const polygon = generateConvexPolygon();
        polygonsData.push(polygon);
        drawPolygon(polygon);
    }

    // Appliquer les courbes et lignes droites dans chaque polygone
    polygonsData.forEach(polygon => {
        for (let i = 0; i < numberOfBezierCurves; i++) {
            generateBezierCurveInPolygon(polygon);
        }
        for (let i = 0; i < numberOfStraightLines; i++) {
            generateStraightLineInPolygon(polygon);
        }
    });

    // Afficher les données dans la console
    logCurvesAndLinesData();
}

initCityPlan();
