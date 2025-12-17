// index.js
const express = require('express'); // à installer : npm i express
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
require('dotenv').config();

const TOKEN = process.env.TOKEN;
const CHANNEL_TEXT_ID = process.env.CHANNEL_TEXT_ID;
let MESSAGE_ID = process.env.MESSAGE_ID;
const CHANNEL_VOICE_ID = process.env.CHANNEL_VOICE_ID;
const SECRET_TOKEN = process.env.WEBSITE_ACCESS;

const DATA_FILE = 'data.json';
let sessions = {};
let data = {
  totals: {},
  daily: {},
  weekly: {},
  aliases: {}
};

// Charger les données si elles existent
if (fs.existsSync(DATA_FILE)) data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
async function loadDataFromGitHub() {
  if (!process.env.GITHUB_TOKEN) return; // Si pas de token, rester sur local
  try {
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const owner = "kodpe";       // à remplacer
    const repo = "edn-data";     // à remplacer
    const path = DATA_FILE;

    const { data: fileData } = await octokit.repos.getContent({ owner, repo, path });

    // Le contenu est encodé en base64
    const content = Buffer.from(fileData.content, "base64").toString("utf8");
    data = JSON.parse(content);
    console.log("✅ data.json chargé depuis GitHub !");
  } catch (err) {
    console.error("⚠️ Impossible de charger data.json depuis GitHub :", err.message);
    // fallback : fichier local si existe
    if (fs.existsSync(DATA_FILE)) {
      data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      console.log("✅ data.json chargé depuis fichier local.");
    }
  }
}

// Ton token secret partagé

// Servir les fichiers statiques depuis le dossier "public"
app.use(express.static(path.join(__dirname, "public")));

// Middleware pour vérifier le token dans l’URL
app.use((req, res, next) => {
  // Tu peux passer le token via query string: /?token=xxxx
  const token = req.query.token;

  if (token !== SECRET_TOKEN) {
    return res.status(401).send("Accès refusé. Token invalide.");
  }

  next();
});

// --- Express simple ---
/*
app.get('/', (req, res) => {
  res.send(`<h1>Bot Discord EDN est actif ✅</h1><p>Dernière mise à jour : ${new Date().toLocaleString()}</p>`);
});
*/

// Si quelqu’un fait GET /, renvoyer index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index2.html"));
});

app.listen(PORT, () => console.log(`🌐 Serveur web actif sur le port ${PORT}`));

// --- Discord ---
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// --- Helper pour sauvegarder le JSON local + GitHub ---
async function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  // --- GitHub push ---
  if (!process.env.GITHUB_TOKEN) return; // si pas de token, skip
  try {
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const owner = "kodpe"; // <--- à remplacer
    const repo = "edn-data";      // <--- à remplacer
    const path = DATA_FILE;

    const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

    // récupérer le sha si le fichier existe déjà
    let sha;
    try {
      const { data: existing } = await octokit.repos.getContent({ owner, repo, path });
      sha = existing.sha;
    } catch (err) {
      if (err.status !== 404) throw err;
    }

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: "Update data.json from bot",
      content,
      sha,
    });
    console.log("✅ data.json pushé sur GitHub !");
  } catch (err) {
    console.error("❌ Erreur GitHub :", err);
  }
}

// --- Helpers ---
function formatHours(hours) {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m === 0 ? `${h}h` : `${h}h${m.toString().padStart(2,'0')}`;
}
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0,10);
}

// --- Discord Events ---
client.once('ready', async () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
  try {
    const channel = await client.channels.fetch(CHANNEL_VOICE_ID);
    channel.members.forEach(member => {
      const userId = member.user.id;
      if (!sessions[userId]) sessions[userId] = Date.now();
    });
  } catch (err) {
    console.error("Erreur lors de l'initialisation des sessions :", err);
  }
  updateMessage();
});

client.on('voiceStateUpdate', (oldState, newState) => {
  const userId = newState.member.user.id;
  const oldChannelId = oldState.channelId;
  const newChannelId = newState.channelId;

  if (newChannelId === CHANNEL_VOICE_ID && !sessions[userId]) {
    console.log(`✅ ENTER ${userId}`);
    sessions[userId] = Date.now();
  }

  if (sessions[userId] && (oldChannelId === CHANNEL_VOICE_ID && newChannelId !== CHANNEL_VOICE_ID)) {
    console.log(`✅ EXIT ${userId}`);
    const duration = (Date.now() - sessions[userId]) / 3600000;

    data.totals[userId] = (data.totals[userId] || 0) + duration;

    const todayStr = new Date().toISOString().slice(0,10);
    if (!data.daily[userId] || data.daily[userId].date !== todayStr) {
      data.daily[userId] = { date: todayStr, hours: 0 };
    }
    data.daily[userId].hours += duration;

    const mondayStr = getMonday(new Date());
    if (!data.weekly[userId] || data.weekly[userId].week !== mondayStr) {
      data.weekly[userId] = { week: mondayStr, hours: 0 };
    }
    data.weekly[userId].hours += duration;

    delete sessions[userId];
    (async () => { await saveData(); })();
    updateMessage();
  }
});

// --- Update Discord message ---
async function updateMessage() {
  const channel = await client.channels.fetch(CHANNEL_TEXT_ID);
  let message;
  try { message = await channel.messages.fetch(MESSAGE_ID); } catch { message = null; }

  const now = new Date();
  const todayStr = now.toISOString().slice(0,10);
  const mondayStr = getMonday(now);

  let leaderboard = "```\n";
  leaderboard += "            | Today | Week  | All-time |\n";
  leaderboard += " -----------|-------|-------|----------|\n";

  const entries = Object.keys(data.totals).sort((a,b) => (data.totals[b] || 0) - (data.totals[a] || 0));
  for (const userId of entries) {
    const displayName = (data.aliases[userId] || `<@${userId}>`).padEnd(10,' ');
    const todayHours = (data.daily[userId]?.date === todayStr) ? data.daily[userId].hours : 0;
    const weekHours = (data.weekly[userId]?.week === mondayStr) ? data.weekly[userId].hours : 0;
    const allTimeHours = data.totals[userId] || 0;

    leaderboard += `| ${displayName.padStart(8,' ')}| ${formatHours(todayHours).padStart(5,' ')} | ${formatHours(weekHours).padStart(5,' ')} | ${formatHours(allTimeHours).padStart(8,' ')} |\n`;
  }

  leaderboard += `\nUpdate : ${now.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' })} ${now.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' })}\n`;
  leaderboard += "```\n";

  if (!message) {
    const sent = await channel.send(leaderboard);
    MESSAGE_ID = sent.id;
    console.log(`🆕 Nouveau message créé : ${sent.id}`);
  } else if (message.author.id === client.user.id) {
    await message.edit(leaderboard);
    console.log(`Message édité : ${message.id}`);
  } else {
    console.warn("⚠️ Le message n’appartient pas au bot, impossible de le modifier.");
  }
}

// Update chaque 180 minutes
setInterval(updateMessage, 3 * 60 * 60 * 1000);


(async () => {
  await loadDataFromGitHub();
  client.login(TOKEN);
})();
