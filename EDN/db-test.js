const Database = require("better-sqlite3");
const db = new Database(process.env.DB_PATH || "dev\planning.db");
db.pragma("foreign_keys = ON");

/* =========================================================
   TEST 1 — Lister tous les segments
   ========================================================= */
const segments = db.prepare(`
  SELECT id, label, start_date, end_date
  FROM segments
  ORDER BY id
`).all();

console.log("\n=== SEGMENTS ===");
console.table(segments);

/* =========================================================
   TEST 2 — Lister toutes les dates avec leur segment
   ========================================================= */
const dates = db.prepare(`
  SELECT
    d.id AS date_id,
    s.label AS segment,
    d.date,
    d.status,
    d.description
  FROM segment_dates d
  JOIN segments s ON s.id = d.segment_id
  ORDER BY s.id, d.date
`).all();

console.log("\n=== DATES ===");
console.table(dates);

/* =========================================================
   TEST 3 — Lister tous les items avec leur date + segment
   ========================================================= */
const items = db.prepare(`
  SELECT
    i.id AS item_id,
    s.label AS segment,
    d.date,
    i.label,
    i.status
  FROM segment_items i
  JOIN segment_dates d ON d.id = i.date_id
  JOIN segments s ON s.id = d.segment_id
  ORDER BY s.id, d.date, i.id
`).all();

console.log("\n=== ITEMS ===");
console.table(items);

/* =========================================================
   TEST 4 — Vue hiérarchique (segment → dates → items)
   ========================================================= */
console.log("\n=== STRUCTURE COMPLÈTE ===");

for (const segment of segments) {
  console.log(`\n[SEGMENT] ${segment.label} (${segment.start_date} → ${segment.end_date})`);

  const segmentDates = db.prepare(`
    SELECT *
    FROM segment_dates
    WHERE segment_id = ?
    ORDER BY date
  `).all(segment.id);

  for (const d of segmentDates) {
    console.log(
      `  - ${d.date} [${d.status}] ${d.description || ""}`
    );

    const dateItems = db.prepare(`
      SELECT label, status
      FROM segment_items
      WHERE date_id = ?
    `).all(d.id);

    for (const item of dateItems) {
      console.log(`      • ${item.label} (${item.status})`);
    }
  }
}
