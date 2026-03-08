// db-create.js
const { db } = require("./db");

db.prepare(`
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		api_token TEXT UNIQUE NOT NULL,
		revision_goal_per_item INTEGER NOT NULL DEFAULT 3,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
`).run();

console.log("[OK] Table users creee.");

db.prepare(`
	CREATE TABLE IF NOT EXISTS edn_items (
    	id INTEGER PRIMARY KEY AUTOINCREMENT,
    	edn_id INTEGER UNIQUE NOT NULL,
    	label TEXT NOT NULL,
    	weight INTEGER NOT NULL DEFAULT 1
	);
`).run();

console.log("[OK] Table edn_items cree.");

db.prepare(`
	CREATE TABLE IF NOT EXISTS edn_matieres (
    	id INTEGER PRIMARY KEY AUTOINCREMENT,
    	code TEXT UNIQUE NOT NULL,
		short TEXT UNIQUE NOT NULL,
		label TEXT NOT NULL,
		source TEXT,
		color TEXT NOT NULL
	);
`).run();

console.log("[OK] Table edn_matieres cree.");

db.prepare(`
  CREATE TABLE IF NOT EXISTS edn_item_matieres (
    item_id INTEGER NOT NULL,
    matiere_id INTEGER NOT NULL,
    weight INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (item_id, matiere_id),
    FOREIGN KEY (item_id) REFERENCES edn_items(id) ON DELETE CASCADE,
    FOREIGN KEY (matiere_id) REFERENCES edn_matieres(id) ON DELETE CASCADE
  );
`).run();

console.log("[OK] Table de liason edn_items <-> edn_matieres cree.");

db.prepare(`
CREATE TABLE IF NOT EXISTS user_item_counters (
    user_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    revision_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, item_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES edn_items(id) ON DELETE CASCADE
);
`).run();

console.log("[OK] Table de liason users <-> edn_items count cree.");

db.prepare(`
CREATE TABLE IF NOT EXISTS user_day_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    work_date TEXT NOT NULL,
    worked_hours REAL NOT NULL DEFAULT 0,
    UNIQUE(user_id, work_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS user_day_log_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_log_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    FOREIGN KEY (day_log_id) REFERENCES user_day_logs(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES edn_items(id) ON DELETE CASCADE
);
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS user_day_log_practices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_log_id INTEGER NOT NULL,
    practice_type TEXT NOT NULL,
    matiere_id INTEGER,
    FOREIGN KEY (day_log_id) REFERENCES user_day_logs(id) ON DELETE CASCADE,
    FOREIGN KEY (matiere_id) REFERENCES edn_matieres(id) ON DELETE SET NULL
);
`).run();

console.log("[OK] Tables user_day_logs / user_day_log_items / user_day_log_practices créées.");