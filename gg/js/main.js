  import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js';

    // Configuration de la scène
    const scene = new THREE.Scene();

    // Configuration de la caméra
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = -10;

    // Configuration du renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Création d'un carré (plane geometry)
    const geometry = new THREE.PlaneGeometry(0.15, 0.15); // Un carré de 0.5 unités de côté
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Couleur noire
    const square = new THREE.Mesh(geometry, material);

    // Ajout du carré à la scène
    scene.add(square);

    // Fonction d'animation (dans ce cas, rien ne bouge)
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate(); // Démarrage de l'animation