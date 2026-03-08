function getToken() {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
}

const itemsState = {
    items: [],
    counters: [],
    revisionGoalPerItem: 1,
    isReady: false,
};

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

function mergeItemsWithCounters(items, counters) {
    const countersMap = new Map();

    counters.forEach((row) => {
        countersMap.set(Number(row.item_id), Number(row.revision_count ?? 0));
    });

    return items.map((item) => ({
        ...item,
        revision_count: countersMap.get(Number(item.id)) ?? 0,
    }));
}

function renderItems(containerId, items, options = {}) {
    const {
        showLabel = true,
        showMatieres = true,
        showProgress = false,
        revisionGoalPerItem = 1,
    } = options;

    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    items.forEach((item) => {
        const row = document.createElement("div");
        row.className = "domain-row";

        const tagEl = document.createElement("div");
        tagEl.className = "item-tag";
        tagEl.textContent = item.edn_id;
        row.appendChild(tagEl);

        if (showLabel) {
            const nameEl = document.createElement("div");
            nameEl.className = "domain-name";
            nameEl.textContent = item.label;
            row.appendChild(nameEl);
        }

        if (showMatieres) {
            const matieresEl = document.createElement("div");
            matieresEl.className = "item-matieres";

            if (Array.isArray(item.matieres)) {
                item.matieres.forEach((matiere) => {
                    const badge = document.createElement("span");
                    badge.className = "item-tag";
                    badge.textContent = matiere.short;
                    badge.style.color = matiere.color;
                    badge.style.borderColor = matiere.color;
                    matieresEl.appendChild(badge);
                });
            }

            row.appendChild(matieresEl);
            row.classList.add("domain-row-vert");
        }

        if (showProgress) {
            const progressBar = createProgressBar({
                done: Number(item.revision_count ?? 0),
                goal: Number(revisionGoalPerItem ?? 1),
                showBar: true,
                showPercent: true,
                showValues: false,
                startColor: "#00ffff",
                endColor: "#ff00ff",
            });

            const progressWrapper = document.createElement("div");
            progressWrapper.className = "item-progress-wrapper";
            progressWrapper.appendChild(progressBar.getElement());

            row.appendChild(progressWrapper);
        }

        container.appendChild(row);
    });
}

function renderAllItems() {
    if (!itemsState.isReady) return;

    const itemsWithCounters = mergeItemsWithCounters(itemsState.items, itemsState.counters);
    // console.warn(itemsWithCounters)

    renderItems("cnt-items-list", itemsWithCounters, {
        showLabel: true,
        showMatieres: true,
        showProgress: false,
    });

    renderItems("items-progress-list", itemsWithCounters, {
        showLabel: false,
        showMatieres: false,
        showProgress: true,
        revisionGoalPerItem: itemsState.revisionGoalPerItem,
    });
}

async function initItems() {
    try {
        const [items, counters] = await Promise.all([
            fetchItemsWithMat(),
            fetchUserItemCounters(),
        ]);

        // console.warn(items, counters)

        itemsState.items = items;
        itemsState.counters = counters;
        itemsState.isReady = true;
        // console.warn(itemsState)

        if (typeof window.setPersonalGoalData === "function") {
            window.setPersonalGoalData({ items, counters });
        }

        renderAllItems();
    } catch (err) {
        console.error(err);
    }
}

document.addEventListener("revision-goal-changed", (event) => {
    itemsState.revisionGoalPerItem = Math.max(1, Number(event.detail?.revisionGoal) || 1);
    renderAllItems();
});

document.addEventListener("DOMContentLoaded", initItems);

/*
Si incrémentation/décrémentation des items en live, recall
window.setPersonalGoalData({ items: itemsState.items, counters: itemsState.counters});
*/

/*

Progression totale
totalDone = somme(min(revision_count, revisionGoal))
totalGoal = items.length * revisionGoal

Moyenne par jour
remaining = totalGoal - totalDone
dailyRate = remaining / daysRemaining

Moyenne par semaine
weeklyRate = remaining / (daysRemaining / 7)
avec : targetDate = ednDate - 1 mois
et arrondi : Math.ceil(value * 10) / 10
*/