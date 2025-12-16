function createMachineMemory(memSize) {
    // return linear array
    let mem = new Array(memSize);
    for (let i = 0; i < memSize; i++) {
        mem[i] = {
            value: 0,
            args: [],
            owner: null,
        }
    }
    return mem;
}

// const NEUTRAL_CELL_COLORS = "#151515"
const NEUTRAL_CELL_COLORS = "#181818"
const BASE_WARRIOR_COLORS = [
    "#FF0000", // warrior 1 - rouge
    "#00FF00", // warrior 2 - vert
    "#0000FF", // warrior 3 - bleu
    "#FFFF00", // warrior 4 - jaune
    "#FF00FF", // warrior 5 - magenta
    "#00FFFF", // warrior 6 - cyan
    "#FF8800", // warrior 7 - orange
    "#8800FF", // warrior 8 - violet
];

function drawMemory(width, height) {
    const CELL_SIZE = Math.floor(Math.min(width / COLS, height / ROWS));
    const GRID_REAL_SIZE_X = CELL_SIZE * COLS;
    const GRID_REAL_SIZE_Y = CELL_SIZE * ROWS;
    const GRID_OFFSET_X = (canvas.width - GRID_REAL_SIZE_X) / 2;
    const GRID_OFFSET_Y = (canvas.height - GRID_REAL_SIZE_Y) / 2;

    let viewStart = 0;
    let idx = viewStart;
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            // idx = (idx + MEM_SIZE) % MEM_SIZE;

            let cell = mem[idx];
            if (cell == null) {
                console.trace("drawMemory called");
                console.warn("mem[0]:", mem[0]);
                throw new Error("ABORT");
            }
            ctx.fillStyle = getCellColor(warriors, cell, idx);
            ctx.fillRect(x * CELL_SIZE + GRID_OFFSET_X + 1, y * CELL_SIZE + GRID_OFFSET_Y + 1, CELL_SIZE - 2, CELL_SIZE - 2);

            // wrap circulaire
            idx++;
            if (idx >= MEM_SIZE) idx = 0;
        }
    }

    // ----- dessin des process (petit cadre sur la case) -----
    for (w = 0; w < warriors.length; w++) {
        ctx.strokeStyle = BASE_WARRIOR_COLORS[w];
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
        for (i = 0; i < warriors[w].plist.length; i++) {
            const { x, y } = addressToCanvasXY(warriors[w].plist[i].address, COLS);
            ctx.strokeRect(x * CELL_SIZE + GRID_OFFSET_X + 2, y * CELL_SIZE + GRID_OFFSET_Y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
            // ctx.strokeRect(x * CELL_SIZE + GRID_OFFSET_X + 1, y * CELL_SIZE + GRID_OFFSET_Y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        }
    }

    // ----- dessin des BEAM (rayon cyan immense) -----
    //                  DEPRECATED
    return; // TMP
    for (i = 0; i < plist.length; i++) {
        if (oneInCent()) {
            const { x, y } = addressToCanvasXY(plist[i].address, COLS);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#00ffffff";
            ctx.shadowBlur = 0;
            const len = CELL_SIZE * 30; // reverse with *-1
            ctx.strokeRect(x * CELL_SIZE + GRID_OFFSET_X + 2 + 1,
                y * CELL_SIZE + GRID_OFFSET_Y + CELL_SIZE / 2 - 1,
                len - 4, 1);
        }
    }
}

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