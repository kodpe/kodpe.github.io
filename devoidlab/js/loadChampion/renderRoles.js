function renderRoles(roles) {
  logCALL("renderRoles() <- json.roles");
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
  logOK("renderRoles()");
}