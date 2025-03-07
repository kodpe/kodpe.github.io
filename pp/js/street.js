import { URL } from "./constants.js";
import { setBtnLeftPlace, setBtnRightPlace, setPlaceName } from "./autoDiv.js";
import { setupAudio, setVolume, playSounds, pauseSounds, initPageSoundsArrayVolumeRatio } from "./volume.js";
// STREET.js
window.page = "street";
setPlaceName(window.page);
setBtnLeftPlace(null);
setBtnRightPlace(URL.CUISINE);
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const rue_bg = new Image();
rue_bg.src = 'img/places/rue.jpg';
let rue_bg_scaleFactor = 0.56;
let rue_drawWidth, rue_drawHeight;
let rue_offsetX = 0;
let rue_offsetY = -150;


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

const framerate = 30; // Framerate souhaité en FPS
const interval = 1000 / framerate; // Calcul du délai entre les frames (en ms)
let lastTime = 0;

// const video = document.getElementById('tv-video');

function animate(timestamp) {
    if (timestamp - lastTime >= interval) {
        lastTime = timestamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(rue_bg, rue_offsetX, rue_offsetY, rue_drawWidth, rue_drawHeight);

        // DEBUG DRAW PATH
    }
    requestAnimationFrame(animate);
}

function waitForBG() {
    rue_bg.onload = function () {
        rue_drawWidth = rue_bg.width * rue_bg_scaleFactor;
        rue_drawHeight = rue_bg.height * rue_bg_scaleFactor;
        animate();
    };
}

// MAIN LINE START
waitForBG();

// -------- SOUND DESIGN -----------//
const calm = setupAudio('sounds/city-night.mp3', 0.5, true);
setTimeout(() => {
    calm.play();
}, 500);

const owl = setupAudio('sounds/tawny-owl.mp3', 0.8, false);
setInterval(() => {
    owl.play();
}, 20000);

const tvnoise = setupAudio('sounds/tvnoise.mp3', 0.2, true);
const tvButton = setupAudio('sounds/old-button.mp3', 0.7, false);

// TV
let isTvOn = false;
let videoTV = document.getElementById('tv-video');
videoTV.classList.add('disabled');
document.getElementById('btn-tv').addEventListener('click', function () {
    if (isTvOn === false) {
        isTvOn = true;
        tvButton.play();
        console.log('PLAY TV BTN');
        setTimeout(() => {
            tvnoise.play();
            videoTV.classList.remove('disabled');
        }, 500);
    }
    else {
        isTvOn = false;
        tvButton.play();
        setTimeout(() => {
            tvnoise.pause();
            videoTV.classList.add('disabled');
        }, 500);
    }
});