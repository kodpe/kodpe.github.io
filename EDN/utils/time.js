function formatHours(hours) {
    const m = Math.round(hours * 60);
    return `${Math.floor(m / 60)}h${(m % 60).toString().padStart(2, "0")}`;
}

function getMonday(date) {
    const d = new Date(date);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d.toISOString().slice(0, 10);
}

module.exports = { formatHours, getMonday };
