let questions = [];
let selectedPools = [];
let config = {};
let currentQuestionIndex = 0;
let score = 0;
let quizMode = '';
let numQuestions = 0;
let historyResult = '';


const poolContainer = document.getElementById('pool-selection');
const startClassic = document.getElementById('start-classic');
const startMarathon = document.getElementById('start-marathon');
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

async function loadConfig() {
    try {
        const configResponse = await fetch('config.json');
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
        poolContainer.insertBefore(card, startClassic);
        poolContainer.insertBefore(startClassic, startMarathon);
    });
}

// Gestion de la sélection des pools
function togglePoolSelection(card, poolFile) {
    if (selectedPools.includes(poolFile)) {
        selectedPools = selectedPools.filter(p => p !== poolFile);
        card.classList.remove('selected');
    } else {
        selectedPools.push(poolFile);
        card.classList.add('selected');
    }
    startClassic.disabled = selectedPools.length === 0;
    startMarathon.disabled = selectedPools.length === 0;
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
        if (quizMode === 'classic' && questions.length > 10) {
            numQuestions = 10;
        }
        shuffleQuestions(questions);
        questions = questions.slice(0, numQuestions);
        startQuiz();
    } catch (error) {
        console.error('Erreur lors du chargement des questions:', error);
    }
}

function startQuiz() {
    if (questions.length === 0) {
        console.log('Aucune question chargée.');
        return;
    }
    currentQuestionIndex = 0;
    score = 0;
    historyResult = '';

    document.getElementById('pool-selection').classList.add('hidden');
    document.getElementById('question-container').classList.remove('hidden');

    scoreTitleElement.innerText = 'SCORE ';
    currentScoreElement.innerText = score;
    nbQuestionsElement.innerText = numQuestions;
    feedbackElement.innerText = '';
    scoreContainer.classList.remove('hidden');

    trueButton.classList.remove('hidden');
    falseButton.classList.remove('hidden');
    nextButton.classList.add('hidden');
    restartButton.classList.add('hidden');

    showQuestion();
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;
    feedbackElement.innerText = '';
    trueButton.classList.remove('hidden');
    falseButton.classList.remove('hidden');
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
    if (isCorrect) {
        score++;
        historyResult += `<span class='correct'>✔</span>`;
        feedbackElement.innerHTML = "<span class='correct'>GOOD!</span><br><br> " + currentQuestion.explanation;
    } else {
        historyResult += `<span class='incorrect'>✘</span>`;
        feedbackElement.innerHTML = "<span class='incorrect'>WRONG!</span><br><br> " + currentQuestion.explanation;
    }
    currentScoreElement.innerText = score;
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
    scoreContainer.classList.add('hidden');
    document.getElementById('question-container').classList.add('hidden');
    document.getElementById('feedback').innerText = '';
    document.getElementById('pool-selection').classList.remove('hidden');
    const poolCards = document.querySelectorAll('.pool-card');
    poolCards.forEach(card => {
        card.classList.remove('selected');
    });
    startClassic.disabled = selectedPools.length === 0;
    startMarathon.disabled = selectedPools.length === 0;
}

trueButton.addEventListener('click', () => checkAnswer(true));
falseButton.addEventListener('click', () => checkAnswer(false));
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', startQuiz);
restartButton.addEventListener('click', restartQuiz);
startClassic.addEventListener('click', () => {
    quizMode = 'classic';
    loadQuestions();
});
startMarathon.addEventListener('click', () => {
    quizMode = 'marathon';
    loadQuestions();
});

loadConfig();
restartQuiz();
