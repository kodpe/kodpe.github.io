const MEM_SIZE = 8192; // 64 x 128
const MIN_DIST = 400;
const MAX_FORK = 1000;
const MAX_CYCLES = 10000;
let mem = [];
// let plist = [];
let warriors = [];

function gameInit(warriors) {
    // console.trace("gameInit called")
    mem = [];   // reset de la memoire
    // plist = []; // reset des process
    gameStop = true;
    gameIsRunning = false;

    if (warriors.length < 2) {
        console.log("warrios.length < 2");
        return;
    }

    if (warriors.length > 8) {
        console.warn("warrios.length > 8");
        return;
    }

    const NB_WARRIORS = warriors.length;
    const randPositions = randomNPositions(NB_WARRIORS, MIN_DIST, MEM_SIZE);

    for (let i = 0; i < NB_WARRIORS; i++) {
        const parsed = bluecode_compiler(warriors[i].rawfile, MEM_SIZE);
        if (parsed == null || parsed.length == 0) {
            console.error("parsed null or empty");
            return;
        }
        warriors[i].parsed_code = parsed;
        warriors[i].origin_addr = randPositions[i];
        // (si instruction ORIGIN presente dans le code alors reladdr != 0)
        // console.log(parsed);
        if (parsed[0].reladdr != 0) {
            warriors[i].origin_addr = parsed[0].reladdr;
        }
        console.log("name:", warriors[i].name + ", origin:", warriors[i].origin_addr);
        new ProcessReaderHead(warriors[i].plist.length, 
            warriors[i].name,
            warriors[i].editor_id,
            warriors[i].origin_addr, 
            MEM_SIZE);
        console.log("plist: len =", warriors[i].plist.length, "\n", warriors[i].plist);
    }

    console.log("warriors: len =", warriors.length, "\n", warriors);
    console.log("===== WARRIORS READY =====");

    // create memory
    mem = createMachineMemory(MEM_SIZE);

    // fill memory with players codes
    for (let i = 0; i < NB_WARRIORS; i++) {
        const parsed_code = warriors[i].parsed_code;
        const origin = warriors[i].origin_addr;
        const owner = warriors[i].name;
        for (k = 0; k < parsed_code.length; k++) {
            mem[origin + k] = {
            value: parsed_code[k].args[0],
            args: [].concat(parsed_code[k].args),
            owner: owner,
            }
            if (parsed_code[k].args[0] == '-')
                console.warn("COUCOUCUUCOUC - -")
        }
    }

    console.log(mem)
    gameIsRunning = true;
    resizeCanvasPixelPerfect(); // (and draw memory() inside)
    console.log("===== BATTLEFIELD READY =====");

    gameRunner(); // TEMP
}

// const btnPause = document.getElementById("btn-battle-pause");
// const btnReset = document.getElementById("btn-battle-reset");
// const btnSpeed1 = document.getElementById("btn-battle-speed1");
// const btnSpeed2 = document.getElementById("btn-battle-speed2");
// const btnSpeed10 = document.getElementById("btn-battle-speed10");
// const btnSpeed30 = document.getElementById("btn-battle-speed30");
// const btnSpeed60 = document.getElementById("btn-battle-speed60");
// const btnSpeed120 = document.getElementById("btn-battle-speed120");

/*
btnPause.addEventListener("click", () => {
    if (battlePause == false) {
        battlePause = true;
        btnPause.textContent = "PLAY";
    }
    else {
        battlePause = false;
        btnPause.textContent = "PAUSE";
    }
});

btnReset.addEventListener("click", () => {
    gameStop = false;
    handleEditorUpdate();
});

btnSpeed1.addEventListener("click", () => {
    // TICK_MS = setTickMs(1);
    // TICK_RATE_PER_SECOND = 1;
});

btnSpeed2.addEventListener("click", () => {
    // TICK_MS = setTickMs(2);
    // TICK_RATE_PER_SECOND = 2;
});

btnSpeed10.addEventListener("click", () => {
    // TICK_MS = setTickMs(10);
    // TICK_RATE_PER_SECOND = 10;
});

btnSpeed30.addEventListener("click", () => {
    // TICK_MS = setTickMs(30);
    // TICK_RATE_PER_SECOND = 30;
});

btnSpeed60.addEventListener("click", () => {
    // TICK_MS = setTickMs(60);
    // TICK_RATE_PER_SECOND = 60;
});

btnSpeed120.addEventListener("click", () => {
    // TICK_MS = setTickMs(120);
    // TICK_RATE_PER_SECOND = 120;
});
*/