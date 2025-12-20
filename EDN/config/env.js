require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  DISCORD_BOT_TOKEN: process.env.TOKEN,
  CHANNEL_TEXT_ID: process.env.CHANNEL_TEXT_ID,
  CHANNEL_VOICE_ID: process.env.CHANNEL_VOICE_ID,
  CHANNEL_VOICE_ID_2: process.env.CHANNEL_VOICE_ID_2,
  MESSAGE_ID: process.env.MESSAGE_ID,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  DB_PATH: process.env.DB_PATH,
  WEB_SECRET: process.env.WEBSITE_ACCESS
};