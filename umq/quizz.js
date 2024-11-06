let questions = [];
let selectedPools = [];
let config = {};
let currentQuestionIndex = 0;
let score = 0;
let quizMode = '';  // 'classic' ou 'marathon'


const poolContainer = document.getElementById('pool-selection');
const startClassic = document.getElementById('start-classic');
const startMarathon = document.getElementById('start-marathon');
const questionElement = document.getElementById('question');
const trueButton = document.getElementById('true-btn');
const falseButton = document.getElementById('false-btn');
const feedbackElement = document.getElementById('feedback');
const scoreContainer = document.getElementById('score-container');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-btn');
const nextButton = document.getElementById('next-btn');
const currentScoreElement = document.getElementById('current-score');

// Charger la configuration des pools depuis config.json
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
    //document.getElementById('pool-selection').classList.remove('hidden');
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
    questions = []; // Réinitialiser les questions
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

        // Mélanger les questions
        shuffleQuestions(questions);

        // Démarrer le quiz après le chargement et le mélange des questions
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

    // Masquer la section de sélection des pools
    document.getElementById('pool-selection').classList.add('hidden');

    // Afficher le score tracker
    document.getElementById('score-tracker').classList.remove('hidden');

    currentQuestionIndex = 0;
    score = 0;

    // Afficher le conteneur de questions
    document.getElementById('question-container').classList.remove('hidden');

    // Masquer le score et les boutons au début
    scoreContainer.classList.add('hidden');
    feedbackElement.innerText = '';
    currentScoreElement.innerText = score; // Initialiser le score affiché à 0

    trueButton.classList.remove('hidden');
    falseButton.classList.remove('hidden');
    nextButton.classList.add('hidden');

    showQuestion();  // Afficher la première question
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;
    feedbackElement.innerText = ''; // Réinitialiser le feedback
    trueButton.classList.remove('hidden');
    falseButton.classList.remove('hidden');
    nextButton.classList.add('hidden'); // Masquer le bouton "Question Suivante"
}

function checkAnswer(isTrue) {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.answer === isTrue;

    // Afficher le résultat et l'explication
    if (isCorrect) {
        score++;
        feedbackElement.innerText = "Bonne réponse ! " + currentQuestion.explanation;
    } else {
        feedbackElement.innerText = "Mauvaise réponse ! " + currentQuestion.explanation;
    }

    // Mettre à jour l'affichage du score
    currentScoreElement.innerText = score;

    // Masquer les boutons "Vrai" et "Faux" et afficher "Question Suivante"
    trueButton.classList.add('hidden');
    falseButton.classList.add('hidden');
    nextButton.classList.remove('hidden');
}

function showScore() {
    questionElement.innerText = '';
    trueButton.classList.add('hidden');
    falseButton.classList.add('hidden');
    nextButton.classList.add('hidden');
    feedbackElement.innerText = '';

    finalScoreElement.innerText = `${score} sur ${Math.min(config.numQuestions, questions.length)}`;
    scoreContainer.classList.remove('hidden');
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < Math.min(config.numQuestions, questions.length)) {
        showQuestion();
    } else {
        showScore();
    }
}

function restartQuiz() {
    // Réinitialiser les variables
    selectedPools = [];
    questions = [];
    currentQuestionIndex = 0;
    score = 0;

    // Cacher les sections du quiz et du score
    document.getElementById('question-container').classList.add('hidden');
    document.getElementById('score-container').classList.add('hidden');
    document.getElementById('feedback').innerText = '';

    // Afficher la sélection des pools
    document.getElementById('pool-selection').classList.remove('hidden');

    // Réinitialiser les boutons de la sélection des pools (enlever la classe 'selected' des cartes)
    const poolCards = document.querySelectorAll('.pool-card');
    poolCards.forEach(card => {
        card.classList.remove('selected');
    });

    // Réactiver le bouton de démarrage du quiz si au moins un pool est sélectionné
    startClassic.disabled = selectedPools.length === 0;
    startMarathon.disabled = selectedPools.length === 0;

    // Réinitialiser le score affiché
    currentScoreElement.innerText = score;
}

trueButton.addEventListener('click', () => checkAnswer(true));
falseButton.addEventListener('click', () => checkAnswer(false));
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', startQuiz);
restartButton.addEventListener('click', restartQuiz);
startClassic.addEventListener('click', loadQuestions);
startMarathon.addEventListener('click', loadQuestions);


// Charger la configuration initiale
loadConfig();
restartQuiz();
