
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
    // drawMemory(mem, memSize);
    return mem;
}

function fixCanvasResolution(canvas, ctx) {
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

function drawMemory(mem, memSize, owner1, owner2) {
    const canvas = document.getElementById("memCanvas");
    const ctx = canvas.getContext("2d");
    fixCanvasResolution(canvas, ctx);
    //
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    //
    const MEM_SIZE_DISPLAY = memSize;
    const COLS = Math.ceil(Math.sqrt(MEM_SIZE_DISPLAY));
    const ROWS = Math.ceil(MEM_SIZE_DISPLAY / COLS);
    // cell size calculé pour rentrer pile-poil
    const CELL_WIDTH = rect.width / COLS;
    const CELL_HEIGHT = rect.height / ROWS;
    // la plus petite (pour garder des carrés parfaits)
    const CELL_SIZE = Math.floor(Math.min(CELL_WIDTH, CELL_HEIGHT));
    // console.log("ROWS:", ROWS, "COLS:", COLS, "ROWS*COLS:", ROWS * COLS, "CELLS:", MEM_SIZE_DISPLAY, "CELL_SIZE:", CELL_SIZE);
    //
    const GRID_REAL_SIZE_X = CELL_SIZE * COLS;
    const GRID_REAL_SIZE_Y = CELL_SIZE * ROWS;
    // console.log("GX:", GRID_REAL_SIZE_X, "GY:", GRID_REAL_SIZE_Y);
    // console.log("CX:", canvas.width, "CY:", canvas.height);
    const GRID_OFFSET_X = (canvas.width - GRID_REAL_SIZE_X) / 2;
    const GRID_OFFSET_Y = (canvas.height - GRID_REAL_SIZE_Y) / 2;
    // console.log("OX:", GRID_OFFSET_X, "OY:", GRID_OFFSET_Y);
    //

    let viewStart = 0;  
    let idx = viewStart;
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {

            let cell = mem[idx];

            // couleur rapide selon état
            if (cell.owner == owner1) {
                // ctx.fillStyle = "#888800ff";
                ctx.fillStyle = "#007700ff";
                if (isIntegerStrict(cell.value)) {
                    ctx.fillStyle = "#00770077";
                }

            } else if (cell.owner == owner2) {
                // ctx.fillStyle = "#008888ff";
                ctx.fillStyle = "#770000ff";
                if (isIntegerStrict(cell.value)) {
                    ctx.fillStyle = "#77000077";
                }
            } else { // null
                ctx.fillStyle = "#101010ff";
            }

            ctx.fillRect(x * CELL_SIZE + GRID_OFFSET_X +1, y * CELL_SIZE + GRID_OFFSET_Y +1, CELL_SIZE-2, CELL_SIZE-2);

            // wrap circulaire
            idx++;
            if (idx >= memSize) idx = 0;
        }
    }

    // ---- Dessin de la grille ----
    // ctx.strokeStyle = "rgba(255,255,255,0.05)";
    // ctx.strokeStyle = "rgba(0,255,255,0.05)";
    // ctx.lineWidth = 1;

    // lignes verticales
    // for (let x = 0; x <= COLS; x++) {
    //     ctx.beginPath();
    //     ctx.moveTo(x * CELL_SIZE + 0.5 + GRID_OFFSET_X, 0 + GRID_OFFSET_Y);
    //     ctx.lineTo(x * CELL_SIZE + 0.5 + GRID_OFFSET_X, canvas.height - GRID_OFFSET_Y);
    //     ctx.stroke();
    // }

    // lignes horizontales
    // for (let y = 0; y <= ROWS; y++) {
    //     ctx.beginPath();
    //     ctx.moveTo(0 + GRID_OFFSET_X, y * CELL_SIZE + 0.5 + GRID_OFFSET_Y);
    //     ctx.lineTo(canvas.width - GRID_OFFSET_X, y * CELL_SIZE + 0.5 + GRID_OFFSET_Y);
    //     ctx.stroke();
    //}

    // ----- dessin des process (petit cadre sur la case) -----
    for (i = 0; i < plist.length; i++) {
        const {x, y } = addressToCanvasXY(plist[i].address, COLS);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ffffffff";
        if (plist[i].owner == owner1)
            ctx.strokeStyle = "#00ff00ff";
        if (plist[i].owner == owner2)
            ctx.strokeStyle = "#ff0000ff";
        ctx.shadowBlur = 0;
        ctx.strokeRect(x * CELL_SIZE + GRID_OFFSET_X + 2, y * CELL_SIZE + GRID_OFFSET_Y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        // ctx.strokeRect(x * CELL_SIZE + GRID_OFFSET_X + 1, y * CELL_SIZE + GRID_OFFSET_Y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    }

    // ----- dessin des BEAM (rayon cyan immense) -----
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
