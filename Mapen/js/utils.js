// COLOR UTILS

export function clamp01(x) {
    return Math.max(0, Math.min(1, x));
}

export function mixRgb(a, b, t) {
    return {
        r: Math.round(a.r + (b.r - a.r) * t),
        g: Math.round(a.g + (b.g - a.g) * t),
        b: Math.round(a.b + (b.b - a.b) * t)
    };
}

export function rgbToCss(c) {
    return `rgb(${c.r}, ${c.g}, ${c.b})`;
}

export function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    const value = parseInt(clean, 16);

    return {
        r: (value >> 16) & 255,
        g: (value >> 8) & 255,
        b: value & 255
    };
}

export function generateColorSteps(base, spread = 0.5) {
    const light = { r: 250, g: 250, b: 252 };
    const dark = { r: 8, g: 6, b: 6 };

    const s = clamp01(spread);
    const power = 2.2; // augmenter le power (contraste entre les valeurs)
    const k = Math.pow(s, power);

    return [
        rgbToCss(mixRgb(base, light, 0.55 + k * 0.45)),
        rgbToCss(mixRgb(base, light, 0.25 + k * 0.25)),
        rgbToCss(base),
        rgbToCss(mixRgb(base, dark, 0.25 + k * 0.35)),
        rgbToCss(mixRgb(base, dark, 0.55 + k * 0.45))
    ];
}

// CSV UTILS

export function detectSeparator(text) {
    const firstLine = text.split(/\r?\n/).find(line => line.trim().length > 0) || "";
    const candidates = [";", ",", "\t"];

    let bestSep = ";";
    let bestScore = 0;

    for (const sep of candidates) {
        const score = firstLine.split(sep).length;
        if (score > bestScore) {
            bestScore = score;
            bestSep = sep;
        }
    }

    return bestSep;
}

export function parseFlexibleNumber(value) {
    if (value == null) return null;

    let v = String(value).trim();
    if (!v) return null;

    if (v.endsWith("%")) {
        const num = parseFlexibleNumber(v.slice(0, -1));
        return num == null ? null : num / 100;
    }

    v = v.replace(/\s/g, "");

    const hasComma = v.includes(",");
    const hasDot = v.includes(".");

    if (hasComma && hasDot) {
        if (v.lastIndexOf(",") > v.lastIndexOf(".")) {
            v = v.replace(/\./g, "");
            v = v.replace(",", ".");
        } else {
            v = v.replace(/,/g, "");
        }
    } else if (hasComma) {
        v = v.replace(",", ".");
    }

    const num = parseFloat(v);
    return Number.isNaN(num) ? null : num;
}

export function splitCsvLine(line, separator) {
    return line.split(separator);
}

// NUMBER UTILS
const PERCENTAGE_MODE = "auto"; // TOFIX

export function niceCeil(value) {
    if (value <= 0) return 1;
    if (value <= 1) return 1;

    const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
    const normalized = value / magnitude;

    let niceNormalized;
    if (normalized <= 1) niceNormalized = 1;
    else if (normalized <= 2) niceNormalized = 2;
    else if (normalized <= 2.5) niceNormalized = 2.5;
    else if (normalized <= 5) niceNormalized = 5;
    else niceNormalized = 10;

    return niceNormalized * magnitude;
}

export function inferPercentage(values, headerName = "") {
    if (PERCENTAGE_MODE === "percent") return true;
    if (PERCENTAGE_MODE === "number") return false;

    const header = String(headerName || "").trim().toLowerCase();

    const headerLooksLikePercent =
        header.includes("%") ||
        header.includes("pourcent") ||
        header.includes("percent") ||
        header.includes("pct") ||
        header.includes("ratio") ||
        header.includes("part") ||
        header.includes("taux") ||
        header.includes("tx");

    const validValues = values.filter(v => v != null && !Number.isNaN(v));
    if (!validValues.length) return false;

    const allBetween0And1 = validValues.every(v => v >= 0 && v <= 1);
    const allBetween0And100 = validValues.every(v => v >= 0 && v <= 100);

    return headerLooksLikePercent || allBetween0And1 || allBetween0And100;
}

export function computeScale(values, headerName = "") {
    const validValues = values.filter(v => v != null && !Number.isNaN(v));

    if (!validValues.length) {
        return { min: 0, max: 1, isPercentage: false };
    }

    const rawMin = Math.min(...validValues);
    const rawMax = Math.max(...validValues);
    const isPercentage = inferPercentage(validValues, headerName);

    let min = Math.min(0, rawMin);
    let max = rawMax;

    if (isPercentage) {
        return rawMax <= 1
            ? { min: 0, max: 1, isPercentage: true }
            : { min: 0, max: 100, isPercentage: true };
    }

    max = niceCeil(rawMax);
    if (max <= min) max = min + 1;

    return { min, max, isPercentage: false };
}

export function formatDisplayValue(value, isPercentage = false) {
    if (value == null || Number.isNaN(value)) {
        return "aucune donnée";
    }

    if (isPercentage) {
        if (value >= 0 && value <= 1) {
            return `${(value * 100).toFixed(1)} %`;
        }
        return `${value.toFixed(1)} %`;
    }

    if (Math.abs(value) >= 1000) {
        return new Intl.NumberFormat("fr-FR", {
            maximumFractionDigits: 0
        }).format(value);
    }

    if (Number.isInteger(value)) {
        return String(value);
    }

    return new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value);
}

export function setText(element, text = "") {
    if (!element) return;
    element.textContent = text;
}

export function setVisibleByClass(selector, visible, className = "visible") {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.toggle(className, visible);
}

export function clearObject(obj) {
    Object.keys(obj).forEach((key) => {
        delete obj[key];
    });
}