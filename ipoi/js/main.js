function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

const wrp = document.getElementById('input-wrp');
const inp = document.getElementById('inp');
const btnLearn = document.getElementById('btn-learn');
const btnFun = document.getElementById('btn-fun');
const btnArt = document.getElementById('btn-art');
const btnAdd = document.getElementById('addbutton');
const submitPageElement = document.getElementById("submit-page");
const gridElement = document.getElementById('grid');
let currentSite = {};

btnLearn.addEventListener('click', function () {
    shuffleArray(data);
    generateWebsiteGrid("learn");
    resetUIselector();
    resetInputSearch();
    btnLearn.classList.add("ui-selector");
});
btnFun.addEventListener('click', function () {
    shuffleArray(data);
    generateWebsiteGrid("fun");
    resetUIselector();
    resetInputSearch();
    btnFun.classList.add("ui-selector");
});
btnArt.addEventListener('click', function () {
    shuffleArray(data);
    generateWebsiteGrid("art");
    resetUIselector();
    resetInputSearch();
    btnArt.classList.add("ui-selector");
});

function resetUIselector() {
    btnLearn.classList.remove("ui-selector");
    btnFun.classList.remove("ui-selector");
    btnArt.classList.remove("ui-selector");
    btnAdd.classList.remove("ui-selector");
    submitPageElement.classList.add("disabled");
    grid.classList.remove("disabled");
}

function resetInputSearch() {
    wrp.classList.remove("ui-selector");
    inp.value = "";
}

const elements = document.querySelectorAll('.refresh');
// console.log(elements);
elements.forEach(element => {
    element.addEventListener('click', function () {
        // location.reload(); // current page reload
        shuffleArray(data);
        generateWebsiteGrid("all");
    });
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function removeAccents(chaine) {
    return chaine.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function normalizeWord(word) {
    return removeAccents(word.toLowerCase());
}

function splitString(input) {
    const regex = /([a-zA-Z]+|\d+)/g;
    let result = input.match(regex) || [];
    return result.filter(word => word.length > 2 || !isNaN(word));
}

function removeWordsUnderLength(array, minLength) {
    return array.filter(word => word.length > minLength || !isNaN(word));
}

function improveKeywords(keywords) {
    const keywordMapping = {
        "sea": ["mer", "ocean", "marine", "maritime"],
        "ship": ["boat", "bateau", "navire", "sea", "ocean"],
        "aviation" : ["plane", "air", "flight", "avion", "vol", "fly", "sky"],
        "coding": ["code", "codes", "dev"],
        "map": ["maps", "carte", "world", "plan", "cartes"],
        "tool": ["tools", "outils", "util", "utils", "utile"],
        "art": ["arts", "artist", "artistic"],
        "math": ["maths"],
        "cat": ["cats", "chats"],
        "donut": ["donuts"],
        "comic": ["comics"],
        "dice": ["dices"],
        "music": ["musics", "musique", "sound"],
        "garden": ["jardin"],
        "weird": ["wtf", "strange", "crazy", "mad"],
        "control": ["controle", "check"],
        "game": ["games", "jeux", "jeu", "play"],
        "lol": ["league", "legends", "faille", "rift", "champion", "champ"],
        "road": ["route", "drive", "conduite", "car", "voiture"],
    };

    let toAdd = [];
    keywords.forEach(key => {
        if (keywordMapping[key]) {
            toAdd.push(...keywordMapping[key]);
        }
        if (!keywordMapping[key]?.includes(key + "s") && !key.endsWith("s")) {
            toAdd.push(key + "s");
        }
    });
    return toAdd;
}

function uniqSet(arr) {
    return [...new Set(arr)];
}

https://libretranslate.com/?source=fr&target=en&q=fromage
function generateWebsiteGrid(queryStr) {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";
    // console.log("generateWebSiteGrid with queryStr ["+queryStr+"]");
    if (!queryStr)
        queryStr = "all";
    let queries = uniqSet(splitString(normalizeWord(queryStr)));
    // console.log("generateWebSiteGrid with queries ["+queries+"]");
    if (!queries)
        return;

    data.forEach(site => {
        if (!queries.includes("all")) {
            let keys = [];
            keys.push(...splitString(normalizeWord(site.name)));
            keys.push(...splitString(normalizeWord(site.url)));
            keys.push(...splitString(normalizeWord(site.img)));
            keys.push(...splitString(normalizeWord(site.icon.join(","))));
            keys.push(...site.keywords.map(element => normalizeWord(element)));
            keys.push(...improveKeywords(keys));
            keys = uniqSet(keys);
            // console.log("queries:", queries, " keys:", keys);
            let found = queries.some(query => keys.some(key => key.includes(query)));
            if (found) {
                // console.log("%c[" + queries + "] found in " + site.name +" "+site.url, "background: black; color: green; padding: 2px;");
            } else {
                // console.log("%c[" + queries + "] not found in " + site.name+" "+site.url, "background: black; color: orange; padding: 2px;");
                return;
            }
        }

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
    <img class="webimg"
    srcset="${'ipoi/img/sites_webp/' + site.img +'.webp'} 700w"
    src="${'ipoi/img/sites_webp/' + site.img +'.webp'}" width="700"
    alt="${site.name}"/>
    <div class="site-name">${site.name}</div>
    <div class="icon-grid"></div>
    `;

        const iconGrid = card.querySelector(".icon-grid");
        if (site.icon != null) {
            site.icon.forEach(name => {
                const iconElement = document.createElement("div");
                iconElement.className = "icon";
                // console.log(name);
                iconElement.innerHTML = '<span>' + icons[name].svg + '</span>';
                iconElement.title = icons[name].info;
                iconGrid.appendChild(iconElement);
            });
        }

        const wimg = card.querySelector(".webimg");
        wimg.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            scOpenHandler(site);
        });

        card.addEventListener('click', () => {
            scOpenHandler(site);
        });
        grid.appendChild(card);
    });

}

function scOpenHandler(site) {
    currentSite = site;
    if (site.icon.includes("nsfw") || site.icon.includes("photowarning")) {
        showPopup();
    }
    else {
        window.open(site.url, "_blank");
    }
}

console.log("nb sites registered : [", data.length, "]");
shuffleArray(data);
generateWebsiteGrid("all");