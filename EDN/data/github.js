const { Octokit } = require("@octokit/rest");
const { GITHUB_TOKEN } = require("../config/env");
const { loadData, saveData, data } = require("./storage");

/* DEPRECATED */

const owner = "kodpe";
const repo = "edn-data";
const path = "data.json";

async function loadFromGitHub() {
    // if (!GITHUB_TOKEN) return;
    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    try {
        const { data: file } = await octokit.repos.getContent({ owner, repo, path });
        Object.assign(data, JSON.parse(Buffer.from(file.content, "base64")));
        console.log("✅ data.json chargé depuis GitHub");
    } catch (e) {
        console.warn("⚠️ GitHub load failed");
    }
}

async function saveToGitHub() {
    // if (!GITHUB_TOKEN) return;
    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    let sha;
    try {
        sha = (await octokit.repos.getContent({ owner, repo, path })).data.sha;
    } catch { }

    await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: "Update data.json",
        content: Buffer.from(JSON.stringify(data, null, 2)).toString("base64"),
        sha
    });
    console.log("✅ data.json save on GitHub");
}

// module.exports = { loadFromGitHub, saveToGitHub };
