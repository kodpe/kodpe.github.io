const version = '0'; // depr
let questions = [];
let selectedPools = [];
let config = {};
let currentQuestionIndex = 0;
let score = 0;
let quizMode = '';
let numQuestions = 0;
let historyResult = '';
let selectAllCardsBool = false;

const blankLine = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';

const noopElements = document.getElementsByClassName('noop');
const notingameElements = document.getElementsByClassName('notingame');

const poolContainer = document.getElementById('pool-selection');
const selectAllCardsElement = document.getElementById('select-all-cards');
const startClassic = document.getElementById('start-classic');
const startMarathon = document.getElementById('start-marathon');
const startDaily = document.getElementById('start-daily');
const startDevotion = document.getElementById('start-devotion');
const questionElement = document.getElementById('question');
const trueButton = document.getElementById('true-btn');
const falseButton = document.getElementById('false-btn');
const feedbackElement = document.getElementById('feedback');
const restartButton = document.getElementById('restart-btn');
const nextButton = document.getElementById('next-btn');
const marathonSizeSpan = document.getElementById('marathon-size');

const scoreContainer = document.getElementById('score-container');
const scoreTitleElement = document.getElementById('score-title');
const currentScoreElement = document.getElementById('current-score');
const nbQuestionsElement = document.getElementById('nb-questions');
const qidElement = document.getElementById('qid');

// const lvlContainer = document.getElementById('difficulty-container');
// const lvlHardElement = document.getElementById('lvl-hard');
// const lvlNightElement = document.getElementById('lvl-nightmare');
// const lvlMadElement = document.getElementById('lvl-madness');


function SetTitleVersion() {
    const pageTitleElement = document.getElementById('page-title');
    const titleElement = document.getElementById('title');
    pageTitleElement.innerText += ' ' + version;
    titleElement.innerText += ' ' + version;
}
//SetTitleVersion();

async function loadConfig() {
    try {
        const configResponse = await fetch('../q-data/config.json');
        if (!configResponse.ok) {
            throw new Error('Erreur lors du chargement de config.json');
        }
        config = await configResponse.json();
        generatePoolCards();
    } catch (error) {
        console.error('Erreur de chargement de la configuration :', error);
    }
}

// Générer dynamiquement les cartes de sélection des pools
function generatePoolCards() {
    config.pools.forEach(pool => {
        const card = document.createElement('div');
        card.className = 'pool-card';
        card.dataset.pool = pool.file;
        card.innerText = pool.name;
        card.addEventListener('click', () => togglePoolSelection(card, pool.file));
        poolContainer.insertBefore(card, selectAllCardsElement);
        // poolContainer.insertBefore(selectAllCardsElement, startClassic);
        // poolContainer.insertBefore(startClassic, startMarathon);
    });
}


/* */
// function difficultySelection(lvl) {
//     if (lvl === 'hard') {
//         lvlHardElement.classList.add('selected');
//         lvlNightElement.classList.remove('selected');
//         lvlMadElement.classList.remove('selected');
//     }
//     else if (lvl === 'night') {
//         lvlNightElement.classList.add('selected');
//         lvlHardElement.classList.remove('selected');
//         lvlMadElement.classList.remove('selected');
//     }
//     else if (lvl === 'mad') {
//         lvlMadElement.classList.add('selected');
//         lvlHardElement.classList.remove('selected');
//         lvlNightElement.classList.remove('selected');
//     }
// }
/**/

// Gestion de la sélection des pools
function togglePoolSelection(card, poolFile) {
    if (selectedPools.includes(poolFile)) {
        selectedPools = selectedPools.filter(p => p !== poolFile);
        card.classList.remove('selected');
    } else {
        selectedPools.push(poolFile);
        card.classList.add('selected');
    }
    updateStartButtons();
}

function updateStartButtons() {
    if (selectedPools.length === 0) {
        Array.from(noopElements).forEach(element => element.classList.add('hidden'));
        // difficultySelection('hard');
    } else {
        Array.from(noopElements).forEach(element => element.classList.remove('hidden'));
        // difficultySelection('hard');
    }
}

function toggleSelectAllCards() {
    selectAllCardsBool = !selectAllCardsBool;

    if (selectAllCardsBool) {
        config.pools.forEach(pool => {
            if (!selectedPools.includes(pool.file)) {
                selectedPools.push(pool.file);
            }
            const card = document.querySelector(`.pool-card[data-pool="${pool.file}"]`);
            if (card) card.classList.add('selected');
        });
        selectAllCardsElement.classList.add('selected');
    } else {
        selectedPools = [];
        document.querySelectorAll('.pool-card').forEach(card => {
            card.classList.remove('selected');
        });
        selectAllCardsElement.classList.remove('selected');
    }

    updateStartButtons();
}

// Fonction pour mélanger les questions
function shuffleQuestions(questionsArray) {
    for (let i = questionsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Index aléatoire
        [questionsArray[i], questionsArray[j]] = [questionsArray[j], questionsArray[i]]; // Échanger les éléments
    }
}

// Charger les questions en fonction des pools sélectionnés
async function loadQuestions() {
    questions = []; // Reset questions
    if (selectedPools.length === 0) {
        console.log('Aucun pool sélectionné');
        return;
    }
    try {
        for (const poolFile of selectedPools) {
            const response = await fetch(poolFile);
            if (!response.ok) {
                throw new Error(`Erreur de chargement des questions depuis ${poolFile}`);
            }
            const poolQuestions = await response.json();
            questions = questions.concat(poolQuestions);
        }
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
            if (questions.length < 42) {
                questions = questions.concat(questions);
            }
            shuffleQuestions(questions);
        }
        else if (quizMode === 'daily') {
            numQuestions = 20;
            if (questions.length < 20) {
                questions = questions.concat(questions);
            }
            shuffleArray(questions, getDateSeed());
        }
        else if (quizMode === 'devotion') {
            numQuestions = questions.length;
            shuffleQuestions(questions);
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
    historyResult = '';
    qidElement.innerText = '';

    document.getElementById('pool-selection').classList.add('hidden');
    document.getElementById('question-container').classList.remove('hidden');

    scoreTitleElement.innerHTML = 'SCORE' + blankLine;
    currentScoreElement.innerText = score;
    nbQuestionsElement.innerText = numQuestions;
    feedbackElement.innerText = '';
    scoreContainer.classList.remove('hidden');

    trueButton.classList.remove('hidden');
    falseButton.classList.remove('hidden');
    nextButton.classList.add('hidden');
    restartButton.classList.add('hidden');

    // lvlContainer.classList.add('hidden');
    Array.from(notingameElements).forEach(element => element.classList.add('hidden'));
    showQuestion();
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;
    feedbackElement.innerText = '';
    qidElement.innerHTML = blankLine + blankLine + blankLine + "ID" + blankLine + currentQuestion.id;
    trueButton.classList.remove('hidden');
    falseButton.classList.remove('hidden');
    feedbackElement.classList.add('hidden');
    questionElement.classList.remove('hidden');
    if (currentQuestionIndex === numQuestions - 1) {
        nextButton.innerText = 'END';
    } else {
        nextButton.innerText = 'NEXT';
    }
    nextButton.classList.add('hidden');
}

function checkAnswer(isTrue) {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.answer === isTrue;
    console.log(currentQuestion);
    console.log(isCorrect);
    addAnswerDB(db, domainName, isCorrect); // TODO
    if (isCorrect) {
        score++;
        historyResult += `<span class='correct-mark'>o</span>`;
        feedbackElement.innerHTML = "<span class='correct'>GOOD</span><br><br> " + currentQuestion.explanation;
    } else {
        historyResult += `<span class='incorrect-mark'>x</span>`;
        feedbackElement.innerHTML = "<span class='incorrect'>WRONG</span><br><br> " + currentQuestion.explanation;
    }
    currentScoreElement.innerText = score;
    questionElement.innerText = '';
    feedbackElement.classList.remove('hidden');
    questionElement.classList.add('hidden');
    trueButton.classList.add('hidden');
    falseButton.classList.add('hidden');
    nextButton.classList.remove('hidden');
}

function calculateScorePercentage(score, totalQuestions) {
    if (totalQuestions === 0) return 0;
    return (score / totalQuestions) * 100;
}

function showFinalScore() {
    questionElement.innerText = '';
    feedbackElement.innerText = '';
    qidElement.innerHTML = '';
    trueButton.classList.add('hidden');
    falseButton.classList.add('hidden');
    nextButton.classList.add('hidden');
    restartButton.classList.remove('hidden');
    const percentage = Math.round(calculateScorePercentage(score, numQuestions));
    if (score === numQuestions) {
        scoreTitleElement.innerHTML = "🥳🎉✨<br><br>" + historyResult + "<br><br> " + percentage + "%<br><br>";
    }
    else {
        scoreTitleElement.innerHTML = historyResult + "<br><br> " + percentage + "%<br><br>";
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex % 10 === 0) {
        if (currentQuestionIndex % 20 === 0) {
            historyResult += '<br>';
        }
        else {
            historyResult += ' ';
        }
    }
    if (currentQuestionIndex < numQuestions) {
        showQuestion();
    } else {
        showFinalScore();
    }
}

function restartQuiz() {
    selectedPools = [];
    questions = [];
    currentQuestionIndex = 0;
    score = 0;
    historyResult = '';
    qidElement.innerHTML = '';
    // lvlContainer.classList.remove('hidden');
    // difficultySelection('hard');
    updateStartButtons();
    scoreContainer.classList.add('hidden');
    document.getElementById('question-container').classList.add('hidden');
    document.getElementById('feedback').innerText = '';
    document.getElementById('pool-selection').classList.remove('hidden');
    Array.from(notingameElements).forEach(element => element.classList.remove('hidden'));
    const poolCards = document.querySelectorAll('.pool-card');
    poolCards.forEach(card => {
        card.classList.remove('selected');
    });
}

trueButton.addEventListener('click', () => checkAnswer(true));
falseButton.addEventListener('click', () => checkAnswer(false));
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', restartQuiz);
startClassic.addEventListener('click', () => {
    quizMode = 'classic';
    loadQuestions();
});
startMarathon.addEventListener('click', () => {
    quizMode = 'marathon';
    loadQuestions();
});
startDaily.addEventListener('click', () => {
    quizMode = 'daily';
    loadQuestions();
});
startDevotion.addEventListener('click', () => {
    quizMode = 'devotion';
    loadQuestions();
});
document.getElementById('title').addEventListener('click', restartQuiz);
selectAllCardsElement.addEventListener('click', toggleSelectAllCards);

// lvlHardElement.addEventListener('click', () => difficultySelection('hard'));
// lvlNightElement.addEventListener('click', () => difficultySelection('night'));
// lvlMadElement.addEventListener('click', () => difficultySelection('mad'));

loadConfig();
restartQuiz();
