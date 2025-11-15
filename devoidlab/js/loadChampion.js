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

  textField.textContent = difficulty;
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
  textField.textContent = validPositions.join(" / ");
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
    img.classList.add("svg-role");
    iconWrapper.appendChild(img);
  });

  // Ajouter le texte
  textField.textContent = validRoles.join(" / ");
}

async function loadChampion(jsonPath) {
  try {
    const response = await fetch(jsonPath);
    const json = await response.json();
    renderRoles(json.roles);
    renderDifficulty(json.difficulty);
    renderPositions(json.positions);
  } catch (err) {
    console.error("Erreur lors du chargement du JSON :", err);
  }
}