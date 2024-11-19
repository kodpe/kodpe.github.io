let questions = [];
let selectedPools = [];
let config = {};
let currentQuestionIndex = 0;
let score = 0;
let quizMode = '';
let numQuestions = 0;
let historyResult = '';
let selectAllCardsBool = false;
let isUniqDomainQuiz = false;
let domainName = '';
let xp = 0;
let comboModifier = 0;
let bestcombo = 0;
let bonusPercent = 0;
let fliped = false;
let currentQID = "";
let gameStartTime = new Date();
let endStartTime = new Date();

// <!-- // in-game elements ig- -->
const winrateElem = document.getElementById('ig-winrate');
const comboElem = document.getElementById('ig-combo');
const xpElem = document.getElementById('ig-xp');

const answerTitleElem = document.getElementById('ig-answer-title');
// const answerXpElem = document.getElementById('ig-answer-xp');

const finalTitleElem = document.getElementById('ig-final-title');
const finalRatioElem = document.getElementById('ig-final-ratio');

const questionElemS = document.getElementsByClassName('ig-question');
const progressElemS = document.getElementsByClassName('ig-progress');
const titleCardElemS = document.getElementsByClassName('ig-title-card');

const answerCardElem = document.getElementById('ig-answer-card');
const questionToFlipElem = document.getElementById('ig-question-to-flip');

const answerElem = document.getElementById('ig-answer');
const favoriteElem = document.getElementById('ig-favorite');
favoriteElem.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"><path d="m480-121-41-37q-105.77-97.12-174.88-167.56Q195-396 154-451.5T96.5-552Q80-597 80-643q0-90.15 60.5-150.58Q201-854 290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.42Q880-733.15 880-643q0 46-16.5 91T806-451.5Q765-396 695.88-325.56 626.77-255.12 521-158l-41 37Zm0-79q101.24-93 166.62-159.5Q712-426 750.5-476t54-89.14q15.5-39.13 15.5-77.72 0-66.14-42-108.64T670.22-794q-51.52 0-95.37 31.5T504-674h-49q-26-56-69.85-88-43.85-32-95.37-32Q224-794 182-751.5t-42 108.82q0 38.68 15.5 78.18 15.5 39.5 54 90T314-358q66 66 166 158Zm0-297Z"/></svg>`;
const reportElem = document.getElementById('ig-report');
reportElem.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"><path d="M480-281q14 0 24.5-10.5T515-316q0-14-10.5-24.5T480-351q-14 0-24.5 10.5T445-316q0 14 10.5 24.5T480-281Zm-30-144h60v-263h-60v263ZM330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm25-60h250l175-175v-250L605-780H355L180-605v250l175 175Zm125-300Z"/></svg>`;
const swipeElem = document.getElementById('ig-swipe');
swipeElem.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"><path d="M470-80q-21.88 0-41.94-8T392-112L184-320l15-22q11-16 28.5-22.5T264-366l96 26v-340q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v420l-124-33 139.18 139.18Q442-147 451.13-143.5q9.13 3.5 18.87 3.5h170q42 0 71-29t29-71v-180q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v180q0 66-47 113T640-80H470Zm17-290v-170q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v170h-60Zm126 0v-130q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v130h-60Zm-46 105Zm313-435H700v-40h133q-75-65-164.5-102.5T480-880q-99 0-188.5 37.5T127-740h133v40H80v-180h40v93q78-62 169-97.5T480-920q100 0 191 35.5T840-787v-93h40v180Z"/></svg>`;

const historyCardElem = document.getElementById('ig-history-card');
const historyGridElem = document.getElementById('ig-history-grid');

const finalStatsElem = document.getElementById('ig-final-stats');
const fstatsWinrate = document.getElementById('ig-fstats-winrate');
const fstatsBestCombo = document.getElementById('ig-fstats-bestcombo');
const fstatsTime = document.getElementById('ig-fstats-time');

const fstatsXpDay = document.getElementById('ig-fstats-xp-day');
fstatsXpDay.innerHTML = "☀️ +100%";
const fstatsXpMarathon = document.getElementById('ig-fstats-xp-marathon');
fstatsXpMarathon.innerHTML = "🏃 +20%";
const fstatsXpPelerinage = document.getElementById('ig-fstats-xp-pelerinage');
fstatsXpPelerinage.innerHTML = "🗿 +50%";
const fstatsXpPerfect = document.getElementById('ig-fstats-xp-perfect');
fstatsXpPerfect.innerHTML = "🏆 +10%";
const fstatsXpTotal = document.getElementById('ig-fstats-xp-total');
fstatsXpTotal.innerHTML = " +9999 XP";

const trueButton = document.getElementById('ig-true-btn');
const falseButton = document.getElementById('ig-false-btn');
const nextButton = document.getElementById('ig-next-btn');
const endButton = document.getElementById('ig-end-btn');

const validMarkIcon =`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"><path d="m419-321 289-289-43-43-246 246-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z" /></svg>`;
const missMarkIcon =`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"><path d="m336-294 144-144 144 144 42-42-144-144 144-144-42-42-144 144-144-144-42 42 144 144-144 144 42 42ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z"/></svg>`;
// <!--  -->

async function loadConfig() {
    try {
        const configResponse = await fetch('../q-data/config.json');
        if (!configResponse.ok) {
            throw new Error('Erreur lors du chargement de config.json');
        }
        config = await configResponse.json();
    } catch (error) {
        console.error('Erreur de chargement de la configuration :', error);
    }
}

function shuffleQuestions(questionsArray) {
    for (let i = questionsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Index aléatoire
        [questionsArray[i], questionsArray[j]] = [questionsArray[j], questionsArray[i]]; // Échanger les éléments
    }
}

// Charger les questions en fonction des pools sélectionnés
async function loadQuestions() {

    // console.log("filters:", gameFilters);
    const cats = Object.entries(gameFilters)
        .filter(([key, value]) => value === true)  // Filtre les clés avec la valeur true
        .map(([key, value]) => key);
    console.log("cats:", cats);

    console.log(selectedPools);
    console.log(config.pools);

    // Étape 2 : Ajouter à selectedPools les pools correspondants
    config.pools.forEach(pool => {
        if (cats.includes(pool.name)) {  // Vérifie si le pool.name est dans cats
            selectedPools.push(pool);   // Ajoute le pool à selectedPools
        }
    });

    questions = []; // Reset questions
    if (selectedPools.length === 0 || quizMode === 'daily') {
        console.log('Aucun pool sélectionné OR daily mode => ALL');
        selectedPools = [];
        config.pools.forEach(pool => {
            selectedPools.push(pool);
        });
    }
    if (selectedPools.length === 0) {
        console.error('Aucun pool sélectionné');
        return;
    }
    try {
        // console.log(selectedPools);
        for (const pool of selectedPools) {
            // console.log(pool.name);
            const response = await fetch(pool.file);
            if (!response.ok) {
                throw new Error(`Erreur de chargement des questions depuis ${pool.file}`);
            }
            const poolQuestions = await response.json();
            poolQuestions.forEach(question => {
                question.domainName = pool.name;
            });
            // console.log(poolQuestions);
            questions = questions.concat(poolQuestions);
        }
        // console.log(questions);
        numQuestions = questions.length;
        if (quizMode === 'classic') {
            numQuestions = 10;
            if (questions.length < 10) {
                questions = questions.concat(questions);
            }
            shuffleQuestions(questions);
        }
        else if (quizMode === 'marathon') {
            numQuestions = 42;
            while (questions.length < 42) {
                questions = questions.concat(questions);
            }
            shuffleQuestions(questions);
        }
        else if (quizMode === 'pelerinage') {
            numQuestions = 100;
            while (questions.length < 100) {
                questions = questions.concat(questions);
            }
            shuffleQuestions(questions);
        }
        else if (quizMode === 'daily') {
            numQuestions = 10;
            if (questions.length < 10) {
                questions = questions.concat(questions);
            }
            shuffleArray(questions, getDateSeed());
        }
        
        questions = questions.slice(0, numQuestions);
        startQuiz();
    } catch (error) {
        console.error('Erreur lors du chargement des questions:', error);
    }
}


function getDateSeed() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Mois commence à 0, donc ajoutez 1
    const year = currentDate.getFullYear();
    const seed = parseInt(`${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`, 10);
    return seed;
}

function seededRandom(seed) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function shuffleArray(array, seed) {
    let shuffledArray = array.slice(); // Crée une copie pour ne pas modifier l'original
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(seed) * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Échange
        seed++; // Incrémente la graine pour avoir une variation à chaque itération
    }
    return shuffledArray;
}

function startQuiz() {
    if (questions.length === 0) {
        console.log('Aucune question chargée.');
        return;
    }
    currentQuestionIndex = 0;
    score = 0;
    xp = 0;
    xpElem.innerHTML = xp +" xp";
    winrateElem.innerHTML = "0%";
    comboModifier = 0;
    bestcombo = 0;
    bonusPercent = 0;
    comboElem.innerHTML = '';
    historyResult = '';
    domainName = '';

    isUniqDomainQuiz = false;
    if (selectedPools.length === 1) {
        isUniqDomainQuiz = true;
    }

    fstatsXpDay.classList.add('put-to-back');
    fstatsXpPelerinage.classList.add('put-to-back');
    fstatsXpMarathon.classList.add('put-to-back');
    fstatsXpPerfect.classList.add('put-to-back');

    if (quizMode === 'marathon') {
        fstatsXpMarathon.classList.remove('put-to-back');
        bonusPercent += 20;
    }
    else if (quizMode === 'pelerinage') {
        fstatsXpPelerinage.classList.remove('put-to-back');
        bonusPercent += 50;
    }

    isTodayInDB().then(todayExists => {
        if (!todayExists) {
            addPlayDayToday(); console.log('addPlayDayToday()');
            fstatsXpDay.classList.remove('put-to-back');
            bonusPercent += 100;
        }
    }).catch(error => {
        console.error("isTodayInDB: ", error);
    })
    .finally(() => {
        gameStartTime = new Date();
        setQuestion();
    });
}

function setQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    currentQID = currentQuestion.id;
    for (const elem of questionElemS) {
        elem.innerHTML = currentQuestion.question;
    }
    for (const elem of titleCardElemS) {
        elem.innerHTML = "question";
    }
    for (const elem of progressElemS) {
        elem.innerHTML = (currentQuestionIndex + 1) + " / " + questions.length;
    }
    showQuestionUI();
}


function checkAnswer(isTrue) {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.answer === isTrue;
    // console.log(currentQuestion);
    // console.log(isCorrect);
    addAnswerDB(db, currentQuestion.domainName, isCorrect);
    domainName = currentQuestion.domainName;

    if (isCorrect) {
        score++;
        comboModifier += 1;
        if (comboModifier > bestcombo)
            bestcombo = comboModifier;
        let addXp = GAME_XP_FOR_WIN;
        if (comboModifier > 1) {
            addXp += comboModifier;
            comboElem.innerHTML = 'COMBO +'+comboModifier;
        }
        xp += addXp;
        historyResult += "<span class='ig-icon-valid'>"+validMarkIcon+"</span>";
        answerTitleElem.innerHTML = "<span class='correct'>GOOD</span>";
        // answerXpElem.innerHTML = "+"+addXp+" xp";
    } else {
        comboModifier = 0;
        comboElem.innerHTML = '';
        xp += GAME_XP_FOR_FAIL;
        historyResult += "<span class='ig-icon-miss'>"+missMarkIcon+"</span>";
        answerTitleElem.innerHTML = "<span class='incorrect'>WRONG</span>";
        // answerXpElem.innerHTML = "+1 xp";
    }
    xpElem.innerHTML = xp +" xp";
    const percentage = Math.round(calculateScorePercentage(score, currentQuestionIndex + 1));
    winrateElem.innerHTML = percentage +"%";
    answerElem.innerHTML = currentQuestion.explanation;
    favoriteElem.classList.remove("favorite-action");
    reportElem.classList.remove("report-action");
    fliped = false;
    answerElem.classList.remove('put-to-back');
    questionToFlipElem.classList.add('put-to-back');
    for (const elem of titleCardElemS) {
        elem.innerHTML = "answer";
    }
    showAnswerUI();
}

function calculateScorePercentage(score, totalQuestions) {
    if (totalQuestions === 0) return 0;
    return (score / totalQuestions) * 100;
}

function fromPercent(value, percentage) {
    return (value * percentage) / 100;
}

function formatElapsedTime(start, end) {
    const elapsedTime = Math.floor((end - start) / 1000); // Différence en secondes

    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;

    // Formater les résultats avec des zéros en tête si nécessaire
    const formattedHours = hours > 0 ? `${String(hours).padStart(2, '0')}:` : '';
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
}

function showFinalScore() {
    endStartTime = new Date();
    const elapsedTimeFormatted = formatElapsedTime(gameStartTime, endStartTime);
    fstatsTime.innerHTML = "time        " + elapsedTimeFormatted;

    fstatsBestCombo.innerHTML = "best combo +" + bestcombo;

    const percentage = Math.round(calculateScorePercentage(score, numQuestions));
    fstatsWinrate.innerHTML = "winrate     " + percentage + "%";

    if (score === numQuestions) {
        finalTitleElem.innerHTML = "🥳 PERFECT ✨"; 
        fstatsXpPerfect.classList.remove('put-to-back');
        bonusPercent += 10;
    }
    xp += Math.round(fromPercent(xp, bonusPercent));
    addUserXP(xp); console.log('showFinalScore: addUserXP('+xp+')');
    fstatsXpTotal.innerHTML = " +"+xp+" XP";

    finalRatioElem.innerHTML = score +" / "+numQuestions;
    historyGridElem.innerHTML = historyResult;

    let isTen = false;
    if (quizMode === 'classic' || quizMode === 'daily')
            isTen = true;
    addGameDB(db, 'TOTAL', percentage, isTen);
    if (isUniqDomainQuiz) {
        addGameDB(db, domainName, percentage, isTen);
    }
    showSummaryUI();
}

function nextQuestion() {
    currentQuestionIndex++;
    // if (currentQuestionIndex % 10 === 0) {
    //     if (currentQuestionIndex % 20 === 0) {
    //         historyResult += '<br>';
    //     }
    //     else {
    //         historyResult += ' ';
    //     }
    // }
    if (currentQuestionIndex < numQuestions) {
        setQuestion();
    } else {
        showFinalScore();
    }
}

function restartQuiz() {
    showMenuUI();
    selectedPools = [];
    questions = [];
    currentQuestionIndex = 0;
    score = 0;
    historyResult = '';
    domainName = '';
    winrateElem.innerHTML = '';
}

/* ADD EVENTS LISTERNERS */

trueButton.addEventListener('click', () => checkAnswer(true));
falseButton.addEventListener('click', () => checkAnswer(false));
nextButton.addEventListener('click', nextQuestion);
endButton.addEventListener('click', restartQuiz); // endQuizz

favoriteElem.addEventListener('click', () => {
    favoriteElem.classList.add("favorite-action");
    answerCardElem.click(); // global click bug fixe
    console.log("FAVORITE ACTION"); // TODO
});

reportElem.addEventListener('click', () => {
    reportElem.classList.add("report-action");
    answerCardElem.click(); // global click bug fixe
    console.log("REPORT QID " + currentQID);
    sendMail("The cow jumped over the moon. QID: " + currentQID);
});

answerCardElem.addEventListener('click', () => {
    if (fliped) {
        fliped = false;
        answerElem.classList.remove('put-to-back');
        questionToFlipElem.classList.add('put-to-back');
        for (const elem of titleCardElemS) {
            elem.innerHTML = "answer";
        }
    }
    else {
        fliped = true;
        answerElem.classList.add('put-to-back');
        questionToFlipElem.classList.remove('put-to-back');
        for (const elem of titleCardElemS) {
            elem.innerHTML = "question";
        }
    }
    
});

// TODO quizMode = 'mistakes';

const startDaily = document.getElementById('go-daily');
startDaily.addEventListener('click', () => {
    quizMode = 'daily';
    loadQuestions();
});

const startWithPlayButton = document.getElementById('go-play');
startWithPlayButton.addEventListener('click', () => {
    // console.log('start quiz : ', currentGameMode);
    quizMode = currentGameMode;
    loadQuestions();
});

document.getElementById('title').addEventListener('click', restartQuiz);

const editCategoriesButton = document.getElementById('go-categories');
editCategoriesButton.addEventListener('click', () => {
    showCategoriesUI();
});

/* EXECUTION */

loadConfig();
restartQuiz();
addClassSetupGM();
showMenuUI();

setTimeout(() => {
    const globalElement = document.getElementById('global-none');
    globalElement.classList.remove('global-off');
}, 100);

setTimeout(() => {
    updateNbSelectedElement();
}, 200);


// DEPRECATED BAD BEHAVIOUR DONT USE IT PLEASE
// DEPRECATED BAD BEHAVIOUR DONT USE IT PLEASE
// DEPRECATED BAD BEHAVIOUR DONT USE IT PLEASE
// updateOldKeys(DB_STORE_USER_DOMAINS, "Anatomy", "anatomy");
// updateOldKeys(DB_STORE_USER_DOMAINS, "Physiology", "physiology");
// updateOldKeys(DB_STORE_USER_DOMAINS, "Pathology", "pathology");
// updateOldKeys(DB_STORE_USER_DOMAINS, "Surgery", "surgery");
// updateOldKeys(DB_STORE_USER_DOMAINS, "Pharmacology", "pharmacology");
// updateOldKeys(DB_STORE_USER_DOMAINS, "Genetics", "genetics");
// updateOldKeys(DB_STORE_USER_DOMAINS, "Neurology", "neurology");
// updateOldKeys(DB_STORE_USER_DOMAINS, "Epidemiology", "epidemiology");
// updateOldKeys(DB_STORE_USER_DOMAINS, "Endocrinology", "endocrinology");
// updateOldKeys(DB_STORE_USER_DOMAINS, "Miscellaneous", "various");
// updateOldKeys(DB_STORE_USER_DOMAINS, "Oncology", "oncology");
// updateOldKeys(DB_STORE_USER_DOMAINS, "Cardiology", "cardiology");
// DEPRECATED BAD BEHAVIOUR DONT USE IT PLEASE
// DEPRECATED BAD BEHAVIOUR DONT USE IT PLEASE
// DEPRECATED BAD BEHAVIOUR DONT USE IT PLEASE
