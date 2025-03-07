// VOLUME MANAGER
import { getAllPagesDB, updatePageDB, getCurrentPageIndexDB } from "./database.js";
//
window.globalSoundsArray = [];
//
export function setupAudio(src, volumeBase = 1, loop = false) {
    const audio = new Audio(src);
    audio.volume = volumeBase;
    audio.loop = loop;

    audio.addEventListener('loadedmetadata', () => {
        if (!isNaN(audio.duration)) {
            audio.currentTime = Math.random() * audio.duration;
            // audio.play();
        } else {
            console.error(`Durée non disponible pour : ${src}`);
        }
    });
    window.globalSoundsArray.push({ audio, volumeBase, src });
    return audio;
}
//
export function setVolume(sounds, volume) {
    if (!Array.isArray(sounds)) {
        sounds = [sounds];
    }
    sounds.forEach(sound => sound.volume = volume);
}
//
export function playSounds(sounds) {
    if (!Array.isArray(sounds)) {
        sounds = [sounds];
    }
    sounds.forEach(sound => sound.play());
}

export function pauseSounds(sounds) {
    if (!Array.isArray(sounds)) {
        sounds = [sounds];
    }
    sounds.forEach(sound => sound.pause());
}
//
const volumeSlider = document.getElementById('volumeSlider');
// const volumeBtn = document.getElementById('btn-volume');
let volumeRatio = 0;

volumeSlider.addEventListener('input', async () => {
    volumeRatio = volumeSlider.value / 100;
    //
    window.globalSoundsArray.forEach(soundInfo => {
        // console.log(soundInfo);
        setVolume(soundInfo.audio, soundInfo.volumeBase * volumeRatio);
        // console.warn("set volume to:", soundInfo.volumeBase * volumeRatio);
    });
    //
    let pages = await getAllPagesDB();
    let id = getCurrentPageIndexDB();
    pages[id].volume = volumeRatio;
    updatePageDB(id, pages[id]);
});

async function initFromDB() {
    const pages = await getAllPagesDB();
    let id = getCurrentPageIndexDB();
    volumeRatio = pages[id].volume;
    volumeSlider.value = volumeRatio * 100;
    setTimeout(() => {
        window.globalSoundsArray.forEach(soundInfo => {
            setVolume(soundInfo.audio, soundInfo.volumeBase * volumeRatio);
            // console.warn("set volume to:", soundInfo.volumeBase * volumeRatio);
        });
    }, 500);
}
setTimeout(() => {
    initFromDB();
}, 200);

export function initPageSoundsArrayVolumeRatio() {
    window.globalSoundsArray.forEach(soundInfo => {
        setVolume(soundInfo.audio, soundInfo.volumeBase * volumeRatio);
    });
    // console.log("window.globalSoundsArray:", window.globalSoundsArray);
}
