const { db } = require("./db");

module.exports = {
    setUserDayWorkedHours,
    addUserDayLogItem,
    addUserDayLogPractice,
    getUserMonthlyActivityChart,
};

// Créer ou récupérer une journée
function getOrCreateUserDayLog(userId, workDate) {
    const insert = db.prepare(`
        INSERT INTO user_day_logs (user_id, work_date, worked_hours)
        VALUES (?, ?, 0)
        ON CONFLICT(user_id, work_date) DO NOTHING
    `);

    insert.run(userId, workDate);

    return db.prepare(`
        SELECT id, user_id, work_date, worked_hours
        FROM user_day_logs
        WHERE user_id = ? AND work_date = ?
    `).get(userId, workDate);
}

// Définir les heures d’une journée
function setUserDayWorkedHours(userId, workDate, workedHours) {
    const dayLog = getOrCreateUserDayLog(userId, workDate);

    db.prepare(`
        UPDATE user_day_logs
        SET worked_hours = ?
        WHERE id = ?
    `).run(workedHours, dayLog.id);

    return db.prepare(`
        SELECT id, user_id, work_date, worked_hours
        FROM user_day_logs
        WHERE id = ?
    `).get(dayLog.id);
}

// Ajouter un item fait à une date
function addUserDayLogItem(userId, workDate, itemId) {
    const dayLog = getOrCreateUserDayLog(userId, workDate);

    db.prepare(`
        INSERT INTO user_day_log_items (day_log_id, item_id)
        VALUES (?, ?)
    `).run(dayLog.id, itemId);

    return { ok: true, day_log_id: dayLog.id, item_id: itemId };
}

// Ajouter une pratique faite à une date
function addUserDayLogPractice(userId, workDate, practiceType, matiereId = null) {
    const dayLog = getOrCreateUserDayLog(userId, workDate);

    db.prepare(`
        INSERT INTO user_day_log_practices (day_log_id, practice_type, matiere_id)
        VALUES (?, ?, ?)
    `).run(dayLog.id, practiceType, matiereId);

    return {
        ok: true,
        day_log_id: dayLog.id,
        practice_type: practiceType,
        matiere_id: matiereId
    };
}

// Fonction chart mensuel sur 12 mois glissants
function getUserMonthlyActivityChart(userId) {
    const monthNames = [
        "janv.", "févr.", "mars", "avr.", "mai", "juin",
        "juil.", "août", "sept.", "oct.", "nov.", "déc."
    ];

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const months = [];

    for (let offset = 11; offset >= 0; offset--) {
        const d = new Date(currentYear, currentMonth - offset, 1);
        const year = d.getFullYear();
        const month = d.getMonth();

        months.push({
            key: `${year}-${String(month + 1).padStart(2, "0")}`,
            label: monthNames[month],
            year,
            month
        });
    }

    const labels = months.map(m => m.label);

    const itemsData = new Array(12).fill(0);
    const practicesData = new Array(12).fill(0);
    const hoursData = new Array(12).fill(0);

    const monthIndexByKey = new Map(months.map((m, i) => [m.key, i]));

    const firstMonthKey = months[0].key;
    const lastMonthKey = months[11].key;

    const monthStart = `${firstMonthKey}-01`;

    const lastMonthDate = new Date(months[11].year, months[11].month + 1, 0);
    const monthEnd = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, "0")}-${String(lastMonthDate.getDate()).padStart(2, "0")}`;

    const itemRows = db.prepare(`
        SELECT l.work_date
        FROM user_day_log_items i
        INNER JOIN user_day_logs l ON l.id = i.day_log_id
        WHERE l.user_id = ?
          AND l.work_date >= ?
          AND l.work_date <= ?
    `).all(userId, monthStart, monthEnd);

    const practiceRows = db.prepare(`
        SELECT l.work_date
        FROM user_day_log_practices p
        INNER JOIN user_day_logs l ON l.id = p.day_log_id
        WHERE l.user_id = ?
          AND l.work_date >= ?
          AND l.work_date <= ?
    `).all(userId, monthStart, monthEnd);

    const hourRows = db.prepare(`
        SELECT work_date, worked_hours
        FROM user_day_logs
        WHERE user_id = ?
          AND work_date >= ?
          AND work_date <= ?
    `).all(userId, monthStart, monthEnd);

    for (const row of itemRows) {
        const key = row.work_date.slice(0, 7);
        const index = monthIndexByKey.get(key);
        if (index !== undefined) {
            itemsData[index] += 1;
        }
    }

    for (const row of practiceRows) {
        const key = row.work_date.slice(0, 7);
        const index = monthIndexByKey.get(key);
        if (index !== undefined) {
            practicesData[index] += 1;
        }
    }

    for (const row of hourRows) {
        const key = row.work_date.slice(0, 7);
        const index = monthIndexByKey.get(key);
        if (index !== undefined) {
            hoursData[index] += Number(row.worked_hours || 0);
        }
    }

    return {
        labels,
        datasets: [
            {
                label: "Pratiques",
                data: practicesData,
                backgroundColor: "rgb(191, 19, 197)",
                barPercentage: 0.9,
                categoryPercentage: 0.8
            },
            {
                label: "Items",
                data: itemsData,
                backgroundColor: "#80f",
                barPercentage: 0.9,
                categoryPercentage: 0.8
            },
            {
                label: "Heures",
                data: hoursData,
                backgroundColor: "#088",
                barPercentage: 0.9,
                categoryPercentage: 0.8
            }
        ]
    };
}

/*
*/