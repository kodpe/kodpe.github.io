// web/auth.js
const { getUserByToken } = require("../db/db-users");

module.exports = function checkToken(req, res, next) {
  const token = req.query.token;

  if (!token) {
    return res.status(401).send("Token manquant");
  }

  const user = getUserByToken(token);

  if (!user) {
    return res.status(401).send("Accès refusé");
  }

  // utilisateur attaché à la requête
  req.user = user;

  next();
};