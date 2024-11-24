import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js';

// Configuration de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Paramètres de la sphère quadrillée
const radius = 3; // Rayon de la sphère
const latitudeDivisions = 20; // Divisions sur l'axe de latitude
const longitudeDivisions = 20; // Divisions sur l'axe de longitude
const gridSize = 1 / latitudeDivisions; // Taille d'une case dans la grille

// Fonction pour convertir des coordonnées géographiques (lat, lon) en coordonnées sphériques
function geoToSphere(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180); // Latitude : de 90 à -90 (en radians)
    const theta = (lon + 180) * (Math.PI / 180); // Longitude : de -180 à 180 (en radians)

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
}

// Fonction pour créer une case cliquable
function createGridCell(lat, lon) {
    const geometry = new THREE.SphereGeometry(0.05, 8, 8); // Un petit cercle pour la case
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }); // Vert, en mode wireframe
    const cell = new THREE.Mesh(geometry, material);
    const position = geoToSphere(lat, lon, radius); // Positionner la case sur la sphère
    cell.position.copy(position);

    // Événement de clic sur la case
    cell.userData = { lat, lon }; // Ajouter des données pour identifier la cellule

    cell.callback = function() {
        alert(`Case cliquée: Latitude ${lat}, Longitude ${lon}`);
    };

    scene.add(cell);

    return cell;
}

// Création de la sphère quadrillée avec des cases
const gridCells = [];
for (let lat = -90; lat < 90; lat += gridSize * 180) { // Parfaitement espacé selon la latitude
    for (let lon = -180; lon < 180; lon += gridSize * 360) { // Parfaitement espacé selon la longitude
        const cell = createGridCell(lat, lon);
        gridCells.push(cell);
    }
}

// Fonction pour tester les clics
function onMouseClick(event) {
    // Récupérer la position du clic dans le plan 2D
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Créer un rayon à partir de la caméra
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Trouver les objets que le rayon intersecte
    const intersects = raycaster.intersectObjects(gridCells);

    // Si un objet est intersecté, exécuter son callback
    if (intersects.length > 0) {
        const clickedCell = intersects[0].object;
        clickedCell.callback();
    }
}

window.addEventListener('click', onMouseClick);

// Animation
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
