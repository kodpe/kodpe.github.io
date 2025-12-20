// data/storage.js
const fs = require("fs");
const path = require("path");

// Chemins
const PERSISTENT_PATH = "/data/discord-bot-data.json"; // Fly persistent storage
const LOCAL_PATH = path.join(__dirname, "discord-bot-data.json"); // fallback dev

let data = {
  totals: {},
  daily: {},
  weekly: {},
  aliases: {}
};

// Charger les données
function loadData() {
  if (fs.existsSync(PERSISTENT_PATH)) {
    data = JSON.parse(fs.readFileSync(PERSISTENT_PATH, "utf8"));
    console.log("✅ data.json chargé depuis /data (persistant) !");
  } else if (fs.existsSync(LOCAL_PATH)) {
    data = JSON.parse(fs.readFileSync(LOCAL_PATH, "utf8"));
    console.log("✅ data.json chargé depuis ./data (local) !");
  } else {
    console.log("⚠️ Aucun fichier data.json trouvé, initialisation vide.");
  }
  // return data;
}

// Sauvegarder les données
function saveData() {
  // Toujours dans le stockage persistant si possible
  const targetPath = fs.existsSync("/data") ? PERSISTENT_PATH : LOCAL_PATH;
  fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), "utf8");
  console.log(`💾 data.json sauvegardé dans ${targetPath}`);
}

function getData() {
  return data;
}

// Export
module.exports = { loadData, saveData, getData };
