const { db } = require("./db");

const items = db.prepare("SELECT id FROM edn_items").all();

const insert = db.prepare(`
INSERT OR REPLACE INTO user_item_counters (user_id, item_id, revision_count)
VALUES (?, ?, 0)
`);

const tx = db.transaction(() => {
    for (const item of items) {
        insert.run(1, item.id); // 1 is user_id
    }
});

tx();