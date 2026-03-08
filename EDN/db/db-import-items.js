const { db } = require("./db");
const fs = require("fs");

const items = JSON.parse(
  fs.readFileSync("./db/items.json", "utf8")
);

const insert = db.prepare(`
INSERT INTO edn_items (edn_id, label)
VALUES (?, ?)
`);

const tx = db.transaction((items) => {
  for (const item of items) {
    insert.run(
      parseInt(item.item),
      item.description
    );
  }
});

tx(items);

console.log("[OK] items importes :", items.length);