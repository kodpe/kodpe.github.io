export const boardSize = 10;
export const cellSize = 70;
export const cooldownTime = 8000;
export const imageScaleFactor = 1;
export const piecesStartPosition = [
    { oldx: -1, oldy: -1, x: 0, y: 0, cooldown: 0, color: "black", type: "tower" },
    { oldx: -1, oldy: -1, x: 1, y: 0, cooldown: 0, color: "black", type: "cavalier" },
    { oldx: -1, oldy: -1, x: 2, y: 0, cooldown: 0, color: "black", type: "fou" },
    { oldx: -1, oldy: -1, x: 3, y: 0, cooldown: 0, color: "black", type: "elephant" },
    { oldx: -1, oldy: -1, x: 4, y: 0, cooldown: 0, color: "black", type: "roi" },
    { oldx: -1, oldy: -1, x: 5, y: 0, cooldown: 0, color: "black", type: "reine" },
    { oldx: -1, oldy: -1, x: 6, y: 0, cooldown: 0, color: "black", type: "faucon" },
    { oldx: -1, oldy: -1, x: 7, y: 0, cooldown: 0, color: "black", type: "fou" },
    { oldx: -1, oldy: -1, x: 8, y: 0, cooldown: 0, color: "black", type: "cavalier" },
    { oldx: -1, oldy: -1, x: 9, y: 0, cooldown: 0, color: "black", type: "tower" },
    { oldx: -1, oldy: -1, x: 0, y: 1, cooldown: 0, color: "black", type: "pion" },
    { oldx: -1, oldy: -1, x: 1, y: 1, cooldown: 0, color: "black", type: "pion" },
    { oldx: -1, oldy: -1, x: 2, y: 1, cooldown: 0, color: "black", type: "pion" },
    { oldx: -1, oldy: -1, x: 3, y: 1, cooldown: 0, color: "black", type: "pion" },
    { oldx: -1, oldy: -1, x: 4, y: 1, cooldown: 0, color: "black", type: "pion" },
    { oldx: -1, oldy: -1, x: 5, y: 1, cooldown: 0, color: "black", type: "pion" },
    { oldx: -1, oldy: -1, x: 6, y: 1, cooldown: 0, color: "black", type: "pion" },
    { oldx: -1, oldy: -1, x: 7, y: 1, cooldown: 0, color: "black", type: "pion" },
    { oldx: -1, oldy: -1, x: 8, y: 1, cooldown: 0, color: "black", type: "pion" },
    { oldx: -1, oldy: -1, x: 9, y: 1, cooldown: 0, color: "black", type: "pion" },
    { oldx: -1, oldy: -1, x: 0, y: 8, cooldown: 0, color: "white", type: "pion" },
    { oldx: -1, oldy: -1, x: 1, y: 8, cooldown: 0, color: "white", type: "pion" },
    { oldx: -1, oldy: -1, x: 2, y: 8, cooldown: 0, color: "white", type: "pion" },
    { oldx: -1, oldy: -1, x: 3, y: 8, cooldown: 0, color: "white", type: "pion" },
    { oldx: -1, oldy: -1, x: 4, y: 8, cooldown: 0, color: "white", type: "pion" },
    { oldx: -1, oldy: -1, x: 5, y: 8, cooldown: 0, color: "white", type: "pion" },
    { oldx: -1, oldy: -1, x: 6, y: 8, cooldown: 0, color: "white", type: "pion" },
    { oldx: -1, oldy: -1, x: 7, y: 8, cooldown: 0, color: "white", type: "pion" },
    { oldx: -1, oldy: -1, x: 8, y: 8, cooldown: 0, color: "white", type: "pion" },
    { oldx: -1, oldy: -1, x: 9, y: 8, cooldown: 0, color: "white", type: "pion" },
    { oldx: -1, oldy: -1, x: 0, y: 9, cooldown: 0, color: "white", type: "tower" },
    { oldx: -1, oldy: -1, x: 1, y: 9, cooldown: 0, color: "white", type: "cavalier" },
    { oldx: -1, oldy: -1, x: 2, y: 9, cooldown: 0, color: "white", type: "fou" },
    { oldx: -1, oldy: -1, x: 3, y: 9, cooldown: 0, color: "white", type: "faucon" },
    { oldx: -1, oldy: -1, x: 4, y: 9, cooldown: 0, color: "white", type: "reine" },
    { oldx: -1, oldy: -1, x: 5, y: 9, cooldown: 0, color: "white", type: "roi" },
    { oldx: -1, oldy: -1, x: 6, y: 9, cooldown: 0, color: "white", type: "elephant" },
    { oldx: -1, oldy: -1, x: 7, y: 9, cooldown: 0, color: "white", type: "fou" },
    { oldx: -1, oldy: -1, x: 8, y: 9, cooldown: 0, color: "white", type: "cavalier" },
    { oldx: -1, oldy: -1, x: 9, y: 9, cooldown: 0, color: "white", type: "tower" },
];

// Précharger les images des pièces
export let images = {};

function preloadImages() {
    const pieceTypes = ["pion", "cavalier", "fou", "faucon", "elephant", "tower", "reine", "roi"];
    const colors = ["white", "black"];

    pieceTypes.forEach(type => {
        colors.forEach(color => {
            let img = new Image();
            // img.src = `img/${type}-${color[0]}.png`;
            img.src = `img/${type}-${color[0]}.svg`;
            img.onload = () => {
                images[`${type}-${color[0]}`] = img;
            };
        });
    });
}

preloadImages();
