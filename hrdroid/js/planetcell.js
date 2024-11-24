import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js';

// Configuration de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
// Configuration de la caméra
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Création de la sphère avec une géométrie de UV Sphere
const radius = 1;
const widthSegments = 128;
const heightSegments = 64;

let sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

// Dupliquer les sommets pour chaque face
sphereGeometry = sphereGeometry.toNonIndexed();

// Ajout de couleurs par sommet (initialement gris)
const faceColors = new Float32Array(sphereGeometry.attributes.position.count * 3).fill(0.009);
sphereGeometry.setAttribute('color', new THREE.BufferAttribute(faceColors, 3));

// Ajout d'un attribut alpha initialisé à 1 (opaque)
// const alphas = new Float32Array(sphereGeometry.attributes.position.count).fill(1.0); // Alpha par sommet
const alphas = new Float32Array(sphereGeometry.attributes.position.count).fill(0); // Alpha par sommet
sphereGeometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

// Matériau avec support des couleurs par sommet
// const material = new THREE.MeshBasicMaterial({ vertexColors: true });
const material = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: `
        varying vec3 vColor;
        varying float vAlpha;
        attribute float alpha;
        
        void main() {
            vColor = color;
            vAlpha = alpha;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
            gl_FragColor = vec4(vColor, vAlpha);
        }
    `,
    transparent: true, // Activer la transparence
    vertexColors: true, // Activer les couleurs par sommet
});

const sphere = new THREE.Mesh(sphereGeometry, material);
scene.add(sphere);

// Ajout des arêtes pour le mode wireframe
// const wireframe = new THREE.WireframeGeometry(sphereGeometry);
// const edges = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 }));
// scene.add(edges);
const edges = null;

// Détection des clics sur la sphère
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Fonction pour obtenir la position du clic et colorer les faces
function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Mise à jour du raycaster pour correspondre à la position de la souris
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(sphere);
    if (intersects.length > 0) {
        const faceIndex = intersects[0].faceIndex; // Index de la face cliquée
        const adjacentFaceIndex = findAdjacentFace(faceIndex); // Trouver la face adjacente

        // Colorier la face cliquée et la face adjacente
        // fillFaceWithColor(faceIndex, 0, 0.1, 0.1); // Couleur violette
        fillFaceWithColor(faceIndex, 0.1, 0.9, 0.1, 0.3); // Couleur avec transparence (alpha 0.5)
        if (adjacentFaceIndex !== null) {
            // fillFaceWithColor(adjacentFaceIndex, 0.1, 0, 0.5); // Même couleur
            fillFaceWithColor(adjacentFaceIndex, 0.1, 0.9, 0.1, 0.3); // Couleur avec transparence (alpha 0.5)
        }
    }
}

function fillFaceWithColor(faceIndex, r, g, b, a) {
    const colorAttr = sphereGeometry.attributes.color;
    const alphaAttr = sphereGeometry.attributes.alpha;

    // Chaque face a 3 sommets (3 indices consécutifs)
    const i = faceIndex * 3;
    colorAttr.setXYZ(i, r, g, b);     // Premier sommet
    colorAttr.setXYZ(i + 1, r, g, b); // Deuxième sommet
    colorAttr.setXYZ(i + 2, r, g, b); // Troisième sommet

    alphaAttr.setX(i, a);     // Premier sommet
    alphaAttr.setX(i + 1, a); // Deuxième sommet
    alphaAttr.setX(i + 2, a); // Troisième sommet

    // Indiquer que les couleurs et l'alpha ont été modifiés
    colorAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;
}

// // Fonction pour remplir une face de couleur
// function fillFaceWithColor(faceIndex, r, g, b) {
//     const colorAttr = sphereGeometry.attributes.color;

//     // Chaque face a 3 sommets (3 indices consécutifs)
//     const i = faceIndex * 3;
//     colorAttr.setXYZ(i, r, g, b);     // Premier sommet
//     colorAttr.setXYZ(i + 1, r, g, b); // Deuxième sommet
//     colorAttr.setXYZ(i + 2, r, g, b); // Troisième sommet

//     // Indiquer que les couleurs ont été modifiées
//     colorAttr.needsUpdate = true;
// }

function findLongestEdge(vertices) {
    const edges = [
        Math.hypot(vertices[0][0] - vertices[1][0], vertices[0][1] - vertices[1][1], vertices[0][2] - vertices[1][2]),
        Math.hypot(vertices[1][0] - vertices[2][0], vertices[1][1] - vertices[2][1], vertices[1][2] - vertices[2][2]),
        Math.hypot(vertices[2][0] - vertices[0][0], vertices[2][1] - vertices[0][1], vertices[2][2] - vertices[0][2]),
    ];

    // Retourne la longueur de l'hypoténuse et ses sommets associés
    const maxEdgeIndex = edges.indexOf(Math.max(...edges));
    return {
        length: edges[maxEdgeIndex],
        vertices: [
            vertices[maxEdgeIndex],
            vertices[(maxEdgeIndex + 1) % 3], // Suivant dans le cycle
        ],
    };
}


function findAdjacentFace(faceIndex) {
    const positionAttr = sphereGeometry.attributes.position;

    // Obtenir les sommets de la face cliquée
    const faceA = faceIndex * 3;
    const verticesA = [
        [positionAttr.getX(faceA), positionAttr.getY(faceA), positionAttr.getZ(faceA)],
        [positionAttr.getX(faceA + 1), positionAttr.getY(faceA + 1), positionAttr.getZ(faceA + 1)],
        [positionAttr.getX(faceA + 2), positionAttr.getY(faceA + 2), positionAttr.getZ(faceA + 2)],
    ];

    // Trouver l'hypoténuse de la face cliquée
    const longestEdgeA = findLongestEdge(verticesA);

    // Parcourir toutes les autres faces
    const numFaces = positionAttr.count / 3;
    for (let i = 0; i < numFaces; i++) {
        if (i === faceIndex) continue; // Ignorer la face cliquée

        const faceB = i * 3;
        const verticesB = [
            [positionAttr.getX(faceB), positionAttr.getY(faceB), positionAttr.getZ(faceB)],
            [positionAttr.getX(faceB + 1), positionAttr.getY(faceB + 1), positionAttr.getZ(faceB + 1)],
            [positionAttr.getX(faceB + 2), positionAttr.getY(faceB + 2), positionAttr.getZ(faceB + 2)],
        ];

        // Vérifier si cette face partage la même hypoténuse
        const longestEdgeB = findLongestEdge(verticesB);
        if (
            (longestEdgeA.vertices[0][0] === longestEdgeB.vertices[0][0] &&
                longestEdgeA.vertices[0][1] === longestEdgeB.vertices[0][1] &&
                longestEdgeA.vertices[0][2] === longestEdgeB.vertices[0][2] &&
                longestEdgeA.vertices[1][0] === longestEdgeB.vertices[1][0] &&
                longestEdgeA.vertices[1][1] === longestEdgeB.vertices[1][1] &&
                longestEdgeA.vertices[1][2] === longestEdgeB.vertices[1][2]) ||
            (longestEdgeA.vertices[0][0] === longestEdgeB.vertices[1][0] &&
                longestEdgeA.vertices[0][1] === longestEdgeB.vertices[1][1] &&
                longestEdgeA.vertices[0][2] === longestEdgeB.vertices[1][2] &&
                longestEdgeA.vertices[1][0] === longestEdgeB.vertices[0][0] &&
                longestEdgeA.vertices[1][1] === longestEdgeB.vertices[0][1] &&
                longestEdgeA.vertices[1][2] === longestEdgeB.vertices[0][2])
        ) {
            console.log("Hypoténuse face cliquée:", longestEdgeA);
            console.log("Hypoténuse face testée:", longestEdgeB);
            return i;
        }
    }

    return null; // Aucun adjacent trouvé
}


window.addEventListener('click', onMouseClick, false);

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

// Charger la texture de la planète
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('../js/red.jpg');

// Création de la planète
const geometry = new THREE.SphereGeometry(radius - 0.05, 64, 64);
const mat2 = new THREE.MeshBasicMaterial({ map: texture });
const planet = new THREE.Mesh(geometry, mat2);
scene.add(planet);


// Mise à jour de la rotation avec les flèches
function updateRotation() {
    const rotationSpeed = 0.01;

    if (keyboard.up) {
        sphere.rotation.x -= rotationSpeed;
        planet.rotation.x -= rotationSpeed;
        if (edges)
            edges.rotation.x -= rotationSpeed;
    }
    if (keyboard.down) {
        sphere.rotation.x += rotationSpeed;
        planet.rotation.x += rotationSpeed;
        if (edges)
            edges.rotation.x += rotationSpeed;
    }
    if (keyboard.left) {
        sphere.rotation.y -= rotationSpeed;
        planet.rotation.y -= rotationSpeed;
        if (edges)
            edges.rotation.y -= rotationSpeed;
    }
    if (keyboard.right) {
        sphere.rotation.y += rotationSpeed;
        planet.rotation.y += rotationSpeed;
        if (edges)
            edges.rotation.y += rotationSpeed;
    }
}

// Création du cube rouge
const cubeSize = 1; // Taille du cube
const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Rouge
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// Positionner le cube au centre
cube.position.set(0, 0, 0);

// Ajouter le cube à la scène
scene.add(cube);


// Animation de la scène
function animate() {
    const rotX = 0.0001;
    const rotY = 0.0001;
    requestAnimationFrame(animate);
    sphere.rotation.y += rotY;
    planet.rotation.y += rotY;
    if (edges)
        edges.rotation.y += rotY;

    sphere.rotation.x += rotX;
    planet.rotation.x += rotX;
    if (edges)
        edges.rotation.x += rotX;
    updateRotation();

    // cube rotation
    cube.rotation.y += 0.001;
    cube.rotation.x += 0.001;
    cube.rotation.z += 0.001;
    renderer.render(scene, camera);
}
animate();
