function createHeader(titles) {
    const grid = document.getElementById("grid");
    const headerRow = document.createElement('div');
    headerRow.classList.add('line');
    headerRow.innerHTML = ``;
    titles.forEach((title) => {
        if (title == "Categories" || title == "Topics")
            headerRow.innerHTML += `<div class="header category">${title}</div>`;
        else
            headerRow.innerHTML += `<div class="header">${title}</div>`;
    });
    grid.appendChild(headerRow);
}

function generateWebsiteGrid() {

    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    createHeader(TOPICS_HEADER);
    Object.values(CATEGORIES).forEach(({ label, svg }) => {
        const author = randomName(3, 8);
        const rowElement = document.createElement('div');
        rowElement.classList.add('line');
        rowElement.innerHTML = `
                <div class="cell icon">${svg}</div>
                <div class="cell category">${label}</div>
                <div class="cell">${author}</div>
                <div class="cell counter" data-counter="posts"></div>
                <div class="cell" data-counter="timestamp"></div>
                <div class="cell" data-counter="operations"></div>
            `;
        const counterPosts = rowElement.querySelector('[data-counter="posts"]');
        const tsElement = rowElement.querySelector('[data-counter="timestamp"]');
        const opElement = rowElement.querySelector('[data-counter="operations"]');
        createCounter(counterPosts, 10000000, tsElement, opElement);

        grid.appendChild(rowElement);
    });
}

generateWebsiteGrid();