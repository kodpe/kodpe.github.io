const elements = document.querySelectorAll('.refresh');
console.log(elements);
elements.forEach(element => {
    console.log('hello');
    element.addEventListener('click', function () {
        console.log('hello');
        location.reload();
    });
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
shuffleArray(data);

const grid = document.getElementById("grid");
data.forEach(site => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
    <img src="${'../img/sites/'+site.img}" alt="${site.name}">
    <div class="site-name">${site.name}</div>
    <div class="icon-grid"></div>
    `;
    //<hr class="line"></hr>

    const iconGrid = card.querySelector(".icon-grid");
    site.icons.forEach(name => {

        // icon img
        const iconElement = document.createElement("div");
        iconElement.className = "icon";
        // console.log(name);
        iconElement.innerHTML = '<span>' + icons[name].svg + '</span>';
        iconElement.title = icons[name].info;
        iconGrid.appendChild(iconElement);

        // icon info
        // const infoElement = document.createElement("div");
        // infoElement.className = "icon-description";
        // infoElement.innerText = icons[name].info;
        // infoElement.style.display = "none";
        // iconElement.addEventListener("mouseover", () => {
        //     infoElement.style.display = "block";
        // });
        // iconElement.addEventListener("mouseout", () => {
        //     infoElement.style.display = "none";
        // });
        // iconGrid.appendChild(infoElement);
    });

    card.addEventListener('click', () => {
        window.open(site.url, "_blank");
    });

    grid.appendChild(card);
});
