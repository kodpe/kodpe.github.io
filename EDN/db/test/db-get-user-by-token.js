const { db } = require("../db");

const token = process.argv[2];

if (!token) {
  console.log("Usage: node db-get-user-by-token.js <token>");
  process.exit(1);
}

const user = db.prepare(`
  SELECT * FROM users WHERE api_token = ?
`).get(token);

console.log(user);