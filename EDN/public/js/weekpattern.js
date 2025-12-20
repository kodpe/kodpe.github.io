// ====== CONFIG ======
const DAYS = 7;
const MIN = 0;
const MAX = 9; // ajustable si besoin

// ====== STATE ======
const values = Array.from({ length: DAYS }, (_, i) => {
    const el = document.getElementById(`val-${i}`);
    return parseInt(el.textContent, 10) || 0;
});

// ====== DOM ======
const totalEl = document.getElementById("week-total");

// ====== HELPERS ======
function updateDisplay(index) {
    document.getElementById(`val-${index}`).textContent = values[index];
}

function updateTotal() {
    const total = values.reduce((a, b) => a + b, 0);
    totalEl.textContent = `~ ${total} items par semaine`;
    console.log(getWeeklyPattern());
}

// ====== BUTTON HANDLERS ======
function increment(index) {
    if (values[index] < MAX) {
        values[index]++;
        updateDisplay(index);
        updateTotal();
    }
}

function decrement(index) {
    if (values[index] > MIN) {
        values[index]--;
        updateDisplay(index);
        updateTotal();
    }
}

// ====== INIT EVENTS ======
for (let i = 0; i < DAYS; i++) {
    document
        .getElementById(`btn-inc-${i}`)
        .addEventListener("click", () => increment(i));

    document
        .getElementById(`btn-dec-${i}`)
        .addEventListener("click", () => decrement(i));
}

// ====== PUBLIC API ======
function getWeeklyPattern() {
    return [...values]; // copie sécurisée
}

// ====== INIT ======
updateTotal();

