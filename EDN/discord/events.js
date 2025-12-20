const client = require("./client");
const { CHANNEL_VOICE_ID, CHANNEL_VOICE_ID_2, CHANNEL_TEXT_ID, MESSAGE_ID } = require("../config/env");
const { updateMessage } = require("./board");
const { formatHours, getMonday } = require("../utils/time");
const { loadData, saveData, getData } = require("../data/storage");
const { sendSvgAsImage, sendHoursTable } = require("./pngSender")

const TRACKED_VOICE_CHANNELS = [
    CHANNEL_VOICE_ID,
    CHANNEL_VOICE_ID_2
];

let sessions = {};

// --- Discord Events ---
client.once('clientReady', async () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
    try {
        for (const channelId of TRACKED_VOICE_CHANNELS) {
            const channel = await client.channels.fetch(channelId);
            channel.members.forEach(member => {
                const userId = member.user.id;
                if (!sessions[userId]) sessions[userId] = Date.now();
            });
        }

    } catch (err) {
        console.error("Erreur lors de l'initialisation des sessions :", err);
    }
    loadData();
    // updateMessage();
    setInterval(async () => { await updateMessage(); }, 4 * 60 * 60 * 1000);

    function scheduleMidnightUpdate() {
        const now = new Date();
        const nextMidnight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
            0, 0, 0, 0
        );
        const msUntilMidnight = nextMidnight - now;

        setTimeout(() => {
            updateDailyAtMidnight();
            // Ensuite on répète toutes les 24h
            setInterval(updateDailyAtMidnight, 24 * 60 * 60 * 1000);
        }, msUntilMidnight);
    }

    scheduleMidnightUpdate();
});

client.on('voiceStateUpdate', (oldState, newState) => {
    const userId = newState.member.user.id;
    const oldChannelId = oldState.channelId;
    const newChannelId = newState.channelId;
    const data = getData();

    const wasTracked = TRACKED_VOICE_CHANNELS.includes(oldChannelId);
    const isTracked = TRACKED_VOICE_CHANNELS.includes(newChannelId);

    // >>> Entrée dans un salon tracké
    if (isTracked && !wasTracked && !sessions[userId]) {
        console.log(`✅ >>> ENTER ${userId} ${data.aliases[userId]}`);
        sessions[userId] = Date.now();
    }

    // <<< Sortie d’un salon tracké
    if (wasTracked && !isTracked && sessions[userId]) {
        console.log(`✅ <<< EXIT ${userId} ${data.aliases[userId]}`);
        const duration = (Date.now() - sessions[userId]) / 3600000;

        data.totals[userId] = (data.totals[userId] || 0) + duration;

        const todayStr = new Date().toISOString().slice(0, 10);
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
        saveData();
        updateMessage();
    }
});

function updateDailyAtMidnight() {
    const data = getData();
    const todayStr = new Date().toISOString().slice(0, 10);

    // Si des utilisateurs sont encore connectés, on calcule leur temps jusqu'à maintenant
    const now = Date.now();
    for (const userId of Object.keys(sessions)) {
        const duration = (now - sessions[userId]) / 3600000; // heures
        data.totals[userId] = (data.totals[userId] || 0) + duration;

        // Ajouter aux journaux quotidiens
        if (!data.daily[userId] || data.daily[userId].date !== todayStr) {
            data.daily[userId] = { date: todayStr, hours: 0 };
        }
        data.daily[userId].hours += duration;

        // Ajouter aux journaux hebdos
        const mondayStr = getMonday(new Date());
        if (!data.weekly[userId] || data.weekly[userId].week !== mondayStr) {
            data.weekly[userId] = { week: mondayStr, hours: 0 };
        }
        data.weekly[userId].hours += duration;

        // Réinitialiser le timer pour le nouveau jour
        sessions[userId] = now;
    }

    saveData();
    updateMessage(); // met à jour le message Discord
}
