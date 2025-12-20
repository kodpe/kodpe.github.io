const { WEB_SECRET } = require("../config/env");

module.exports = function checkToken(req, res, next) {
  const token = req.query.token;
  if (token !== WEB_SECRET) {
    return res.status(401).send("Accès refusé");
  }
  next();
};
