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

function renderRoles(roles) {
  const iconWrapper = document.getElementById("role-icons-js");
  const textField = document.getElementById("role-text-js");
  iconWrapper.innerHTML = "";
  textField.textContent = "";

  if (!roles || roles.length === 0 || Array.isArray(roles) === false) {
    console.error("Aucun rôle trouvé dans la fiche champion.");
    textField.textContent = "Unknown";
    return;
  }

  const validRoles = roles.filter(role => ROLE_DATA[role]);
  if (validRoles.length !== roles.length) {
    console.error("Rôles invalides :", roles);
    textField.textContent = "Unknown";
    return;
  }

  // Ajouter les icônes
  validRoles.forEach(role => {
    const img = document.createElement("img");
    img.src = ROLE_DATA[role];
    img.alt = role;
    img.classList.add("svg-role-22");
    iconWrapper.appendChild(img);
  });

  // Ajouter le texte
  // textField.textContent = validRoles.join(" / ");
  textField.innerHTML = validRoles.join("<br>");
}

function renderProfil(json) {
  if (json.name.length > 20) { console.warn("too long value :", json.name); return }
  if (json.title.length > 30) { console.warn("too long value :", json.title); return }
  if (json.lore.short.length > 200) { console.warn("too long value :", json.lore.short); return }

    document.title = json.name;

    const caption = document.getElementById("caption-txt");
    caption.textContent = json.title;

    const name = document.getElementById("name-txt");
    name.textContent = json.name;

    const short = document.getElementById("short-txt");
    short.textContent = json.lore.short;

    const img = document.getElementById("champion-img");
    img.src = "images/champions/" + json.splash_face.file;
}

function renderAbilitiesButtons(json) {

  const buttonsPanel = document.getElementById("champion-buttons-panel");

  const keys = ["p", "q", "w", "e", "r"];
  for (const key of keys) {
    btn = document.createElement("div");
    btn.classList.add("spell-btn");
    btn.classList.add("bordered");
    btn.id = "ability-btn-" + key;
    buttonsPanel.appendChild(btn);
    //
    keyb = document.createElement("div");
    keyb.innerHTML = key.toUpperCase();
    keyb.classList.add("keyb-key");
    btn.appendChild(keyb);
    //
    img = document.createElement("img");
    img.src = "images/champions_abilities/" + json.name + "/_all_icons/icon_" + key + ".png",
    img.alt = "ability_img_"+key;
    img.classList.add("ability-icon-img"); 
    btn.appendChild(img);
    //
    keyt = document.createElement("div");
    abname = json.abilities[key].name;
    keyt.innerHTML = abname.toUpperCase();
    keyt.classList.add("keyb-name");
    btn.appendChild(keyt);
  }
}

function renderRadarChampionStats(json) {
  Object.entries(json).forEach(([statName, value]) => {
    const bars = Array.from(document.querySelectorAll(`.stat-wheel-${statName} .stat-wheel-bar`));
    console.warn(bars);
    bars.forEach((bar, index) => {
      if (index < value) {
        bar.classList.add('stat-wheel-bar-lit');
      } else {
        bar.classList.remove('stat-wheel-bar-lit');
      }
    });
  });
}

async function loadChampion(jsonPath) {
  try {
    const response = await fetch(jsonPath);
    const json = await response.json();

    // RENDERING DE LA PAGE
    renderProfil(json);
    renderRoles(json.roles);
    renderPositions(json.positions);
    //
    renderAbilitiesButtons(json);
    //
    renderRadarChampionStats(json.stats_wheel);
    renderDifficulty(json.difficulty);

    //
  } catch (err) {
    console.error("Erreur lors du chargement du JSON :", err);
  }
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