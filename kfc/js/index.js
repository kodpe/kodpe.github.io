let peer = new Peer(generateShortPeerId());
let conn;
let boardSize = 12, cellSize = 50;
let pieces = [
    { x: 2, y: 3, cooldown: 0, color: "white" },
    { x: 2, y: 4, cooldown: 0, color: "white" },
    { x: 3, y: 6, cooldown: 0, color: "white" },
    { x: 5, y: 1, cooldown: 0, color: "black" },
    { x: 5, y: 7, cooldown: 0, color: "black" },
    { x: 6, y: 3, cooldown: 0, color: "black" }
];
let playerColor = null;
let cooldownTime = 8000;
let selectedPiece = null;
let gameStarted = false;

function generateShortPeerId() {
    return Math.random().toString(36).substr(2, 5).toUpperCase();
}

peer.on("open", id => {
    document.getElementById("myPeerId").innerText = "Votre ID : " + id;
});

startHost();

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
    let count = 3;
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

function setupGame() {
    let canvas = document.getElementById("chessboard");
    let ctx = canvas.getContext("2d");

    canvas.addEventListener("click", (event) => {
        if (!gameStarted) return;

        let rect = canvas.getBoundingClientRect();
        let x = Math.floor((event.clientX - rect.left) / cellSize);
        let y = Math.floor((event.clientY - rect.top) / cellSize);

        let clickedPiece = pieces.find(p => p.x === x && p.y === y && p.color === playerColor);

        if (clickedPiece) {
            selectedPiece = clickedPiece;
        } else if (selectedPiece && selectedPiece.cooldown <= 0) {
            selectedPiece.x = x;
            selectedPiece.y = y;
            selectedPiece.cooldown = cooldownTime;
            selectedPiece = null;
            sendPosition();
        }
    });

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let boardLight = getCSSVariable("--board-light");
        let boardDark = getCSSVariable("--board-dark");
        let cooldownColor = getCSSVariable("--cooldown-color");
        let pieceOutline = getCSSVariable("--piece-outline");

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                ctx.fillStyle = (i + j) % 2 === 0 ? boardLight : boardDark;
                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }

        pieces.forEach((p) => {
            if (p.cooldown > 0) {
                ctx.fillStyle = cooldownColor;
                ctx.fillRect(
                    p.x * cellSize,
                    p.y * cellSize + (cellSize * (1 - p.cooldown / cooldownTime)),
                    cellSize,
                    cellSize * (p.cooldown / cooldownTime)
                );
            }

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x * cellSize + cellSize / 2, p.y * cellSize + cellSize / 2, cellSize / 3, 0, Math.PI * 2);
            ctx.fill();

            if (p === selectedPiece) {
                ctx.strokeStyle = pieceOutline;
                ctx.lineWidth = 4;
                ctx.strokeRect(p.x * cellSize, p.y * cellSize, cellSize, cellSize);
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
