import { URL } from "./constants.js";
import { setBtnLeftPlace, setBtnRightPlace, setPlaceName } from "./autoDiv.js";
import { getTartipodByIdDB, getTartipodCountDB, updateTartipodDB } from "./database.js";
import { computeTartipodFormuleCost, computeTartipodFormuleNeed } from "./tartinoide-data.js";
import { setupAudio, setVolume, playSounds, pauseSounds, initPageSoundsArrayVolumeRatio } from "./volume.js";
import { cnt_nb_fromage, cnt_nb_pain, decFromage, decPain, updateTartitopdsNeeds } from "./itemsManager.js";
import { bigIntToScientificNotation, formatNSP } from "./lib.js";
//
window.page = "park";
setPlaceName(window.page);
setBtnLeftPlace(URL.CUISINE);
setBtnRightPlace(null);
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let tabRessources = document.getElementById("tab");
// tabRessources.classList.add('disabled');

// -------- SOUND DESIGN -----------//
const buttonUp = setupAudio('sounds/button-up.mp3', 1, false);
const lvlup = setupAudio('sounds/lvlup.mp3', 1, false);
const button = setupAudio('sounds/old-button.mp3', 1, false);
const calm = setupAudio('sounds/st-james-park.mp3', 0.5, true);
const story = setupAudio('sounds/alienloop.mp3', 0.4, true);
const mamieSounds = [
    'sounds/mamie1.mp3',
    'sounds/mamie1.mp3',
    'sounds/mamie2.mp3',
    'sounds/mamie2.mp3',
];
const mamies = mamieSounds.map(src => setupAudio(src, 0.2, true));
initPageSoundsArrayVolumeRatio();
//
function soundParkON() {
    story.play();
    let volumeRatio = volumeSlider.value / 100;
    setVolume(mamies, 0.2 * volumeRatio);
    playSounds(mamies);
    calm.currentTime = Math.random() * (calm.duration || 0);
    calm.pause();
}

function soundParkOFF() {
    story.pause();
    calm.play();
}

setTimeout(() => {
    calm.play();
}, 500);

function autoJumpIfPlaying() {
    if (mamies[0].paused)
        return;
    mamies[0].currentTime = 0 + Math.random();
    mamies[1].currentTime = 2 + Math.random() * 2;
    mamies[2].currentTime = 0 + Math.random();
    mamies[3].currentTime = 5 + Math.random() * 2;
}
setInterval(autoJumpIfPlaying, 10000);

function ifParkCloseReduceVoices() {
    if (mamies[0].paused || isParkClosed === false)
        return;
    if (mamies[0].volume <= 0.03) {
        pauseSounds(mamies);
        return;
    }
    mamies[0].volume -= 0.025;
    mamies[1].volume -= 0.025;
    mamies[2].volume -= 0.025;
    mamies[3].volume -= 0.025;
}
setInterval(ifParkCloseReduceVoices, 1000);
////////////////////////////

const points = [
    { x: 150, y: 560 },   // Coin supérieur gauche
    { x: 1900, y: 560 },  // Coin supérieur droit
    { x: 1900, y: 940 }, // Coin inférieur droit
    { x: 150, y: 940 }   // Coin inférieur gauche
];

const originPoint = [
    { x: 10, y: 550 },   // Coin supérieur gauche
    { x: 110, y: 550 },  // Coin supérieur droit
    { x: 110, y: 900 }, // Coin inférieur droit
    { x: 10, y: 900 }   // Coin inférieur gauche
];

const orderPoints = [
    { x: 300, y: 600 },   // Coin supérieur gauche
    { x: 1550, y: 600 },  // Coin supérieur droit
    { x: 1550, y: 900 }, // Coin inférieur droit
    { x: 300, y: 900 }   // Coin inférieur gauche
];

const domainPath = [
    { r: 0, x: 1250, y: 250 }, // depart du parc
    { r: 0, x: 1290, y: 400 },
    { r: 0, x: 1620, y: 620 }, // porte
    { r: 0, x: 1620, y: 690 }, // quitte la route
    { r: 0, x: 1450, y: 880 },
    { r: 0, x: 750, y: 880 }, // mid point au milieu des vignes
    { r: 0, x: 500, y: 720 },
    { r: 0, x: 30, y: 630 },
    { r: 0, x: 30, y: 570 }, // left point
    { r: 0, x: 150, y: 440 },
    { r: 0, x: 400, y: 340 },
    { r: 0, x: 870, y: 270 },
    { r: 0, x: 900, y: 210 }, // arrive en hauteur
    { r: 0, x: 1250, y: 250 }, // retour au depart du parc
];

const framerate = 30; // Framerate souhaité en FPS
const interval = 1000 / framerate; // Calcul du délai entre les frames (en ms)
let lastTime = 0;
let inOrder = false; // Booléen à activer pour mettre les items en ordre
let isParkClosed = true;
let isLoadingON = false;
let countAllIndex = 0;

const itemSize = 60;
const images = [];
//
let imageCount = 0;
getTartipodCountDB().then((count) => {
    console.warn("NB " + count);
    imageCount = count; // Mise à jour du nombre d'images (Tartipods)
    //
    for (let i = 0; i < imageCount; i++) {
        const img = new Image();
        img.src = 'img/bonhomme-tartine.png';
        images.push({
            img,
            id: i,
            x: originPoint[0].x + Math.random() * (originPoint[1].x - originPoint[0].x - itemSize),
            y: originPoint[0].y + Math.random() * (originPoint[3].y - originPoint[0].y - itemSize),
            targetX: points[0].x + Math.random() * (points[1].x - points[0].x - itemSize),
            targetY: points[0].y + Math.random() * (points[3].y - points[0].y - itemSize),
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4,
            size: itemSize,
            angle: 0,
            angleSpeed: (Math.random() - 0.5) * 0.1,
            isActive: true,
            isTargeting: true,
            isTargetingToQuit: false,
            isQuitting: false,
            isSelected: false,
        });
    }

    //

    function getNextZeroRIndex(path, currentIndex) {
        for (let i = currentIndex + 1; i < path.length; i++) {
            if (path[i].r === 0) {
                return i;
            }
        }
        return -1; // Si aucun élément avec r = 0 n'est trouvé
    }
    // const nextIndex = getNextZeroRIndex(domainPath, 2);

    const parkFG = new Image();
    parkFG.src = 'img/places/parkFG.png';

    const park_bg = new Image();
    park_bg.src = 'img/places/park.jpg';
    let park_bg_scaleFactor = 0.34;
    let park_drawWidth, park_drawHeight;
    let park_offsetX = 0;
    let park_offsetY = -200;

    const domain_over = new Image();
    domain_over.src = 'img/places/domainOVER.png';

    const domain_bg = new Image();
    domain_bg.src = 'img/places/domain.jpg';
    let domain_bg_scaleFactor = 0.6;
    let domain_drawWidth, domain_drawHeight;
    let domain_offsetX = 0;
    let domain_offsetY = -100;

    function drawPath(pnts, color_str, width) {
        ctx.beginPath();
        ctx.moveTo(pnts[0].x, pnts[0].y);

        for (let i = 1; i < pnts.length; i++) {
            ctx.lineTo(pnts[i].x, pnts[i].y);
        }
        ctx.closePath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color_str;
        ctx.stroke();
    }

    ///


    // Calcul automatique du nombre de colonnes et lignes en fonction du nombre d'items (FOR ORDER ONLY)
    const availableWidth = orderPoints[1].x - orderPoints[0].x;
    const availableHeight = orderPoints[3].y - orderPoints[0].y;
    const maxItemsPerRow = Math.floor(availableWidth / itemSize);
    const maxItemsPerColumn = Math.floor(availableHeight / itemSize);
    const rows = Math.ceil(images.length / maxItemsPerRow);
    const columns = Math.min(maxItemsPerRow, images.length);
    const itemSpacing = (availableWidth / columns) - itemSize;

    function animate(timestamp) {
        if (timestamp - lastTime >= interval) {
            // RESET
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // BG
            if (isDomaineTour) {
                ctx.drawImage(domain_bg, domain_offsetX, domain_offsetY, domain_drawWidth, domain_drawHeight);
            }
            else {
                ctx.drawImage(park_bg, park_offsetX, park_offsetY, park_drawWidth, park_drawHeight);
            }
            //
            if (isLoadingON === false)
                requestAnimationFrame(animate);

            images.forEach((item, index) => {
                if (isParkClosed) {
                    if (item.isQuitting) {
                        item.isQuitting = false;
                        item.targetX = originPoint[0].x + Math.random() * (originPoint[1].x - originPoint[0].x - itemSize),
                            item.targetY = originPoint[0].y + Math.random() * (originPoint[3].y - originPoint[0].y - itemSize),
                            item.isTargetingToQuit = true;
                        // console.log("ISQUITTING");
                    }
                    if (item.isTargetingToQuit) {
                        // console.log("IS TARGET TO QUIT");
                        const targetX = item.targetX;
                        const targetY = item.targetY;
                        const dx = targetX - item.x;
                        const dy = targetY - item.y;
                        item.x += dx * 0.01;
                        item.y += dy * 0.01;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 2) {
                            item.isTargetingToQuit = false;
                            item.x = originPoint[0].x + Math.random() * (originPoint[1].x - originPoint[0].x - itemSize);
                            item.y = originPoint[0].y + Math.random() * (originPoint[3].y - originPoint[0].y - itemSize);
                            item.targetX = points[0].x + Math.random() * (points[1].x - points[0].x - itemSize);
                            item.targetY = points[0].y + Math.random() * (points[3].y - points[0].y - itemSize);
                            item.dx = (Math.random() - 0.5) * 4;
                            item.dy = (Math.random() - 0.5) * 4;
                            item.angleSpeed = (Math.random() - 0.5) * 0.1;
                            item.angle = 0;
                            item.isActive = true;
                            item.isTargeting = true;
                            item.isSelected = false;
                        }
                    }
                }
                else if (isDomaineTour) {
                    let nextTargetIndex = getNextZeroRIndex(item.domainPath, item.domainPathIndex);
                    if (nextTargetIndex !== -1) {
                        const targetX = item.domainPath[nextTargetIndex].x;
                        const targetY = item.domainPath[nextTargetIndex].y;
                        const dx = targetX - item.x;
                        const dy = targetY - item.y;

                        // Calcul de la distance au prochain point
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        // Vitesse constante (ajuste cette valeur)
                        const speed = item.domainWalkSpeed;

                        if (distance > speed) {
                            // Déplacement avec normalisation pour garder une vitesse fixe
                            item.x += (dx / distance) * speed;
                            item.y += (dy / distance) * speed;
                        } else {
                            // Atteint le point cible, on le "snap" et passe au suivant
                            item.x = targetX;
                            item.y = targetY;
                            item.domainPath[nextTargetIndex].r = 1; // Marque le point comme atteint
                            item.domainPathIndex++;
                            countAllIndex++;
                            if (countAllIndex === (domainPath.length - 1) * imageCount) {
                                countAllIndex = 0;
                                closeDomainTour();
                            }
                        }
                    }
                }
                else if (inOrder) {
                    const targetX = orderPoints[0].x + (index % columns) * (item.size + itemSpacing); // Position X calculée
                    const targetY = orderPoints[0].y + Math.floor(index / columns) * (item.size + itemSpacing); // Position Y calculée
                    // Limiter la position pour qu'elle ne dépasse pas les bords du rectangle
                    const maxX = orderPoints[1].x - item.size; // Coordonnée X maximale (bord droit du rectangle)
                    const maxY = orderPoints[3].y - item.size; // Coordonnée Y maximale (bord bas du rectangle)
                    // Calcul des déplacements en respectant les limites
                    const dx = Math.min(Math.max(targetX, orderPoints[0].x), maxX) - item.x;
                    const dy = Math.min(Math.max(targetY, orderPoints[0].y), maxY) - item.y;
                    // Application d'une vitesse de déplacement douce (réduite pour éviter trop de rapidité)
                    item.x += dx * 0.02; // Réduit la vitesse
                    item.y += dy * 0.02; // Réduit la vitesse
                }
                else if (item.isTargeting) {
                    const targetX = item.targetX;
                    const targetY = item.targetY;
                    const dx = targetX - item.x;
                    const dy = targetY - item.y;
                    item.x += dx * 0.008;
                    item.y += dy * 0.008;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 2) {
                        item.isTargeting = false;
                        item.isActive = true;
                    }
                }
                else {
                    // Si le mode "en ordre" est désactivé, les items continuent leur mouvement habituel
                    item.x += item.dx;
                    item.y += item.dy;
                }

                item.angle += item.angleSpeed;

                if (isDomaineTour === false) {
                    // Rebond sur les bords du rectangle
                    if (item.x <= points[0].x || item.x + item.size >= points[1].x) item.dx *= -1;
                    if (item.y <= points[0].y || item.y + item.size >= points[3].y) item.dy *= -1;
                }

                // Vitesse et amplitude des sauts
                const bounceSpeed = 8; // Vitesse du sautillement
                const bounceAmplitude = 20; // Hauteur des sauts
                const bounce = Math.abs(Math.sin(item.angle * bounceSpeed)) * bounceAmplitude;

                // Effet de rotation oscillante (entre -10° et +10°)
                const rotationSpeed = 8; // Plus grand = rotation plus rapide
                const maxRotation = 15; // Angle max en degrés
                const angle = Math.sin(item.angle * rotationSpeed) * maxRotation;

                // Rotation et affichage de l'image
                ctx.save(); // Sauvegarde l'état actuel du contexte
                ctx.translate(item.x + item.size / 2, item.y + item.size / 2 - bounce); // Centre de l'image pour la rotation
                ctx.rotate((angle * Math.PI) / 180); // Conversion degrés -> radians
                ctx.drawImage(item.img, item.size / -2, item.size / -2, item.size, item.size); // Dessin avec origine au centre
                ctx.restore(); // Restaure l'état initial (évite que toutes les rotations s'empilent)

                if (item.isSelected) {
                    ctx.strokeStyle = '#ddb42cff';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(item.x + item.size / 2, item.y + item.size / 2 - 10, item.size * 0.7, 0, Math.PI * 2); // (x, y, rayon, angleDépart, angleFin)
                    ctx.stroke();
                }
            });

            if (isDomaineTour === false)
                ctx.drawImage(parkFG, park_offsetX, park_offsetY, park_drawWidth, park_drawHeight);
            else
                ctx.drawImage(domain_over, domain_offsetX, domain_offsetY, domain_drawWidth, domain_drawHeight);

            // DEBUG
            // drawPath(points, 'green', 2);
            // drawPath(originPoint, 'red', 2);
            // drawPath(orderPoints, 'magenta', 2);
            // drawPath([{ x: 1200, y: 200 },{ x: 1300, y: 200 },{ x: 1300, y: 300 },{ x: 1200, y: 300 }], 'blue', 2);

            // tartinoides path line
            // drawPath(domainPath, 'red', 2);

            lastTime = timestamp;
        }
        requestAnimationFrame(animate);
    }

    function waitForBG() {
        park_bg.onload = function () {
            park_drawWidth = park_bg.width * park_bg_scaleFactor;
            park_drawHeight = park_bg.height * park_bg_scaleFactor;

            // domain_bg.onload = function () {
            domain_drawWidth = domain_bg.width * domain_bg_scaleFactor;
            domain_drawHeight = domain_bg.height * domain_bg_scaleFactor;
            animate();
            // };
        };
    }

    // MAIN LINE START
    waitForBG();


    /////////////////// PANNEAU DE COMMANDE
    let btnPark = document.getElementById("btn-park");
    let isParkOpen = false;
    btnPark.innerHTML = "OUVRIR LE PARC";

    let btnActivity = document.getElementById("btn-activity");
    let isActivityOrder = false;
    btnActivity.innerHTML = "EN ORDRE !";
    btnActivity.classList.add('disabled');

    let btnDomaineTour = document.getElementById("btn-domaine-tour");
    let isDomaineTour = false;
    btnDomaineTour.innerHTML = "FAIRE LE TOUR DU DOMAINE";
    btnDomaineTour.classList.add('disabled');

    let commandPanel = document.getElementById("commandPanel");
    let tartineProfilPanel = document.getElementById("infoPanel");

    btnPark.addEventListener("click", function () {
        button.play();
        if (isParkOpen == true) {
            isParkOpen = false;
            btnPark.innerHTML = "OUVRIR LE PARC";
            btnActivity.classList.add('disabled');
            isParkClosed = true;
            tartineProfilPanel.classList.add("disabled");
            images.forEach((i) => (i.isSelected = false));
            soundParkOFF();
            isDomaineTour = false;
            btnDomaineTour.classList.add('disabled');
            tabRessources.classList.add('disabled');
        }
        else {
            isParkOpen = true;
            btnPark.innerHTML = "FERMER LE PARC";
            btnActivity.classList.remove('disabled');
            isLoadingON = true;
            isParkClosed = false;
            soundParkON();
            images.forEach((item, index) => {
                item.isQuitting = true;
                // item.x = originPoint[0].x + Math.random() * (originPoint[1].x - originPoint[0].x - itemSize);
                // item.y = originPoint[0].y + Math.random() * (originPoint[3].y - originPoint[0].y - itemSize);
                item.targetX = points[0].x + Math.random() * (points[1].x - points[0].x - itemSize);
                item.targetY = points[0].y + Math.random() * (points[3].y - points[0].y - itemSize);
                item.dx = (Math.random() - 0.5) * 4;
                item.dy = (Math.random() - 0.5) * 4;
                item.angle = 0;
                item.angleSpeed = (Math.random() - 0.5) * 0.1;
                item.isSelected = false;
            });
            isDomaineTour = false;
            btnDomaineTour.classList.remove('disabled');
            tabRessources.classList.remove('disabled');
        }
    });

    btnActivity.addEventListener("click", function () {
        button.play();
        if (isActivityOrder == true) {
            isActivityOrder = false;
            btnActivity.innerHTML = "EN ORDRE !";
            inOrder = false;
        }
        else {
            isActivityOrder = true;
            btnActivity.innerHTML = "AMUSEZ VOUS !";
            inOrder = true;
        }
    });

    btnDomaineTour.addEventListener("click", function () {
        button.play();
        console.warn("TOUR DU DOMAINE DEPART");
        document.getElementById("place-name").textContent = "le domaine";
        document.getElementById("btn-place-left").classList.add("disabled");
        document.getElementById("btn-place-right").classList.add("disabled");
        isDomaineTour = true;
        window.page = "domaine";
        commandPanel.classList.add('disabled');
        tartineProfilPanel.classList.add('disabled');
        tabRessources.classList.add('disabled');
        images.forEach(i => {
            i.isSelected = false;
            i.size = itemSize / 3;
            i.x = 1250;
            i.y = 250;
            i.domainPath = JSON.parse(JSON.stringify(domainPath)); // DEEP COPY
            i.domainPathIndex = 0;
            i.domainWalkSpeed = Math.random() * 0.3 + 1.5;
        });
        story.pause();
        story.volume = story.volume / 2;
        setVolume(mamies, mamies[0].volume / 3);
        calm.play();
        setTimeout(function () {
            if (isDomaineTour)
                closeDomainTour();
        }, 120000);
    });

    function closeDomainTour() {
        console.warn("TOUR DU DOMAINE TERMINE");
        document.getElementById("place-name").textContent = "le parc";
        document.getElementById("btn-place-left").classList.remove("disabled");
        document.getElementById("btn-place-right").classList.remove("disabled");
        isDomaineTour = false;
        window.page = "park";
        commandPanel.classList.remove('disabled');
        tabRessources.classList.remove('disabled');
        story.volume = story.volume * 2;
        setVolume(mamies, mamies[0].volume * 3);
        story.play();
        calm.pause();
        images.forEach(i => {
            i.size = itemSize;
            i.x = points[0].x + Math.random() * (points[1].x - points[0].x - itemSize);
            i.y = points[0].y + Math.random() * (points[3].y - points[0].y - itemSize);
        });
    }

    //////

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const hitboxPadding = 5;
        let found = false;
        //
        if (isDomaineTour)
            return;
        //
        images.forEach((item) => {
            if (
                mouseX >= item.x - hitboxPadding &&
                mouseX <= item.x + item.size + hitboxPadding &&
                mouseY >= item.y - hitboxPadding &&
                mouseY <= item.y + item.size + hitboxPadding
            ) {
                if (isParkClosed)
                    return;
                // console.log('Item sélectionné:', item);
                images.forEach((i) => (i.isSelected = false));
                infoPanel.classList.add("disabled");
                item.isSelected = !item.isSelected;
                selectedItem = item;
                found = true;
                infoPanel.classList.remove("disabled");
                updateTartipodProfilPanel();
                button.play();
            }
        });
        if (found === false || isParkClosed) {
            images.forEach((i) => (i.isSelected = false));
            infoPanel.classList.add("disabled");
        }
    });

    ///// TARTIPOD PROFIL PANEL
    function updateXPBar(xp) {
        const xpFill = document.getElementById("xp-fill");
        xpFill.style.transition = "width 0.1s ease";
        if (xp === 0) {
            xpFill.style.width = "100%";
            setTimeout(() => {
                const min = 10;
                const max = 30;
                const randomPercentage = Math.floor(Math.random() * (max - min + 1)) + min;
                xpFill.style.width = `${randomPercentage}%`;
                xpFill.style.transition = "none";
                // xpFill.style.width = "20%";
            }, 180);
        } else if (xp === 1) {
            const min = 40;
            const max = 60;
            const randomPercentage = Math.floor(Math.random() * (max - min + 1)) + min;
            xpFill.style.width = `${randomPercentage}%`;
            // xpFill.style.width = "50%";
        } else if (xp === 2) {
            const min = 70;
            const max = 90;
            const randomPercentage = Math.floor(Math.random() * (max - min + 1)) + min;
            xpFill.style.width = `${randomPercentage}%`;
            // xpFill.style.width = "80%";
        }
    }
    const closeButton = document.getElementById("closePanel");
    closeButton.addEventListener("click", function () {
        button.play();
        infoPanel.classList.add("disabled");
        selectedItem = null;
        images.forEach((i) => (i.isSelected = false));
    });

    function leftProfil() {
        if (selectedItem === null)
            return;
        button.play();
        images.forEach((i) => (i.isSelected = false));
        if (selectedItem.id === 0)
            selectedItem = images[images.length - 1];
        else
            selectedItem = images[selectedItem.id - 1];
        selectedItem.isSelected = true;
        images[selectedItem.id].isSelected = true;
        updateTartipodProfilPanel();
    }

    function rightProfil() {
        if (selectedItem === null)
            return;
        button.play();
        images.forEach((i) => (i.isSelected = false));
        if (selectedItem.id === images.length - 1)
            selectedItem = images[0];
        else
            selectedItem = images[selectedItem.id + 1];
        selectedItem.isSelected = true;
        images[selectedItem.id].isSelected = true;
        updateTartipodProfilPanel();
    }

    async function upgradeTartipodAction() {
        if (selectedItem) {
            const tartipod = await getTartipodByIdDB(selectedItem.id);
            const current_cost = BigInt(computeTartipodFormuleCost(tartipod));
            if (tartipod.favorite === "pain") {
                if (current_cost > cnt_nb_pain) {
                    console.warn("not enough pain");
                    return;
                }
                else {
                    decPain(current_cost);
                }
            }
            else if (tartipod.favorite === "fromage") {
                if (current_cost > cnt_nb_fromage) {
                    console.warn("not enough fromage");
                    return;
                }
                else {
                    decFromage(current_cost);
                }
            }
            //
            buttonUp.play();
            // tartipod.xp += Math.floor(Math.random() * 3) + 1;;
            tartipod.xp += 1;
            const oldlvl = tartipod.lvl;
            tartipod.lvl += 1; // TMP c plus satisfaisant non ?
            // tartipod.lvl = 1 + Math.floor(tartipod.xp / 3);
            if (oldlvl !== tartipod.lvl) {
                // lvlup.play();
            }
            if (Math.floor(tartipod.xp % 3) === 0) {
                tartipod.lvl += Math.floor(Math.random() * 5) + 1;
                lvlup.play();
            }
            updateXPBar(Math.floor(tartipod.xp % 3));
            setTimeout(() => {
                document.getElementById("tartipod-lvl").textContent = Math.floor(tartipod.lvl);
            }, 180);
            const need = BigInt(computeTartipodFormuleNeed(tartipod));
            let scientist = formatNSP(need.toString());
            if (need.toString().length > 12)
                scientist = bigIntToScientificNotation(need);

            const cost = computeTartipodFormuleCost(tartipod);
            document.getElementById("tartipod-need").textContent = scientist + " " + tartipod.favorite + "s / h";
            document.getElementById("upgrade-cost").innerHTML = cost + " " + tartipod.favorite + "s";
            updateTartitopdsNeeds();
            updateTartipodCostUpgrade();
            await updateTartipodDB(tartipod);
        }
    }

    const leftProfilButton = document.getElementById("btn-left-select");
    leftProfilButton.addEventListener("click", function () {
        leftProfil();
    });

    const rightProfilButton = document.getElementById("btn-right-select");
    rightProfilButton.addEventListener("click", function () {
        rightProfil();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            leftProfil();
        }
        else if (event.key === "ArrowRight") {
            event.preventDefault();
            rightProfil();
        }
        else if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
            event.preventDefault();
            upgradeTartipodAction();
        }
    });


    const btnUpgrade = document.getElementById("upgrade-btn");
    btnUpgrade.addEventListener("click", async function () {
        await upgradeTartipodAction();
    });

    const costTable = document.getElementById("cost-table");
    btnUpgrade.addEventListener('mouseenter', function () {
        updateTartipodCostUpgrade();
    });
    btnUpgrade.addEventListener('mouseleave', () => {
        costTable.classList.add("disabled");
    });

    async function costAvailabiltyIndicator() {
        if (selectedItem) {
            const tartipod = await getTartipodByIdDB(selectedItem.id);
            const current_cost = BigInt(computeTartipodFormuleCost(tartipod));
            let scientist = formatNSP(current_cost.toString());
            if (current_cost.toString().length > 12)
                scientist = bigIntToScientificNotation(current_cost);
            if (tartipod.favorite === "pain") {
                if (current_cost > cnt_nb_pain) {
                    btnUpgrade.classList.add('btn-upgrade-too-expensive');
                    costTable.classList.add('cost-table-too-expensive');
                    document.getElementById("upgrade-cost").innerHTML = scientist + " " + tartipod.favorite + "s";
                    let content = document.getElementById("upgrade-cost").innerHTML;
                    document.getElementById("upgrade-cost").innerHTML = content + '\
                    <br>stock de pain insuffisant';
                }
                else {
                    btnUpgrade.classList.remove('btn-upgrade-too-expensive');
                    costTable.classList.remove('cost-table-too-expensive');
                    document.getElementById("upgrade-cost").innerHTML = scientist + " " + tartipod.favorite + "s";
                }
            }
            else if (tartipod.favorite === "fromage") {
                if (current_cost > cnt_nb_fromage) {
                    btnUpgrade.classList.add('btn-upgrade-too-expensive');
                    costTable.classList.add('cost-table-too-expensive');
                    document.getElementById("upgrade-cost").innerHTML = scientist + " " + tartipod.favorite + "s";
                    let content = document.getElementById("upgrade-cost").innerHTML;
                    document.getElementById("upgrade-cost").innerHTML = content + '\
                    <br>stock de fromage insuffisant';
                }
                else {
                    btnUpgrade.classList.remove('btn-upgrade-too-expensive');
                    costTable.classList.remove('cost-table-too-expensive');
                    document.getElementById("upgrade-cost").innerHTML = scientist + " " + tartipod.favorite + "s";
                }
            }
        }
    }

    async function updateTartipodCostUpgrade() {
        if (selectedItem) {
            const tartipod = await getTartipodByIdDB(selectedItem.id);
            const cost = computeTartipodFormuleCost(tartipod);
            document.getElementById("upgrade-cost").innerHTML = cost + " " + tartipod.favorite + "s";
            costTable.classList.remove("disabled");
            costAvailabiltyIndicator();
            //
        }
    }

    //
    let selectedItem = null;
    const infoPanel = document.getElementById("infoPanel");
    //
    async function updateTartipodProfilPanel() {
        infoPanel.classList.add("disabled");
        if (selectedItem === null)
            return;
        costAvailabiltyIndicator();
        const tartipod = await getTartipodByIdDB(selectedItem.id);
        // console.log(tartipod);
        document.getElementById("tartipod-name").textContent = tartipod.name.toUpperCase();
        if (tartipod.age > 1)
            document.getElementById("tartipod-age").textContent = tartipod.age + " jours";
        else
            document.getElementById("tartipod-age").textContent = tartipod.age + " jour";
        document.getElementById("tartipod-status").textContent = tartipod.status.toLowerCase();
        document.getElementById("tartipod-think").textContent = tartipod.think.toLowerCase();
        document.getElementById("tartipod-favorite").textContent = tartipod.favorite.toLowerCase();
        const need = BigInt(computeTartipodFormuleNeed(tartipod));
        let scientist = formatNSP(need.toString());
        if (need.toString().length > 12)
            scientist = bigIntToScientificNotation(need);
        document.getElementById("tartipod-need").textContent = scientist + " " + tartipod.favorite + "s / h";
        document.getElementById("tartipod-lvl").textContent = Math.floor(tartipod.lvl);
        // document.getElementById("tartipod-xp").textContent = tartipod.xp % 3; // DBG ONLY XP BAR
        updateXPBar(Math.floor(tartipod.xp % 3));
        infoPanel.classList.remove("disabled");
    }

    // TODO button keyboard gauche / droite pour modifier rapidement la selection

    // VOLUME PANEL
    const volumeSlider = document.getElementById('volumeSlider');
    // TODO ameliorer le systeme sonore
    volumeSlider.addEventListener('input', () => {
        let volumeRatio = volumeSlider.value / 100;
        story.volume = 0.4 * volumeRatio;
        calm.volume = 0.5 * volumeRatio;
        setVolume(mamies, 0.2 * volumeRatio);
    });


}).catch((error) => {
    console.error("Erreur lors de la récupération du nombre d'images :", error);
});