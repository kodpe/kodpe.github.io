import { attributionDiv, AttributionToggle } from "../js/map-attribution.js";
export const TILE_CONFIG = {
    dark: {
        base: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
        labels: "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
    },
    light: {
        base: "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
        labels: "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
    }
};

export const ZONE_BORDER = {
    color: "#888888",
    weight: 1,
    opacity: 1
};

export const ZONE_BORDER_HOVER = {
    color: "#ffffff",
    weight: 2,
    opacity: 1
};

export const DEFAULT_SCALE = {
    min: 0,
    max: 1,
    isPercentage: false,
    valueColumn: null,
    extraColumns: []
};

export const DEFAULT_BASE_COLOR = { r: 64, g: 0, b: 255 };
export const DEFAULT_ZONE_FILL_OPACITY = 0.6;
export const DEFAULT_COLOR_SPREAD = 0.9;

/* =========================
   MAP INIT
========================= */

export const map = L.map("map", {
    zoomControl: false,
    minZoom: 14,
    maxZoom: 17,
    zoomSnap: 0.25,
    zoomDelta: 0.25,
    zoomAnimation: true,
    zoomAnimationThreshold: 4,
    attributionControl: false
});

map.setView([49.429, 1.055], 14);

map.setMaxBounds([
    [49.38, 0.95],
    [49.47, 1.15]
]);

L.control.zoom({
    position: "bottomright"
}).addTo(map);

map.addControl(new AttributionToggle());
