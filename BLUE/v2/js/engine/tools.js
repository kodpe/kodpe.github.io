function randomPos(max) {
    return Math.floor(Math.random() * max);
}

function circularDistance(a, b, size) {
    const d = Math.abs(a - b);
    return Math.min(d, size - d);
}

function randomTwoPositions(minDist = 500, size = 8192) {
    const a = randomPos(size);
    let b;
    // boucle jusqu'à avoir un b valide
    do {
        b = randomPos(size);
    } while (circularDistance(a, b, size) < minDist);
    return { a, b };
}

function addressToCanvasXY(addr, COLS) {
    const y = Math.floor(addr / COLS);
    const x = addr % COLS;
    return { x, y };
}

function oneInTen() {
    return Math.random() < 0.1;
}

function oneInCent() {
    return Math.random() < 0.01;
}

// strictement des entiers (positifs ou négatifs)
// et que seul le signe - est autorisé
function isIntegerStrict(str) {
    return /^-?\d+$/.test(str);
}

function isIncOrDec(str) {
    return /^[A-Za-z0-9_\+-][A-Za-z0-9_]*(\+\+|--)$/.test(str);
}

// console.log(isIncOrDec("a++"));     // true
// console.log(isIncOrDec("var--"));   // true
// console.log(isIncOrDec("++a"));     // false
// console.log(isIncOrDec("a + +"));   // false
// console.log(isIncOrDec("123++"));   // false

function convertIncDec(str) {
    const m = str.match(/^([A-Za-z0-9_\+-][A-Za-z0-9_]*)(\+\+|--)$/);
    if (!m) return null; // pas un a++ ou var--
    
    const variable = m[1];
    const op = m[2] === "++" ? "+=" : "-=";

    return `MSET ${variable} ${op} 1`.split(/\s+/);
}

function randomNPositions(n, minDist = 500, size = 8192) {
    const positions = [];

    while (positions.length < n) {
        const p = randomPos(size);
        let ok = true;

        // Vérifie la distance circulaire avec toutes les positions déjà placées
        for (let i = 0; i < positions.length; i++) {
            if (circularDistance(p, positions[i], size) < minDist) {
                ok = false;
                break;
            }
        }

        if (ok) positions.push(p);
    }

    return positions;
}

function colorWithAlpha(hexColor, alpha) {
    // hexColor: "#RRGGBB"
    // exemple : "#FF0000" + 50% alpha -> "#FF000080"
    alpha = Math.min(Math.max(alpha, 0), 1); // clamp 0..1
    return hexColor + Math.floor(alpha * 255).toString(16).padStart(2, '0');
}

function adjustColor(hex, factor) {
    // factor = -1..1 ; négatif = plus sombre, positif = plus clair
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    const newR = Math.min(255, Math.max(0, r + r*factor));
    const newG = Math.min(255, Math.max(0, g + g*factor));
    const newB = Math.min(255, Math.max(0, b + b*factor));
    return "#" + newR.toString(16).padStart(2,'0') +
                 newG.toString(16).padStart(2,'0') +
                 newB.toString(16).padStart(2,'0');
}