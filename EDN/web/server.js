const express = require("express");
const path = require("path");
const routes = require("./routes");
const { PORT } = require("../config/env");

function startServer() {
  const app = express();

  // assets libres
  app.use("/css", express.static(path.join(__dirname, "..", "public/css")));
  app.use("/js", express.static(path.join(__dirname, "..", "public/js")));
  app.use("/data", express.static(path.join(__dirname, "..", "public/data")));
  app.use("/images", express.static(path.join(__dirname, "..", "public/images")));

  routes(app);

  app.listen(PORT, () =>
    console.log(`🌐 Web server actif sur ${PORT}`)
  );
}

module.exports = startServer;
