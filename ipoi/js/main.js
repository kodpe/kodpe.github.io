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

btnLearn.addEventListener('click', function () {
    generateWebsiteGrid("learn");
    resetUIselector();
    btnLearn.parentElement.classList.add("ui-selector");
});
btnFun.addEventListener('click', function () {
    generateWebsiteGrid("fun");
    resetUIselector();
    btnFun.parentElement.classList.add("ui-selector");
});
btnArt.addEventListener('click', function () {
    generateWebsiteGrid("art");
    resetUIselector();
    btnArt.parentElement.classList.add("ui-selector");
});

function resetUIselector() {
    btnLearn.parentElement.classList.remove("ui-selector");
    btnFun.parentElement.classList.remove("ui-selector");
    btnArt.parentElement.classList.remove("ui-selector");
    inp.value = "";
    wrp.classList.remove("ui-selector");
}

const elements = document.querySelectorAll('.refresh');
// console.log(elements);
elements.forEach(element => {
    element.addEventListener('click', function () {
        // location.reload(); // current page reload
        clickGlobalShuffle();
        generateWebsiteGrid("all");
    });
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function clickGlobalShuffle() {
    shuffleArray(data);
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
            keys.push(...splitString(normalizeWord(site.name))); // ajout du nom du site aux keywords
            // keys.push(...splitString(normalizeWord(site.url)));
            keys.push(...site.keywords.map(element => normalizeWord(element)));
            keys = uniqSet(keys);
            console.log("queries:", queries, " keys:", keys);
            let found = queries.some(query => keys.some(key => key.includes(query)));
            if (found) {
                console.log("%c[" + queries + "] found in " + site.name +" "+site.url, "background: black; color: green; padding: 2px;");
            } else {
                // console.log("%c[" + queries + "] not found in " + site.name+" "+site.url, "background: black; color: orange; padding: 2px;");
                return;
            }
        }

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
    <img class="webimg" src="${'../img/sites/' + site.img}" alt="${site.name}">
    <div class="site-name">${site.name}</div>
    <div class="icon-grid"></div>
    `;

        const iconGrid = card.querySelector(".icon-grid");
        if (site.icon != null) {
            site.icon.forEach(name => {
                const iconElement = document.createElement("div");
                iconElement.className = "icon";
                console.log(name);
                iconElement.innerHTML = '<span>' + icons[name].svg + '</span>';
                iconElement.title = icons[name].info;
                iconGrid.appendChild(iconElement);
            });
        }

        const wimg = card.querySelector(".webimg");
        wimg.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            window.open(site.url, "_blank");
        });

        card.addEventListener('click', () => {
            window.open(site.url, "_blank");
        });
        grid.appendChild(card);
    });

}

generateWebsiteGrid("all");