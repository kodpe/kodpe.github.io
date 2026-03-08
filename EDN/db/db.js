// db.js
const Database = require("better-sqlite3");

const DB_PATH = process.env.DB_PATH || "dev\\planning.db";

const db = new Database(DB_PATH);
db.pragma("foreign_keys = ON");

/*
  db.js est appelé quand un autre fichier fait require("./db")
  db-create.js n’est appelé que si tu fais node db-create.js
  db-add-user.js n’est appelé que si tu fais node db-add-user.js
*/

module.exports = {
	db,
	getAllMatieres,
	getAllItems,
	getAllItemsWithMatieres,
};

// DATABASE API
function getAllMatieres() {
	return db.prepare(`
    SELECT id, code, short, label, source, color
    FROM edn_matieres
    ORDER BY code
  `).all();
}

function getAllItems() {
	return db.prepare(`
    SELECT id, edn_id, label, weight
    FROM edn_items
    ORDER BY edn_id
  `).all();
}

function getAllItemsWithMatieres() {
  const rows = db.prepare(`
    SELECT
      i.id,
      i.edn_id,
      i.label,
      i.weight,
      m.code AS matiere_code,
      m.short AS matiere_short,
      m.label AS matiere_label,
      m.color AS matiere_color,
      im.weight AS matiere_weight
    FROM edn_items i
    LEFT JOIN edn_item_matieres im ON im.item_id = i.id
    LEFT JOIN edn_matieres m ON m.id = im.matiere_id
    ORDER BY i.edn_id, im.rowid
  `).all();

  const itemsById = new Map();

  for (const row of rows) {
    if (!itemsById.has(row.id)) {
      itemsById.set(row.id, {
        id: row.id,
        edn_id: row.edn_id,
        label: row.label,
        weight: row.weight,
        matieres: []
      });
    }

    if (row.matiere_code) {
      itemsById.get(row.id).matieres.push({
        code: row.matiere_code,
        short: row.matiere_short,
        label: row.matiere_label,
        color: row.matiere_color,
        weight: row.matiere_weight
      });
    }
  }

  return Array.from(itemsById.values());
}