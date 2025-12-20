/* index.js main entrypoint */
const startServer = require("./web/server");
const client = require("./discord/client");
require("./discord/events");
const { DISCORD_BOT_TOKEN } = require("./config/env");

(async () => {
  startServer();
  client.login(DISCORD_BOT_TOKEN);
})();
