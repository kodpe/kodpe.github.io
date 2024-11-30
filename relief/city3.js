const canvas = document.getElementById('city-canvas');
const ctx = canvas.getContext('2d');
let points = [];
let cellSize = 100;
let numCols = 0;
let numRows = 0;
let variationRange = 1;

function resizeCanvas() {
    canvas.width = window.innerWidth - 10;
    canvas.height = window.innerHeight - 10;
    draw();
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

async function pause() {
    return new Promise(resolve => setTimeout(resolve, 1000));
}

async function loop() {
    while (true) {
        console.log("new tesselation");
        draw();
        await pause();
    }
}
loop();

function draw() {
    cellSize = getRandomIntBetween(60, 800);
    numCols = Math.round(canvas.width / cellSize);
    numRows = Math.round(canvas.height / cellSize);
    variationRange = cellSize / getRandomIntBetween(1, cellSize);
    minPointSeg = Math.random() * (0.5 - 0.1) + 0.1;
    maxPointSeg = Math.random() * (0.9 - 0.5) + 0.5;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = `rgba(${Math.random() * 16}, ${Math.random() * 32}, ${Math.random() * 205 + 50}, 1)`;
    points = generateGridPoints();
    delaunayTriangulation(points);
}

function getRandomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateGridPoints() {
    const points = [];
    const cellWidth = canvas.width / numCols;  // Largeur de chaque cellule
    const cellHeight = canvas.height / numRows;  // Hauteur de chaque cellule

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const centerX = col * cellWidth + cellWidth / 2;
            const centerY = row * cellHeight + cellHeight / 2;

            const randomX = centerX + (Math.random() * variationRange * 2 - variationRange); // Variation aléatoire dans la plage [-variationRange, variationRange]
            const randomY = centerY + (Math.random() * variationRange * 2 - variationRange); // Variation aléatoire dans la plage [-variationRange, variationRange]

            points.push({ x: randomX, y: randomY });
        }
    }

    function divideLine(p1, p2, n) {
        const points = [];
        const dx = (p2.x - p1.x) / n;
        const dy = (p2.y - p1.y) / n;
        for (let i = 0; i <= n; i++) {
            const x = p1.x + i * dx;
            const y = p1.y + i * dy;
            points.push({ x, y });
        }
        return points;
    }
    points.push(...divideLine({ x: 0, y: 0 }, { x: 0, y: canvas.height }, numRows+1));
    points.push(...divideLine({ x: 0, y: 0 }, { x: canvas.width, y: 0 }, numCols+1));
    points.push(...divideLine({ x: 0, y: canvas.height }, { x: canvas.width, y: canvas.height }, numCols+1));
    points.push(...divideLine({ x: canvas.width, y: 0 }, { x: canvas.width, y: canvas.height }, numRows+1));
    return points;
}

function getRandomPointOnSegment(p1, p2) {
    const t = Math.random() * (maxPointSeg - minPointSeg) + minPointSeg;
    const x = p1.x + t * (p2.x - p1.x);
    const y = p1.y + t * (p2.y - p1.y);
    return { x, y };
}

function drawCrossingLines(p1, p2, p3) {
    const pA = getRandomPointOnSegment(p1, p2); // Point sur le segment [p1, p2]
    const pB = getRandomPointOnSegment(p2, p3); // Point sur le segment [p2, p3]
    const pC = getRandomPointOnSegment(p3, p1); // Point sur le segment [p3, p1]

    ctx.beginPath();
    ctx.moveTo(pA.x, pA.y);
    ctx.lineTo(pB.x, pB.y); // Ligne entre pA et pB
    ctx.moveTo(pC.x, pC.y);
    ctx.lineTo(pA.x, pA.y); // Ligne entre pC et pA
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();
}

function drawRandomBezierCurve(p1, p2, p3) {
    // Calculer les milieux des côtés du triangle
    const middle1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    const middle2 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
    const middle3 = { x: (p3.x + p1.x) / 2, y: (p3.y + p1.y) / 2 };

    const control1 = {
        x: middle1.x + Math.random() * (middle2.x - middle1.x),
        y: middle1.y + Math.random() * (middle2.y - middle1.y)
    };
    const control2 = {
        x: middle2.x + Math.random() * (middle3.x - middle2.x),
        y: middle2.y + Math.random() * (middle3.y - middle2.y)
    };

    ctx.beginPath();
    ctx.moveTo(middle1.x, middle1.y); // Départ au milieu du premier côté
    ctx.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, middle3.x, middle3.y); // Courbe vers le milieu du dernier côté
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
}

function drawCompleteGrid(p1, p2, p3) {
    const minX = Math.min(p1.x, p2.x, p3.x);
    const maxX = Math.max(p1.x, p2.x, p3.x);
    const minY = Math.min(p1.y, p2.y, p3.y);
    const maxY = Math.max(p1.y, p2.y, p3.y);

    const gridSpacing = cellSize/30 + Math.random() * 50;

    for (let y = minY; y < maxY; y += gridSpacing) {
        const intersections = getHorizontalIntersections(y, p1, p2, p3);
        if (intersections.length === 2) {
            ctx.beginPath();
            ctx.moveTo(intersections[0], y);
            ctx.lineTo(intersections[1], y);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    for (let x = minX; x < maxX; x += gridSpacing) {
        const intersections = getVerticalIntersections(x, p1, p2, p3);
        if (intersections.length === 2) {
            ctx.beginPath();
            ctx.moveTo(x, intersections[0]);
            ctx.lineTo(x, intersections[1]);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
}

function getHorizontalIntersections(y, p1, p2, p3) {
    const x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y, x3 = p3.x, y3 = p3.y;

    function lineIntersection(x1, y1, x2, y2, y) {
        const m = (y2 - y1) / (x2 - x1);
        const x = (y - y1) / m + x1;
        return x;
    }

    let intersectionX1 = null, intersectionX2 = null, intersectionX3 = null;

    if (y >= Math.min(y1, y2) && y <= Math.max(y1, y2)) {
        intersectionX1 = lineIntersection(x1, y1, x2, y2, y);
    }
    if (y >= Math.min(y2, y3) && y <= Math.max(y2, y3)) {
        intersectionX2 = lineIntersection(x2, y2, x3, y3, y);
    }
    if (y >= Math.min(y3, y1) && y <= Math.max(y3, y1)) {
        intersectionX3 = lineIntersection(x3, y3, x1, y1, y);
    }

    return [intersectionX1, intersectionX2, intersectionX3].filter(x => x != null);
}

function getVerticalIntersections(x, p1, p2, p3) {
    const x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y, x3 = p3.x, y3 = p3.y;

    function lineIntersection(x1, y1, x2, y2, x) {
        const m = (y2 - y1) / (x2 - x1);
        const y = m * (x - x1) + y1;
        return y;
    }

    let intersectionY1 = null, intersectionY2 = null, intersectionY3 = null;

    if (x >= Math.min(x1, x2) && x <= Math.max(x1, x2)) {
        intersectionY1 = lineIntersection(x1, y1, x2, y2, x);
    }
    if (x >= Math.min(x2, x3) && x <= Math.max(x2, x3)) {
        intersectionY2 = lineIntersection(x2, y2, x3, y3, x);
    }
    if (x >= Math.min(x3, x1) && x <= Math.max(x3, x1)) {
        intersectionY3 = lineIntersection(x3, y3, x1, y1, x);
    }

    return [intersectionY1, intersectionY2, intersectionY3].filter(y => y != null);
}

function drawTriangle(p1, p2, p3) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.stroke();

        // ctx.fillStyle = `rgba(${Math.random() * 16}, ${Math.random() * 32}, ${Math.random() * 205 + 50}, 1)`;
        // ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 25}, ${Math.random() * 255}, 1)`;
        // ctx.fillStyle = `rgba(${Math.random() * 205 + 50}, ${Math.random() * 0}, ${Math.random() * 0}, 1)`;
        ctx.fillStyle = `rgba(${Math.random() * 205 + 50}, ${Math.random() * 0}, ${Math.random() * 0}, 1)`;

    ctx.fill();
    // drawRandomBezierCurve(p1, p2, p3);
    // drawCrossingLines(p1, p2, p3);
    // drawCompleteGrid(p1, p2, p3);
}

function divideTriangle(p1, p2, p3, depth) {
    // Si la profondeur est 0, on arrête la récursion et on dessine le triangle
    if (depth === 0) {
        drawTriangle(p1, p2, p3);
        return;
    }


    // Générer des points aléatoires sur chaque côté du triangle
    const p12 = getRandomPointOnSegment(p1, p2);
    const p23 = getRandomPointOnSegment(p2, p3);
    const p31 = getRandomPointOnSegment(p3, p1);

    // Diviser le triangle en 4 sous-triangles
    const center = {
        x: (p1.x + p2.x + p3.x) / 3,
        y: (p1.y + p2.y + p3.y) / 3
    };

    // if (Math.random() > 0.5)
        divideTriangle(p1, p12, center, depth - 1);
    // if (Math.random() > 0.5)
        divideTriangle(p12, p2, center, depth - 1);
    // if (Math.random() > 0.5)
        divideTriangle(p2, p23, center, depth - 1);
    // if (Math.random() > 0.5)
        divideTriangle(p23, p3, center, depth - 1);
    // if (Math.random() > 0.5)
        divideTriangle(p3, p31, center, depth - 1);
    // if (Math.random() > 0.5)
        divideTriangle(p31, p1, center, depth - 1);
}

function delaunayTriangulation(points) {
    const delaunay = d3.Delaunay.from(points.map(p => [p.x, p.y]));
    const triangles = delaunay.triangles;
    for (let i = 0; i < triangles.length; i += 3) {
        const p1 = points[triangles[i]];
        const p2 = points[triangles[i + 1]];
        const p3 = points[triangles[i + 2]];
        drawTriangle(p1, p2, p3);
        divideTriangle(p1, p2, p3, 3);
    }
}
