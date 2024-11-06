const questions = [
    {
        question: "La Terre est plate.",
        answer: false,
        explanation: "La Terre est sphérique, bien qu'elle soit légèrement aplatie aux pôles."
    },
    {
        question: "L'eau gèle à 0 degrés Celsius.",
        answer: true,
        explanation: "C'est vrai, l'eau gèle à 0 degrés Celsius à pression normale."
    },
    {
        question: "Le soleil tourne autour de la Terre.",
        answer: false,
        explanation: "C'est faux, la Terre tourne autour du soleil."
    },
    // Ajoutez d'autres questions ici
];

let currentQuestionIndex = 0;
let score = 0;

const cardElement = document.getElementById('card');
const questionElement = document.getElementById('question');
const feedbackElement = document.getElementById('feedback');
const scoreContainer = document.getElementById('score-container');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-btn');

let startX = 0;
let isDragging = false;

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
    cardElement.style.transform = 'translateX(0)'; // Reset position of card
}

function handleDragStart(event) {
    startX = event.clientX;
    isDragging = true;
    cardElement.classList.add('grabbing');
}

function handleDragMove(event) {
    if (!isDragging) return;
    const distance = event.clientX - startX;
    cardElement.style.transform = `translateX(${distance}px)`;
}

function handleDragEnd(event) {
    if (!isDragging) return;
    isDragging = false;
    cardElement.classList.remove('grabbing');
    const distance = event.clientX - startX;
    
    if (distance < -100) {
        checkAnswer(false); // Glissé à gauche pour Faux
    } else if (distance > 100) {
        checkAnswer(true); // Glissé à droite pour Vrai
    } else {
        cardElement.style.transform = 'translateX(0)'; // Reset si trop peu de glissement
    }
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

    if (currentQuestionIndex < questions.length) {
        setTimeout(showQuestion, 2000); // Afficher la prochaine question après 2 secondes
    } else {
        setTimeout(showScore, 2000); // Afficher le score final après 2 secondes
    }
}

function showScore() {
    questionElement.innerText = '';
    feedbackElement.innerText = '';
    scoreContainer.classList.remove('hidden');
    finalScoreElement.innerText = `${score} sur ${questions.length}`;
}

restartButton.addEventListener('click', startQuiz);

cardElement.addEventListener('mousedown', handleDragStart);
document.addEventListener('mousemove', handleDragMove);
document.addEventListener('mouseup', handleDragEnd);

// Démarrer le quiz
startQuiz();
