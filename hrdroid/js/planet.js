import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js';

// Configuration de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Charger la texture de la planète
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('../js/red.jpg');

// Création de la planète
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshBasicMaterial({ map: texture });
const planet = new THREE.Mesh(geometry, material);
scene.add(planet);

// Fonction pour convertir des coordonnées géographiques en coordonnées sphériques
function geoToSphere(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180); // Latitude : de 90 à -90 (en radians)
    const theta = (lon + 180) * (Math.PI / 180); // Longitude : de -180 à 180 (en radians)

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
}

// Exemple de positions géographiques (latitude, longitude)
const locations = [
    { lat: 48.8566, lon: 2.3522 }, // Paris
    { lat: 34.0522, lon: -118.2437 }, // Los Angeles
    { lat: -33.8688, lon: 151.2093 }, // Sydney
    { lat: 51.5074, lon: -0.1278 }  // Londres
];

// Création des marqueurs
const markerGeometry = new THREE.SphereGeometry(0.01, 8, 8); // Petits sphères pour les marqueurs
const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Rouge

const markers = locations.map(location => {
    const position = geoToSphere(location.lat, location.lon, 1); // 1 = rayon de la planète
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.copy(position); // Placer le marqueur sur la sphère
    scene.add(marker);
    return marker;
});

// Interaction de la souris
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

function onMouseDown(event) {
    isDragging = true;
}

function onMouseMove(event) {
    if (!isDragging) return;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    planet.rotation.y -= deltaX * 0.005;
    planet.rotation.x += deltaY * 0.005;

    // Mettre à jour la position des marqueurs en fonction de la rotation
    markers.forEach(marker => {
        // marker.position.applyMatrix4(planet.matrixWorld); // Appliquer la matrice de la planète pour mettre à jour la position du marqueur
    });

    previousMousePosition = { x: event.clientX, y: event.clientY };
}

function onMouseUp() {
    isDragging = false;
}

function onMouseLeave() {
    isDragging = false;
}

window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener('mouseleave', onMouseLeave);

// Déplacement avec les touches du clavier
const keyboard = {
    up: false,
    down: false,
    left: false,
    right: false
};

function onKeyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            keyboard.up = true;
            break;
        case 'ArrowDown':
            keyboard.down = true;
            break;
        case 'ArrowLeft':
            keyboard.left = true;
            break;
        case 'ArrowRight':
            keyboard.right = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.key) {
        case 'ArrowUp':
            keyboard.up = false;
            break;
        case 'ArrowDown':
            keyboard.down = false;
            break;
        case 'ArrowLeft':
            keyboard.left = false;
            break;
        case 'ArrowRight':
            keyboard.right = false;
            break;
    }
}

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

// Mise à jour de la rotation avec les flèches
function updateRotation() {
    const rotationSpeed = 0.005;

    if (keyboard.up) {
        planet.rotation.x -= rotationSpeed;
    }
    if (keyboard.down) {
        planet.rotation.x += rotationSpeed;
    }
    if (keyboard.left) {
        planet.rotation.y -= rotationSpeed;
    }
    if (keyboard.right) {
        planet.rotation.y += rotationSpeed;
    }

    // Mettre à jour la position des marqueurs en fonction de la rotation
    markers.forEach(marker => {
        // marker.position.applyMatrix4(planet.matrixWorld); // Appliquer la matrice de la planète pour mettre à jour la position du marqueur
    });
}

// Animation
function animate() {

    requestAnimationFrame(animate);
    // Gérer la rotation avec les flèches
    updateRotation();

    renderer.render(scene, camera);
}

animate();
