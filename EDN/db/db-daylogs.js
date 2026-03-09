const { db } = require("./db");

module.exports = {
    setUserDayWorkedHours,
    addUserDayLogItem,
    addUserDayLogPractice,
    setUserDayLogItemDone,
    setUserDayLogPracticeDone,
    getUserMonthlyActivityChart,
    getUserHabitTrackerData,
};

// =========================
// Helpers
// =========================

function toDbBoolean(value, defaultValue = 1) {
    if (value === undefined || value === null) {
        return defaultValue;
    }
    return value ? 1 : 0;
}

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

// =========================
// Day log
// =========================

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

// =========================
// Items
// =========================

// Ajouter un item à une date
function addUserDayLogItem(userId, workDate, itemId, isDone = true) {
    const dayLog = getOrCreateUserDayLog(userId, workDate);
    const dbIsDone = toDbBoolean(isDone, 1);

    const result = db.prepare(`
        INSERT INTO user_day_log_items (day_log_id, item_id, is_done)
        VALUES (?, ?, ?)
    `).run(dayLog.id, itemId, dbIsDone);

    return db.prepare(`
        SELECT i.id, i.day_log_id, i.item_id, i.is_done
        FROM user_day_log_items i
        INNER JOIN user_day_logs l ON l.id = i.day_log_id
        WHERE i.id = ?
          AND l.user_id = ?
    `).get(result.lastInsertRowid, userId);
}

function setUserDayLogItemDone(userId, itemLogId, isDone) {
    const dbIsDone = toDbBoolean(isDone, 0);

    const target = db.prepare(`
        SELECT i.id
        FROM user_day_log_items i
        INNER JOIN user_day_logs l ON l.id = i.day_log_id
        WHERE i.id = ?
          AND l.user_id = ?
    `).get(itemLogId, userId);

    if (!target) {
        return null;
    }

    db.prepare(`
        UPDATE user_day_log_items
        SET is_done = ?
        WHERE id = ?
    `).run(dbIsDone, itemLogId);

    return db.prepare(`
        SELECT i.id, i.day_log_id, i.item_id, i.is_done
        FROM user_day_log_items i
        INNER JOIN user_day_logs l ON l.id = i.day_log_id
        WHERE i.id = ?
          AND l.user_id = ?
    `).get(itemLogId, userId);
}

// =========================
// Practices / Activities
// =========================

// Ajouter une pratique / activité à une date
function addUserDayLogPractice(userId, workDate, practiceType, matiereId = null, isDone = true) {
    const dayLog = getOrCreateUserDayLog(userId, workDate);
    const dbIsDone = toDbBoolean(isDone, 1);

    const result = db.prepare(`
        INSERT INTO user_day_log_practices (day_log_id, practice_type, matiere_id, is_done)
        VALUES (?, ?, ?, ?)
    `).run(dayLog.id, practiceType, matiereId, dbIsDone);

    return db.prepare(`
        SELECT p.id, p.day_log_id, p.practice_type, p.matiere_id, p.is_done
        FROM user_day_log_practices p
        INNER JOIN user_day_logs l ON l.id = p.day_log_id
        WHERE p.id = ?
          AND l.user_id = ?
    `).get(result.lastInsertRowid, userId);
}

function setUserDayLogPracticeDone(userId, practiceLogId, isDone) {
    const dbIsDone = toDbBoolean(isDone, 0);

    const target = db.prepare(`
        SELECT p.id
        FROM user_day_log_practices p
        INNER JOIN user_day_logs l ON l.id = p.day_log_id
        WHERE p.id = ?
          AND l.user_id = ?
    `).get(practiceLogId, userId);

    if (!target) {
        return null;
    }

    db.prepare(`
        UPDATE user_day_log_practices
        SET is_done = ?
        WHERE id = ?
    `).run(dbIsDone, practiceLogId);

    return db.prepare(`
        SELECT p.id, p.day_log_id, p.practice_type, p.matiere_id, p.is_done
        FROM user_day_log_practices p
        INNER JOIN user_day_logs l ON l.id = p.day_log_id
        WHERE p.id = ?
          AND l.user_id = ?
    `).get(practiceLogId, userId);
}

// =========================
// Chart mensuel sur 12 mois glissants
// =========================

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

    const labels = months.map((m) => m.label);

    const itemsData = new Array(12).fill(0);
    const practicesData = new Array(12).fill(0);
    const hoursData = new Array(12).fill(0);

    const monthIndexByKey = new Map(months.map((m, i) => [m.key, i]));

    const firstMonthKey = months[0].key;
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
          AND i.is_done = 1
    `).all(userId, monthStart, monthEnd);

    const practiceRows = db.prepare(`
        SELECT l.work_date
        FROM user_day_log_practices p
        INNER JOIN user_day_logs l ON l.id = p.day_log_id
        WHERE l.user_id = ?
          AND l.work_date >= ?
          AND l.work_date <= ?
          AND p.is_done = 1
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
                label: "Activités",
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

// =========================
// Habit tracker (count items + practices per day)
// =========================

function getUserHabitTrackerData(userId) {
    const today = new Date();
    const start = new Date(today);
    start.setFullYear(start.getFullYear() - 1);

    const startDate = start.toISOString().slice(0, 10);
    const endDate = today.toISOString().slice(0, 10);

    const itemRows = db.prepare(`
        SELECT l.work_date AS work_date, COUNT(*) AS count
        FROM user_day_log_items i
        INNER JOIN user_day_logs l ON l.id = i.day_log_id
        WHERE l.user_id = ?
          AND l.work_date >= ?
          AND l.work_date <= ?
          AND i.is_done = 1
        GROUP BY l.work_date
        ORDER BY l.work_date
    `).all(userId, startDate, endDate);

    const practiceRows = db.prepare(`
        SELECT l.work_date AS work_date, COUNT(*) AS count
        FROM user_day_log_practices p
        INNER JOIN user_day_logs l ON l.id = p.day_log_id
        WHERE l.user_id = ?
          AND l.work_date >= ?
          AND l.work_date <= ?
          AND p.is_done = 1
        GROUP BY l.work_date
        ORDER BY l.work_date
    `).all(userId, startDate, endDate);

    const itemsByDate = {};
    const practicesByDate = {};

    for (const row of itemRows) {
        itemsByDate[row.work_date] = Number(row.count || 0);
    }

    for (const row of practiceRows) {
        practicesByDate[row.work_date] = Number(row.count || 0);
    }

    return {
        startDate,
        endDate,
        itemsByDate,
        practicesByDate,
    };
}