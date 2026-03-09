const checkToken = require("./auth");

const {
    setUserDayWorkedHours,
    addUserDayLogItem,
    addUserDayLogPractice,
    setUserDayLogItemDone,
    setUserDayLogPracticeDone,
    getUserMonthlyActivityChart,
    getUserHabitTrackerData,
} = require("../db/db-daylogs")

// ----- api daylogs -----

module.exports = function routesApiDaylogs(app) {

    function isValidIsoDate(dateStr) {
        return typeof dateStr === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
    }

    function parseIsDone(value) {
        return value === true || value === 1 || value === "1" ? 1 : 0;
    }

    const allowedPracticeTypes = new Set([
        "MASTERCLASS",
        "CONFERENCE",
        "LCA",
        "QCM",
        "QROC",
        "DP",
        "BU",
        "QUIZ",
        "ANNALE",
        "STAGE",
        "PARTIEL",
        "ECOS",
        "EXAM_BLANC",
        "ANCRAGE",
        "AUTRE",
    ]);

    // bar chart 3 data set
    app.get("/api/user/monthly-activity-chart", checkToken, (req, res) => {
        const data = getUserMonthlyActivityChart(req.user.id);
        res.json(data);
    });

    // Définir les heures d’un jour
    app.post("/api/user/day-log/set-hours", checkToken, (req, res) => {
        const { workDate, workedHours } = req.body;

        if (!isValidIsoDate(workDate)) {
            return res.status(400).json({ error: "workDate invalide" });
        }

        const hours = Number(workedHours);
        if (!Number.isFinite(hours) || hours < 0) {
            return res.status(400).json({ error: "workedHours invalide" });
        }

        const row = setUserDayWorkedHours(req.user.id, workDate, hours);
        res.json(row);
    });

    // Ajouter un item à un jour
    app.post("/api/user/day-log/add-item", checkToken, (req, res) => {
        const { workDate, itemId, isDone } = req.body;

        if (!isValidIsoDate(workDate)) {
            return res.status(400).json({ error: "workDate invalide" });
        }

        const parsedItemId = Number(itemId);
        if (!Number.isInteger(parsedItemId) || parsedItemId <= 0) {
            return res.status(400).json({ error: "itemId invalide" });
        }

        const parsedIsDone = parseIsDone(isDone);

        const row = addUserDayLogItem(
            req.user.id,
            workDate,
            parsedItemId,
            parsedIsDone
        );

        res.json(row);
    });

    // Ajouter une activité / pratique à un jour
    app.post("/api/user/day-log/add-practice", checkToken, (req, res) => {
        const { workDate, practiceType, matiereId, isDone } = req.body;

        if (!isValidIsoDate(workDate)) {
            return res.status(400).json({ error: "workDate invalide" });
        }

        if (typeof practiceType !== "string" || !allowedPracticeTypes.has(practiceType)) {
            return res.status(400).json({ error: "practiceType invalide" });
        }

        let parsedMatiereId = null;

        if (matiereId !== null && matiereId !== undefined && matiereId !== "") {
            parsedMatiereId = Number(matiereId);

            if (!Number.isInteger(parsedMatiereId) || parsedMatiereId <= 0) {
                return res.status(400).json({ error: "matiereId invalide" });
            }
        }

        const parsedIsDone = parseIsDone(isDone);

        const row = addUserDayLogPractice(
            req.user.id,
            workDate,
            practiceType,
            parsedMatiereId,
            parsedIsDone
        );

        res.json(row);
    });

    // Cocher / décocher un item
    app.post("/api/user/day-log/item/set-done", checkToken, (req, res) => {
        const { itemLogId, isDone } = req.body;

        const parsedItemLogId = Number(itemLogId);
        if (!Number.isInteger(parsedItemLogId) || parsedItemLogId <= 0) {
            return res.status(400).json({ error: "itemLogId invalide" });
        }

        const parsedIsDone = parseIsDone(isDone);

        const row = setUserDayLogItemDone(req.user.id, parsedItemLogId, parsedIsDone);

        if (!row) {
            return res.status(404).json({ error: "item introuvable" });
        }

        res.json(row);
    });

    // Cocher / décocher une pratique / activité
    app.post("/api/user/day-log/practice/set-done", checkToken, (req, res) => {
        const { practiceLogId, isDone } = req.body;

        const parsedPracticeLogId = Number(practiceLogId);
        if (!Number.isInteger(parsedPracticeLogId) || parsedPracticeLogId <= 0) {
            return res.status(400).json({ error: "practiceLogId invalide" });
        }

        const parsedIsDone = parseIsDone(isDone);

        const row = setUserDayLogPracticeDone(req.user.id, parsedPracticeLogId, parsedIsDone);

        if (!row) {
            return res.status(404).json({ error: "activité introuvable" });
        }

        res.json(row);
    });

    // Get Habit tracker (count items + practices per day)
    app.get("/api/user/habit-tracker", checkToken, (req, res) => {
        const data = getUserHabitTrackerData(req.user.id);
        res.json(data);
    });

};