// BLUECODE MACHINE
// const MEM_SIZE = 32768;
// const MEM_SIZE = 16384;
// const MEM_SIZE = 8192;
const MEM_SIZE = 10000;
const MIN_DIST = 500;
const NAME_P1 = "kodp";
const NAME_P2 = "anta";
let mem = [];

function gameInit(rawfile1, rawfile2) {
    console.warn("===== GAME INIT =====");
    if (rawfile1 == null || rawfile2 == null)
        return;

    const { a, b } = randomTwoPositions(MIN_DIST, MEM_SIZE);
    let ORIGIN_ADDRESS_P1 = a;
    let ORIGIN_ADDRESS_P2 = b;

    // files parsing
    console.log("COMPILE P1");
    parsed1 = bluecode_compiler(rawfile1, MEM_SIZE);
    console.log("COMPILE P2");
    parsed2 = bluecode_compiler(rawfile2, MEM_SIZE);
    if (parsed1 == null || parsed2 == null)
        return;

    console.log("COMPILE DONE");
    // mise a jour des points de depart
    // (si instruction ORIGIN presente dans le code alors reladdr != 0)
    if (parsed1[0].reladdr != 0) {
        ORIGIN_ADDRESS_P1 = parsed1[0].reladdr;
    }
    if (parsed2[0].reladdr != 0) {
        ORIGIN_ADDRESS_P2 = parsed2[0].reladdr;
    }
    // console.warn(ORIGIN_ADDRESS_P1, ORIGIN_ADDRESS_P2);

    // creer les 2 guerriers
    plist = createProcessList(NAME_P1, ORIGIN_ADDRESS_P1, NAME_P2, ORIGIN_ADDRESS_P2);

    // create memory
    mem = createMachineMemory(MEM_SIZE);

    // fill memory with players codes
    for (i = 0; i < parsed1.length; i++) {
        mem[ORIGIN_ADDRESS_P1 + i] = {
            value: parsed1[i].args[0],
            args: parsed1[i].args,
            owner: NAME_P1,
        }
    }
    for (i = 0; i < parsed2.length; i++) {
        mem[ORIGIN_ADDRESS_P2 + i] = {
            value: parsed2[i].args[0],
            args: parsed2[i].args,
            owner: NAME_P2,
        }
    }

    // console.log("RAW MEM P1", mem.slice(ORIGIN_ADDRESS_P1-1, ORIGIN_ADDRESS_P1 + parsed1.length+1));
    // console.log("RAW MEM P2", mem.slice(ORIGIN_ADDRESS_P2-1, ORIGIN_ADDRESS_P2 + parsed2.length+1));

    // Mise a jour de l'affichage
    drawMemory(mem, MEM_SIZE, NAME_P1, NAME_P2);

    // start gameRunner
    gameRunner(); // TEMP
}


let tickCount = 0;
function gameRunner() {
    // GAME LOOP
    // const TICK_RATE = 30; // 30 fois par secondes
    const TICK_RATE = 30; // 1 fois par secondes
    const TICK_MS = 1000 / TICK_RATE;

    let nextTick = performance.now();

    function loop() {
        const now = performance.now();

        if (now >= nextTick) {
            gameTick();
            nextTick += TICK_MS;
        }

        requestAnimationFrame(loop);
    }

    loop();

    function gameTick() {
        // console.log("tick", nextTick);
        tickCount++;
        // action only the next process here
        onlyTheTopProcess();
        // testprocessup();
        drawMemory(mem, MEM_SIZE, NAME_P1, NAME_P2);
    }
}

function testprocessup() {
    for (i = 0; i < plist.length; i++) {
        plist[i].move();
        // plist[i % plist.length].address = randomPos(MEM_SIZE);
    }
}

function onlyTheTopProcess() {
    // console.log("ACTION PROCESS ", plist[0]);

    const executed_cell = mem[plist[0].address]
    // console.log(executed_cell)
    if (executed_cell.value == "COPY") {
        plist[0].copy(executed_cell.args);
    }
    else if (executed_cell.value == "JUMP") {
        plist[0].jump(executed_cell.args);
    }
    else if (executed_cell.value == "FORK") {
        plist[0].fork(executed_cell.args);
    }
    else if (isIntegerStrict(executed_cell.value))
    {
        plist[0].kill();
    }
    else {
        console.warn("UNKNOWN CELL:", executed_cell);
        plist[0].kill();
    }

    // on passe le process actif au bout de la liste
    plist.push(plist.shift());
}