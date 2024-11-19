/**
 * Fonction pour calculer les coordonnées d'un point sur un cercle
 * @param {number} cx - Coordonnée X du centre
 * @param {number} cy - Coordonnée Y du centre
 * @param {number} radius - Rayon du cercle
 * @param {number} angleDegrees - Angle en degrés
 * @returns {object} - Coordonnées {x, y}
 */
function polarToCartesian(cx, cy, radius, angleDegrees) {
    const angleRadians = (angleDegrees - 90) * (Math.PI / 180); // Décalage pour aligner le 0° en haut
    return {
        x: cx + radius * Math.cos(angleRadians),
        y: cy + radius * Math.sin(angleRadians),
    };
}


// Mise à jour de la ligne

function setLineAngles(_id, _angle) {
    // Paramètres
    const line = document.getElementById(_id);
    const centerX = 50; // Centre X
    const centerY = 50; // Centre Y
    const radius = 16;  // Rayon
    const angle = _angle;   // Angle en degrés
    const width = 1;
    const color = '#ffffff';
    // Calcul des coordonnées du point final
    const endPoint = polarToCartesian(centerX, centerY, radius, angle);
    line.setAttribute("x2", endPoint.x);
    line.setAttribute("y2", endPoint.y);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", width);
}

// setLineAngles("d1", 0);
// setLineAngles("d2", 30);
// setLineAngles("d3", 60);
// setLineAngles("d4", 90);
// setLineAngles("d5", 120);
// setLineAngles("d6", 150);
// setLineAngles("d7", 180);
// setLineAngles("d8", 210);
// setLineAngles("d9", 240);
// setLineAngles("d10", 270);
// setLineAngles("d11", 300);
// setLineAngles("d12", 330);

// setLineAngles("2d1", 15);
// setLineAngles("2d2", 45);
// setLineAngles("2d3", 75);
// setLineAngles("2d4", 105);
// setLineAngles("2d5", 135);
// setLineAngles("2d6", 165);
// setLineAngles("2d7", 195);
// setLineAngles("2d8", 225);
// setLineAngles("2d9", 255);
// setLineAngles("2d10", 285);
// setLineAngles("2d11", 315);
// setLineAngles("2d12", 345);

/*
                <!-- <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"> -->
                    <!-- Cercle de référence -->
                    <!-- <line id="d1" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="d2" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="d3" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="d4" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="d5" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="d6" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="d7" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="d8" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="d9" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="d10" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="d11" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="d12" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="2d1" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="2d2" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="2d3" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="2d4" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="2d5" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="2d6" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="2d7" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="2d8" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="2d9" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="2d10" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="2d11" x1="50" y1="50" x2="50" y2="5" /> -->
                    <!-- <line id="2d12" x1="50" y1="50" x2="50" y2="5" /> -->
                <!-- </svg> -->

*/