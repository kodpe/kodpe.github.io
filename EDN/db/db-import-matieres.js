const { db } = require("./db");
const fs = require("fs");

const matieres = JSON.parse(
  fs.readFileSync("./db/matieres.json", "utf8")
);

const upsertMatiere = db.prepare(`
  INSERT INTO edn_matieres (code, short, label, source, color)
  VALUES (?, ?, ?, ?, ?)
  ON CONFLICT(code) DO UPDATE SET
    short = excluded.short,
    label = excluded.label,
    source = excluded.source,
    color = excluded.color
`);

const tx = db.transaction((rows) => {
  for (const row of rows) {
    upsertMatiere.run(
      row.code,
      row.short,
      row.label,
      row.source,
      row.color
    );
  }
});

tx(matieres);

console.log(`[OK] ${matieres.length} matières importées ou mises à jour.`);