class GameSoundManager {
    constructor(sounds = {}) {
        // sounds = { name: url }
        this.sounds = {};
        for (const name in sounds) {
            const audio = new Audio(sounds[name]);
            audio.preload = "auto";
            audio.loop = false;
            this.sounds[name] = audio;
        }
    }

    play(name) {
        const sound = this.sounds[name];
        if (!sound) return console.warn(`Sound "${name}" not found`);
        sound.currentTime = 0;
        sound.play();
    }

    stop(name) {
        const sound = this.sounds[name];
        if (!sound) return;
        sound.pause();
        sound.currentTime = 0;
    }

    loop(name, state = true) {
        const sound = this.sounds[name];
        if (!sound) return;
        sound.loop = state;
        if (state) sound.play();
    }

    setVolume(name, value = 1) {
        const sound = this.sounds[name];
        if (!sound) return;
        sound.volume = value;
    }
}

const soundManager = new GameSoundManager({
    goalwin: '../sounds/a-football-hits-the-net-goal-313216.mp3',
    polishs: '../sounds/cheering-lech-poznan-w-grodzie-przemysawa-23379.mp3',
    crowd_1: '../sounds/crowd-cheering-379666.mp3',
    crowd_2: '../sounds/football-crowd-3-69245.mp3',
    crowd_3: '../sounds/football-game-in-a-big-arena-31575.mp3',
    pouetss: '../sounds/football-party-people-in-the-streets-24170.mp3',
    gaelics: '../sounds/ireland-gaelic-football-match-anthem-55742.mp3',
    whistle: '../sounds/metal-whistle-6121.mp3',
    stompss: '../sounds/powerful-stomps-claps-cheering-sport-rhythmic-applause-317290.mp3',
    shootss: '../sounds/soccer-ball-kick-37625.mp3',
    kickall: '../sounds/soccerballkick-6770.mp3'
});

// Jouer un son une fois
// soundManager.play('gaelics');

// Jouer un son en boucle
// soundManager.loop('kickall', true);
// soundManager.loop('crowd_2', true);
// soundManager.setVolume('stompss', 0.2);
// soundManager.loop('stompss', true);

// Arrêter un son
// soundManager.stop('ambient');

// Ajuster le volume
// soundManager.setVolume('goal', 0.5);
// soundManager.setVolume('goalwin', 0.1); //../sounds/a-football-hits-the-net-goal-313216.mp3',
soundManager.setVolume('polishs', 0.3); //../sounds/cheering-lech-poznan-w-grodzie-przemysawa-23379.mp3',
soundManager.setVolume('crowd_1', 0.1); //../sounds/crowd-cheering-379666.mp3',
soundManager.setVolume('crowd_2', 0.8); //../sounds/football-crowd-3-69245.mp3',
soundManager.setVolume('crowd_3', 0.3); //../sounds/football-game-in-a-big-arena-31575.mp3',
soundManager.setVolume('pouetss', 0.05); //../sounds/football-party-people-in-the-streets-24170.mp3',
soundManager.setVolume('gaelics', 0.9); //../sounds/ireland-gaelic-football-match-anthem-55742.mp3',
soundManager.setVolume('whistle', 0.1); //../sounds/metal-whistle-6121.mp3',
soundManager.setVolume('stompss', 0.05); //../sounds/powerful-stomps-claps-cheering-sport-rhythmic-applause-317290.mp3',
soundManager.setVolume('kickall', 1); //../sounds/powerful-stomps-claps-cheering-sport-rhythmic-applause-317290.mp3',

// soundManager.loop('goalwin', true); //../sounds/a-football-hits-the-net-goal-313216.mp3',
soundManager.loop('polishs', true); //../sounds/cheering-lech-poznan-w-grodzie-przemysawa-23379.mp3',
soundManager.loop('crowd_1', true); //../sounds/crowd-cheering-379666.mp3',
soundManager.loop('crowd_2', true); //../sounds/football-crowd-3-69245.mp3',
soundManager.loop('crowd_3', true); //../sounds/football-game-in-a-big-arena-31575.mp3',
soundManager.loop('pouetss', true); //../sounds/football-party-people-in-the-streets-24170.mp3',
soundManager.loop('gaelics', true); //../sounds/ireland-gaelic-football-match-anthem-55742.mp3',
soundManager.loop('whistle', true); //../sounds/metal-whistle-6121.mp3',
soundManager.loop('stompss', true); //../sounds/powerful-stomps-claps-cheering-sport-rhythmic-applause-317290.mp3',
soundManager.loop('kickall', true); //../sounds/soccer-ball-kick-37625.mp3',