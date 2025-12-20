const path = require("path");
const checkToken = require("./auth");

module.exports = function (app) {
  app.get("/", checkToken, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  });
};
