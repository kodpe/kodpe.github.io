function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
        hex = hex.split("").map(c => c + c).join("");
    }
    const num = parseInt(hex, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
    };
}

function rgbToHex({ r, g, b }) {
    return "#" + [r, g, b]
        .map(v => Math.max(0, Math.min(255, Math.round(v)))
            .toString(16).padStart(2, "0"))
        .join("");
}

function adjustBrightness(hex, amount) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex({
        r: r + 255 * amount,
        g: g + 255 * amount,
        b: b + 255 * amount
    });
}

function adjustContrast(hex, amount) {
    const { r, g, b } = hexToRgb(hex);
    const factor = (1 + amount);
    return rgbToHex({
        r: 128 + (r - 128) * factor,
        g: 128 + (g - 128) * factor,
        b: 128 + (b - 128) * factor
    });
}

function adjustSaturation(hex, amount) {
    let { r, g, b } = hexToRgb(hex);
    r /= 255; g /= 255; b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    s = Math.min(1, Math.max(0, s + amount));

    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    return rgbToHex({
        r: hue2rgb(p, q, h + 1 / 3) * 255,
        g: hue2rgb(p, q, h) * 255,
        b: hue2rgb(p, q, h - 1 / 3) * 255
    });
}

function tweakColor(hex, {
    brightness = 0,
    contrast = 0,
    saturation = 0
} = {}) {
    let c = hex;
    if (brightness) c = adjustBrightness(c, brightness);
    if (contrast) c = adjustContrast(c, contrast);
    if (saturation) c = adjustSaturation(c, saturation);
    return c;
}

const base = "#43d787";
// const hover    = tweakColor(base, { brightness: 0.1 });
// const active   = tweakColor(base, { contrast: 0.15 });
// const disabled = tweakColor(base, { saturation: -0.6, brightness: 0.2 });
