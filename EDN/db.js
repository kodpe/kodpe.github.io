const Database = require("better-sqlite3");

const DB_PATH = process.env.DB_PATH || "dev\planning.db";

const db = new Database(DB_PATH);
db.pragma("foreign_keys = ON");

/* =========================================================
   RÉCUPÉRER UN SEGMENT COMPLET (segments + dates + items)
   ========================================================= */
function getSegment(segmentId) {
  const segment = db.prepare(`
    SELECT * FROM segments WHERE id = ?
  `).get(segmentId);

  if (!segment) return null;

  const dates = db.prepare(`
    SELECT * FROM segment_dates
    WHERE segment_id = ?
    ORDER BY date ASC
  `).all(segmentId);

  const dateIds = dates.map(d => d.id);
  const itemsByDate = {};

  if (dateIds.length) {
    const items = db.prepare(`
      SELECT * FROM segment_items
      WHERE date_id IN (${dateIds.map(() => "?").join(",")})
    `).all(...dateIds);

    for (const item of items) {
      if (!itemsByDate[item.date_id]) itemsByDate[item.date_id] = [];
      itemsByDate[item.date_id].push(item);
    }
  }

  return {
    ...segment,
    dates: dates.map(d => ({
      ...d,
      items: itemsByDate[d.id] || []
    }))
  };
}

/* =========================================================
   METTRE À JOUR UN SEGMENT ENTIER (label + dates)
   ⚠️ Remplacement total des dates & items
   ========================================================= */
function updateSegment(segmentId, { label, start_date, end_date, dates }) {
  const tx = db.transaction(() => {
    db.prepare(`
      UPDATE segments
      SET label = ?, start_date = ?, end_date = ?
      WHERE id = ?
    `).run(label, start_date, end_date, segmentId);

    db.prepare(`
      DELETE FROM segment_dates WHERE segment_id = ?
    `).run(segmentId);

    for (const d of dates) {
      const res = db.prepare(`
        INSERT INTO segment_dates (segment_id, date, status, description)
        VALUES (?, ?, ?, ?)
      `).run(segmentId, d.date, d.status, d.description);

      const dateId = res.lastInsertRowid;

      for (const item of d.items || []) {
        db.prepare(`
          INSERT INTO segment_items (date_id, label, status)
          VALUES (?, ?, ?)
        `).run(dateId, item.label, item.status);
      }
    }
  });

  tx();
}

/* =========================================================
   DATE : WORKED / EXCLUDE (mutuellement exclusifs)
   ========================================================= */
function markDateWorked(dateId) {
  db.prepare(`
    UPDATE segment_dates
    SET status = 'worked'
    WHERE id = ?
  `).run(dateId);
}

function markDateExclude(dateId) {
  db.prepare(`
    UPDATE segment_dates
    SET status = 'exclude'
    WHERE id = ?
  `).run(dateId);
}

/* =========================================================
   ITEMS
   ========================================================= */
function addItemToDate(dateId, label) {
  db.prepare(`
    INSERT INTO segment_items (date_id, label, status)
    VALUES (?, ?, 'todo')
  `).run(dateId, label);
}

function removeItem(itemId) {
  db.prepare(`
    DELETE FROM segment_items WHERE id = ?
  `).run(itemId);
}

function markItemDone(itemId) {
  db.prepare(`
    UPDATE segment_items
    SET status = 'done'
    WHERE id = ?
  `).run(itemId);
}

function markItemTodo(itemId) {
  db.prepare(`
    UPDATE segment_items
    SET status = 'todo'
    WHERE id = ?
  `).run(itemId);
}

/* =========================================================
   EXPORT
   ========================================================= */
module.exports = {
  db,
  getSegment,
  updateSegment,
  markDateWorked,
  markDateExclude,
  addItemToDate,
  removeItem,
  markItemDone,
  markItemTodo
};
