const path = require("path");
const checkToken = require("./auth");
const { getAllMatieres, getAllItems, getAllItemsWithMatieres } = require("../db/db");

const {
	getAllUserItemCounters,
	incrementUserItemCounter,
	decrementUserItemCounter,
	setUserItemCounter
} = require("../db/db-user-item-counters");

const {
	getUserRevisionGoal,
	setUserRevisionGoal
} = require("../db/db-users");


module.exports = function (app) {

	// root
	app.get("/", checkToken, (req, res) => {
		console.log("User connecté:", req.user.name);

		res.sendFile(path.join(__dirname, "..", "public", "index.html"));
	});

	// api reference
	app.get("/api/matieres", checkToken, (req, res) => {
		const matieres = getAllMatieres();
		res.json(matieres);
	});

	app.get("/api/items", checkToken, (req, res) => {
		console.log("test")
		const items = getAllItems();
		res.json(items);
	});

	app.get("/api/items-with-mat", checkToken, (req, res) => {
		const items = getAllItemsWithMatieres();
		res.json(items);
	});

	// api user
	app.get("/api/user-item-counters", checkToken, (req, res) => {
		const rows = getAllUserItemCounters(req.user.id);
		res.json(rows);
	});

	app.post("/api/items/:itemId/increment", checkToken, (req, res) => {
		const itemId = Number(req.params.itemId);

		if (!Number.isInteger(itemId) || itemId <= 0) {
			return res.status(400).json({ error: "itemId invalide" });
		}

		const row = incrementUserItemCounter(req.user.id, itemId);
		res.json(row);
	});

	app.post("/api/items/:itemId/decrement", checkToken, (req, res) => {
		const itemId = Number(req.params.itemId);

		if (!Number.isInteger(itemId) || itemId <= 0) {
			return res.status(400).json({ error: "itemId invalide" });
		}

		const row = decrementUserItemCounter(req.user.id, itemId);
		res.json(row);
	});

	app.post("/api/items/:itemId/set-count", checkToken, (req, res) => {
		const itemId = Number(req.params.itemId);
		const count = Number(req.body.count);

		if (!Number.isInteger(itemId) || itemId <= 0) {
			return res.status(400).json({ error: "itemId invalide" });
		}

		if (!Number.isFinite(count) || count < 0) {
			return res.status(400).json({ error: "count invalide" });
		}

		const row = setUserItemCounter(req.user.id, itemId, count);
		res.json(row);
	});

	app.get("/api/user/revision-goal", checkToken, (req, res) => {
		const row = getUserRevisionGoal(req.user.id);
		if (!row) {
			return res.json({ revision_goal_per_item: 2 });
		}
		res.json(row);
	});

	app.post("/api/user/revision-goal", checkToken, (req, res) => {
		const goal = Number(req.body.goal);

		if (!Number.isFinite(goal) || goal < 1) {
			return res.status(400).json({ error: "goal invalide" });
		}

		const row = setUserRevisionGoal(req.user.id, goal);
		res.json(row);
	});

	// ----- api daylogs -----
	/*
	// bar chart 3 data set
	app.get("/api/user/monthly-activity-chart", checkToken, (req, res) => {
		const data = getUserMonthlyActivityChart(req.user.id);
		res.json(data);
	});

	// Définir les heures d’un jour
	app.post("/api/user/day-log/set-hours", checkToken, (req, res) => {
		const { workDate, workedHours } = req.body;

		if (!workDate) {
			return res.status(400).json({ error: "workDate manquant" });
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
		const { workDate, itemId } = req.body;

		const parsedItemId = Number(itemId);

		if (!workDate) {
			return res.status(400).json({ error: "workDate manquant" });
		}

		if (!Number.isInteger(parsedItemId) || parsedItemId <= 0) {
			return res.status(400).json({ error: "itemId invalide" });
		}

		const row = addUserDayLogItem(req.user.id, workDate, parsedItemId);
		res.json(row);
	});

	app.post("/api/user/day-log/add-practice", checkToken, (req, res) => {
		const { workDate, practiceType, matiereId } = req.body;

		const allowedPracticeTypes = new Set([
			"MASTERCLASS", "CONFERENCE", "LCA", "QCM", "QROC",
			"DP", "BU", "QUIZ", "ANNALE", "STAGE",
			"PARTIEL", "ECOS", "EXAM_BLANC", "ANCRAGE", "AUTRE",
		]);

		if (!workDate) {
			return res.status(400).json({ error: "workDate manquant" });
		}

		if (!allowedPracticeTypes.has(practiceType)) {
			return res.status(400).json({ error: "practiceType invalide" });
		}

		let parsedMatiereId = null;

		if (matiereId !== null && matiereId !== undefined && matiereId !== "") {
			parsedMatiereId = Number(matiereId);

			if (!Number.isInteger(parsedMatiereId) || parsedMatiereId <= 0) {
				return res.status(400).json({ error: "matiereId invalide" });
			}
		}

		const row = addUserDayLogPractice(
			req.user.id,
			workDate,
			practiceType,
			parsedMatiereId
		);

		res.json(row);
	});

	app.post("/api/user/day-log/item/set-done", checkToken, (req, res) => {
		const { itemLogId, isDone } = req.body;

		const parsedItemLogId = Number(itemLogId);
		if (!Number.isInteger(parsedItemLogId) || parsedItemLogId <= 0) {
			return res.status(400).json({ error: "itemLogId invalide" });
		}

		const parsedIsDone = isDone === true || isDone === 1 ? 1 : 0;

		const row = setUserDayLogItemDone(parsedItemLogId, parsedIsDone);
		res.json(row);
	});

	app.post("/api/user/day-log/practice/set-done", checkToken, (req, res) => {
		const { practiceLogId, isDone } = req.body;

		const parsedPracticeLogId = Number(practiceLogId);
		if (!Number.isInteger(parsedPracticeLogId) || parsedPracticeLogId <= 0) {
			return res.status(400).json({ error: "practiceLogId invalide" });
		}

		const parsedIsDone = isDone === true || isDone === 1 ? 1 : 0;

		const row = setUserDayLogPracticeDone(parsedPracticeLogId, parsedIsDone);
		res.json(row);
	});
	*/

};

/*
"MASTERCLASS", "CONFERENCE", "LCA", "QCM", "QROC",
"DP", "BU", "QUIZ", "ANNALE", "STAGE",
"PARTIEL", "ECOS", "EXAM_BLANC", "ANCRAGE", "AUTRE"
*/