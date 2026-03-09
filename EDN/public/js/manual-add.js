function getToken() {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
}

function getTodayIsoDate() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function getIsDoneFromWorkDate(workDate) {
    return workDate <= getTodayIsoDate() ? 1 : 0;
}

const practiceFormEl = document.getElementById("practice-form");
const practiceDateEl = document.getElementById("practice-date");
const practiceTypeEl = document.getElementById("practice-type");
const practiceMatiereEl = document.getElementById("practice-matiere");
const practiceFeedbackEl = document.getElementById("practice-feedback");
const practiceSubmitBtnEl = document.getElementById("practice-submit-btn");

const itemFormEl = document.getElementById("item-form");
const itemDateEl = document.getElementById("item-date");
const itemEdnIdEl = document.getElementById("item-edn-id");
const itemFeedbackEl = document.getElementById("item-feedback");
const itemSubmitBtnEl = document.getElementById("item-submit-btn");

let isSubmittingPractice = false;
let isSubmittingItem = false;
let itemsByEdnId = new Map();

function setFeedback(element, message, type = "") {
    element.textContent = message;
    element.className = "feedback";

    if (type) {
        element.classList.add(type);
    }
}

async function fetchMatieres() {
    const token = getToken();

    const res = await fetch(`/api/matieres?token=${encodeURIComponent(token)}`);

    if (!res.ok) {
        throw new Error("Impossible de charger les matières");
    }

    return await res.json();
}

async function populateMatieres() {
    const matieres = await fetchMatieres();

    for (const matiere of matieres) {
        const option = document.createElement("option");
        option.value = matiere.id;
        option.textContent = `${matiere.code} — ${matiere.label}`;
        practiceMatiereEl.appendChild(option);
    }
}

async function addPractice(workDate, practiceType, matiereId) {
    const token = getToken();
    const isDone = getIsDoneFromWorkDate(workDate);

    const res = await fetch(`/api/user/day-log/add-practice?token=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            workDate,
            practiceType,
            matiereId,
            isDone
        })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.error || "Impossible d'ajouter l'activité");
    }

    return data;
}

async function fetchItems() {
    const token = getToken();

    const res = await fetch(`/api/items?token=${encodeURIComponent(token)}`);
    if (!res.ok) {
        throw new Error("Impossible de charger les items");
    }

    return await res.json();
}

async function loadItemsIndex() {
    const items = await fetchItems();

    itemsByEdnId = new Map(
        items.map((item) => [Number(item.edn_id), item])
    );
}

async function addItemByEdnId(workDate, ednId) {
    const item = itemsByEdnId.get(Number(ednId));

    if (!item) {
        throw new Error(`Aucun item trouvé pour EDN ID ${ednId}`);
    }

    const token = getToken();
    const isDone = getIsDoneFromWorkDate(workDate);

    const res = await fetch(`/api/user/day-log/add-item?token=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            workDate,
            itemId: item.id,
            isDone
        })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.error || "Impossible d'ajouter l'item");
    }

    return {
        ...data,
        edn_id: item.edn_id,
        label: item.label
    };
}

practiceFormEl.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmittingPractice) return;

    const workDate = practiceDateEl.value;
    const practiceType = practiceTypeEl.value;
    const matiereId = practiceMatiereEl.value ? Number(practiceMatiereEl.value) : null;

    if (!workDate) {
        setFeedback(practiceFeedbackEl, "Date manquante.", "error");
        return;
    }

    if (!practiceType) {
        setFeedback(practiceFeedbackEl, "Type d'activité manquant.", "error");
        return;
    }

    isSubmittingPractice = true;
    practiceSubmitBtnEl.disabled = true;
    setFeedback(practiceFeedbackEl, "Enregistrement...");

    try {
        const row = await addPractice(workDate, practiceType, matiereId);

        const matiereText = practiceMatiereEl.value
            ? ` — matière : ${practiceMatiereEl.options[practiceMatiereEl.selectedIndex].textContent}`
            : "";

        const statusText = row.is_done ? "faite" : "à faire";

        setFeedback(
            practiceFeedbackEl,
            `Activité ajoutée : ${practiceType} le ${workDate}${matiereText} (${statusText}).`,
            "success"
        );
    } catch (err) {
        console.error(err);
        setFeedback(practiceFeedbackEl, err.message || "Erreur.", "error");
    } finally {
        isSubmittingPractice = false;
        practiceSubmitBtnEl.disabled = false;
    }
});

itemFormEl.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmittingItem) return;

    const workDate = itemDateEl.value;
    const ednId = Number(itemEdnIdEl.value);

    if (!workDate) {
        setFeedback(itemFeedbackEl, "Date manquante.", "error");
        return;
    }

    if (!Number.isInteger(ednId) || ednId <= 0) {
        setFeedback(itemFeedbackEl, "EDN ID invalide.", "error");
        return;
    }

    isSubmittingItem = true;
    itemSubmitBtnEl.disabled = true;
    setFeedback(itemFeedbackEl, "Enregistrement...");

    try {
        const row = await addItemByEdnId(workDate, ednId);
        const statusText = row.is_done ? "fait" : "à faire";

        setFeedback(
            itemFeedbackEl,
            `Item ajouté : ${row.edn_id}${row.label ? ` — ${row.label}` : ""} le ${workDate} (${statusText}).`,
            "success"
        );

        itemEdnIdEl.value = "";
        itemEdnIdEl.focus();
    } catch (err) {
        console.error(err);
        setFeedback(itemFeedbackEl, err.message || "Erreur.", "error");
    } finally {
        isSubmittingItem = false;
        itemSubmitBtnEl.disabled = false;
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    practiceDateEl.value = getTodayIsoDate();
    itemDateEl.value = getTodayIsoDate();

    try {
        await Promise.all([
            populateMatieres(),
            loadItemsIndex()
        ]);
    } catch (err) {
        console.error(err);
        setFeedback(itemFeedbackEl, "Impossible de charger les données.", "error");
        setFeedback(practiceFeedbackEl, "Impossible de charger les données.", "error");
    }
});