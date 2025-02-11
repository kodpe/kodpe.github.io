let peer = new Peer(generateShortPeerId());
let conn;
let boardSize = 12, cellSize = 50;
let pieces = [
    { x: 0, y: 0, cooldown: 0, color: "black", type: "tower" },
    { x: 1, y: 0, cooldown: 0, color: "black", type: "cavalier" },
    { x: 2, y: 0, cooldown: 0, color: "black", type: "fou" },
    { x: 3, y: 0, cooldown: 0, color: "black", type: "faucon" },
    { x: 4, y: 0, cooldown: 0, color: "black", type: "elephant" },
    { x: 5, y: 0, cooldown: 0, color: "black", type: "roi" },
    { x: 6, y: 0, cooldown: 0, color: "black", type: "reine" },
    { x: 7, y: 0, cooldown: 0, color: "black", type: "elephant" },
    { x: 8, y: 0, cooldown: 0, color: "black", type: "faucon" },
    { x: 9, y: 0, cooldown: 0, color: "black", type: "fou" },
    { x: 10, y: 0, cooldown: 0, color: "black", type: "cavalier" },
    { x: 11, y: 0, cooldown: 0, color: "black", type: "tower" },
    { x: 0, y: 1, cooldown: 0, color: "black", type: "pion" },
    { x: 1, y: 1, cooldown: 0, color: "black", type: "pion" },
    { x: 2, y: 1, cooldown: 0, color: "black", type: "pion" },
    { x: 3, y: 1, cooldown: 0, color: "black", type: "pion" },
    { x: 4, y: 1, cooldown: 0, color: "black", type: "pion" },
    { x: 5, y: 1, cooldown: 0, color: "black", type: "pion" },
    { x: 6, y: 1, cooldown: 0, color: "black", type: "pion" },
    { x: 7, y: 1, cooldown: 0, color: "black", type: "pion" },
    { x: 8, y: 1, cooldown: 0, color: "black", type: "pion" },
    { x: 9, y: 1, cooldown: 0, color: "black", type: "pion" },
    { x: 10, y: 1, cooldown: 0, color: "black", type: "pion" },
    { x: 11, y: 1, cooldown: 0, color: "black", type: "pion" },
    { x: 0, y: 10, cooldown: 0, color: "white", type: "pion" },
    { x: 1, y: 10, cooldown: 0, color: "white", type: "pion" },
    { x: 2, y: 10, cooldown: 0, color: "white", type: "pion" },
    { x: 3, y: 10, cooldown: 0, color: "white", type: "pion" },
    { x: 4, y: 10, cooldown: 0, color: "white", type: "pion" },
    { x: 5, y: 10, cooldown: 0, color: "white", type: "pion" },
    { x: 6, y: 10, cooldown: 0, color: "white", type: "pion" },
    { x: 7, y: 10, cooldown: 0, color: "white", type: "pion" },
    { x: 8, y: 10, cooldown: 0, color: "white", type: "pion" },
    { x: 9, y: 10, cooldown: 0, color: "white", type: "pion" },
    { x: 10, y: 10, cooldown: 0, color: "white", type: "pion" },
    { x: 11, y: 10, cooldown: 0, color: "white", type: "pion" },
    { x: 0, y: 11, cooldown: 0, color: "white", type: "tower" },
    { x: 1, y: 11, cooldown: 0, color: "white", type: "cavalier" },
    { x: 2, y: 11, cooldown: 0, color: "white", type: "fou" },
    { x: 3, y: 11, cooldown: 0, color: "white", type: "faucon" },
    { x: 4, y: 11, cooldown: 0, color: "white", type: "elephant" },
    { x: 5, y: 11, cooldown: 0, color: "white", type: "reine" },
    { x: 6, y: 11, cooldown: 0, color: "white", type: "roi" },
    { x: 7, y: 11, cooldown: 0, color: "white", type: "elephant" },
    { x: 8, y: 11, cooldown: 0, color: "white", type: "faucon" },
    { x: 9, y: 11, cooldown: 0, color: "white", type: "fou" },
    { x: 10, y: 11, cooldown: 0, color: "white", type: "cavalier" },
    { x: 11, y: 11, cooldown: 0, color: "white", type: "tower" },
];

let playerColor = null;
let cooldownTime = 8000;
let selectedPiece = null;
let gameStarted = false;

function generateShortPeerId() {
    return Math.random().toString(36).substr(2, 1).toUpperCase();
}

peer.on("open", id => {
    document.getElementById("myPeerId").innerText = "Votre ID : " + id;
});


function startHost() {
    peer.on("connection", connection => {
        if (conn) return;
        conn = connection;
        playerColor = "white";
        document.getElementById("playerRole").innerText = "Rôle : Blanc ⚪";
        conn.on("open", () => {
            conn.send(JSON.stringify({ role: "black", pieces }));
        });
        setupConnection();
    });
}

function setupConnection() {
    conn.on("data", data => {
        pieces = JSON.parse(data);
    });
    conn.on("open", () => {
        console.log("Connexion établie !");
        startCountdown();
    });
    conn.on("close", () => console.log("Connexion fermée !"));
}

function startCountdown() {
    let countdownElement = document.getElementById("countdown");
    countdownElement.style.display = "block";
    let count = 1;
    countdownElement.innerText = count;
    let countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownElement.innerText = count;
        } else {
            clearInterval(countdownInterval);
            countdownElement.innerText = "GO!";
            setTimeout(() => {
                countdownElement.style.display = "none";
                gameStarted = true;
                setupGame();
            }, 1000);
        }
    }, 1000);
}

function getCSSVariable(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function welcomeDrawBoard() {
    let canvas = document.getElementById("chessboard");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let boardLight = getCSSVariable("--board-light");
    let boardDark = getCSSVariable("--board-dark");
    let cooldownColor = getCSSVariable("--cooldown-color");
    let pieceOutline = getCSSVariable("--piece-outline");

    // Dessine les cases du plateau avec inversion pour le client
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            // Inverser l'affichage des cases pour le client
            let displayX = i;
            let displayY = j;
            if (playerColor === "black") {
                displayX = boardSize - 1 - i;
                displayY = boardSize - 1 - j;
            }

            ctx.fillStyle = (displayX + displayY) % 2 === 0 ? boardLight : boardDark;
            ctx.fillRect(displayX * cellSize, displayY * cellSize, cellSize, cellSize);
        }
    }

    // Dessine les pièces
    pieces.forEach((p) => {
        if (p.color === undefined || p.type === undefined) {
            console.error("Missing 'color' or 'type' in piece:", p);
            return;
        }

        let pieceKey = `${p.color}-${p.type}`;
        let pieceImage = images[pieceKey];
        let imageScaleFactor = 1;

        // Calculer les coordonnées des pièces en fonction du joueur
        let pieceX = p.x;
        let pieceY = p.y;
        if (playerColor === "black") {
            pieceX = boardSize - 1 - p.x;
            pieceY = boardSize - 1 - p.y;
        }

        if (pieceImage) {
            let imageWidth = cellSize * imageScaleFactor;
            let imageHeight = cellSize * imageScaleFactor;
            // Dessiner l'image de la pièce avec la taille ajustée
            ctx.drawImage(
                pieceImage,
                pieceX * cellSize + (cellSize - imageWidth) / 2,  // Centrer horizontalement
                pieceY * cellSize + (cellSize - imageHeight) / 2, // Centrer verticalement
                imageWidth,  // Largeur ajustée de l'image
                imageHeight   // Hauteur ajustée de l'image
            );
        } else {
            console.error(`Image for ${pieceKey} not found!`);
        }

    });
}

function setupGame() {
    let canvas = document.getElementById("chessboard");
    let ctx = canvas.getContext("2d");

    canvas.addEventListener("click", (event) => {
        if (!gameStarted)
            return;

        let rect = canvas.getBoundingClientRect();
        let x = Math.floor((event.clientX - rect.left) / cellSize);
        let y = Math.floor((event.clientY - rect.top) / cellSize);

        // Inverser la position pour le client (=/= host)
        if (playerColor === "black") {
            x = boardSize - 1 - x;
            y = boardSize - 1 - y;
        }

        let clickedPiece = pieces.find(p => p.x === x && p.y === y && p.color === playerColor);

        if (clickedPiece && clickedPiece.cooldown <= 0) {
            selectedPiece = clickedPiece;
            clearMoveIndicators();  // Efface les anciens indicateurs (cases possibles)
            showValidMoves(selectedPiece);
        }
        else if (selectedPiece && selectedPiece.cooldown <= 0)
        {
            let targetPiece = pieces.find(p => p.x === x && p.y === y);

            if (targetPiece && targetPiece.color !== selectedPiece.color)
            {
                console.log(`Une pièce ennemi ${targetPiece.color} ${targetPiece.type} a été trouvée a cet emplacement !`);
                pieceDeath(targetPiece, x, y); // piece ennemie
            }
            else if (targetPiece)
            {
                console.log("Mouvement impossible : La case est occupée par une pièce alliée.");
                return; // piece allie, pas de mouvement
            }
            selectedPiece.x = x;
            selectedPiece.y = y;
            selectedPiece.cooldown = cooldownTime;
            selectedPiece = null;
            sendPosition();
        }
    });

    function pieceDeath(targetPiece, x, y) {
        console.log(`La pièce ${targetPiece.color} ${targetPiece.type} a été tuée!`);
        // Vérifier si c'est un roi et déclarer le gagnant
        if (targetPiece.type === "roi") {
            let winner = targetPiece.color === "black" ? "Blanc ⚪" : "Noir ⚫";
            console.log(`Le joueur ${winner} a gagné en tuant le roi !`);
            gameStarted = false; // Stopper le jeu
            alert(`Le joueur ${winner} a gagné !`);
            // reload page or reset game (todo improve)
            setTimeout(() => {
                window.location.reload();  // Recharge la page et recommence le jeu
            }, 1000);
            // resetGame(); // DEPR
        }
        pieces = pieces.filter(p => !(p.x === x && p.y === y));  // Retirer la pièce morte
    }

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let boardLight = getCSSVariable("--board-light");
        let boardDark = getCSSVariable("--board-dark");
        let cooldownColor = getCSSVariable("--cooldown-color");
        let pieceOutline = getCSSVariable("--piece-outline");

        // Dessine les cases du plateau avec inversion pour le client
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                // Inverser l'affichage des cases pour le client
                let displayX = i;
                let displayY = j;
                if (playerColor === "black") {
                    displayX = boardSize - 1 - i;
                    displayY = boardSize - 1 - j;
                }

                ctx.fillStyle = (displayX + displayY) % 2 === 0 ? boardLight : boardDark;
                ctx.fillRect(displayX * cellSize, displayY * cellSize, cellSize, cellSize);
            }
        }

        // Dessine les pièces
        pieces.forEach((p) => {
            if (p.color === undefined || p.type === undefined) {
                console.error("Missing 'color' or 'type' in piece:", p);
                return;
            }

            let pieceKey = `${p.color}-${p.type}`;
            let pieceImage = images[pieceKey];
            let imageScaleFactor = 1;

            // Calculer les coordonnées des pièces en fonction du joueur
            let pieceX = p.x;
            let pieceY = p.y;
            if (playerColor === "black") {
                pieceX = boardSize - 1 - p.x;
                pieceY = boardSize - 1 - p.y;
            }

            if (pieceImage) {
                let imageWidth = cellSize * imageScaleFactor;
                let imageHeight = cellSize * imageScaleFactor;
                // Dessiner l'image de la pièce avec la taille ajustée
                ctx.drawImage(
                    pieceImage,
                    pieceX * cellSize + (cellSize - imageWidth) / 2,  // Centrer horizontalement
                    pieceY * cellSize + (cellSize - imageHeight) / 2, // Centrer verticalement
                    imageWidth,  // Largeur ajustée de l'image
                    imageHeight   // Hauteur ajustée de l'image
                );
            } else {
                console.error(`Image for ${pieceKey} not found!`);
            }

            if (p.cooldown > 0) {
                ctx.fillStyle = cooldownColor;
                ctx.fillRect(
                    pieceX * cellSize,
                    pieceY * cellSize + (cellSize * (1 - p.cooldown / cooldownTime)),
                    cellSize,
                    cellSize * (p.cooldown / cooldownTime)
                );
            }

            if (p === selectedPiece) {
                ctx.strokeStyle = pieceOutline;
                ctx.lineWidth = 3;
                ctx.strokeRect(pieceX * cellSize, pieceY * cellSize, cellSize, cellSize);
            }
        });

        requestAnimationFrame(drawBoard);
    }

    function updateCooldowns() {
        pieces.forEach(p => {
            if (p.cooldown > 0) p.cooldown -= 50;
        });
        setTimeout(updateCooldowns, 50);
    }

    drawBoard();
    updateCooldowns();
}

function sendPosition() {
    if (conn && conn.open) {
        conn.send(JSON.stringify(pieces));
    }
}

function joinGame() {
    let peerId = document.getElementById("peerId").value;
    conn = peer.connect(peerId);
    conn.on("data", data => {
        let msg = JSON.parse(data);
        if (msg.role) {
            playerColor = msg.role;
            pieces = msg.pieces;
            document.getElementById("playerRole").innerText = "Rôle : Noir ⚫";
        } else {
            pieces = msg;
        }
    });
    conn.on("open", () => {
        console.log("Connexion établie !");
        startCountdown();
    });
}

window.onload = function () {
    let urlParams = new URLSearchParams(window.location.search);
    let peerId = urlParams.get("peerId");
    if (peerId) {
        joinGame(peerId);
    }
};

// Précharger les images des pièces
let images = {};

function preloadImages() {
    const pieceTypes = ["pion", "cavalier", "fou", "faucon", "elephant", "tower", "reine", "roi"];
    const colors = ["white", "black"];

    pieceTypes.forEach(type => {
        colors.forEach(color => {
            let img = new Image();
            img.src = `img/${type}-${color[0]}.png`;
            img.onload = () => {
                images[`${color}-${type}`] = img;
            };
        });
    });
}

preloadImages();
startHost();
welcomeDrawBoard();
