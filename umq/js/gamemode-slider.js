const valuesName = ['CLASSIC', 'MARATHON 🏃 +20% xp', 'PELERINAGE 🗿 +50% xp'];
const values = [10, 42, 100];
// const uEmojis = ['🚑', '🏃', '🗿'];
// const uEmojis = ['\u1f691', '\u1f3c3', '\u1f5fb'];

function getGameModeValue(sliderValue) {
    // console.log('sliderValue', sliderValue);
    if (sliderValue == 0)
        return 'classic';
    if (sliderValue == 1)
        return 'marathon';
    if (sliderValue == 2)
        return 'pelerinage';
    console.error("error invalid gameMode");
    return 'classic';
}

function sliderInit(gameModeCode) {
    const slider = document.getElementById("slider");
    const valueDisplay = document.getElementById("value-display");

    currentGameMode = getGameModeValue(gameModeCode);
    slider.value = gameModeCode;
    valueDisplay.innerHTML = 'x'+values[slider.value] + ' ' + valuesName[slider.value];

    // Afficher la valeur en fonction du slider
    slider.addEventListener("input", function () {
        valueDisplay.innerHTML = 'x'+values[slider.value] + ' ' + valuesName[slider.value];
        currentGameMode = getGameModeValue(slider.value);
        saveGameModeDB(getGameModeValue(slider.value));
    });
}

let currentGameMode = {};
loadGameModeFromDB();

async function loadGameModeFromDB() {
    currentGameMode = await getGameModeDB();
    currentGameMode = currentGameMode.value;
    // console.log("HEY", currentGameMode);
    if (currentGameMode === 'classic') { sliderInit(0); }
    else if (currentGameMode === 'marathon') { sliderInit(1); }
    else if (currentGameMode === 'pelerinage') { sliderInit(2); }
    else { console.error("error invalid gameMode"); }
}


