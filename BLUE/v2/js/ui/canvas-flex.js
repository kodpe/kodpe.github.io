
// ===== OBSERVER FLEXBOX =====
function updateFlexLayout(el) {
    // console.log("Flex updated:", el);
    if (el.id === "canvas-memory-field") {
        requestAnimationFrame(() => {
            resizeCanvasPixelPerfect();
        });
    }
}
const ro = new ResizeObserver(entries => {
    for (const entry of entries) {
        updateFlexLayout(entry.target);
    }
});
function observeFlexElements() {
    document.querySelectorAll("*").forEach(el => {
        if (getComputedStyle(el).display === "flex") {
            try { ro.observe(el); } catch (e) { }
        }
    });
}
window.addEventListener("load", observeFlexElements);
window.addEventListener("resize", observeFlexElements);
// 

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const COLS = 128;
const ROWS = 64;

function resizeCanvasPixelPerfect() {
    const dpr = window.devicePixelRatio || 1;

    // taille du div
    const container = document.getElementById('canvas-memory-field');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // pixel-perfect canvas
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // drawCanvas(width, height);
    if (gameIsRunning)
        drawMemory(width, height);
}

function drawCanvas(width, height) {
    ctx.clearRect(0, 0, width, height);

    const cellSize = Math.floor(Math.min(width / COLS, height / ROWS));

    const gridWidth = cellSize * COLS;
    const gridHeight = cellSize * ROWS;

    const offsetX = Math.floor((width - gridWidth) / 2);
    const offsetY = Math.floor((height - gridHeight) / 2);

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    for (let x = 0; x <= COLS; x++) {
        const px = offsetX + x * cellSize + 0.5;
        ctx.beginPath();
        ctx.moveTo(px, offsetY);
        ctx.lineTo(px, offsetY + gridHeight);
        ctx.stroke();
    }

    for (let y = 0; y <= ROWS; y++) {
        const py = offsetY + y * cellSize + 0.5;
        ctx.beginPath();
        ctx.moveTo(offsetX, py);
        ctx.lineTo(offsetX + gridWidth, py);
        ctx.stroke();
    }
}

// Resize quand le div change de taille
window.addEventListener('resize', resizeCanvasPixelPerfect);
//
const container = document.getElementById("canvas-memory-field");
const ro2 = new ResizeObserver(() => {
    requestAnimationFrame(() => resizeCanvasPixelPerfect());
});
ro2.observe(container);

// Premier appel
// resizeCanvasPixelPerfect();

function getCellColor(warriors, cell, idx) {
    if (warriors.length > BASE_WARRIOR_COLORS.length) {
        console.warn("warrios.length > BASE_WARRIOR_COLORS.length");
        return;
    }
    if (cell.owner != null) {
        let editor_id = 0;
        for (let i = 0; i < warriors.length; i++) {
            if (cell.owner == warriors[i].name) {
                editor_id = warriors[i].editor_id;
                break;
            }
        }
        let baseColor = BASE_WARRIOR_COLORS[editor_id];
        if (isIntegerStrict(cell.value)) {
            return colorWithAlpha(baseColor, 0.2);
        } else {
            return colorWithAlpha(baseColor, 0.5);
        }
    }
    return NEUTRAL_CELL_COLORS;
}