const el = document.getElementById("verification-date");
const eltxtdate = document.getElementById("item-source-check-date");

const verificationDate = new Date(el.dataset.date);
eltxtdate.innerHTML = "Dernière vérification : " + el.dataset.date;

const now = new Date();
const diffYears = (now - verificationDate) / (1000 * 60 * 60 * 24 * 365);

if (diffYears > 1) {
    el.classList.add("expired");
} else {
    el.classList.add("valid");
}