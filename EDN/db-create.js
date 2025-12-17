const db = require("./db");

// Sécurité & perfs correctes pour SQLite
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

/* =========================
   TABLE : segments
   ========================= */
db.prepare(`
CREATE TABLE IF NOT EXISTS segments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT,
    start_date TEXT NOT NULL, -- YYYY-MM-DD
    end_date TEXT NOT NULL    -- YYYY-MM-DD
);
`).run();

/* =========================
   TABLE : segment_dates
   ========================= */
db.prepare(`
CREATE TABLE IF NOT EXISTS segment_dates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    segment_id INTEGER NOT NULL,
    date TEXT NOT NULL, -- YYYY-MM-DD
    status TEXT DEFAULT 'active', -- active | exclude | worked
    description TEXT,
    FOREIGN KEY (segment_id) REFERENCES segments(id) ON DELETE CASCADE
);
`).run();

/* =========================
   TABLE : segment_items
   ========================= */
db.prepare(`
CREATE TABLE IF NOT EXISTS segment_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date_id INTEGER NOT NULL,
    label TEXT NOT NULL,       -- ex: "34", "m1", "pneumo"
    status TEXT DEFAULT 'todo', -- todo | done
    FOREIGN KEY (date_id) REFERENCES segment_dates(id) ON DELETE CASCADE
);
`).run();

console.log("✅ Base de données créée avec succès :", path);
