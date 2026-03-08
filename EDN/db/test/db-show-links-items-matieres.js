const { db } = require("../db");

const rows = db.prepare(`
SELECT
  i.edn_id,
  m.code AS matiere,
  im.weight
FROM edn_item_matieres im
JOIN edn_items i ON i.id = im.item_id
JOIN edn_matieres m ON m.id = im.matiere_id
ORDER BY i.edn_id
`).all();

console.table(rows);

console.log(`\nTotal liaisons: ${rows.length}`);