const { db } = require("./db");

// récupère toutes les counts d'un user
function getAllUserItemCounters(userId) {
  return db.prepare(`
    SELECT
      uic.item_id,
      uic.revision_count,
      i.edn_id,
      i.label,
      i.weight
    FROM user_item_counters uic
    JOIN edn_items i ON i.id = uic.item_id
    WHERE uic.user_id = ?
    ORDER BY i.edn_id
  `).all(userId);
}

// récupère une count précise
function getUserItemCounter(userId, itemId) {
  return db.prepare(`
    SELECT *
    FROM user_item_counters
    WHERE user_id = ? AND item_id = ?
  `).get(userId, itemId);
}

// crée la ligne si elle n'existe pas
function ensureUserItemCounter(userId, itemId) {
  db.prepare(`
    INSERT OR IGNORE INTO user_item_counters (user_id, item_id, revision_count)
    VALUES (?, ?, 0)
  `).run(userId, itemId);
}

// +1
function incrementUserItemCounter(userId, itemId) {
  ensureUserItemCounter(userId, itemId);

  db.prepare(`
    UPDATE user_item_counters
    SET revision_count = revision_count + 1
    WHERE user_id = ? AND item_id = ?
  `).run(userId, itemId);

  return getUserItemCounter(userId, itemId);
}

// -1 avec minimum 0
function decrementUserItemCounter(userId, itemId) {
  ensureUserItemCounter(userId, itemId);

  db.prepare(`
    UPDATE user_item_counters
    SET revision_count = CASE
      WHEN revision_count > 0 THEN revision_count - 1
      ELSE 0
    END
    WHERE user_id = ? AND item_id = ?
  `).run(userId, itemId);

  return getUserItemCounter(userId, itemId);
}

// set direct
function setUserItemCounter(userId, itemId, count) {
  const safeCount = Math.max(0, Number(count) || 0);

  db.prepare(`
    INSERT INTO user_item_counters (user_id, item_id, revision_count)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, item_id) DO UPDATE SET
      revision_count = excluded.revision_count
  `).run(userId, itemId, safeCount);

  return getUserItemCounter(userId, itemId);
}

module.exports = {
  getAllUserItemCounters,
  getUserItemCounter,
  incrementUserItemCounter,
  decrementUserItemCounter,
  setUserItemCounter
};