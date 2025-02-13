import { piecesStartPosition, boardSize, cellSize, images, imageScaleFactor, cooldownTime } from './data.js';
import { getCSSVariable, generateShortPeerId, getUrlParam, getCurrentUrl } from './tools.js';
import { startGameTimer, stopGameTimer } from './gameTimer.js';
import { getValidMoves, clearMoveIndicators, isOpponent } from './getMoves.js';

let peer;
let conn;
let hostid = '';
// canvas
let canvas;
let ctx;
//
let playerColor = null;
let selectedPiece = null;
let gameStarted = false;
let pieces = piecesStartPosition;
let boardNeedsUpdate = true;

document.getElementById("code-pin").classList.add("disabled");
document.getElementById("url-menu").classList.add("disabled");
document.getElementById("btn-copycode").classList.add("disabled");
document.getElementById("ingame-bar").classList.add("disabled");
document.getElementById("msg-error").classList.add("disabled");
document.getElementById("msg-waiting").classList.add("disabled");
document.getElementById("grid-vt-nb").classList.add("disabled");
document.getElementById("grid-hz-lt").classList.add("disabled");

function copy(texte) {
    // create tmp
    var element = document.createElement('textarea');
    element.value = texte;
    document.body.appendChild(element);
    // Sélectionne et copie le texte
    element.select();
    document.execCommand('copy');
    // remove tmp
    document.body.removeChild(element);
}

function copyCodePin() {
    copy(hostid);
    let btn = document.getElementById("btn-copycode");
    if (btn.classList.contains("btn-lock-on")) {
        btn.innerText = "Copier le code";
        btn.classList.remove("btn-lock-on");

    }
    else {
        btn.innerText = "Code copié";
        btn.classList.add("btn-lock-on");
    }
}

function copyGameUrl() {
    copy(getCurrentUrl() + "?game=" + hostid);
    let btn = document.getElementById("btn-copylink");
    if (btn.classList.contains("btn-lock-on")) {
        btn.innerText = "Copier le lien";
        btn.classList.remove("btn-lock-on");

    }
    else {
        btn.innerText = "Lien copié";
        btn.classList.add("btn-lock-on");
    }
}



function hostGame() {
    let pin = generateShortPeerId();
    peer = new Peer("kfc-" + pin); // kfc-
    peer.on("open", id => {
        hostid = pin;
        document.getElementById("code-pin").innerText = hostid;
        document.getElementById("game-url").innerText = getCurrentUrl() + "?game=" + hostid;
        document.getElementById("code-pin").classList.remove("disabled");
        document.getElementById("url-menu").classList.remove("disabled");
        document.getElementById("btn-copycode").classList.remove("disabled");
        document.getElementById("join-menu").classList.add("disabled");
        document.getElementById("btn-create").classList.add("disabled");
        document.getElementById("msg-waiting").classList.remove("disabled");
        console.log("create game id: ", hostid);
    });

    peer.on("connection", connection => {
        if (conn) return;
        conn = connection;
        playerColor = "white";
        document.getElementById("playerRole").innerText = "Vous avez les Blancs ⚪";
        conn.on("open", () => {
            conn.send(JSON.stringify({ role: "black", pieces }));
        });
        setupConnection();
    });

}


////////////////////////////////////////////////
// host game button events

document.addEventListener('DOMContentLoaded', function () {
    const btnCreate = document.getElementById('btn-create');
    btnCreate.addEventListener('click', hostGame);
});

document.addEventListener('DOMContentLoaded', function () {
    const btnCopyCode = document.getElementById('btn-copycode');
    btnCopyCode.addEventListener('click', copyCodePin);
});

document.addEventListener('DOMContentLoaded', function () {
    const btnCopyLink = document.getElementById('btn-copylink');
    btnCopyLink.addEventListener('click', copyGameUrl);
});

////////////////////////////////////////////////
// Input join event

var input = document.getElementById('peerId');
input.value = '';

input.addEventListener('input', function () {
    document.getElementById("msg-error").classList.add("disabled");
    if (input.value.trim() === '') {
        // empty input
        input.classList.remove('hugeFont');
    } else {
        input.classList.add('hugeFont');
    }
});

input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && input.value.trim() !== '') {
        joinGame();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const btnJoin = document.getElementById('btn-join');
    btnJoin.addEventListener('click', joinGame);
});

function checkJoinUrlGame() {
    let pin = getUrlParam("game");
    if (pin === null) {
        console.log("no url game pin param");
        return;
    }
    console.warn("url game pin found:", pin);
    input.value = pin;
    window.history.replaceState({}, document.title, window.location.pathname);
    joinGame();
}
checkJoinUrlGame();


function joinGame() {
    if (input.value.trim() === '') {
        return;
    }
    console.log("try join game with id :", input.value);
    let peerId = input.value;

    try {
        peer = new Peer("kfc-" + generateShortPeerId()); // kfc-
        peer.on("open", id => {
            console.log('id', id);
            conn = peer.connect("kfc-" + peerId); // kfc-
            conn.on("data", data => {
                try {
                    let msg = JSON.parse(data);
                    if (msg.role) {
                        playerColor = msg.role;
                        pieces = msg.pieces;
                        document.getElementById("playerRole").innerText = "Vous avez les Noirs ⚫";
                    } else {
                        pieces = msg;
                    }
                } catch (e) {
                    console.error("Erreur lors du traitement des données reçues :", e);
                }
            });

            conn.on("open", () => {
                console.log("Connexion établie !");
                document.getElementById("ingame-bar").classList.remove("disabled");
                document.getElementById("host-menu").classList.add("disabled");
                document.getElementById("join-menu").classList.add("disabled");
                document.getElementById("url-menu").classList.add("disabled");
                document.getElementById("btn-title").disabled = true;
                startCountdown();
            });

            conn.on("error", err => {
                console.warn("Erreur de connexion :", err);
                document.getElementById("msg-error").innerText = "Code PIN inconnu";
                document.getElementById("msg-error").classList.remove("disabled");
            });
        });

        peer.on("error", err => {
            console.warn("Erreur du Peer :", err);
            document.getElementById("msg-error").innerText = "Code PIN inconnu";
            document.getElementById("msg-error").classList.remove("disabled");
        });

    } catch (e) {
        console.error("Erreur fatale dans joinGame():", e);
        document.getElementById("msg-error").innerText = "joinGame() Fatal Error";
        document.getElementById("msg-error").classList.remove("disabled");
    }
}

function setupConnection() {
    conn.on("data", data => {
        pieces = JSON.parse(data);
    });
    conn.on("open", () => {
        console.log("Connexion établie !");
        document.getElementById("ingame-bar").classList.remove("disabled");
        document.getElementById("host-menu").classList.add("disabled");
        document.getElementById("join-menu").classList.add("disabled");
        document.getElementById("url-menu").classList.add("disabled");
        document.getElementById("msg-waiting").classList.add("disabled");
        document.getElementById("btn-title").disabled = true;
        startCountdown();
    });
    conn.on("close", () => console.log("Connexion fermée !"));
}

function startCountdown() {
    preSetupGame();
    let countdownElement = document.getElementById("countdown");
    countdownElement.innerText = "";
    let count = 4;
    countdownElement.innerText = count;
    let countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownElement.innerText = count;
        } else {
            clearInterval(countdownInterval);
            countdownElement.innerText = "C PARTI !";
            setTimeout(() => {
                countdownElement.innerHTML = "&nbsp";
                gameStarted = true;
                setupGame();
            }, 1000);
        }
    }, 1000);
}

////////////////////////////////////////////////
////////////////////////////////////////////////
/* GAME */

function DrawBoardCases() {
    let boardLight = getCSSVariable("--board-light");
    let boardDark = getCSSVariable("--board-dark");

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
}

function DrawCooldownUpdate(p, x, y) {
    if (p.cooldown > 0) {
        ctx.fillStyle = getCSSVariable("--cooldown-color");
        ctx.fillRect(
            x * cellSize,
            y * cellSize + (cellSize * (1 - p.cooldown / cooldownTime)),
            cellSize,
            cellSize * (p.cooldown / cooldownTime)
        );
    }
}

function samePos(p1, p2) {
    if (p1.x === p2.x && p1.y === p2.y)
        return true;
    return false;
}

function DrawStrokeIfSelected(p, x, y) {
    if (selectedPiece && samePos(p, selectedPiece)) {
        ctx.strokeStyle = getCSSVariable("--piece-outline");
        ctx.lineWidth = 4;
        ctx.strokeRect(x * cellSize + 2, y * cellSize + 2, cellSize - ctx.lineWidth, cellSize - ctx.lineWidth);
    }
}

function DrawPieceImg(p, x, y) {
    let pieceKey = `${p.type}-${p.color[0]}`;
    let pieceImage = images[pieceKey];

    if (pieceImage === null) {
        console.error(`Image for ${pieceKey} not found!`);
        return;
    }
    // console.log("DrawImages()", pieceKey);
    // Dessiner l'image de la pièce avec la taille ajustée
    let imageWidth = cellSize * imageScaleFactor;
    let imageHeight = cellSize * imageScaleFactor;
    ctx.drawImage(
        pieceImage,
        x * cellSize + (cellSize - imageWidth) / 2,  // Centrer horizontalement
        y * cellSize + (cellSize - imageHeight) / 2, // Centrer verticalement
        imageWidth,  // Largeur ajustée de l'image
        imageHeight   // Hauteur ajustée de l'image
    );
}

function sendPosition() {
    if (conn && conn.open) {
        conn.send(JSON.stringify(pieces));
    }
}

function drawBoard() {
    if (!boardNeedsUpdate) return;

    // reset ctx canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    DrawBoardCases();
    showValidMoves(selectedPiece);

    // Dessine les pièces
    pieces.forEach((p) => {
        if (p.color === undefined || p.type === undefined) {
            console.error("Missing 'color' or 'type' in piece:", p);
            return;
        }
        // Calculer les coordonnées des pièces en fonction du côté
        let px = p.x;
        let py = p.y;
        if (playerColor === "black") {
            px = boardSize - 1 - p.x;
            py = boardSize - 1 - p.y;
        }
        DrawCooldownUpdate(p, px, py);
        DrawPieceImg(p, px, py);
        DrawStrokeIfSelected(p, px, py);
    });

    boardNeedsUpdate = false;
    requestAnimationFrame(drawBoard);
}

function preSetupGame() {
    canvas = document.getElementById("chessboard");
    canvas.width = boardSize * cellSize;
    canvas.height = boardSize * cellSize;
    ctx = canvas.getContext("2d");
    boardNeedsUpdate = true;
    drawBoard();
    document.getElementById("grid-vt-nb").classList.remove("disabled");
    document.getElementById("grid-hz-lt").classList.remove("disabled");
}

function canvasEventMouseMove() {
    canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Convertir les coordonnées en indices de grille
        let x = Math.floor(mouseX / cellSize);
        let y = Math.floor(mouseY / cellSize);
        if (playerColor === "black") {
            x = boardSize - 1 - x;
            y = boardSize - 1 - y;
        }

        // Vérifier si une pièce alliée est présente sur cette case
        const piece = pieces.find(p => p.x === x && p.y === y && p.color === playerColor);

        if (piece) {
            canvas.style.cursor = "pointer"; // Changer en pointeur si c'est une pièce alliée
        } else {
            canvas.style.cursor = "default"; // Revenir au curseur normal sinon
        }
    });
}

function updateCooldowns() {
    pieces.forEach(p => {
        if (p.cooldown > 0) {
            p.cooldown -= 50;
        }
    });
    setTimeout(updateCooldowns, 50);
}

function canvasEventClick() {
    canvas.addEventListener("click", (event) => {
        console.log("selectedPiece:", selectedPiece);
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
                console.log("showValidMoves:", selectedPiece);
        }
        else if (selectedPiece && selectedPiece.cooldown <= 0) {
            let moves = showValidMoves(selectedPiece);
            let positionExists = moves.some(move => move.x === x && move.y === y);
            if (!positionExists) {
                selectedPiece = null;
                console.log("mouvement invalid, on quitte l'event de clique sur une case cible");
                return; // mouvement invalid, on quitte l'event de clique sur une case cible
            }

            let targetPiece = pieces.find(p => p.x === x && p.y === y);
            if (targetPiece && targetPiece.color !== selectedPiece.color) {
                console.log(`Une pièce ennemi ${targetPiece.color} ${targetPiece.type} a été trouvée a cet emplacement !`);
                pieceDeath(targetPiece, x, y); // piece ennemie
            }
            else if (targetPiece) {
                console.log("piece allie, pas de mouvement");
                return; // piece allie, pas de mouvement
            }
            console.warn("MOVE SELECTED PIECE");
            // movement
            // Trouver l'index de la pièce déplacée dans pieces
            let pieceIndex = pieces.findIndex(p => p.x === selectedPiece.x && p.y === selectedPiece.y);
            if (pieceIndex === -1) {
                console.warn("ERROR find -1");
                return;
            }
            pieces[pieceIndex].oldx = pieces[pieceIndex].x;
            pieces[pieceIndex].oldy = pieces[pieceIndex].y;
            pieces[pieceIndex].x = x;
            pieces[pieceIndex].y = y;
            pieces[pieceIndex].cooldown = cooldownTime;
            // si un pion arrive sur derniere ligne alors on le change en dame
            if (pieces[pieceIndex].type === "pion") {
                if (playerColor === "white" && y === 0) {
                    pieces[pieceIndex].type = "reine";
                }
                if (playerColor === "black" && y === 9) {
                    pieces[pieceIndex].type = "reine";
                }
            }
            selectedPiece = null;
            sendPosition();
        }
    });
}

function setupGame() {
    canvasEventMouseMove();
    canvasEventClick();
    boardNeedsUpdate = true;
    drawBoard(); // first draw
    updateCooldowns();
    startGameTimer();

    setInterval(() => {
        if (gameStarted === false)
            return;
        updateBoard(); // Met à jour tout le plateau
        checkForWinner();
    }, 32); // ~ 30 fps
}

function updateBoard() {
    boardNeedsUpdate = true;
    requestAnimationFrame(drawBoard);
}

function showValidMoves(p) {
    if (p === null)
        return null;
    let valid_x_color = getCSSVariable("--valid-move-x-color");
    let valid_c_color = getCSSVariable("--valid-move-c-color");
    let moves = getValidMoves(p, pieces);

    // Efface l'overlay avant de dessiner les nouveaux cercles
    // ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    // DrawBoardCases();

    moves.forEach(move => {
        let size = cellSize;
        let x = move.x * cellSize + cellSize / 2;
        let y = move.y * cellSize + cellSize / 2;

        if (playerColor === "black") {
            x = (boardSize - 1 - move.x) * cellSize + cellSize / 2;
            y = (boardSize - 1 - move.y) * cellSize + cellSize / 2;
        }

        ctx.beginPath();
        if (isOpponent(move.x, move.y)) {
            ctx.fillStyle = valid_x_color;
        } else {
            ctx.fillStyle = valid_c_color;
        }
        // un cercle
        // ctx.arc(x, y, 10, 0, Math.PI * 2);
        // ctx.fill();
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
        ctx.closePath();
    });

    return moves;
}

function pieceDeath(targetPiece, x, y) {
    console.log(`La pièce ${targetPiece.color} ${targetPiece.type} a été tuée!`);
    pieces = pieces.filter(p => !(p.x === x && p.y === y));  // Retirer la pièce morte
}

function checkForWinner() {
    let whiteKingAlive = false;
    let blackKingAlive = false;

    // Parcours de toutes les pièces pour vérifier la présence des rois
    pieces.forEach(piece => {
        if (piece.type === "roi") {
            if (piece.color === "white") {
                whiteKingAlive = true;
            } else if (piece.color === "black") {
                blackKingAlive = true;
            }
        }
    });

    // Déterminer le vainqueur si un roi est mort
    if (!whiteKingAlive) {
        let winner = "Noir ⚫";
        console.log(`Le joueur ${winner} a gagné en tuant le roi blanc !`);
        alert(`Le joueur ${winner} a gagné !`);
    } else if (!blackKingAlive) {
        let winner = "Blanc ⚪";
        console.log(`Le joueur ${winner} a gagné en tuant le roi noir !`);
        alert(`Le joueur ${winner} a gagné !`);
    }

    if (!whiteKingAlive || !blackKingAlive) {
        stopGameTimer();
        gameStarted = false;  // Stopper le jeu
        // reload page or reset game
        setTimeout(() => {
            window.location.reload();  // Recharge la page et recommence le jeu
        }, 1000);
    }
}
