function getToken() {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
}

const matieresState = {
    matieres: [],
    items: [],
    counters: [],
    revisionGoalPerItem: 1,
    isReady: false,
};

async function fetchMatieres() {
    const token = getToken();

    const res = await fetch(`/api/matieres?token=${encodeURIComponent(token)}`);
    if (!res.ok) {
        throw new Error("Impossible de charger les matières");
    }

    return await res.json();
}

async function fetchItemsWithMat() {
    const token = getToken();

    const res = await fetch(`/api/items-with-mat?token=${encodeURIComponent(token)}`);
    if (!res.ok) {
        throw new Error("Impossible de charger les items");
    }

    return await res.json();
}

async function fetchUserItemCounters() {
    const token = getToken();

    const res = await fetch(`/api/user-item-counters?token=${encodeURIComponent(token)}`);
    if (!res.ok) {
        throw new Error("Impossible de charger les compteurs utilisateur");
    }

    return await res.json();
}

function buildCountersMap(counters) {
    const map = new Map();

    counters.forEach((row) => {
        map.set(Number(row.item_id), Number(row.revision_count ?? 0));
    });

    return map;
}

function renderMatieresList(containerId, matieres, showLabel = true, showSource = true) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    matieres.forEach((matiere) => {
        const row = document.createElement("div");
        row.className = "domain-row";

        const color = matiere.color;

        const tagEl = document.createElement("div");
        tagEl.className = "item-tag";
        tagEl.textContent = matiere.code;
        tagEl.style.color = color;
        tagEl.style.borderColor = color;

        row.appendChild(tagEl);

        if (showLabel) {
            const nameEl = document.createElement("div");
            nameEl.className = "domain-name";
            nameEl.style.color = color;
            nameEl.textContent = matiere.label;

            if (showSource && matiere.source) {
                nameEl.textContent += ` (${matiere.source})`;
            }

            row.appendChild(nameEl);
        }

        container.appendChild(row);
    });
}

function computeMatiereProgress(matiere, items, countersMap, revisionGoalPerItem) {
    const goalPerItem = Math.max(1, Number(revisionGoalPerItem) || 1);

    const matiereItems = items.filter((item) =>
        Array.isArray(item.matieres) &&
        item.matieres.some((m) => m.code === matiere.code)
    );

    let done = 0;

    for (const item of matiereItems) {
        const revisionCount = Number(countersMap.get(Number(item.id)) ?? 0);
        done += Math.min(revisionCount, goalPerItem);
    }

    const goal = matiereItems.length * goalPerItem;

    return {
        done,
        goal,
        itemCount: matiereItems.length,
    };
}

function renderMatieresListWithProgress(containerId, matieres, showLabel = false, showSource = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    const countersMap = buildCountersMap(matieresState.counters);

    matieres.forEach((matiere) => {
        const row = document.createElement("div");
        row.className = "domain-row";

        const color = matiere.color;

        const tagEl = document.createElement("div");
        tagEl.className = "item-tag";
        tagEl.textContent = matiere.code;
        tagEl.style.color = color;
        tagEl.style.borderColor = color;
        row.appendChild(tagEl);

        if (showLabel) {
            const nameEl = document.createElement("div");
            nameEl.className = "domain-name";
            nameEl.style.color = color;
            nameEl.textContent = matiere.label;

            if (showSource && matiere.source) {
                nameEl.textContent += ` (${matiere.source})`;
            }

            row.appendChild(nameEl);
        }

        const { done, goal } = computeMatiereProgress(
            matiere,
            matieresState.items,
            countersMap,
            matieresState.revisionGoalPerItem
        );

        const progressBar = createProgressBar({
            done,
            goal: Math.max(1, goal),
            showBar: true,
            showPercent: true,
            showValues: true,
            startColor: "#00ffff",
            endColor: "#ff00ff",
        });

        const progressWrapper = document.createElement("div");
        progressWrapper.className = "item-progress-wrapper";
        progressWrapper.appendChild(progressBar.getElement());

        row.appendChild(progressWrapper);
        container.appendChild(row);
    });
}

function renderAllMatieres() {
    if (!matieresState.isReady) return;

    renderMatieresList("domains-list", matieresState.matieres, true, true);
    renderMatieresListWithProgress("specs-progress-list", matieresState.matieres, false, false);
}

async function initMatieres() {
    try {
        const [matieres, items, counters] = await Promise.all([
            fetchMatieres(),
            fetchItemsWithMat(),
            fetchUserItemCounters(),
        ]);

        matieresState.matieres = matieres;
        matieresState.items = items;
        matieresState.counters = counters;
        matieresState.isReady = true;

        if (typeof window.getRevisionGoal === "function") {
            matieresState.revisionGoalPerItem = Math.max(1, Number(window.getRevisionGoal()) || 1);
        }

        renderAllMatieres();
    } catch (err) {
        console.error(err);
    }
}

document.addEventListener("revision-goal-changed", (event) => {
    matieresState.revisionGoalPerItem = Math.max(
        1,
        Number(event.detail?.revisionGoal) || 1
    );

    renderAllMatieres();
});

document.addEventListener("DOMContentLoaded", initMatieres);