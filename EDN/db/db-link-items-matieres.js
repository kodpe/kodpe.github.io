const fs = require("fs");
const path = require("path");
const { db } = require("./db");

const items = JSON.parse(
  fs.readFileSync("./db/items.json", "utf8")
);

const getItemByEdnId = db.prepare(`
  SELECT id FROM edn_items WHERE edn_id = ?
`);

const getMatiereByShort = db.prepare(`
  SELECT id FROM edn_matieres WHERE short = ?
`);

const insertLink = db.prepare(`
  INSERT OR IGNORE INTO edn_item_matieres (item_id, matiere_id, weight)
  VALUES (?, ?, ?)
`);

const tx = db.transaction((rows) => {
  for (const row of rows) {
    const item = getItemByEdnId.get(parseInt(row.item, 10));

    if (!item) {
      console.warn(`[WARN] item introuvable: ${row.item}`);
      continue;
    }

    for (const short of row.codes || []) {
      const matiere = getMatiereByShort.get(short);

      if (!matiere) {
        console.warn(`[WARN] matiere introuvable pour short: ${short}`);
        continue;
      }

      insertLink.run(item.id, matiere.id, 1);
    }
  }
});

tx(items);

console.log(`[OK] Liaison items <-> matières importée.`);