function randomDateInPast(secondsRange) {
    // Obtenir la date actuelle
    const currentDate = new Date();

    // Calculer un nombre aléatoire de secondes à soustraire
    const randomSeconds = Math.floor(Math.random() * secondsRange);

    // Soustraire ces secondes de la date actuelle
    currentDate.setSeconds(currentDate.getSeconds() - randomSeconds);

    // Formater la date de manière minimaliste (ex: "2024-12-09 14:30")
    const year = currentDate.getFullYear() % 100;
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const ms = String(Math.floor(currentDate.getMilliseconds() / 10)).padStart(2, '0');

    // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return `${hours}:${minutes}:${seconds}:${ms}`;
}


function randomName(min, max) {
    // Définir les lettres possibles (a-z)
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // Choisir une longueur aléatoire entre min et max
    const length = Math.floor(Math.random() * (max - min + 1)) + min;

    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        result += letters[randomIndex];
    }
    while (result.length < max) {
        result += ' ';
    }
    return result;
}

function randomTimestamp() {
    const date = randomDateInPast(0);
    const name = randomName(3, 8);
    return date + "<br>by " + name;
}