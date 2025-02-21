export const soundsLib = [
    new Audio("sounds/button.mp3"),
    new Audio("sounds/Adroite.mp3"),
    new Audio("sounds/Agauche.mp3"),
    new Audio("sounds/Coconut.mp3"),
    new Audio("sounds/Ehwewe.mp3"),
    new Audio("sounds/Johanne.mp3"),
    new Audio("sounds/SylvainDurif.mp3"),
    new Audio("sounds/aguagu.mp3"),
    new Audio("sounds/avecunwilly.mp3"),
    new Audio("sounds/babyvoice.mp3"),
    new Audio("sounds/baguette.mp3"),
    new Audio("sounds/benjecomprend.mp3"),
    new Audio("sounds/cartekiwi.mp3"),
    new Audio("sounds/cartekiwishorter.mp3"),
    new Audio("sounds/chipi.mp3"),
    new Audio("sounds/corbin.mp3"),
    new Audio("sounds/cpassorcier.mp3"),
    new Audio("sounds/dansedeforet.mp3"),
    new Audio("sounds/deco.mp3"),
    new Audio("sounds/destrucs.mp3"),
    new Audio("sounds/everybodydotheflop.mp3"),
    new Audio("sounds/gps.mp3"),
    new Audio("sounds/grelotine.mp3"),
    new Audio("sounds/habebabeu.mp3"),
    new Audio("sounds/hamburger.mp3"),
    new Audio("sounds/heeey.mp3"),
    new Audio("sounds/howareyou.mp3"),
    new Audio("sounds/hydrate.mp3"),
    new Audio("sounds/icitourdecontrole.mp3"),
    new Audio("sounds/iliketrains.mp3"),
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
    new Audio("sounds/ouille.mp3"),
    new Audio("sounds/painfromage.mp3"),
    new Audio("sounds/pasdewilly.mp3"),
    new Audio("sounds/petitdej.mp3"),
    new Audio("sounds/pitoupitou.mp3"),
    new Audio("sounds/rire1.mp3"),
    new Audio("sounds/rire2.mp3"),
    new Audio("sounds/rire3.mp3"),
    new Audio("sounds/rire4.mp3"),
    new Audio("sounds/riresante.mp3"),
    new Audio("sounds/someburger.mp3"),
    new Audio("sounds/sylvaing.mp3"),
    new Audio("sounds/turtlehello.mp3"),
    new Audio("sounds/williwaller.mp3"),
    new Audio("sounds/xandiloquence.mp3"),
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

export function playPieceSoundLib(type) {
    switch (type) {
        case "pion":
            break;
        case "tower":
            break;
        case "cavalier":
            break;
        case "fou":
            break;
        case "roi":
            break;
        case "reine":
            break;
        case "faucon":
            break;
        case "elephant":
            break;
    }
}