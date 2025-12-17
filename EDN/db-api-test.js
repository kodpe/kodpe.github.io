const {
  db,
  getSegment,
  updateSegment,
  markDateWorked,
  markDateExclude,
  addItemToDate,
  removeItem,
  markItemDone,
  markItemTodo
} = require("./db"); // adapte le chemin si besoin

db.pragma("foreign_keys = ON");

console.log("\n=== DÉBUT DES TESTS ===");

/* =========================================================
   1️⃣ Création d’un segment de test
   ========================================================= */
const segmentRes = db.prepare(`
  INSERT INTO segments (label, start_date, end_date)
  VALUES ('SEGMENT_TEST', '2025-01-01', '2025-01-03')
`).run();

const segmentId = segmentRes.lastInsertRowid;
console.log("Segment créé :", segmentId);

/* =========================================================
   2️⃣ Ajout des dates + items via updateSegment
   ========================================================= */
updateSegment(segmentId, {
  label: "SEGMENT_TEST",
  start_date: "2025-01-01",
  end_date: "2025-01-03",
  dates: [
    {
      date: "2025-01-01",
      status: "worked",
      description: "Jour 1",
      items: [
        { label: "item A", status: "todo" },
        { label: "item B", status: "done" }
      ]
    },
    {
      date: "2025-01-02",
      status: "exclude",
      description: "Jour 2",
      items: []
    },
    {
      date: "2025-01-03",
      status: "worked",
      description: "Jour 3",
      items: [{ label: "item C", status: "todo" }]
    }
  ]
});

console.log("Segment initialisé");

/* =========================================================
   3️⃣ Récupération du segment complet
   ========================================================= */
let segment = getSegment(segmentId);
console.log("\n=== SEGMENT INITIAL ===");
console.dir(segment, { depth: null });

/* =========================================================
   4️⃣ Tester worked / exclude sur une date
   ========================================================= */
const dateToToggle = segment.dates[1]; // 2025-01-02

markDateWorked(dateToToggle.id);
console.log("\nDate marquée WORKED");

markDateExclude(dateToToggle.id);
console.log("Date marquée EXCLUDE");

/* =========================================================
   5️⃣ Ajouter un item à une date existante
   ========================================================= */
const targetDateId = segment.dates[0].id;

addItemToDate(targetDateId, "item D");
console.log("\nItem ajouté à la date");

/* =========================================================
   6️⃣ Modifier statut item TODO / DONE
   ========================================================= */
segment = getSegment(segmentId);

const item = segment.dates[0].items[0];

markItemDone(item.id);
console.log("Item marqué DONE");

markItemTodo(item.id);
console.log("Item marqué TODO");

/* =========================================================
   7️⃣ Supprimer un item
   ========================================================= */
const itemToDelete = segment.dates[0].items[1];

removeItem(itemToDelete.id);
console.log("Item supprimé");

/* =========================================================
   8️⃣ État final du segment
   ========================================================= */
segment = getSegment(segmentId);

console.log("\n=== SEGMENT FINAL ===");
console.dir(segment, { depth: null });

/* =========================================================
   9️⃣ Nettoyage (optionnel)
   ========================================================= */
/*
db.prepare(`
  DELETE FROM segments WHERE id = ?
`).run(segmentId);

console.log("\nSegment de test supprimé");
*/

/* ========================================================= */
console.log("\n=== TESTS TERMINÉS AVEC SUCCÈS ===");
