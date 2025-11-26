function renderAbilitiesButtons(json) {
    logCALL("renderAbilitiesButtons() <- json");

    const buttonsPanel = document.getElementById("champion-buttons-panel");

    logCREATE("create p,q,w,e,r buttons");
    //
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
        img.src = 'data/champions/' + json.name + '/abilities/icon_' + key + '.png';
        img.alt = "ability_img_" + key;
        img.classList.add("ability-icon-img");
        btn.appendChild(img);
        //
        keyt = document.createElement("div");
        abname = json.abilities[key].name;
        keyt.innerHTML = abname.toUpperCase();
        keyt.classList.add("keyb-name");
        btn.appendChild(keyt);
    }
    logWARN("renderAbilitiesButtons()");
}