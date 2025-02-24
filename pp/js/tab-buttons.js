/*
    IMPORT REQUIREMENT : pain-fromage.js
*/

// ------------ BUTTON MAKE TARTINE
btnTartine.addEventListener("click", function () {
    makeTartine();
});
function makeTartine() {
    if (cnt_nb_pain >= 1_000_000_000_000n && cnt_nb_fromage >= 1_000_000_000_000n) {
        cnt_nb_pain -= 1_000_000_000n;
        cnt_nb_fromage -= 1_000_000_000n;
        cnt_nb_tartine += 1_000_000_000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_pain >= 100_000_000_000n && cnt_nb_fromage >= 100_000_000_000n) {
        cnt_nb_pain -= 100_000_000n;
        cnt_nb_fromage -= 100_000_000n;
        cnt_nb_tartine += 100_000_000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_pain >= 10_000_000_000n && cnt_nb_fromage >= 10_000_000_000n) {
        cnt_nb_pain -= 10_000_000n;
        cnt_nb_fromage -= 10_000_000n;
        cnt_nb_tartine += 10_000_000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_pain >= 1_000_000_000n && cnt_nb_fromage >= 1_000_000_000n) {
        cnt_nb_pain -= 1_000_000n; // BigInt
        cnt_nb_fromage -= 1_000_000n;
        cnt_nb_tartine += 1_000_000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_pain >= 100_000_000n && cnt_nb_fromage >= 100_000_000n) {
        cnt_nb_pain -= 100_000n;
        cnt_nb_fromage -= 100_000n;
        cnt_nb_tartine += 100_000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_pain >= 10_000_000n && cnt_nb_fromage >= 10_000_000n) {
        cnt_nb_pain -= 10_000n;
        cnt_nb_fromage -= 10_000n;
        cnt_nb_tartine += 10_000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_pain >= 1000000n && cnt_nb_fromage >= 1000000n) {
        cnt_nb_pain -= 1000n; // BigInt
        cnt_nb_fromage -= 1000n;
        cnt_nb_tartine += 1000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_pain >= 10000n && cnt_nb_fromage >= 10000n) {
        cnt_nb_pain -= 10n; // BigInt
        cnt_nb_fromage -= 10n;
        cnt_nb_tartine += 10n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_pain >= 1 && cnt_nb_fromage >= 1) {
        cnt_nb_pain -= 1n; // BigInt
        cnt_nb_fromage -= 1n;
        cnt_nb_tartine += 1n;
        updateCntValues();
        return;
    }
}

// ------------ BUTTON MAKE SLICER PAIN
btnSlicerPain.addEventListener("click", function () {
    makeSlicerPain();
});
function makeSlicerPain() {
    if (cnt_nb_bras >= 1_000_000_000_000n) {
        cnt_nb_bras -= 1_000_000_000_000n;
        cnt_slicer_pain += 100_000_000_000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 100_000_000_000n) {
        cnt_nb_bras -= 100_000_000_000n;
        cnt_slicer_pain += 10_000_000_000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 10_000_000_000n) {
        cnt_nb_bras -= 10_000_000_000n;
        cnt_slicer_pain += 1_000_000_000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 1000000000n) {
        cnt_nb_bras -= 1000000000n;
        cnt_slicer_pain += 100000000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 100000000n) {
        cnt_nb_bras -= 100000000n;
        cnt_slicer_pain += 10000000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 10000000n) {
        cnt_nb_bras -= 10000000n;
        cnt_slicer_pain += 1000000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 1000000n) {
        cnt_nb_bras -= 1000000n;
        cnt_slicer_pain += 100000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 100000n) {
        cnt_nb_bras -= 100000n;
        cnt_slicer_pain += 10000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 10000n) {
        cnt_nb_bras -= 10000n;
        cnt_slicer_pain += 1000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 1000n) {
        cnt_nb_bras -= 1000n;
        cnt_slicer_pain += 100n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 100n) {
        cnt_nb_bras -= 100n;
        cnt_slicer_pain += 10n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 10n) {
        cnt_nb_bras -= 10n;
        cnt_slicer_pain += 1n;
        updateCntValues();
        return;
    }
}

// ------------ BUTTON MAKE SLICER FROMAGE
btnSlicerFromage.addEventListener("click", function () {
    makeSlicerFromage();
});
function makeSlicerFromage() {
    if (cnt_nb_bras >= 1_000_000_000_000n) {
        cnt_nb_bras -= 1_000_000_000_000n;
        cnt_slicer_fromage += 100_000_000_000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 100_000_000_000n) {
        cnt_nb_bras -= 100_000_000_000n;
        cnt_slicer_fromage += 10_000_000_000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 10_000_000_000n) {
        cnt_nb_bras -= 10_000_000_000n;
        cnt_slicer_fromage += 1_000_000_000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 1000000000n) {
        cnt_nb_bras -= 1000000000n;
        cnt_slicer_fromage += 100000000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 100000000n) {
        cnt_nb_bras -= 100000000n;
        cnt_slicer_fromage += 10000000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 10000000n) {
        cnt_nb_bras -= 10000000n;
        cnt_slicer_fromage += 1000000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 1000000n) {
        cnt_nb_bras -= 1000000n;
        cnt_slicer_fromage += 100000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 100000n) {
        cnt_nb_bras -= 100000n;
        cnt_slicer_fromage += 10000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 10000) {
        cnt_nb_bras -= 10000n;
        cnt_slicer_fromage += 1000n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 1000) {
        cnt_nb_bras -= 1000n;
        cnt_slicer_fromage += 100n;
        updateCntValues();
        return;
    }
    else if (cnt_nb_bras >= 100) {
        cnt_nb_bras -= 100n;
        cnt_slicer_fromage += 10n;
        updateCntValues();
        return;
    }
    if (cnt_nb_bras >= 10) {
        cnt_nb_bras -= 10n;
        cnt_slicer_fromage += 1n;
        updateCntValues();
        return;
    }
}

// ------------ BUTTON MAKE MACHINE PAIN
btnMachinePain.addEventListener("click", function () {
    makeMachinePain();
});
function makeMachinePain() {
    if (cnt_slicer_pain >= 10_000_000n
        && cnt_nb_bras >= 10_000_000n
        && cnt_nb_pain >= 10_000_000n
        && cnt_nb_tartine >= 10_000_000n
    ) {
        cnt_slicer_pain -= 10_000_000n;
        cnt_nb_bras -= 10_000_000n;
        cnt_nb_pain -= 10_000_000n;
        cnt_nb_tartine -= 10_000_000n;
        cnt_machine_pain += 1_000_000n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_pain >= 1_000_000n
        && cnt_nb_bras >= 1_000_000n
        && cnt_nb_pain >= 1_000_000n
        && cnt_nb_tartine >= 1_000_000n
    ) {
        cnt_slicer_pain -= 1_000_000n;
        cnt_nb_bras -= 1_000_000n;
        cnt_nb_pain -= 1_000_000n;
        cnt_nb_tartine -= 1_000_000n;
        cnt_machine_pain += 100_000n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_pain >= 100000n
        && cnt_nb_bras >= 100000n
        && cnt_nb_pain >= 100000n
        && cnt_nb_tartine >= 100000n
    ) {
        cnt_slicer_pain -= 100000n;
        cnt_nb_bras -= 100000n;
        cnt_nb_pain -= 100000n;
        cnt_nb_tartine -= 100000n;
        cnt_machine_pain += 10000n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_pain >= 10000 && cnt_nb_bras >= 10000 && cnt_nb_pain >= 10000 && cnt_nb_tartine >= 10000) {
        cnt_slicer_pain -= 10000n;
        cnt_nb_bras -= 10000n;
        cnt_nb_pain -= 10000n;
        cnt_nb_tartine -= 10000n;
        cnt_machine_pain += 1000n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_pain >= 1000 && cnt_nb_bras >= 1000 && cnt_nb_pain >= 1000 && cnt_nb_tartine >= 1000) {
        cnt_slicer_pain -= 1000n;
        cnt_nb_bras -= 1000n;
        cnt_nb_pain -= 1000n;
        cnt_nb_tartine -= 1000n;
        cnt_machine_pain += 100n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_pain >= 100 && cnt_nb_bras >= 100 && cnt_nb_pain >= 100 && cnt_nb_tartine >= 100) {
        cnt_slicer_pain -= 100n;
        cnt_nb_bras -= 100n;
        cnt_nb_pain -= 100n;
        cnt_nb_tartine -= 100n;
        cnt_machine_pain += 10n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_pain >= 10 && cnt_nb_bras >= 10 && cnt_nb_pain >= 10 && cnt_nb_tartine >= 10) {
        cnt_slicer_pain -= 10n;
        cnt_nb_bras -= 10n;
        cnt_nb_pain -= 10n;
        cnt_nb_tartine -= 10n;
        cnt_machine_pain += 1n;
        updateCntValues();
        return;
    }
}

// ------------ BUTTON MAKE MACHINE PAIN
btnMachineFromage.addEventListener("click", function () {
    makeMachineFromage();
});
function makeMachineFromage() {
    if (cnt_slicer_fromage >= 10_000_000n
        && cnt_nb_bras >= 10_000_000n
        && cnt_nb_fromage >= 10_000_000n
        && cnt_nb_tartine >= 10_000_000n
    ) {
        cnt_slicer_fromage -= 10_000_000n;
        cnt_nb_bras -= 10_000_000n;
        cnt_nb_fromage -= 10_000_000n;
        cnt_nb_tartine -= 10_000_000n;
        cnt_machine_fromage += 1_000_000n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_fromage >= 1_000_000n
        && cnt_nb_bras >= 1_000_000n
        && cnt_nb_fromage >= 1_000_000n
        && cnt_nb_tartine >= 1_000_000n
    ) {
        cnt_slicer_fromage -= 1_000_000n;
        cnt_nb_bras -= 1_000_000n;
        cnt_nb_fromage -= 1_000_000n;
        cnt_nb_tartine -= 1_000_000n;
        cnt_machine_fromage += 100_000n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_fromage >= 100000 && cnt_nb_bras >= 100000 && cnt_nb_fromage >= 100000 && cnt_nb_tartine >= 100000) {
        cnt_slicer_fromage -= 100000n;
        cnt_nb_bras -= 100000n;
        cnt_nb_fromage -= 100000n;
        cnt_nb_tartine -= 100000n;
        cnt_machine_fromage += 10000n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_fromage >= 10000 && cnt_nb_bras >= 10000 && cnt_nb_fromage >= 10000 && cnt_nb_tartine >= 10000) {
        cnt_slicer_fromage -= 10000n;
        cnt_nb_bras -= 10000n;
        cnt_nb_fromage -= 10000n;
        cnt_nb_tartine -= 10000n;
        cnt_machine_fromage += 1000n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_fromage >= 1000 && cnt_nb_bras >= 1000 && cnt_nb_fromage >= 1000 && cnt_nb_tartine >= 1000) {
        cnt_slicer_fromage -= 1000n;
        cnt_nb_bras -= 1000n;
        cnt_nb_fromage -= 1000n;
        cnt_nb_tartine -= 1000n;
        cnt_machine_fromage += 100n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_fromage >= 100 && cnt_nb_bras >= 100 && cnt_nb_fromage >= 100 && cnt_nb_tartine >= 100) {
        cnt_slicer_fromage -= 100n;
        cnt_nb_bras -= 100n;
        cnt_nb_fromage -= 100n;
        cnt_nb_tartine -= 100n;
        cnt_machine_fromage += 10n;
        updateCntValues();
        return;
    }
    else if (cnt_slicer_fromage >= 10 && cnt_nb_bras >= 10 && cnt_nb_fromage >= 10 && cnt_nb_tartine >= 10) {
        cnt_slicer_fromage -= 10n;
        cnt_nb_bras -= 10n;
        cnt_nb_fromage -= 10n;
        cnt_nb_tartine -= 10n;
        cnt_machine_fromage += 1n;
        updateCntValues();
        return;
    }
}

function hasChance(pourcentage) {
    return Math.random() * 100 < pourcentage;
}

// ----- MACHINE A PAIN
function AutoMachines() {
    if (isGameON === false)
        return;
    let isChanceToMakeBrasAndTartines = false;
    if (hasChance(5)) {
        isChanceToMakeBrasAndTartines = true;
    }

    if (cnt_machine_pain >= 1) {
        cnt_nb_pain += 10n + cnt_machine_pain ** 4n;
        if (isChanceToMakeBrasAndTartines) {
            cnt_nb_bras += cnt_machine_pain / 10n;
            cnt_nb_tartine += cnt_machine_pain / 10n;
        }
    }
    if (cnt_machine_fromage >= 1) {
        cnt_nb_fromage += 10n + cnt_machine_fromage ** 4n;
        if (isChanceToMakeBrasAndTartines) {
            cnt_nb_bras += cnt_machine_fromage / 10n;
            cnt_nb_tartine += cnt_machine_fromage / 10n;
        }
    }
    updateCntValues();
}
setInterval(AutoMachines, 280);

// AUTOSAVE DATABASE
function AutoSaveDB() {
    saveCounters(cnt_nb_pain.toString(),
                cnt_nb_fromage.toString(),
                cnt_nb_bras.toString(),
                cnt_nb_tartine.toString(),
                cnt_slicer_pain.toString(),
                cnt_slicer_fromage.toString(),
                cnt_machine_pain.toString(),
                cnt_machine_fromage.toString(),
            );
}
setInterval(AutoSaveDB, 3000);