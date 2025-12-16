
function executeTopProcessRoundRobin() {
    while (warriors[indexCurrentProcess].plist.length == 0)
        indexCurrentProcess++;
    const top_process = warriors[indexCurrentProcess].plist.shift();
    warriors[indexCurrentProcess].plist.push(top_process);
    // console.warn("top_process already shifted & pushed: ", top_process);
    indexCurrentProcess = (indexCurrentProcess + 1) % warriors.length;

    const executed_cell = mem[top_process.address]
    // console.log("executed_cell: ", executed_cell);

    const args = executed_cell.args;
    // console.log("args: ", args);

    if (isIntegerStrict(executed_cell.value)) {
        top_process._kill();
    }
    else {
        switch (executed_cell.value) {
            case "COPY":
                top_process.copy(args);
                break;
            case "JUMP":
                top_process.jump(args);
                break;
            case "FORK":
                top_process.fork(args);
                break;
            case "WAIT":
                top_process.wait(args);
                break;
            case "FLIP":
                top_process.flip(args);
                break;
            case "SPIN":
                top_process.spin(args);
                break;
            case "MSET":
                top_process.mset(args);
                break;
            default: 
                console.warn("UNKNOWN CELL:", executed_cell);
                top_process.kill();
        }
    }
    checkForWinner();
}


function checkForWinner() {
    let countAlives = 0;
    let lastAliveOwner = "nan";
    let lastAliveId = -1;
    for (let i = 0; i < warriors.length; i++) {
        if (warriors[i].plist.length >= 1) {
            countAlives++;
            lastAliveOwner = warriors[i].name;
            lastAliveId = i;
        }
    }
    if (countAlives > 1) {
        return false;
    }

    gameStop = true; // stop the gameRunner
    console.warn("WINNER:", lastAliveOwner);
    console.log("plist: len =", warriors[lastAliveId].plist.length, 
                "\n", warriors[lastAliveId].plist);
    const cnt = document.getElementById("warriors-list");
    cnt.innerHTML += "<br>WINNER: " + lastAliveOwner;
    return true;
}