const ROLE_DATA = {
  "Assassin": "images/icons/roleAssassin.svg",
  "Fighter": "images/icons/roleFighter.svg",
  "Mage": "images/icons/roleMage.svg",
  "Tireur": "images/icons/roleMarksman.svg",
  "Support": "images/icons/roleSupport.svg",
  "Tank": "images/icons/roleTank.svg"
};

const POSITIONS_DATA = {
  "Top": "images/icons/icon-position-top.png",
  "Jungle": "images/icons/icon-position-jungle.png",
  "Mid": "images/icons/icon-position-middle.png",
  "Bot": "images/icons/icon-position-bottom.png",
  "Support": "images/icons/icon-position-utility.png",
};

const DIFFICULTY_DATA = {
  "Low": "images/icons/difficultyLow.svg",
  "Medium": "images/icons/difficultyMed.svg",
  "High": "images/icons/difficultyHigh.svg"
};

function renderDifficulty(difficulty) {
  const iconWrapper = document.getElementById("difficulty-icon-js");
  const textField = document.getElementById("difficulty-text-js");
  iconWrapper.innerHTML = "";
  textField.textContent = "";

  if (!difficulty || !(difficulty in DIFFICULTY_DATA)) {
    console.error("Aucun niveau de difficulté trouvé dans la fiche champion.");
    textField.textContent = "Unknown";
    return;
  }

  const img = document.createElement("img");
  img.src = DIFFICULTY_DATA[difficulty];
  img.alt = difficulty;
  img.classList.add("svg-role");
  iconWrapper.appendChild(img);

  textField.innerHTML = difficulty + "<br>difficulty";
}

function renderPositions(positions) {
  const iconWrapper = document.getElementById("position-icons-js");
  const textField = document.getElementById("position-text-js");
  iconWrapper.innerHTML = "";
  textField.textContent = "";

  if (!positions || positions.length === 0 || Array.isArray(positions) === false) {
    console.error("Aucune position trouvé dans la fiche champion.");
    textField.textContent = "Unknown";
    return;
  }

  const validPositions = positions.filter(pos => POSITIONS_DATA[pos]);
  if (validPositions.length !== positions.length) {
    console.error("Positions invalides :", positions);
    textField.textContent = "Unknown";
    return;
  }

  // Ajouter les icônes
  validPositions.forEach(pos => {
    const img = document.createElement("img");
    img.src = POSITIONS_DATA[pos];
    img.alt = pos;
    img.classList.add("svg-role");
    iconWrapper.appendChild(img);
  });

  // Ajouter le texte
  textField.innerHTML = validPositions.join("<br>");
}


function renderRadarStats(json) {
  logCALL("renderRadarStats() <- json");
  Object.entries(json).forEach(([statName, value]) => {
    const bars = Array.from(document.querySelectorAll(`.stat-wheel-${statName} .stat-wheel-bar`));
    // console.warn(bars);
    bars.forEach((bar, index) => {
      if (index < value) {
        bar.classList.add('stat-wheel-bar-lit');
      } else {
        bar.classList.remove('stat-wheel-bar-lit');
      }
    });
  });
  logOK("renderRadarStats()");
}

async function loadChampion(jsonPath) {
  logCALL("loadChampion() <- jsonPath");
  try {
    const response = await fetch(jsonPath);
    const json = await response.json();

    // RENDERING DE LA PAGE CHAMPION (OK)
    renderProfil(json);
    renderRoles(json.roles);
    renderPositions(json.positions);
    renderAuthor(json);

    // TODO
    renderAbilities(json);
    renderAbilitiesButtons(json);
    //
    renderRadarStats(json.stats_wheel);
    renderDifficulty(json.difficulty);
    //
    renderConceptBoard(json.name);

    //
  } catch (err) {
    console.error("Erreur lors du chargement du JSON :", err);
  }
  logOK("loadChampion()");
}

function renderRadar(json) {
  const LANG = "fr"; // ou "en"
  const prefix = `sw_${LANG}`;
  const stats = ["dmg", "tgh", "ctl", "mob", "uti"];

  stats.forEach(st => {
    const el = document.getElementById(`${st}-id`);
    if (el) {
      el.textContent = json[prefix][st];
    } else {
      console.warn(`Élément #${st}-id introuvable`);
    }
  });



}

async function loadLocalization(jsonPath) {
  try {
    const response = await fetch(jsonPath);
    const json = await response.json();
    renderRadar(json);
  } catch (err) {
    console.error("Erreur lors du chargement du JSON :", err);
  }
}