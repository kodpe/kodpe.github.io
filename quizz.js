let questions = [];
let config = {};
let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById('question');
const trueButton = document.getElementById('true-btn');
const falseButton = document.getElementById('false-btn');
const feedbackElement = document.getElementById('feedback');
const scoreContainer = document.getElementById('score-container');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-btn');

async function loadQuizData() {
    try {
        const configResponse = await fetch('config.json');
        config = await configResponse.json();

        const questionsResponse = await fetch('questions.json');
        questions = await questionsResponse.json();

        startQuiz();
    } catch (error) {
        console.error('Erreur de chargement des données :', error);
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    scoreContainer.classList.add('hidden');
    feedbackElement.innerText = '';
    showQuestion();
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;
}

function checkAnswer(isTrue) {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.answer === isTrue;

    if (isCorrect) {
        score++;
        feedbackElement.innerText = "Correct ! " + currentQuestion.explanation;
    } else {
        feedbackElement.innerText = "Faux. " + currentQuestion.explanation;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < Math.min(config.numQuestions, questions.length)) {
        setTimeout(showQuestion, 2000); // Afficher la prochaine question après 2 secondes
    } else {
        setTimeout(showScore, 2000); // Afficher le score final après 2 secondes
    }
}

function showScore() {
    questionElement.innerText = '';
    trueButton.classList.add('hidden');
    falseButton.classList.add('hidden');
    feedbackElement.innerText = '';

    finalScoreElement.innerText = `${score} sur ${Math.min(config.numQuestions, questions.length)}`;
    scoreContainer.classList.remove('hidden');
}

trueButton.addEventListener('click', () => checkAnswer(true));
falseButton.addEventListener('click', () => checkAnswer(false));
restartButton.addEventListener('click', startQuiz);

// Charger les données et démarrer le quiz
loadQuizData();
