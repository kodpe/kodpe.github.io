const { db } = require("./db");

function getUserByToken(token) {
  return db.prepare(`
    SELECT * FROM users WHERE api_token = ?
  `).get(token);
}

function getUserRevisionGoal(userId) {
  return db.prepare(`
    SELECT revision_goal_per_item
    FROM users
    WHERE id = ?
  `).get(userId);
}

function setUserRevisionGoal(userId, goal) {
  const safeGoal = Math.max(1, Number(goal) || 1);

  db.prepare(`
    UPDATE users
    SET revision_goal_per_item = ?
    WHERE id = ?
  `).run(safeGoal, userId);

  return db.prepare(`
    SELECT revision_goal_per_item
    FROM users
    WHERE id = ?
  `).get(userId);
}


module.exports = {
  getUserByToken,
  getUserRevisionGoal,
  setUserRevisionGoal,
};