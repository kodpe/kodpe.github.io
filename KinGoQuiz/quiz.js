const QUESTIONS = {
    "FIND_VALID_PROG": { label: "Trouve le programme qui fonctionne", level: 1, },
    // ONLY ANSWERS
    "FIND_FALSE_PROG": { label: "Trouve le programme qui ne compile pas", level: 1, },
    // ONLY ANSWERS
    "FIND_TYPAGE_ERR": { label: "Trouve le code qui a une erreur de type", level: 1 },
    // ONLY ANSWERS
    "FIND_VALID_CODE": { label: "Trouve le code correct", level: 1 },
    // ONLY ANSWERS
    "FIND_SYNTAX_ERR": { label: "Trouve le code qui a une erreur de syntaxe", level: 1 },
    // ONLY ANSWERS
    "FIND_CLEAN_CODE": { label: "Trouve le code le plus propre", level: 1 },
    // ONLY ANSWERS

    "FIND_CODE_W_OUT": { label: "Trouve le code qui produit la sortie", level: 2 },
    // TERM + ANSWERS
    "FIND_OUT_W_CODE": { label: "Trouve la sortie produite par ce code", level: 2 },
    // CODE + ANSWERS
    "FIND_CODE_WH_IN": { label: "Trouve le code qui peut recevoir cette entrée", level: 2 },
    // TERM + ANSWERS
    "FIND_IN_WH_CODE": { label: "Trouve l'entrée que peut recevoir ce code", level: 2 },
    // CODE + ANSWERS

    "FIND_VALID_FUNC": { label: "Trouve la fonction qui fait fonctionner ce programme", level: 3, },
    "FIND_LOGICA_ERR": { label: "Trouve le code qui a une erreur de logique", level: 3 },
    "FIND_RUNTIM_ERR": { label: "Trouve le code qui crash à l'éxécution", level: 3 },
    "FIND_F_CODE_OUT": { label: "Trouve le code qui ne peut pas produire cette sortie", level: 3 },
    "FIND_CODE_WH_IO": { label: "Trouve le code compatible avec cette entrée/sortie", level: 3 },
    "FIND_IO_WH_CODE": { label: "Trouve l'entrée/sortie compatible avec ce code", level: 3 },
};

const CODE_FILES = {
    "valid_prog": [
        "2samefor.go",
        "binaire.go",
        "bizarre.go",
        "conditions.go",
        "giantcom.go",
        "helloword.go",
        "onefor.go",
        "printf.go",
        "progwithfunc.go",
        "stupidvar.go",
        "sum.go"
    ],
    "valid_prog_not": [
        "2samefor copy 2.go",
        "2samefor copy.go",
        "2samefor.go",
        "binaire copy 2.go",
        "binaire copy 3.go",
        "binaire copy.go",
        "binaire.go",
        "bizarre copy 2.go",
        "bizarre copy.go",
        "bizarre.go",
        "conditions copy 2.go",
        "conditions copy.go",
        "conditions.go",
        "displayimage.go",
        "helloword copy 2.go",
        "helloword copy.go",
        "helloword.go",
        "onefor copy 2.go",
        "onefor copy.go",
        "onefor.go",
        "printf copy 2.go",
        "printf copy.go",
        "printf.go",
        "progwithfunc copy 2.go",
        "progwithfunc copy.go",
        "progwithfunc.go",
        "stupidvar copy 2.go",
        "stupidvar copy.go",
        "stupidvar.go",
        "sum copy 2.go",
        "sum copy.go",
        "sum.go"
    ],
    "valid_type": [
        "addbool.go",
        "binaire.go",
        "byte.go",
        "compare.go",
        "convert.go",
        "floatesque.go",
        "forchar.go",
        "forfor.go",
        "func.go",
        "george.go",
        "int_float.go",
        "int_string.go",
        "len.go",
        "poulet.go",
        "return.go",
        "return2.go",
        "scan.go",
        "scanf.go",
        "string_int.go",
        "tableau.go",
    ],
    "valid_type_not": [
        "addbool.go",
        "binaire.go",
        "byte.go",
        "compare.go",
        "convert.go",
        "floatesque.go",
        "forchar.go",
        "forfor.go",
        "func.go",
        "george.go",
        "int_float.go",
        "int_string.go",
        "len.go",
        "poulet.go",
        "return.go",
        "return2.go",
        "scan.go",
        "scanf.go",
        "string_int.go",
        "tableau.go",
    ],
    "valid_with_out": [
        "1.go",
        "2.go",
        "3.go",
        "4.go",
        "5.go",
        "6.go",
        "7.go",
        "8.go",
        "9.go",
        "0.go",
    ],
};

function mulberry32(seed) {
    return function () {
        seed |= 0;
        seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

function createNewSeed() {
    const params = new URLSearchParams(window.location.search);
    seed = Math.floor(Math.random() * 10000)
    params.set("seed", seed);
    const newUrl = window.location.pathname + "?" + params.toString();
    history.replaceState(null, "", newUrl);
}

function seedExist() {
    return new URLSearchParams(window.location.search).get("seed") !== null;
}


const questionElement = document.getElementById("question")
const answer_1_element = document.getElementById("answer-1");
const answer_2_element = document.getElementById("answer-2");
const result_element = document.getElementById("result");
const button_next = document.getElementById("btn-next");
const score_element = document.getElementById("score");
const session_score_element = document.getElementById("session-score");
const termCnt_element = document.getElementById("term-cnt");
const termBlock_element = document.getElementById("term-block");

valid_answer = 0;
score = 0;
seed = 0
session_score = 0;
sesson_quiz_played = 0;
if (sessionStorage.getItem("visited")) {
    console.log("La page a été rechargée !");
    createNewSeed()
} else {
    console.log("Première visite !");
    sessionStorage.setItem("visited", "true");
    if (!seedExist())
        createNewSeed()
    else {
        seed = new URLSearchParams(window.location.search).get("seed");
    }
}


function getRandomFile(folder) {
    const list = CODE_FILES[folder];
    return list[Math.floor(rand() * list.length)];
}

function loadCodeBlock(folder, elementId) {
    const file = getRandomFile(folder);
    const path = `code/${folder}/${file}`;
    fetch(path)
        .then(response => response.text())
        .then(code => {
            const codeElement = document.getElementById(elementId);
            codeElement.textContent = code;
            hljs.highlightElement(codeElement);
            hljs.lineNumbersBlock(codeElement);
        })
        .catch(err => {
            document.getElementById(elementId).textContent = 'Erreur de chargement du code.';
            console.error(err);
        });
}

function FIND_VALID_PROG() {
    questionElement.textContent = QUESTIONS.FIND_VALID_PROG.label;
    const r_order = rand()
    if (r_order < 0.5) {
        valid_answer = 1;
        loadCodeBlock('valid_prog', 'answer-1');
        loadCodeBlock('valid_prog_not', 'answer-2');
    } else {
        valid_answer = 2;
        loadCodeBlock('valid_prog', 'answer-2');
        loadCodeBlock('valid_prog_not', 'answer-1');
    }
}

function FIND_FALSE_PROG() {
    questionElement.textContent = QUESTIONS.FIND_FALSE_PROG.label;
    const r_order = rand()
    if (r_order < 0.5) {
        valid_answer = 1;
        loadCodeBlock('valid_prog', 'answer-2');
        loadCodeBlock('valid_prog_not', 'answer-1');
    } else {
        valid_answer = 2;
        loadCodeBlock('valid_prog', 'answer-1');
        loadCodeBlock('valid_prog_not', 'answer-2');
    }
}

function FIND_TYPAGE_ERR() {
    questionElement.textContent = QUESTIONS.FIND_TYPAGE_ERR.label;
    const r_order = rand()
    if (r_order < 0.5) {
        valid_answer = 1;
        loadCodeBlock('valid_type', 'answer-2');
        loadCodeBlock('valid_type_not', 'answer-1');
    } else {
        valid_answer = 2;
        loadCodeBlock('valid_type', 'answer-1');
        loadCodeBlock('valid_type_not', 'answer-2');
    }
}

function FIND_VALID_CODE() {
    questionElement.textContent = QUESTIONS.FIND_VALID_CODE.label;
    const r_order = rand()
    if (r_order < 0.5) {
        valid_answer = 1;
        loadCodeBlock('valid_type', 'answer-1');
        loadCodeBlock('valid_type_not', 'answer-2');
    } else {
        valid_answer = 2;
        loadCodeBlock('valid_type', 'answer-2');
        loadCodeBlock('valid_type_not', 'answer-1');
    }
}

function loadAbsolutOutput(folder, file, elementId) {
    termCnt_element.classList.remove('disabled');
    termCnt_element.classList.add('disabled-click');
    const path = `code/${folder}/${file}`;
    fetch(path)
        .then(response => response.text())
        .then(code => {
            const codeElement = document.getElementById(elementId);
            codeElement.textContent = code;
            // hljs.highlightElement(codeElement);
            // hljs.lineNumbersBlock(codeElement);
        })
        .catch(err => {
            document.getElementById(elementId).textContent = 'Erreur de chargement du code.';
            console.error(err);
        });
}

function loadLinkedCodeBlock(folder, file, elementId) {
    const path = `code/${folder}/${file}`;
    fetch(path)
        .then(response => response.text())
        .then(code => {
            const codeElement = document.getElementById(elementId);
            codeElement.textContent = code;
            hljs.highlightElement(codeElement);
            hljs.lineNumbersBlock(codeElement);
        })
        .catch(err => {
            document.getElementById(elementId).textContent = 'Erreur de chargement du code.';
            console.error(err);
        });
}

function FIND_CODE_W_OUT() {
    questionElement.textContent = QUESTIONS.FIND_CODE_W_OUT.label;
    const r_order = rand()
    if (r_order < 0.5) {
        valid_answer = 1;
        const file = getRandomFile('valid_with_out');
        loadLinkedCodeBlock('valid_with_out', file, 'answer-1');
        loadLinkedCodeBlock('valid_with_out_not', file, 'answer-2');
        loadAbsolutOutput('output', file.replace(/\.go$/, ".txt"), 'term-block')
    } else {
        valid_answer = 2;
        const file = getRandomFile('valid_with_out');
        loadLinkedCodeBlock('valid_with_out', file, 'answer-2');
        loadLinkedCodeBlock('valid_with_out_not', file, 'answer-1');
        loadAbsolutOutput('output', file.replace(/\.go$/, ".txt"), 'term-block')
    }
}

function loadQuestion() {
    resetAnswersBorderColor();
    termCnt_element.classList.add('disabled');

    const r_categ = rand();

    if (r_categ < 1 / 5) {
        FIND_VALID_PROG();
    } else if (r_categ < 2 / 5) {
        FIND_FALSE_PROG();
    } else if (r_categ < 3 / 5) {
        FIND_TYPAGE_ERR();
    } else if (r_categ < 4 / 5) {
        FIND_VALID_CODE();
    } else {
        FIND_CODE_W_OUT();
    }
}

function resetAnswersBorderColor() {
    answer_1_element.classList.remove("true");
    answer_1_element.classList.remove("false");
    answer_1_element.classList.remove("disabled-click");
    // 
    answer_2_element.classList.remove("false");
    answer_2_element.classList.remove("true");
    answer_2_element.classList.remove("disabled-click");
    //
    result_element.classList.add("masked");
    button_next.classList.add("masked");
}

function revealAnswers() {
    resetAnswersBorderColor()
    if (valid_answer == 1) {
        answer_1_element.classList.add("true");
        answer_2_element.classList.add("false");
    } else {
        answer_1_element.classList.add("false");
        answer_2_element.classList.add("true");
    }
    result_element.classList.remove("masked");
    button_next.classList.remove("masked");
    answer_1_element.classList.add("disabled-click");
    answer_2_element.classList.add("disabled-click");
}

function updateScore() {
}

answer_1_element.addEventListener("click", function () {
    sesson_quiz_played++;
    if (valid_answer == 1) {
        result_element.textContent = "Bravo";
        score++;
        session_score++;
        score_element.innerHTML = score.toString() + " bonnes réponses consécutives"
    }
    else {
        result_element.textContent = "Perdu";
        score_element.innerHTML = ""
        score = 0;
    }
    session_score_element.innerHTML = session_score.toString() + " / " + sesson_quiz_played.toString();
    revealAnswers();
});

answer_2_element.addEventListener("click", function () {
    sesson_quiz_played++;
    if (valid_answer == 2) {
        result_element.textContent = "Bravo";
        score++;
        session_score++;
        score_element.innerHTML = score.toString() + " bonnes réponses consécutives"
    }
    else {
        result_element.textContent = "Perdu";
        score_element.innerHTML = ""
        score = 0;
    }
    session_score_element.innerHTML = session_score.toString() + " / " + sesson_quiz_played.toString();
    revealAnswers();
});

button_next.addEventListener("click", function () {
    loadQuestion();
});

const rand = mulberry32(seed); // initialisation du rand() avec la seed
loadQuestion();
