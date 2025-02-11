function isOccupied(x, y) {
    // Vérifie si la case est occupée par une pièce
    return pieces.some(p => p.x === x && p.y === y);
}

function isAlly(x, y) {
    // Vérifie si la case est occupée par une pièce alliée
    return pieces.some(p => p.x === x && p.y === y && p.color === selectedPiece.color);
}

function isOpponent(x, y) {
    // Vérifie si la case est occupée par une pièce ennemie
    return pieces.some(p => p.x === x && p.y === y && p.color !== selectedPiece.color);
}

function getValidMoves(piece) {
    let moves = [];
    let directions = [];

    switch (piece.type) {
        case "pion":
            // Le pion se déplace d'une case en avant (en fonction de la couleur)
            let forward = piece.color === "white" ? -1 : 1;
            // Case en avant
            if (!isOccupied(piece.x, piece.y + forward)) {
                moves.push({ x: piece.x, y: piece.y + forward });
                // Si c'est le premier mouvement, on peut avancer de deux cases
                if ((piece.color === "white" && piece.y === 1) || (piece.color === "black" && piece.y === 10)) {
                    if (!isOccupied(piece.x, piece.y + 2 * forward)) {
                        moves.push({ x: piece.x, y: piece.y + 2 * forward });
                    }
                }
            }
            // Captures en diagonale
            if (piece.x > 0 && isOpponent(piece.x - 1, piece.y + forward)) {
                moves.push({ x: piece.x - 1, y: piece.y + forward });
            }
            if (piece.x < 11 && isOpponent(piece.x + 1, piece.y + forward)) {
                moves.push({ x: piece.x + 1, y: piece.y + forward });
            }
            break;

        case "tour":
            // La tour se déplace sur les lignes et colonnes
            directions = [
                { dx: 1, dy: 0 }, // Droite
                { dx: -1, dy: 0 }, // Gauche
                { dx: 0, dy: 1 }, // Bas
                { dx: 0, dy: -1 } // Haut
            ];
            directions.forEach(dir => {
                let x = piece.x;
                let y = piece.y;
                while (true) {
                    x += dir.dx;
                    y += dir.dy;
                    if (x < 0 || x >= 12 || y < 0 || y >= 12 || isAlly(x, y)) break;
                    moves.push({ x, y });
                    if (isOpponent(x, y)) break; // Si la case est occupée par un adversaire, la capture est possible
                }
            });
            break;

        case "cavalier":
            // Le cavalier se déplace en "L"
            let knightMoves = [
                { dx: 2, dy: 1 }, { dx: 2, dy: -1 },
                { dx: -2, dy: 1 }, { dx: -2, dy: -1 },
                { dx: 1, dy: 2 }, { dx: 1, dy: -2 },
                { dx: -1, dy: 2 }, { dx: -1, dy: -2 }
            ];
            knightMoves.forEach(move => {
                let newX = piece.x + move.dx;
                let newY = piece.y + move.dy;
                if (newX >= 0 && newX < 12 && newY >= 0 && newY < 12 && !isAlly(newX, newY)) {
                    moves.push({ x: newX, y: newY });
                }
            });
            break;

        case "fou":
            // Le fou se déplace en diagonale
            directions = [
                { dx: 1, dy: 1 }, // Bas-droit
                { dx: 1, dy: -1 }, // Haut-droit
                { dx: -1, dy: 1 }, // Bas-gauche
                { dx: -1, dy: -1 } // Haut-gauche
            ];
            directions.forEach(dir => {
                let x = piece.x;
                let y = piece.y;
                while (true) {
                    x += dir.dx;
                    y += dir.dy;
                    if (x < 0 || x >= 12 || y < 0 || y >= 12 || isAlly(x, y)) break;
                    moves.push({ x, y });
                    if (isOpponent(x, y)) break; // Si la case est occupée par un adversaire, la capture est possible
                }
            });
            break;

        case "roi":
            // Le roi peut se déplacer d'une case dans toutes les directions
            let kingMoves = [
                { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }, // Horizontale et verticale
                { dx: 1, dy: 1 }, { dx: 1, dy: -1 }, { dx: -1, dy: 1 }, { dx: -1, dy: -1 } // Diagonales
            ];
            kingMoves.forEach(move => {
                let newX = piece.x + move.dx;
                let newY = piece.y + move.dy;
                if (newX >= 0 && newX < 12 && newY >= 0 && newY < 12 && !isAlly(newX, newY)) {
                    moves.push({ x: newX, y: newY });
                }
            });
            break;

        case "reine":
            // La reine combine la tour et le fou
            directions = [
                { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }, // Tour (lignes et colonnes)
                { dx: 1, dy: 1 }, { dx: 1, dy: -1 }, { dx: -1, dy: 1 }, { dx: -1, dy: -1 } // Fou (diagonales)
            ];
            directions.forEach(dir => {
                let x = piece.x;
                let y = piece.y;
                while (true) {
                    x += dir.dx;
                    y += dir.dy;
                    if (x < 0 || x >= 12 || y < 0 || y >= 12 || isAlly(x, y)) break;
                    moves.push({ x, y });
                    if (isOpponent(x, y)) break; // Capture possible, mais arrêt du déplacement
                }
            });
            break;

        case "faucon":
            directions = [
                { dx: 2, dy: 0 }, { dx: -2, dy: 0 }, { dx: 0, dy: 2 }, { dx: 0, dy: -2 }, // Lignes et colonnes
                { dx: 2, dy: 2 }, { dx: 2, dy: -2 }, { dx: -2, dy: 2 }, { dx: -2, dy: -2 } // Diagonales
            ];
            directions.forEach(dir => {
                let newX = piece.x + dir.dx;
                let newY = piece.y + dir.dy;

                // Vérifier si la case de destination est valide
                if (newX >= 0 && newX < 12 && newY >= 0 && newY < 12 && !isAlly(newX, newY)) {
                    moves.push({ x: newX, y: newY });
                }
            });
            break;

        case "elephant":
            // Déplacements diagonaux avant (haut-gauche et haut-droite)
            let diagonalMoves = [
                { dx: -1, dy: 1 }, // Avant-gauche
                { dx: 1, dy: 1 }   // Avant-droite
            ];
            diagonalMoves.forEach(move => {
                let newX = piece.x + move.dx;
                let newY = piece.y + move.dy;
                if (isInBounds(newX, newY)) {
                    if (!isAlly(newX, newY)) {
                        moves.push({ x: newX, y: newY }); // Déplacement ou capture
                    }
                }
            });

            // Déplacement en avant (1 à 3 cases en ligne droite)
            let forwardPath = [];
            for (let i = 1; i <= 3; i++) {
                let newX = piece.x;
                let newY = piece.y + i;

                if (!isInBounds(newX, newY)) break; // Sort du plateau

                forwardPath.push({ x: newX, y: newY });

                // Capture toutes les pièces (ennemies et alliées)
                if (isOccupied(newX, newY)) {
                    continue; // Continue à avancer après avoir pris une pièce
                }
            }
            moves = moves.concat(forwardPath);
            break;
    }

    return moves;
}

function showValidMoves(piece) {
    let moves = getValidMoves(piece);

    moves.forEach(move => {
        let circle = document.createElement("div");
        circle.style.position = "absolute";
        circle.style.width = "15px";
        circle.style.height = "15px";
        circle.style.borderRadius = "50%";
        circle.style.left = (move.x * cellSize + cellSize / 2 - 7.5) + "px"; 
        circle.style.top = (move.y * cellSize + cellSize / 2 - 7.5) + "px";  
        circle.style.backgroundColor = isOpponent(move.x, move.y) ? "red" : "blue";  
        circle.classList.add("move-indicator");
        document.getElementById("chessboard").appendChild(circle);
    });
}

function clearMoveIndicators() {
    document.querySelectorAll(".move-indicator").forEach(el => el.remove());
}
