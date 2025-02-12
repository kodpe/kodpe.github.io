export function getCSSVariable(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function generateShortPeerId(length = 4) {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}