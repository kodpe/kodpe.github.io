let cmEditors = [];
let cmEditorsON = [];
const nbEditors = 3;
//
const DEFAULT_FILES= ["def1.b", "def2.b", "def3.b", "def4.b"];
let initialLoad = true;
//
const editorCnt = document.getElementById("editors-grid-cnt");

// EDITORS ON CHANGE 
// Fonction "debounce" pour limiter le nombre d'appels
function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}
// On wrappe avec debounce, ici 200ms après la dernière frappe
const debouncedUpdate = debounce(handleEditorUpdate, 200);

// Fonction qui traite le contenu
function handleEditorUpdate() {
    if (initialLoad == true) {
        return ;
    }
    warriors = []; // reset des warriors
    for (let i = 0; i < cmEditorsON.length; i++) {
        const rawfile = cmEditorsON[i].getValue();
        const firstLine = rawfile.split('\n')[0];
        const name = firstLine.slice(1);
        const warrior = {
            name : name,
            editor_id : i,
            warrior_id: i,
            rawfile : rawfile,
            origin_addr : null,
            parsed_code: null,
            plist: [],
        };
        warriors.push(warrior);
    }
    // updateWarriorListUI(warriors);
    gameInit(warriors);
}


function updateWarriorListUI(warriors) {
    if (gameStop == true)
        return;
    cnt = document.getElementById("warriors-list");
    while (cnt.firstChild) {
        cnt.removeChild(cnt.firstChild);
    }
    for (let i = 0; i < warriors.length; i++) {
        const element = document.createElement("div");
        element.classList.add("warrior_id_card");
        element.textContent = "warrior: " + warriors[i].name;
        element.textContent += " #" + warriors[i].editor_id;
        element.textContent += " process: " + warriors[i].plist.length;
        cnt.appendChild(element);
    }
}

// CM EDITORS CREATION LOOP
for (let i = 0; i < nbEditors; i++) {
    //
    const editorBlock = document.createElement("div");
    editorBlock.classList.add("editor-block");
    editorCnt.appendChild(editorBlock);

    // create reset button
    const resetButton = document.createElement("button");
    resetButton.id = "resetBtn" + i;
    resetButton.classList.add("save-btn");
    resetButton.classList.add("reset-btn");
    resetButton.textContent = "reset";
    editorBlock.appendChild(resetButton);

    // create input
    const inputFile = document.createElement("input");
    inputFile.classList.add("inputFile");
    inputFile.type = "file";
    inputFile.id = "inputFile" + i;
    editorBlock.appendChild(inputFile);

    // create save button
    const saveButton = document.createElement("button");
    saveButton.id = "saveBtn" + i;
    saveButton.classList.add("save-btn");
    saveButton.textContent = "save";
    editorBlock.appendChild(saveButton);

    // create toggle button
    const toggleButton = document.createElement("button");
    toggleButton.id = "tgbtn";
    toggleButton.classList.add("toggle-btn");
    toggleButton.textContent = "OFF";


    editorBlock.appendChild(toggleButton);

    // create editor element
    const editorElement = document.createElement("div");
    editorElement.classList.add("editor");
    editorElement.id = "editor" + i;
    editorBlock.appendChild(editorElement);

    // Crée l'éditeur CodeMirror sans contenu initial
    const editor = CodeMirror(editorElement, {
        mode: "bluecode",
        lineNumbers: true,
        theme: "ayu-dark",
        keyMap: "vim",
        indentWithTabs: true,
        tabSize: 4,
        lineWrapping: true,
        value: "",
        showCursorWhenSelecting: true,
        inputStyle: "textarea"
    });

    editor.setOption("vimMode", true);
    editor.setOption("showCursorWhenSelecting", true);
    editor.setOption("inputStyle", "textarea");
    editor.setOption("status", true);
    // editor.setOption("theme", "dracula-custom");

    // EVENTS
    // => delay => handleEditorUpdate
    editor.on("change", debouncedUpdate); 

    // → Auto-save 500ms après une modification
    let autosaveTimer = null;
    editor.on("change", () => {
        clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(() => {
            localStorage.setItem(
                "cm_autosave_" + i,
                editor.getValue()
            );
            // console.log("Auto-saved:", i);
        }, 1000);
    });

    // add codeMirror to list
    cmEditors.push(editor);

    // Charge le fichier par défaut
    const listeners = editor.getOption("onChangeListeners");
    editor.off("change", handleEditorUpdate);
    function loadDefaultFile() {
        fetch("doc/" + DEFAULT_FILES[i % DEFAULT_FILES.length])
            .then(response => response.text())
            .then(code => editor.setValue(code))
            .catch(err => console.error("Erreur chargement fichier :", err));
    }

     // → Charger l’auto-save s’il existe
    const saved = localStorage.getItem("cm_autosave_" + i);
    if (saved !== null) {
        editor.setValue(saved);
        // console.log("Found-save:", i);
    }
    else {
        loadDefaultFile();
    }
    editor.on("change", handleEditorUpdate);


    resetButton.addEventListener("click", () => {
        loadDefaultFile();
    });

    // Permet à l'utilisateur de charger un fichier via input
    inputFile.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (evt) {
            editor.setValue(evt.target.result);
        };
        reader.readAsText(file);
    });

    saveButton.addEventListener("click", () => {
        const content = editor.getValue();
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "program.b";
        a.click();
        URL.revokeObjectURL(url);
    });


    // TOGGLE EVENT
    toggleButton.addEventListener("click", () => {
        toggleButton.classList.toggle("on");
        editorBlock.classList.toggle("on");
        toggleButton.textContent = toggleButton.classList.contains("on") ? "ON BATTLE" : "OFF";

        const index = cmEditorsON.indexOf(editor);
        if (index === -1) {
            cmEditorsON.push(editor);
        } else {
            cmEditorsON.splice(index, 1);
        }
        // console.log(cmEditorsON);
        handleEditorUpdate();
    });
    if (i == 0 || i == 1) // TEMP
        toggleButton.click();
}

initialLoad = false;
// handleEditorUpdate();


CodeMirror.Vim.defineEx("write", "w", function (cm) {
    console.log("Simuler :w");
});
