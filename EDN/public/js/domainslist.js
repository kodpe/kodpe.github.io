// SPECS CNT
const container = document.getElementById("domains-list");

Object.entries(domains).forEach(([tag, data]) => {
    const row = document.createElement("div");
    row.className = "domain-row";

    const color = data.color;
    // const color = tweakColor(data.color, { saturation: 0.1, brightness: 0.1, contrast: 0 });

    const tagEl = document.createElement("div");
    tagEl.className = "item-tag";
    tagEl.textContent = tag;
    tagEl.style.color = color;
    tagEl.style.borderColor = color;

    const nameEl = document.createElement("div");
    nameEl.className = "domain-name";
    nameEl.textContent = data.name;
    if (data.ref)
        nameEl.textContent += " (" + data.ref + ")";
    nameEl.style.color = color;

    row.appendChild(tagEl);
    row.appendChild(nameEl);
    container.appendChild(row);
});

// PROGRESS CNT
const container2 = document.getElementById("specs-progress-list");

Object.entries(domains).forEach(([tag, data]) => {
    const row = document.createElement("div");
    row.className = "domain-row";

    const color = data.color;
    // const color = tweakColor(data.color, { saturation: 0.1, brightness: 0.1, contrast: 0 });

    const tagEl = document.createElement("div");
    tagEl.className = "item-tag";
    tagEl.textContent = tag;
    tagEl.style.color = color;
    tagEl.style.borderColor = color;

    const nameEl = document.createElement("div");
    nameEl.className = "domain-name";
    // nameEl.textContent = data.name;
    nameEl.style.color = color;

    row.appendChild(tagEl);
    row.appendChild(nameEl);
    container2.appendChild(row);
});