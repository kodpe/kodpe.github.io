export const soundsLib = [
    new Audio("sounds/Adroite.mp3"),
    new Audio("sounds/Agauche.mp3"),
    new Audio("sounds/avecunwilly.mp3"),
    new Audio("sounds/benjecomprend.mp3"),
    new Audio("sounds/button.mp3"),
    new Audio("sounds/cartekiwi.mp3"),
    new Audio("sounds/cartekiwishorter.mp3"),
    new Audio("sounds/chipi.mp3"),
    new Audio("sounds/Coconut.mp3"),
    new Audio("sounds/corbin.mp3"),
    new Audio("sounds/dansedeforet.mp3"),
    new Audio("sounds/deco.mp3"),
    new Audio("sounds/destrucs.mp3"),
    new Audio("sounds/Ehwewe.mp3"),
    new Audio("sounds/hydrate.mp3"),
    new Audio("sounds/icitourdecontrole.mp3"),
    new Audio("sounds/Johanne.mp3"),
    new Audio("sounds/josianepichet.mp3"),
    new Audio("sounds/ma1.mp3"),
    new Audio("sounds/ma2.mp3"),
    new Audio("sounds/ma3.mp3"),
    new Audio("sounds/ma4.mp3"),
    new Audio("sounds/ma5.mp3"),
    new Audio("sounds/ma6.mp3"),
    new Audio("sounds/mariage.mp3"),
    new Audio("sounds/mayday.mp3"),
    new Audio("sounds/monmetier.mp3"),
    new Audio("sounds/monsieur.mp3"),
    new Audio("sounds/moveit.mp3"),
    new Audio("sounds/nope.mp3"),
    new Audio("sounds/ouah.mp3"),
    new Audio("sounds/pasdewilly.mp3"),
    new Audio("sounds/petitdej.mp3"),
    new Audio("sounds/rire1.mp3"),
    new Audio("sounds/rire2.mp3"),
    new Audio("sounds/rire3.mp3"),
    new Audio("sounds/rire4.mp3"),
    new Audio("sounds/riresante.mp3"),
    new Audio("sounds/SylvainDurif.mp3"),
    new Audio("sounds/sylvaing.mp3"),
    new Audio("sounds/williwaller.mp3"),
    new Audio("sounds/yoda.mp3"),
];

export function playSoundLib(index = -1) {
    if (index === -1) {
        index = Math.floor(Math.random() * soundsLib.length);
    }
    console.log("soundlib:", index);
    const sound = soundsLib[index];
    sound.currentTime = 0;
    sound.play();
}

export function stopAllSoundsLib() {
    soundsLib.forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
}
