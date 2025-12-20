const habit_data = {
    "2025-10-27": 0,
    "2025-10-28": 6,
    "2025-10-29": 1,
    "2025-10-30": 0,
    "2025-10-31": 0,
    "2025-11-01": 0,
    "2025-11-02": 0,
    "2025-11-03": 3,
    "2025-11-04": 4,
    "2025-11-05": 2,
    "2025-11-06": 3,
    "2025-11-07": 5,
    "2025-11-08": 2,
    "2025-11-09": 0,
    "2025-11-10": 0,
    "2025-11-11": 0,
    "2025-11-12": 0,
    "2025-11-13": 0,
    "2025-11-14": 0,
    "2025-11-15": 0,
    "2025-11-16": 0,
    "2025-11-17": 0,
    "2025-11-18": 0,
    "2025-11-19": 0,
    "2025-11-20": 0,
    "2025-11-21": 0,
    "2025-11-22": 0,
    "2025-11-23": 0,
    "2025-11-24": 5,
    "2025-11-25": 9,
    "2025-11-26": 7,
    "2025-11-27": 6,
    "2025-11-28": 2,
    "2025-11-29": 5,
    "2025-11-30": 0,
    "2025-12-01": 4,
    "2025-12-02": 7,
    "2025-12-03": 4,
    "2025-12-04": 9,
    "2025-12-05": 1,
    "2025-12-06": 4,
    "2025-12-07": 4,
    "2025-12-08": 5,
    "2025-12-09": 7,
    "2025-12-10": 9,
    "2025-12-11": 3,
    "2025-12-12": 4,
    "2025-12-13": 1,
    "2025-12-14": 0,
    "2025-12-15": 0,
    "2025-12-16": 0,
    "2025-12-17": 0,
    "2025-12-18": 0,
    "2025-12-19": 0,
    "2025-12-20": 0,
    "2025-12-21": 0,
};

const habit_data_2 = {
    "2025-10-27": 0,
    "2025-10-28": 2,
    "2025-10-29": 0,
    "2025-10-30": 0,
    "2025-10-31": 0,
    "2025-11-01": 0,
    "2025-11-02": 0,
    "2025-11-03": 0,
    "2025-11-04": 2,
    "2025-11-05": 1,
    "2025-11-06": 2,
    "2025-11-07": 2,
    "2025-11-08": 3,
    "2025-11-09": 0,
    "2025-11-10": 0,
    "2025-11-11": 0,
    "2025-11-12": 0,
    "2025-11-13": 0,
    "2025-11-14": 0,
    "2025-11-15": 0,
    "2025-11-16": 0,
    "2025-11-17": 0,
    "2025-11-18": 0,
    "2025-11-19": 0,
    "2025-11-20": 0,
    "2025-11-21": 0,
    "2025-11-22": 0,
    "2025-11-23": 0,
    "2025-11-24": 2,
    "2025-11-25": 2,
    "2025-11-26": 2,
    "2025-11-27": 2,
    "2025-11-28": 2,
    "2025-11-29": 3,
    "2025-11-30": 0,
    "2025-12-01": 2,
    "2025-12-02": 2,
    "2025-12-03": 2,
    "2025-12-04": 2,
    "2025-12-05": 2,
    "2025-12-06": 3,
    "2025-12-07": 2,
    "2025-12-08": 2,
    "2025-12-09": 2,
    "2025-12-10": 2,
    "2025-12-11": 2,
    "2025-12-12": 2,
    "2025-12-13": 3,
    "2025-12-14": 0,
    "2025-12-15": 3,
    "2025-12-16": 3,
    "2025-12-17": 3,
    "2025-12-18": 0,
    "2025-12-19": 0,
    "2025-12-20": 0,
    "2025-12-21": 0,
};


// AJOUTER 2 bOUTONS ITEMS / HEURES + HABIT HEURES

// UTILS

function mergeArrays_strict(arr1, arr2) {
    if (arr1.length != arr2.length) {
        console.error("length of arrays are not equal");
    }
    return arr1.map((val, i) => Number(val) + Number(arr2[i]));
}

function mergeDicts_strict(obj1, obj2) {
    const keys1 = Object.keys(obj1).sort();
    const keys2 = Object.keys(obj2).sort();

    if (keys1.length !== keys2.length || !keys1.every((k, i) => k === keys2[i])) {
        console.error("Les clés des objets ne correspondent pas");
        return null;
    }

    const merged = {};
    for (const key of keys1) {
        merged[key] = Number(obj1[key]) + Number(obj2[key]);
    }

    return merged;
}


function getTodayLocalDate() {
    const d = new Date();
    return d;
}

function getDayOneYearAgo() {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d;
}

// FUNCTIONS

function getLevel(value, thresholds) {
    if (value === 0) return 0;
    if (value <= thresholds[0]) return 1;
    if (value <= thresholds[1]) return 2;
    if (value <= thresholds[2]) return 3;
    return 4;
}

// Exemple :

function createHabitTracker() {
    const habit_grid = document.getElementById("habit-grid");
    const sumtext = document.getElementById("habit-sum-text");

    // sum des items only
    {
        const ivs = Object.values(habit_data).filter(v => v > 0).sort((a, b) => a - b);
        const sum = ivs.reduce((acc, curr) => acc + curr, 0);
        sumtext.textContent = sum + " items révisés sur l'année glissante";
    }

    // Calcul des seuils (quartiles) (combined = items + others)
    const combined = mergeDicts_strict(habit_data, habit_data_2);
    const cvs = Object.values(combined).filter(v => v > 0).sort((a, b) => a - b);
    const q = p => cvs[Math.floor(cvs.length * p)] || 0;
    const thresholds = [q(0.25), q(0.5), q(0.75)];

    const today = new Date();
    let start = new Date(today);
    let currentMonth = start.getMonth();

    let isMidMonth = false;
    let monthShortFR;

    for (let k = 0; k < 53; k++) {
        const col = document.createElement("div");
        col.className = "habit-7days-col";
        habit_grid.prepend(col);

        if (isMidMonth) {
            isMidMonth = false;
            col.textContent = monthShortFR;
        }

        for (let i = 0; i < 7; i++) {
            const step = new Date(start);
            step.setDate(start.getDate() - i);

            const key = step.toISOString().slice(0, 10);
            const value = combined[key] ?? 0;
            const level = getLevel(value, thresholds);

            // prepend etiquette
            const cell = document.createElement("div");
            cell.className = "habit-day";
            cell.dataset.level = level;
            const value_items = habit_data[key] ?? 0;
            const value_others = habit_data_2[key] ?? 0;
            cell.title = `${key}\n${value_items} items\n${value_others} others`;
            cell.style.animationDelay = `${(371 - k * 7 + i) * 9}ms`;
            col.prepend(cell);

            if (step.getDate() == 15) {
                isMidMonth = true;
                monthShortFR = step.toLocaleString('fr-FR', { month: 'short' });
            }
        }
        start.setDate(start.getDate() - 7);
    }

    requestAnimationFrame(() => {
        const habitGrid = document.querySelector('.habit-grid');
        habitGrid.scrollLeft = habitGrid.scrollWidth;
    });
}

createHabitTracker();

const habitGrid = document.querySelector('.habit-grid');
const SPEED = 0.7;
habitGrid.addEventListener('wheel', (e) => {
    e.preventDefault();
    habitGrid.scrollLeft += e.deltaY * SPEED;
}, { passive: false });
