import { formatNSP } from "./lib.js";
import { createTartipod } from "./tartinoide-data.js";
import { setupAudio, setVolume, playSounds, pauseSounds, initPageSoundsArrayVolumeRatio } from "./volume.js";
import { updateAllItemsDB, getAllItemsDB, addTartipodDB, getTartipodCountDB, getTartipodsNeedByFavorite } from "./database.js";
export let cnt_nb_pain = BigInt("0");
export let cnt_nb_fromage = BigInt("0");
export let cnt_nb_bras = BigInt("0");
export let cnt_nb_tartine = BigInt("0");
export let cnt_slicer_pain = BigInt("0");
export let cnt_slicer_fromage = BigInt("0");
export let cnt_machine_pain = BigInt("0");
export let cnt_machine_fromage = BigInt("0");
export let cnt_nb_tartipods = BigInt("0");
export let cnt_need_pain = BigInt("0");     // per 3 seconds
export let cnt_need_fromage = BigInt("0");  // per 3 seconds

const CntPain = document.getElementById('cnt-pain');
const CntFromage = document.getElementById('cnt-fromage');
const CntBras = document.getElementById('cnt-bras');
const CntTartine = document.getElementById('cnt-tartine');
const CntSlicerPain = document.getElementById('cnt-slicer-pain');
const CntSlicerFromage = document.getElementById('cnt-slicer-fromage');
const CntMachinePain = document.getElementById('cnt-machine-pain');
const CntMachineFromage = document.getElementById('cnt-machine-fromage');
const CntTartipod = document.getElementById('cnt-tartipod');

let btnTartine = document.getElementById("cnt-tartine-btn");
let btnSlicerPain = document.getElementById("cnt-slicer-pain-btn");
let btnSlicerFromage = document.getElementById("cnt-slicer-fromage-btn");
let btnMachinePain = document.getElementById("cnt-machine-pain-btn");
let btnMachineFromage = document.getElementById("cnt-machine-fromage-btn");
let btnTartipod = document.getElementById("cnt-tartipod-btn");

export function decPain(qt) {
    cnt_nb_pain -= qt;
    updateCntValues();
}

export function decFromage(qt) {
    cnt_nb_fromage -= qt;
    updateCntValues();
}

export function incPainWithSlicers() {
    cnt_nb_pain += 1n + (cnt_slicer_pain ** 3n) * 100n;
}

export function incFromageWithSlicers() {
    cnt_nb_fromage += 1n + (cnt_slicer_fromage ** 3n) * 100n;
}

export function incBras() {
    cnt_nb_bras += 1n;
}

export function addPain() {
    if (cnt_slicer_pain > 0) {
        if (cnt_machine_pain > 0) {
            cnt_nb_pain += 1n * ((1n + cnt_slicer_pain) * 3n) * (cnt_machine_pain * cnt_machine_pain * 9n);
        }
        else {
            cnt_nb_pain += 1n * (cnt_slicer_pain * 3n);
        }
    }
    else {
        cnt_nb_pain += 1n;
    }
    updateCntValues();
}

export function addFromage() {
    if (cnt_slicer_fromage > 0) {
        if (cnt_machine_fromage > 0) {
            cnt_nb_fromage += 1n * ((1n + cnt_slicer_fromage) * 3n) * (cnt_machine_fromage * cnt_machine_fromage * 9n);
        }
        else {
            cnt_nb_fromage += 1n * (cnt_slicer_fromage * 3n); // BigInt
        }
    }
    else {
        cnt_nb_fromage += 1n;
    }
    updateCntValues();
}

export function updateTartitopdsNeeds() {
    getTartipodsNeedByFavorite("pain").then((sum) => {
        cnt_need_pain = BigInt(Math.floor(sum / 1200)); // 1200s * 3s (=) 3600 sec (=) 1 hour
        // console.warn("cnt_need_pain", cnt_need_pain);
    });
    //
    getTartipodsNeedByFavorite("fromage").then((sum) => {
        cnt_need_fromage = BigInt(Math.floor(sum / 1200));
        // console.warn("cnt_need_fromage", cnt_need_fromage);
    });
}

//
const button = setupAudio('sounds/old-button.mp3', 1, false);
//

document.addEventListener("DOMContentLoaded", () => {
    //
    async function loadItems() {
        try {
            const allItems = await getAllItemsDB();
            const getAmount = (id) => {
                const item = allItems.find(i => i.id === id);
                return item ? BigInt(item.amount) : 0n;
            };
            cnt_nb_pain = getAmount(0);  // pain
            cnt_nb_fromage = getAmount(1);  // fromage
            cnt_nb_bras = getAmount(2);  // bras
            cnt_nb_tartine = getAmount(3);  // tartine
            cnt_slicer_pain = getAmount(4);  // slicer pain
            cnt_slicer_fromage = getAmount(5);  // slicer fromage
            cnt_machine_pain = getAmount(6);  // machine pain
            cnt_machine_fromage = getAmount(7);  // machine fromage
            cnt_nb_tartipods = getAmount(8);
            //
            getTartipodCountDB().then((count) => {
                cnt_nb_tartipods = BigInt(count);
            }).catch((error) => {
                console.error("Erreur lors de l'obtention du nombre de Tartipods :", error);
            });
            updateTartitopdsNeeds();

        } catch (error) {
            console.error("Erreur lors du chargement des items :", error);
        }
    }
    loadItems();
    //

    // ------------ BUTTON MAKE TARTINE
    if (btnTartine) {
        btnTartine.addEventListener("click", function () {
            makeTartine();
            button.play();
        });
        function makeTartine() {
            if (cnt_nb_pain >= 100_000_000_000_000n && cnt_nb_fromage >= 100_000_000_000_000n) {
                cnt_nb_pain -= 100_000_000_000n;
                cnt_nb_fromage -= 100_000_000_000n;
                cnt_nb_tartine += 100_000_000_000n;
                updateCntValues();
                return;
            }
            else if (cnt_nb_pain >= 10_000_000_000_000n && cnt_nb_fromage >= 10_000_000_000_000n) {
                cnt_nb_pain -= 10_000_000_000n;
                cnt_nb_fromage -= 10_000_000_000n;
                cnt_nb_tartine += 10_000_000_000n;
                updateCntValues();
                return;
            }
            else if (cnt_nb_pain >= 1_000_000_000_000n && cnt_nb_fromage >= 1_000_000_000_000n) {
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
    }

    // ------------ BUTTON MAKE SLICER PAIN
    if (btnSlicerPain) {
        btnSlicerPain.addEventListener("click", function () {
            makeSlicerPain();
            button.play();
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
    }

    // ------------ BUTTON MAKE SLICER FROMAGE
    if (btnSlicerFromage) {
        btnSlicerFromage.addEventListener("click", function () {
            makeSlicerFromage();
            button.play();
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
    }

    // ------------ BUTTON MAKE MACHINE PAIN
    if (btnMachinePain) {
        btnMachinePain.addEventListener("click", function () {
            makeMachinePain();
            button.play();
        });
        function makeMachinePain() {
            if (cnt_slicer_pain >= 1000_000_000n
                && cnt_nb_bras >= 1000_000_000n
                && cnt_nb_pain >= 1000_000_000n
                && cnt_nb_tartine >= 1000_000_000n
            ) {
                cnt_slicer_pain -= 1000_000_000n;
                cnt_nb_bras -= 1000_000_000n;
                cnt_nb_pain -= 1000_000_000n;
                cnt_nb_tartine -= 1000_000_000n;
                cnt_machine_pain += 100_000_000n;
                updateCntValues();
                return;
            }
            else if (cnt_slicer_pain >= 100_000_000n
                && cnt_nb_bras >= 100_000_000n
                && cnt_nb_pain >= 100_000_000n
                && cnt_nb_tartine >= 100_000_000n
            ) {
                cnt_slicer_pain -= 100_000_000n;
                cnt_nb_bras -= 100_000_000n;
                cnt_nb_pain -= 100_000_000n;
                cnt_nb_tartine -= 100_000_000n;
                cnt_machine_pain += 10_000_000n;
                updateCntValues();
                return;
            }
            else if (cnt_slicer_pain >= 10_000_000n
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
    }

    // ------------ BUTTON MAKE MACHINE PAIN
    if (btnMachineFromage) {
        btnMachineFromage.addEventListener("click", function () {
            makeMachineFromage();
            button.play();
        });
        function makeMachineFromage() {
            if (cnt_slicer_fromage >= 1000_000_000n
                && cnt_nb_bras >= 1000_000_000n
                && cnt_nb_fromage >= 1000_000_000n
                && cnt_nb_tartine >= 1000_000_000n
            ) {
                cnt_slicer_fromage -= 1000_000_000n;
                cnt_nb_bras -= 1000_000_000n;
                cnt_nb_fromage -= 1000_000_000n;
                cnt_nb_tartine -= 1000_000_000n;
                cnt_machine_fromage += 100_000_000n;
                updateCntValues();
                return;
            }
            else if (cnt_slicer_fromage >= 100_000_000n
                && cnt_nb_bras >= 100_000_000n
                && cnt_nb_fromage >= 100_000_000n
                && cnt_nb_tartine >= 100_000_000n
            ) {
                cnt_slicer_fromage -= 100_000_000n;
                cnt_nb_bras -= 100_000_000n;
                cnt_nb_fromage -= 100_000_000n;
                cnt_nb_tartine -= 100_000_000n;
                cnt_machine_fromage += 10_000_000n;
                updateCntValues();
                return;
            }
            else if (cnt_slicer_fromage >= 10_000_000n
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
    }

    // ------------ BUTTON MAKE TARTIPOD
    if (btnTartipod) {
        btnTartipod.addEventListener("click", function () {
            makeTartipod();
            button.play();
        });
        function makeTartipod() {
            // TODO CHECK LEFTTIME (600, 0 is mandatory)
            if (cnt_nb_tartine >= 1_000_000_000_000n && cnt_nb_bras >= 1_000_000_000_000n) { // 1000 milliard
                cnt_nb_bras -= 1_000_000_000_000n;
                cnt_nb_tartine -= 1_000_000_000_000n;
                updateCntValues();
                const id = parseInt(cnt_nb_tartipods.toString(), 10);
                addTartipodDB(createTartipod(id));
                cnt_nb_tartipods += 1n;
                return;
            }
        }
    }

    // + 439025 / h
    // - 32859852 / h

    function AutoMachines() {
        cnt_nb_bras += (cnt_machine_pain + cnt_machine_fromage) * 10n;
        cnt_nb_tartine += cnt_machine_pain + cnt_machine_fromage;
        if (cnt_machine_pain >= 1) {
            cnt_nb_pain += 10n + cnt_machine_pain ** 3n;
        }
        if (cnt_machine_fromage >= 1) {
            cnt_nb_fromage += 10n + cnt_machine_fromage ** 3n;
        }
        updateCntValues();
    }
    setInterval(AutoMachines, 250);

    // AUTOSAVE DATABASE
    function AutoSaveDB() {
        // consommation (tartipods needs)
        // condition pour ne pas l'introduire au tout debut du jeu mais a partir des trancheuses
        if (cnt_slicer_pain >= 1 && cnt_slicer_fromage >= 1) {
            cnt_nb_pain -= cnt_need_pain;
            if (cnt_nb_pain < 0)
                cnt_nb_pain = 0n;
            cnt_nb_fromage -= cnt_need_fromage;
            if (cnt_nb_fromage < 0)
                cnt_nb_fromage = 0n;
        }
        //
        // save to db
        let itemsDataTab = {
            0: { amount: cnt_nb_pain.toString() },  // pain
            1: { amount: cnt_nb_fromage.toString() },  // fromage
            2: { amount: cnt_nb_bras.toString() },  // bras
            3: { amount: cnt_nb_tartine.toString() },  // tartine
            4: { amount: cnt_slicer_pain.toString() },  // slicer_pain
            5: { amount: cnt_slicer_fromage.toString() },  // slicer_fromage
            6: { amount: cnt_machine_pain.toString() },  // machine_pain
            7: { amount: cnt_machine_fromage.toString() },  // machine_fromage
            8: { amount: cnt_nb_tartipods.toString() },
        };
        updateAllItemsDB(itemsDataTab);
        console.log("AutoSaveDB()");
        updateCntValues();
    }
    setInterval(AutoSaveDB, 3000);

});

function updateCntButtonsActions() {
    if (btnTartine) {
        if (cnt_nb_pain < 1 || cnt_nb_fromage < 1) {
            btnTartine.classList.add('disabled');
        }
        else {
            btnTartine.classList.remove('disabled');
        }
    }
    if (btnSlicerPain && btnSlicerFromage) {
        if (cnt_nb_bras < 10) {
            btnSlicerPain.classList.add('disabled');
            btnSlicerFromage.classList.add('disabled');
        }
        else {
            btnSlicerPain.classList.remove('disabled');
            btnSlicerFromage.classList.remove('disabled');
        }
    }
    if (btnMachinePain) {
        if (cnt_slicer_pain < 10 || cnt_nb_bras < 10 || cnt_nb_pain < 10 || cnt_nb_tartine < 10) {
            btnMachinePain.classList.add('disabled');
        }
        else {
            btnMachinePain.classList.remove('disabled');
        }
    }
    if (btnMachineFromage) {
        if (cnt_slicer_fromage < 10 || cnt_nb_bras < 10 || cnt_nb_fromage < 10 || cnt_nb_tartine < 10) {
            btnMachineFromage.classList.add('disabled');
        }
        else {
            btnMachineFromage.classList.remove('disabled');
        }
    }
    if (btnTartipod) {
        if (cnt_nb_tartine < 1_000_000_000_000n || cnt_nb_bras < 1_000_000_000_000n) {
            btnTartipod.classList.add('disabled');
        }
        else {
            btnTartipod.classList.remove('disabled');
        }
    }
}

export function updateCntValues() {
    if (CntFromage)
        CntFromage.innerHTML = formatNSP(cnt_nb_fromage.toString());
    if (CntPain)
        CntPain.innerHTML = formatNSP(cnt_nb_pain.toString());
    if (CntBras)
        CntBras.innerHTML = formatNSP(cnt_nb_bras.toString());
    if (CntTartine)
        CntTartine.innerHTML = formatNSP(cnt_nb_tartine.toString());
    if (CntSlicerPain)
        CntSlicerPain.innerHTML = formatNSP(cnt_slicer_pain.toString());
    if (CntSlicerFromage)
        CntSlicerFromage.innerHTML = formatNSP(cnt_slicer_fromage.toString());
    if (CntMachinePain)
        CntMachinePain.innerHTML = formatNSP(cnt_machine_pain.toString());
    if (CntMachineFromage)
        CntMachineFromage.innerHTML = formatNSP(cnt_machine_fromage.toString());
    if (CntTartipod)
        CntTartipod.innerHTML = formatNSP(cnt_nb_tartipods.toString());
    updateCntButtonsActions();
}

export function getPainProdStr() {
    let prod = 0n;
    if (cnt_machine_pain >= 1n) {
        prod = 10n + cnt_machine_pain ** 3n;
    }
    prod *= 14_400n;
    return formatNSP(prod.toString());
}

export function getFromageProdStr() {
    let prod = 0n;
    if (cnt_machine_fromage >= 1n) {
        prod = 10n + cnt_machine_fromage ** 3n;
    }
    prod *= 14_400n;
    return formatNSP(prod.toString());
}

export function getBrasProdStr() {
    let prod = cnt_machine_pain + cnt_machine_fromage;
    prod *= 14_400n;
    return formatNSP(prod.toString());
}

export function getTartineProdStr() {
    let prod = cnt_machine_pain + cnt_machine_fromage;
    prod *= 14_400n;
    return formatNSP(prod.toString());
}

export function getPainNeedPerHourStr() {
    let needPerHour = cnt_need_pain * 1200n;
    return formatNSP(needPerHour.toString());
}

export function getFromageNeedPerHourStr() {
    let needPerHour = cnt_need_fromage * 1200n;
    return formatNSP(needPerHour.toString());
}