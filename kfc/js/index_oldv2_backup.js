import { piecesStartPosition, boardSize, cellSize, images, imageScaleFactor, cooldownTime } from './data.js';
import { getCSSVariable, generateShortPeerId } from './tools.js';
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
let selectedPiece_white = null;
let selectedPiece_black = null;
let gameStarted = false;
let pieces = piecesStartPosition;
let boardNeedsUpdate = true;

document.getElementById("code-pin").classList.add("disabled");
document.getElementById("btn-copycode").classList.add("disabled");
document.getElementById("ingame-bar").classList.add("disabled");
document.getElementById("msg-error").classList.add("disabled");
document.getElementById("msg-waiting").classList.add("disabled");

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
        document.getElementById("btn-copycode").innerText = "Copier le code";
        document.getElementById("btn-copycode").classList.remove("btn-lock-on");

    }
    else {
        document.getElementById("btn-copycode").innerText = "Code copié";
        document.getElementById("btn-copycode").classList.add("btn-lock-on");
    }
}


function hostGame() {
    peer = new Peer(generateShortPeerId());
    peer.on("open", id => {
        document.getElementById("code-pin").innerText = id;
        hostid = id;
        document.getElementById("code-pin").classList.remove("disabled");
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


function joinGame() {
    if (input.value.trim() === '') {
        return;
    }
    console.log("try join game with id :", input.value);
    let peerId = input.value;

    try {
        peer = new Peer(generateShortPeerId());
        peer.on("open", id => {
            console.log('id', id);
            conn = peer.connect(peerId);
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
        document.getElementById("msg-waiting").classList.add("disabled");
        startCountdown();
    });
    conn.on("close", () => console.log("Connexion fermée !"));
}

function startCountdown() {
    let countdownElement = document.getElementById("countdown");
    countdownElement.innerText = "";
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
    // console.log(p);
    // console.log(selectedPiece_white);
    if (playerColor === "white" && selectedPiece_white && samePos(p, selectedPiece_white)) {
        ctx.strokeStyle = getCSSVariable("--piece-outline");
        ctx.lineWidth = 3;
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        console.warn("OUIUOIUOIU WHITE");
    }
    if (playerColor === "black" && selectedPiece_black && samePos(p, selectedPiece_black)) {
        ctx.strokeStyle = getCSSVariable("--piece-outline");
        ctx.lineWidth = 3;
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        console.warn("OUIUOIUOIU BLACK");
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
    if (playerColor === "white") {
        showValidMoves(selectedPiece_white);
    }
    if (playerColor === "black") {
        showValidMoves(selectedPiece_black);
    }

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

    // console.log("white dr:", selectedPiece_white);
    // console.log("black dr:", selectedPiece_black);
    boardNeedsUpdate = false;
    requestAnimationFrame(drawBoard);
}

function setupGame() {
    canvas = document.getElementById("chessboard");
    canvas.width = boardSize * cellSize;
    canvas.height = boardSize * cellSize;
    ctx = canvas.getContext("2d");
    DrawBoardCases();

    function updateCooldowns() {
        pieces.forEach(p => {
            if (p.cooldown > 0) {
                p.cooldown -= 50;
            }
        });
        setTimeout(updateCooldowns, 50);
    }

    canvas.addEventListener("click", (event) => {
        console.log("white select:", selectedPiece_white);
        console.log("black select:", selectedPiece_black);
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
            if (playerColor === "white") {
                selectedPiece_white = clickedPiece;
                clearMoveIndicators();  // Efface les anciens indicateurs (cases possibles)
                showValidMoves(selectedPiece_white);
                console.log("player white select:", selectedPiece_white);
            }
            if (playerColor === "black") {
                selectedPiece_black = clickedPiece;
                clearMoveIndicators();  // Efface les anciens indicateurs (cases possibles)
                showValidMoves(selectedPiece_black);
                console.log("player black select:", selectedPiece_black);
            }
        }
        else {
            if (playerColor === "white" && selectedPiece_white && selectedPiece_white.cooldown <= 0) {
                let moves = showValidMoves(selectedPiece_white);
                let positionExists = moves.some(move => move.x === x && move.y === y);
                if (!positionExists) {
                    selectedPiece_white = null;
                    console.log("mouvement invalid, on quitte l'event de clique sur une case cible");
                    return; // mouvement invalid, on quitte l'event de clique sur une case cible
                }

                let targetPiece = pieces.find(p => p.x === x && p.y === y);
                if (targetPiece && targetPiece.color !== selectedPiece_white.color) {
                    console.log(`Une pièce ennemi ${targetPiece.color} ${targetPiece.type} a été trouvée a cet emplacement !`);
                    pieceDeath(targetPiece, x, y); // piece ennemie
                }
                else if (targetPiece) {
                    console.log("piece allie, pas de mouvement");
                    return; // piece allie, pas de mouvement
                }
                console.warn("MOVE WHITE");
                // movement
                // Trouver l'index de la pièce déplacée dans pieces
                let pieceIndex = pieces.findIndex(p => p.x === selectedPiece_white.x && p.y === selectedPiece_white.y);
                if (pieceIndex === -1) {
                    console.warn("ERROR find -1");
                    return;
                }
                pieces[pieceIndex].oldx = pieces[pieceIndex].x;
                pieces[pieceIndex].oldy = pieces[pieceIndex].y;
                pieces[pieceIndex].x = x;
                pieces[pieceIndex].y = y;
                pieces[pieceIndex].cooldown = cooldownTime;
                selectedPiece_white = null;
                sendPosition();
            }
            if (playerColor === "black" && selectedPiece_black && selectedPiece_black.cooldown <= 0) {
                let moves = showValidMoves(selectedPiece_black);
                let positionExists = moves.some(move => move.x === x && move.y === y);
                if (!positionExists) {
                    selectedPiece_black = null;
                    return; // mouvement invalid, on quitte l'event de clique sur une case cible
                }

                let targetPiece = pieces.find(p => p.x === x && p.y === y);
                if (targetPiece && targetPiece.color !== selectedPiece_black.color) {
                    console.log(`Une pièce ennemi ${targetPiece.color} ${targetPiece.type} a été trouvée a cet emplacement !`);
                    pieceDeath(targetPiece, x, y); // piece ennemie
                }
                else if (targetPiece) {
                    return; // piece allie, pas de mouvement
                }
                console.warn("MOVE BLACK");
                // movement Trouver l'index de la pièce déplacée dans pieces
                let pieceIndex = pieces.findIndex(p => p.x === selectedPiece_black.x && p.y === selectedPiece_black.y);
                if (pieceIndex === -1) {
                    console.warn("ERROR find -1");
                    return;
                }
                pieces[pieceIndex].oldx = pieces[pieceIndex].x;
                pieces[pieceIndex].oldy = pieces[pieceIndex].y;
                pieces[pieceIndex].x = x;
                pieces[pieceIndex].y = y;
                pieces[pieceIndex].cooldown = cooldownTime;
                selectedPiece_black = null;
                sendPosition();
            }
            // sendPosition();

        }
        // updateBoard();
    });

    drawBoard(); // first draw
    updateCooldowns();
    startGameTimer();
    let fps = 60; // 30 mises à jour par seconde
    let interval = 1000 / fps; // Temps entre chaque frame (en ms)

    setInterval(() => {
        if (gameStarted === false)
            return;
        updateBoard(); // Met à jour tout le plateau
        checkForWinner();
    }, interval);
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
