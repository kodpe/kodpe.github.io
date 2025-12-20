const fs = require("fs");
const client = require("./client");
const { AttachmentBuilder } = require("discord.js");
const sharp = require("sharp");
const { CHANNEL_VOICE_ID, CHANNEL_TEXT_ID, MESSAGE_ID } = require("../config/env");
const { formatHours, getMonday } = require("../utils/time");
const { loadData, saveData, getData } = require("../data/storage");

const fontBase64 = fs.readFileSync("fonts/Consor.ttf", { encoding: "base64" });
console.log("Font loaded:", fontBase64.length);

async function sendSvgAsImage(svgContent) {
    if (!svgContent) {
        svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
            <rect width="400" height="400" fill="blue" />
            <circle cx="200" cy="200" r="100" fill="yellow" />
            <text x="200" y="220" font-size="40" text-anchor="middle" fill="black">?</text>
        </svg>
        `;
    }

    const widthMatch = svgContent.match(/width="(\d+)"/);
    const heightMatch = svgContent.match(/height="(\d+)"/);
    const width = widthMatch ? parseInt(widthMatch[1], 10) : 500;
    const height = heightMatch ? parseInt(heightMatch[1], 10) : 200;
    const scale = 2;
    const pngBuffer = await sharp(Buffer.from(svgContent))
        .png({ quality: 100 })
        .resize({ width: width * scale, height: height * scale})
        .toBuffer();
    const fileName = "svgAsPng.png";
    const attachment = new AttachmentBuilder(pngBuffer, { name: fileName });

    try {
        const channel = await client.channels.fetch(CHANNEL_TEXT_ID);
        let message = await channel.messages.fetch(MESSAGE_ID);
        await message.edit({ content: "", files: [attachment] });
    } catch (err) {
        console.warn("⚠️ svgAsPng.png n'a pas pu être envoyé");
    }
}

async function sendHoursTable(channel) {
    const data = getData();
    const aliases = data.aliases;
    const users = Object.keys(aliases);

    const width = 510;
    const rowHeight = 40;
    const headerHeight = 40;
    const footerHeight = 40;
    const height = headerHeight + users.length * rowHeight + footerHeight + 10;

    // Début SVG
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <style>
        @font-face {
            font-family: "MyMono";
            src: url("data:font/ttf;base64,${fontBase64}") format("truetype");
        }
        .header, .row, .footer {
        font-family: "MyMono", monospace;
        font-size: 15px;
        font-weight: bold;
        fill: #ffffff;
        }
        .cell { stroke: #ffffff; fill: #1a1a1e; stroke-width: 1; }
        .header-cell { fill: #1a1a1e; }
    </style>
    <rect width="100%" height="100%" fill="#1a1a1e" />`;

    // Largeurs colonnes
    const colWidths = [200, 100, 100, 100]; // Name | Today | Week | All-time
    const colsX = colWidths.reduce((acc, w, i) => {
        acc.push((acc[i - 1] || 0) + (i > 0 ? colWidths[i - 1] : 0));
        return acc;
    }, []);

    // Ligne header
    svg += colsX.map((x, i) => `<rect x="${5 + x}" y="5" width="${colWidths[i]}" height="${headerHeight}" class="cell header-cell" />`).join("");
    const headers = ["", "Today", "Week", "All-time"];
    svg += headers.map((text, i) => `<text x="${5 + colsX[i] + 10}" y="30" class="header">${text}</text>`).join("");

    // Lignes utilisateurs
    users.forEach((id, rowIdx) => {
        const y = headerHeight + rowIdx * rowHeight;
        // Fond des cellules
        svg += colsX.map((x, i) => `<rect x="${5 + x}" y="${y}" width="${colWidths[i]}" height="${rowHeight}" class="cell" />`).join("");
        // Texte
        const name = aliases[id];
        const today = formatHours(data.daily[id]?.hours || 0);
        const week = formatHours(data.weekly[id]?.hours || 0);
        const total = formatHours(data.totals[id] || 0);
        const texts = [name, today, week, total];
        svg += texts.map((text, i) => `<text x="${5 + colsX[i] + 10}" y="${y + 25}" class="row">${text}</text>`).join("");
    });

    // Footer avec date
    const now = new Date();
    const footerText = `Update: ${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    svg += `<text x="15" y="${height - 10}" class="footer">${footerText}</text>`;

    svg += `</svg>`;

    sendSvgAsImage(svg);
}

module.exports = {
    sendSvgAsImage,
    sendHoursTable
};