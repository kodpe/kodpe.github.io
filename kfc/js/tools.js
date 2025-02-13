export function getCSSVariable(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function generateShortPeerId(length = 4) {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

export function getUrlParam(p) {
    let params = new URLSearchParams(window.location.search);
    console.log("params found:", params);
    return params.get(p);
}

export function getCurrentUrl() {
    let currentUrl = window.location.href;
    console.log("getCurrentUrl():", currentUrl);
    return currentUrl;
}
