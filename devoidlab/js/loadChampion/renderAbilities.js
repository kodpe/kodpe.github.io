function renderAbilities(json) {
    logCALL("renderAbilities() <- json");

    const mediaPanel = document.querySelector(".champion-media-panel");
    const textPanel = document.querySelector(".champion-text-panel");

    console.log(mediaPanel);
    console.log(textPanel);

    logCREATE("create p,q,w,e,r descriptions");
    //
    const keys = ["p", "q", "w", "e", "r"];
    for (const key of keys) {
        span = document.createElement("span");
        span.classList.add("champion-abilitie-txt");
        span.textContent = json.abilities[key].description;
        span.id = "champion-abilitie-text-"+key;
        textPanel.appendChild(span);
        //
        img = document.createElement("img");
        img.classList.add("champion-abilitie-img");
        img.src = "images/videoframe.png"
        img.alt = json.name+"-"+key;
        img.id = "champion-abilitie-media-"+key;
        //
        pre = document.createElement("div");
        pre.classList.add("keyb-key");
        pre.textContent = key.toUpperCase();
        img.appendChild(pre);
        //
        mediaPanel.appendChild(img);
        break
    }

    logWARN("renderAbilities()");
}