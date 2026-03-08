// db-add-user.js
const { db } = require("./db");
const crypto = require("crypto");

const token = crypto.randomBytes(32).toString("hex");

db.prepare(`
INSERT INTO users (name, api_token)
VALUES (?, ?)
`).run("Kodp", token);

console.log("✅ User créé");
console.log("Token :", token);