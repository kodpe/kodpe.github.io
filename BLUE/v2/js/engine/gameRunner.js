let battlePause = false;
let gameStop = false;
let gameIsRunning = false;
let indexCurrentProcess = 0;
let countCycles = 0;
let countTicks = 0;

function gameRunner() {
    addEventOnVisibilityChange();
    gameStop = false;
    gameIsRunning = true;
    indexCurrentProcess = 0;
    countCycles = 0;
    countTicks = 0;
    loop();
}

let tickRate = 120; // ticks par seconde
let tickInterval = 1000 / tickRate;
let nextTick = performance.now();

function loop() {
    const now = performance.now();

    while (now >= nextTick) {
        gameTick();
        nextTick += tickInterval;
    }

    if (!gameStop)
        requestAnimationFrame(loop);
}

function gameTick() {
    if (battlePause == true) {
        return;
    }
    if (gameStop == true) {
        gameIsRunning = false;
        return;
    }

    // ===== game core updates =====
    executeTopProcessRoundRobin();
    countTicks++;
    if (countTicks % warriors.length == 0)
        countCycles++;

    // ===== drawing updates =====
    updateWarriorListUI(warriors);
    updateProcessListUI(); // TMP todo update plist from warriors[]
    resizeCanvasPixelPerfect(); // draw memory inside

    if (countCycles == MAX_CYCLES) {
        gameStop = true;
        gameIsRunning = false;
    }
}

function addEventOnVisibilityChange() {
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            battlePause = true;   // pause propre
            console.log("⏸ Jeu en pause (onglet inactif)");
        } else {
            // On synchronise le tick pour éviter les explosions de ticks
            nextTick = performance.now();
            battlePause = false;
            console.log("▶ Jeu repris (onglet actif)");
        }
    });
}

function updateProcessListUI() {
    const cntTicks = document.getElementById("count-ticks");
    cntTicks.textContent = "ticks   : " + countTicks;
    const cntcycles = document.getElementById("count-cycles");
    cntcycles.textContent = "cycles : " + countCycles;
    return;
    const cnt = document.getElementById("process-list");
    // reset process list
    while (cnt.firstChild) {
        cnt.removeChild(cnt.firstChild);
    }

    if (plist.length == 0) {
        return;
    }

    const cell = document.getElementById("current-cell");
    const addr = plist[0].address;
    // console.log(plist)
    cell.textContent = addr + ": " + mem[addr].value + " " + mem[addr].args.slice(1);

    for (let i = 0; i < plist.length; i++) {

        const element = document.createElement("div");
        // element.classList.add("warrior_id_card");
        element.textContent = JSON.stringify(plist[i], null, 1);
        element.textContent = plist[i].owner + " " + plist[i].id;
        element.textContent += " addr:" + plist[i].address;
        element.textContent += " f:" + plist[i].flow_dir;
        element.textContent += " r:" + plist[i].repeater;
        cnt.appendChild(element);
        // cnt.prepend(element);
    }
}