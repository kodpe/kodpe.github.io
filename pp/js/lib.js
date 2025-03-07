const units = ['million', 'milliard', 'billion', 'billiard', 'trillion', 'trilliard', 'quadrillion', 'quadrilliard', 'quintillion', 'quintilliard', 'sextillion', 'sextilliard', 'septillion', 'septilliard', 'octillion', 'octilliard', 'nonillion', 'nonilliard', 'décillion', 'décilliard', 'undécillion', 'undécilliard', 'duodécillion', 'duodécilliard', 'trédécillion', 'trédécilliard', 'quatordécillion', 'quatordécilliard', 'quindécillion', 'quindécilliard', 'sexdécillion', 'sexdécilliard', 'septendécillion', 'septendécilliard', 'octodécillion', 'octodécilliard', 'novemdécillion', 'novemdécilliard', 'vigintillion'];

export function approxBigIntToWords(num) {
    if (num < 1_000_000n) return ''; // Ne retourne rien pour des valeurs inférieures à un milliard

    let unitIndex = 0;
    let value = num;

    // Diviser par 10^9 jusqu'à ce que la valeur soit inférieure à 10^9
    while (value >= 1_000_000n && unitIndex < units.length) {
        value /= 1_000_000n;
        unitIndex++;
    }

    const unit = units[unitIndex - 1];
    const plural = value > 1 ? 's' : ''; // Pluriel si la valeur est supérieure à 1

    return `${value} ${unit}${plural}`;
}

export function bigIntToScientificNotation(num) {
    const strNum = num.toString();
    const length = strNum.length;

    if (length <= 3) {
        return `${num}`;
    }

    const exponent = length - 1;
    const mantissa = num / BigInt(10 ** exponent); // Déplacement de la virgule

    return `${mantissa}x10^${exponent}`;
}

const prefixes = [
    'm', // 10^6 - méga
    'G', // 10^9 - giga
    'T', // 10^12 - tera
    'P', // 10^15 - peta
    'E', // 10^18 - exa
    'Z', // 10^21 - zetta
    'Y', // 10^24 - yotta
    'rY', // 10^27 - ronna
    'qY', // 10^30 - quetta
];

export function bigIntToInternationalFormat(num) {
    if (num < 1_000_000n) return num.toString(); // Ne convertit pas pour les valeurs inférieures à un million

    let value = num;
    let prefixIndex = 0;

    // Diviser par 10^6 (1 million) jusqu'à ce que la valeur soit inférieure à 1 million
    while (value >= 1_000_000n && prefixIndex < prefixes.length) {
        value /= 1_000_000n;
        prefixIndex++;
    }

    const roundedValue = Math.round(Number(value)); // Arrondir pour éviter les décimales
    const prefix = prefixes[prefixIndex]; // Récupérer le préfixe correspondant

    return `${roundedValue} ${prefix}`; // Retourne le format avec le préfixe
}

// Exemple d'utilisation
/*
const num1 = 1000000000n; // 1 milliard
const num2 = 7000000000n; // 7 milliards
const num3 = 2000000000000n; // 2 billions
const num4 = 2000000000000000n; // 2 trillions

console.log(approxBigIntToWords(num1)); // "1 * 10^9"
console.log(approxBigIntToWords(num2)); // "7 * 10^9"
console.log(approxBigIntToWords(num3)); // "2 * 10^12"
console.log(approxBigIntToWords(num4)); // "2 * 10^15"

console.log(bigIntToScientificNotation(num1)); // "1 * 10^9"
console.log(bigIntToScientificNotation(num2)); // "7 * 10^9"
console.log(bigIntToScientificNotation(num3)); // "2 * 10^12"
console.log(bigIntToScientificNotation(num4)); // "2 * 10^15"

console.log(bigIntToInternationalFormat(num1)); // "1 milliard"
console.log(bigIntToInternationalFormat(num2)); // "7 milliards"
console.log(bigIntToInternationalFormat(num3)); // "2 billions"
console.log(bigIntToInternationalFormat(num4)); // "2 trillions"
*/

export function removeDots(str) {
    return str.replace(/\./g, '');
}

export function removeSpaces(str) {
    return str.replace(/\ /g, '');
}

export function formatNPT(str) {
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatNSP(str) {
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function hasChance(pourcentage) {
    return Math.random() * 100 < pourcentage;
}