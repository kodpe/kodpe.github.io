const client = require("./client");
const { CHANNEL_VOICE_ID, CHANNEL_VOICE_ID_2, CHANNEL_TEXT_ID, MESSAGE_ID } = require("../config/env");
const { formatHours, getMonday } = require("../utils/time");
const { loadData, saveData, getData } = require("../data/storage");
const { sendSvgAsImage, sendHoursTable } = require("./pngSender")

// --- Update Discord message ---
async function updateMessage() {
  // sendHoursTable(); // png message
  // return; // deprecated below

  const data = getData();
  const channel = await client.channels.fetch(CHANNEL_TEXT_ID);
  let message;
  try { message = await channel.messages.fetch(MESSAGE_ID); } catch { message = null; }

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const mondayStr = getMonday(now);

  let leaderboard = "Bonjour, le compteur de temps est activé pour les channels réservés au travail\n<#"+CHANNEL_VOICE_ID+"> et <#"+CHANNEL_VOICE_ID_2+">\n";
  leaderboard += "```\n";
  leaderboard += "╔═══════════╤════════╤════════╤════════╗\n";
  leaderboard += "║           │  Today │   Week │    ALL ║\n";
  leaderboard += "╠═══════════╪════════╪════════╪════════╣\n";
  // leaderboard += "╚═══════════╧════════╧════════╧════════╝\n";

  const entries = Object.keys(data.totals).sort((a, b) => (data.totals[b] || 0) - (data.totals[a] || 0));
  for (const userId of entries) {
  // for (let i = 0; i < entries.length; i++) {
    // const userId = entries[i];
    const displayName = (data.aliases[userId] || `<@${userId}>`).padEnd(10, ' ');
    const todayHours = (data.daily[userId]?.date === todayStr) ? data.daily[userId].hours : 0;
    const weekHours = (data.weekly[userId]?.week === mondayStr) ? data.weekly[userId].hours : 0;
    const allTimeHours = data.totals[userId] || 0;

    leaderboard += `║ ${displayName.padStart(7, ' ')}│ ${formatHours(todayHours).padStart(6, ' ')} │ ${formatHours(weekHours).padStart(6, ' ')} │ ${formatHours(allTimeHours).padStart(6, ' ')} ║\n`;
    // if (i + 1 < entries.length) {
    // leaderboard += "╟───────────┼────────┼────────┼────────╢\n";
    // }
  }

  leaderboard += "╚═══════════╧════════╧════════╧════════╝\n";
  leaderboard += `\nUpdate : ${now.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' })} ${now.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' })}\n`;
  leaderboard += "```\n";

  if (!message) {
    const sent = await channel.send(leaderboard);
    MESSAGE_ID = sent.id;
    console.log(`🆕 Nouveau message créé : ${sent.id}`);
  } else if (message.author.id === client.user.id) {
    await message.edit({ content: leaderboard, files: [] });
    console.log(`Message édité : ${message.id}`);
  } else {
    console.warn("⚠️ Le message n’appartient pas au bot, impossible de le modifier.");
  }
}

module.exports = {
  updateMessage
};