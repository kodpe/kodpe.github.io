function getToken() {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
}

let habit_data = {};
let habit_data_2 = {};

function mergeDicts_loose(obj1, obj2) {
    const merged = {};
    const allKeys = new Set([
        ...Object.keys(obj1 || {}),
        ...Object.keys(obj2 || {})
    ]);

    for (const key of allKeys) {
        merged[key] = Number(obj1?.[key] || 0) + Number(obj2?.[key] || 0);
    }

    return merged;
}

function getLevel(value, thresholds) {
    if (value === 0) return 0;
    if (value <= thresholds[0]) return 1;
    if (value <= thresholds[1]) return 2;
    if (value <= thresholds[2]) return 3;
    return 4;
}

async function fetchHabitTrackerData() {
    const token = getToken();

    const res = await fetch(`/api/user/habit-tracker?token=${encodeURIComponent(token)}`);
    if (!res.ok) {
        throw new Error("Impossible de charger les données du habit tracker");
    }

    return await res.json();
}

function clearHabitTracker() {
    const habitGrid = document.getElementById("habit-grid");
    const sumtext = document.getElementById("habit-sum-text");

    if (habitGrid) {
        habitGrid.innerHTML = "";
    }

    if (sumtext) {
        sumtext.textContent = "";
    }
}

function createHabitTracker() {
    const habitGrid = document.getElementById("habit-grid");
    const sumtext = document.getElementById("habit-sum-text");

    if (!habitGrid || !sumtext) {
        return;
    }

    clearHabitTracker();

    const itemValues = Object.values(habit_data).filter(v => v > 0);
    const practiceValues = Object.values(habit_data_2).filter(v => v > 0);

    const sumItems = itemValues.reduce((acc, curr) => acc + curr, 0);
    const sumPractices = practiceValues.reduce((acc, curr) => acc + curr, 0);
    const combined = mergeDicts_loose(habit_data, habit_data_2);
    const activeDays = Object.values(combined).filter(v => v > 0).length;
    sumtext.textContent = `${activeDays} jours actifs, ${sumItems} items et ${sumPractices} activités sur l'année glissante`;

    const cvs = Object.values(combined).filter(v => v > 0).sort((a, b) => a - b);
    const q = p => cvs[Math.floor(cvs.length * p)] || 0;
    const thresholds = [q(0.25), q(0.5), q(0.75)];

    const today = new Date();
    let start = new Date(today);

    let isMidMonth = false;
    let monthShortFR = "";

    for (let k = 0; k < 53; k++) {
        const col = document.createElement("div");
        col.className = "habit-7days-col";
        habitGrid.prepend(col);

        if (isMidMonth) {
            isMidMonth = false;
            col.textContent = monthShortFR;
        }

        for (let i = 0; i < 7; i++) {
            const step = new Date(start);
            step.setDate(start.getDate() - i);

            const localYear = step.getFullYear();
            const localMonth = String(step.getMonth() + 1).padStart(2, "0");
            const localDay = String(step.getDate()).padStart(2, "0");
            const key = `${localYear}-${localMonth}-${localDay}`;

            const value = combined[key] ?? 0;
            const level = getLevel(value, thresholds);

            const cell = document.createElement("div");
            cell.className = "habit-day";
            cell.dataset.level = level;

            const valueItems = habit_data[key] ?? 0;
            const valuePractices = habit_data_2[key] ?? 0;

            cell.title = `${key}\n${valueItems} items\n${valuePractices} activités`;
            cell.style.animationDelay = `${(371 - k * 7 + i) * 9}ms`;

            col.prepend(cell);

            if (step.getDate() === 15) {
                isMidMonth = true;
                monthShortFR = step.toLocaleString("fr-FR", { month: "short" });
            }
        }

        start.setDate(start.getDate() - 7);
    }

    requestAnimationFrame(() => {
        habitGrid.scrollLeft = habitGrid.scrollWidth;
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await fetchHabitTrackerData();

        habit_data = data.itemsByDate || {};
        habit_data_2 = data.practicesByDate || {};

        createHabitTracker();

        const habitGrid = document.querySelector(".habit-grid");
        const SPEED = 0.7;

        if (habitGrid) {
            habitGrid.addEventListener("wheel", (e) => {
                e.preventDefault();
                habitGrid.scrollLeft += e.deltaY * SPEED;
            }, { passive: false });
        }
    } catch (err) {
        console.error(err);
    }
});