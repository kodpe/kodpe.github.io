/*
== css to disable ==
.gm-element-disabled {
    display: none;
}
*/


// == game manager class list ==
const gmClasses = [
    'gm-menu',
    'gm-menu-cats',
    'gm-ingame-question',
    'gm-ingame-answer',
    'gm-ingame-summary'
];

// Constants for better readability and maintenance
const GM_DISABLED = "gm-element-disabled";
const GM_MENU = gmClasses[0];
const GM_CATEGORIES = gmClasses[1];
const GM_QUESTION = gmClasses[2];
const GM_ANSWER = gmClasses[3];
const GM_SUMMARY = gmClasses[4];


function addClassSetupGM() {
    document.getElementById('gm-top-title').classList.add(GM_MENU);

    document.getElementById('topbar').classList.add(GM_CATEGORIES);
    document.getElementById('cnt1').classList.add(GM_CATEGORIES);
    document.getElementById('cnt2').classList.add(GM_CATEGORIES);
    document.getElementById('cnt3').classList.add(GM_CATEGORIES);

    // in-game elements ig-
    document.getElementById('ig-scorebar').classList.add(GM_QUESTION);
    document.getElementById('ig-scorebar').classList.add(GM_ANSWER);

    document.getElementById('ig-answer-score').classList.add(GM_ANSWER);
    document.getElementById('ig-final-score').classList.add(GM_SUMMARY);

    document.getElementById('ig-question-card').classList.add(GM_QUESTION);
    document.getElementById('ig-answer-card').classList.add(GM_ANSWER);
    document.getElementById('ig-history-card').classList.add(GM_SUMMARY);

    document.getElementById('ig-final-stats').classList.add(GM_SUMMARY);

    document.getElementById('ig-true-btn').classList.add(GM_QUESTION);
    document.getElementById('ig-false-btn').classList.add(GM_QUESTION);
    document.getElementById('ig-next-btn').classList.add(GM_ANSWER);
    document.getElementById('ig-end-btn').classList.add(GM_SUMMARY);
    //

    document.getElementById('gm-menu').classList.add(GM_MENU);
    document.getElementById('info-version').classList.add(GM_MENU);
    document.getElementById('absolute-bot').classList.add(GM_MENU);
    // document.getElementById('absolute-bot').classList.add(GM_CATEGORIES);
}

function onClassGM(name) {
    try {
        const elements = Array.from(document.getElementsByClassName(name));
        if (elements.length === 0) {
            console.warn("onClassGM("+name+") : No elements found");
        }
        elements.forEach(elem => elem.classList.remove(GM_DISABLED));
    } catch (error) {
        console.error(`onClassGM() : Error while processing class: ${name}`, error);
    }
}

function disableClassGM(name) {
    try {
        const elements = Array.from(document.getElementsByClassName(name));
        if (elements.length === 0) {
            console.warn("disableClassGM("+name+") : No elements found");
        }
        elements.forEach(elem => elem.classList.add(GM_DISABLED));
    } catch (error) {
        console.error(`disableClassGM() : Error while processing class: ${name}`, error);
    }
}

function showUI(activeClass) {
    gmClasses.forEach(name => {
        if (name != activeClass) {
            disableClassGM(name);
        }
    });
    gmClasses.forEach(name => {
        if (name === activeClass) {
            onClassGM(name);
        }
    });
    currentUI = activeClass;
}

// State management functions
function showMenuUI() {
    showUI(GM_MENU);
}

function showCategoriesUI() {
    showUI(GM_CATEGORIES);
}

function showQuestionUI() {
    showUI(GM_QUESTION);
}

function showAnswerUI() {
    showUI(GM_ANSWER);
}

function showSummaryUI() {
    showUI(GM_SUMMARY);
}


// global to find current ui mode
let currentUI = GM_MENU;