/* index.js main entrypoint */
const startServer = require("./web/server");
const client = require("./discord/client");
require("./discord/events");
const { DISCORD_BOT_TOKEN } = require("./config/env");

(async () => {
  startServer();
  if (process.env.NODE_ENV === "development") {
    console.log("DEVELOPMENT MODE")
    console.log("http://localhost:3000/?token=d67a4ba21340adf0241c7eac0604169a39851a789857ec437e568c1f0c63373a")
  }
  else {
    console.log("PRODUCTION MODE")
    client.login(DISCORD_BOT_TOKEN);
  }
})();

// npm run dev
// fly ssh console -C "printenv"