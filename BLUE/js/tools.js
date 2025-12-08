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
