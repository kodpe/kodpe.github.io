function getToken() {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
}

const nbrevValueEl = document.getElementById("nbrev-value");
const nbrevDecrementBtn = document.getElementById("nbrev-decrement");
const nbrevIncrementBtn = document.getElementById("nbrev-increment");

const pgEls = {
    nextExam: document.getElementById("pg-next-exam"),
    mockExam: document.getElementById("pg-mock-exam"),
    ednDate: document.getElementById("pg-edn-date"),
    dailyRate: document.getElementById("pg-daily-rate"),
    weeklyRate: document.getElementById("pg-weekly-rate"),
    totalProgress: document.getElementById("pg-total-progress"),
};

const personalGoalFlags = {
    showNextExam: true,
    showMockExam: true,
    showEdnDate: true,
    showDailyRate: true,
    showWeeklyRate: true,
    showTotalProgress: true,
};

const personalGoalState = {
    revisionGoal: 1,
    isSavingRevisionGoal: false,

    nextExamDate: "2026-03-30",
    mockExamDate: "2026-07-06",
    ednDate: "2026-10-12",

    items: [],
    counters: [],
};

let totalProgressBar = null;

function ceilToTenth(value) {
    return Math.ceil(value * 10) / 10;
}

function formatDateFr(isoDate) {
    if (!isoDate) return "";
    const [y, m, d] = isoDate.split("-");
    return `${d}/${m}/${y.slice(2)}`;
}

function parseIsoDateLocal(isoDate) {
    const [y, m, d] = isoDate.split("-").map(Number);
    // return new Date(y, m - 1, d); // 1 mois tampon
    // return new Date(y, m, d - 14); // 2 semaines tampon
    return new Date(y, m, d);
}

function subtractOneMonth(date) {
    const copy = new Date(date);
    copy.setMonth(copy.getMonth() - 1);
    return copy;
}

function startOfToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function diffDays(fromDate, toDate) {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil((toDate - fromDate) / msPerDay);
}

function buildCountersMap(counters) {
    const map = new Map();

    counters.forEach((row) => {
        map.set(Number(row.item_id), Number(row.revision_count ?? 0));
    });

    return map;
}

function computePersonalGoalStats() {
    const revisionGoal = Math.max(1, Number(personalGoalState.revisionGoal) || 1);
    const items = Array.isArray(personalGoalState.items) ? personalGoalState.items : [];
    const countersMap = buildCountersMap(personalGoalState.counters);

    const totalItems = items.length;
    const totalGoal = totalItems * revisionGoal;

    let totalDone = 0;

    for (const item of items) {
        const revisionCount = Number(countersMap.get(Number(item.id)) ?? 0);
        totalDone += Math.min(revisionCount, revisionGoal);
    }

    const remaining = Math.max(0, totalGoal - totalDone);

    const ednDate = parseIsoDateLocal(personalGoalState.ednDate);
    const targetDate = subtractOneMonth(ednDate);
    const today = startOfToday();

    const rawDaysRemaining = diffDays(today, targetDate);
    const daysRemaining = Math.max(1, rawDaysRemaining);

    const dailyRate = remaining <= 0 ? 0 : ceilToTenth(remaining / daysRemaining);
    const weeklyRate = remaining <= 0 ? 0 : ceilToTenth(remaining / (daysRemaining / 7));

    return {
        totalDone,
        totalGoal,
        remaining,
        dailyRate,
        weeklyRate,
        targetDate,
        daysRemaining,
    };
}

function renderRevisionGoal() {
    const revisionGoal = personalGoalState.revisionGoal;
    nbrevValueEl.textContent = `${revisionGoal} révision${revisionGoal > 1 ? "s" : ""} par item`;
}

function notifyRevisionGoalChanged() {
    document.dispatchEvent(new CustomEvent("revision-goal-changed", {
        detail: { revisionGoal: personalGoalState.revisionGoal }
    }));
}

function applyPersonalGoalFlags() {
    pgEls.nextExam.classList.toggle("hidden", !personalGoalFlags.showNextExam);
    pgEls.mockExam.classList.toggle("hidden", !personalGoalFlags.showMockExam);
    pgEls.ednDate.classList.toggle("hidden", !personalGoalFlags.showEdnDate);
    pgEls.dailyRate.classList.toggle("hidden", !personalGoalFlags.showDailyRate);
    pgEls.weeklyRate.classList.toggle("hidden", !personalGoalFlags.showWeeklyRate);
    pgEls.totalProgress.classList.toggle("hidden", !personalGoalFlags.showTotalProgress);
}

function renderTotalProgressBar(done, goal) {
    if (!pgEls.totalProgress) return;

    // console.log(done, goal)

    if (!totalProgressBar) {
        totalProgressBar = createProgressBar({
            done,
            goal,
            showBar: true,
            showPercent: true,
            showValues: true,
            startColor: "#00ffff",
            endColor: "#ff00ff",
        });

        pgEls.totalProgress.innerHTML = "";
        pgEls.totalProgress.appendChild(totalProgressBar.getElement());
        return;
    }

    totalProgressBar.setProgress(done, goal);
}

function getDaysRemaining(targetDateStr) {
    const today = new Date();
    const target = new Date(targetDateStr);

    today.setHours(0,0,0,0);
    target.setHours(0,0,0,0);

    const diffMs = target - today;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function renderPersonalGoalDetails() {

    const nextExamDays = getDaysRemaining(personalGoalState.nextExamDate);
    const mockExamDays = getDaysRemaining(personalGoalState.mockExamDate);
    const ednDays = getDaysRemaining(personalGoalState.ednDate);

    pgEls.nextExam.textContent =
        `Prochain partiel : ${formatDateFr(personalGoalState.nextExamDate)} (${nextExamDays} jours)`;

    pgEls.mockExam.textContent =
        `Concours blanc : ${formatDateFr(personalGoalState.mockExamDate)} (${mockExamDays} jours)`;

    pgEls.ednDate.textContent =
        `Date des EDN : ${formatDateFr(personalGoalState.ednDate)} (${ednDays} jours)`;


    const stats = computePersonalGoalStats();

    pgEls.dailyRate.textContent = `${stats.dailyRate.toFixed(1)} items / jour`;
    pgEls.weeklyRate.textContent = `${stats.weeklyRate.toFixed(1)} items / semaine`;

    renderTotalProgressBar(
        stats.totalDone,
        Math.max(1, stats.totalGoal)
    );
}

function rerenderPersonalGoalBlock() {
    renderRevisionGoal();
    renderPersonalGoalDetails();
    applyPersonalGoalFlags();
}

function setPersonalGoalFlags(newFlags = {}) {
    Object.assign(personalGoalFlags, newFlags);
    applyPersonalGoalFlags();
}

function setPersonalGoalDates(newDates = {}) {
    if (newDates.nextExamDate) personalGoalState.nextExamDate = newDates.nextExamDate;
    if (newDates.mockExamDate) personalGoalState.mockExamDate = newDates.mockExamDate;
    if (newDates.ednDate) personalGoalState.ednDate = newDates.ednDate;

    rerenderPersonalGoalBlock();
}

function setPersonalGoalData({ items, counters } = {}) {
    if (Array.isArray(items)) {
        personalGoalState.items = items;
    }

    if (Array.isArray(counters)) {
        personalGoalState.counters = counters;
    }

    rerenderPersonalGoalBlock();
}

async function fetchRevisionGoal() {
    const token = getToken();

    const res = await fetch(`/api/user/revision-goal?token=${encodeURIComponent(token)}`);
    if (!res.ok) {
        throw new Error("Impossible de charger l'objectif de révision");
    }

    const data = await res.json();
    personalGoalState.revisionGoal = Math.max(1, Number(data.revision_goal_per_item) || 1);

    // console.log("API: get revisionGoal", personalGoalState.revisionGoal);
    rerenderPersonalGoalBlock();
    notifyRevisionGoalChanged();
}

async function saveRevisionGoal(newGoal) {
    if (personalGoalState.isSavingRevisionGoal) return;

    personalGoalState.isSavingRevisionGoal = true;

    try {
        const token = getToken();

        const res = await fetch(`/api/user/revision-goal?token=${encodeURIComponent(token)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ goal: newGoal })
        });

        if (!res.ok) {
            throw new Error("Impossible de sauvegarder l'objectif de révision");
        }

        const data = await res.json();
        personalGoalState.revisionGoal = Math.max(1, Number(data.revision_goal_per_item) || 1);

        // console.log("API: set revisionGoal", personalGoalState.revisionGoal);
        rerenderPersonalGoalBlock();
        notifyRevisionGoalChanged();
    } catch (err) {
        console.error(err);
    } finally {
        personalGoalState.isSavingRevisionGoal = false;
    }
}

nbrevDecrementBtn.addEventListener("click", async () => {
    if (personalGoalState.revisionGoal <= 1) return;
    await saveRevisionGoal(personalGoalState.revisionGoal - 1);
});

nbrevIncrementBtn.addEventListener("click", async () => {
    await saveRevisionGoal(personalGoalState.revisionGoal + 1);
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        rerenderPersonalGoalBlock();
        await fetchRevisionGoal();
    } catch (err) {
        console.error(err);
        nbrevValueEl.textContent = "Erreur de chargement";
    }
});

window.getRevisionGoal = () => personalGoalState.revisionGoal;
window.setPersonalGoalFlags = setPersonalGoalFlags;
window.setPersonalGoalDates = setPersonalGoalDates;
window.setPersonalGoalData = setPersonalGoalData;