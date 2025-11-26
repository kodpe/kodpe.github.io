function renderProfil(json) {
  logCALL("renderProfil() <- json");
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
    img.src = "data/champions/"+json.name+"/splashArt/"+ json.splash_face.file;
  logOK("renderProfil()");
}