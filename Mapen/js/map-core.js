import {
    generateColorSteps,
    detectSeparator,
    parseFlexibleNumber,
    splitCsvLine,
    computeScale,
    formatDisplayValue,
    clearObject
} from "./utils.js";

import {
    map,
    TILE_CONFIG,
    ZONE_BORDER,
    ZONE_BORDER_HOVER,
    DEFAULT_SCALE,
    DEFAULT_BASE_COLOR,
    DEFAULT_COLOR_SPREAD,
    DEFAULT_ZONE_FILL_OPACITY,
} from "../data/map-config.js";

/* =========================
   ÉTAT GLOBAL
========================= */

const layersById = {};
const valuesById = {};
const extraDataById = {};

let geoJsonLayer = null;
let baseTileLayer = null;
let labelsTileLayer = null;

let baseColor = DEFAULT_BASE_COLOR;
let colorSpread = DEFAULT_COLOR_SPREAD;
let colorSteps = generateColorSteps(baseColor, colorSpread);

let currentScale = { ...DEFAULT_SCALE };
let zoneFillOpacity = DEFAULT_ZONE_FILL_OPACITY;

/* =========================
   CALLBACKS UI
========================= */

let statusHandler = () => { };
let loadedContentHandler = () => { };
let legendVisibilityHandler = () => { };

export function configureMapCore({
    setStatus,
    setLoadedContent,
    setLegendVisible
} = {}) {
    statusHandler = setStatus || (() => { });
    loadedContentHandler = setLoadedContent || (() => { });
    legendVisibilityHandler = setLegendVisible || (() => { });
}

/* =========================
   GETTERS
========================= */

export function getMapInstance() {
    return map;
}

export function getGeoJsonLayer() {
    return geoJsonLayer;
}

export function getCurrentScale() {
    return currentScale;
}

export function getZoneFillOpacity() {
    return zoneFillOpacity;
}

export function getColorSteps() {
    return colorSteps;
}

/* =========================
   STYLES
========================= */

export function baseStyle() {
    return {
        color: ZONE_BORDER.color,
        weight: ZONE_BORDER.weight,
        opacity: ZONE_BORDER.opacity,
        fillColor: "#585858",
        fillOpacity: zoneFillOpacity
    };
}

export function styleForValue(value, color) {
    if (value === undefined) {
        return baseStyle();
    }

    return {
        color: ZONE_BORDER.color,
        weight: ZONE_BORDER.weight,
        opacity: ZONE_BORDER.opacity,
        fillColor: color,
        fillOpacity: zoneFillOpacity
    };
}

function formatValue(value) {
    return formatDisplayValue(value, currentScale.isPercentage);
}

/* =========================
   COULEURS / LÉGENDE
========================= */

export function setBaseColor(color) {
    baseColor = color;
    refreshColorPalette();
}

export function setColorSpread(spread) {
    colorSpread = spread;
    refreshColorPalette();
}

export function setZoneOpacity(opacity) {
    zoneFillOpacity = opacity;
    refreshAllZoneStyles();
}

function refreshColorPalette() {
    colorSteps = generateColorSteps(baseColor, colorSpread);
    refreshAllZoneStyles();
    updateLegend();
}

function normalizeValueForColor(value) {
    const { min, max } = currentScale;

    if (value == null || Number.isNaN(value)) return 0;
    if (max <= min) return 0;

    const t = (value - min) / (max - min);
    return Math.max(0, Math.min(1, t));
}

function getColor(value) {
    const x = normalizeValueForColor(value);
    const stepCount = colorSteps.length;

    const index = Math.min(
        stepCount - 1,
        Math.floor(x * stepCount)
    );

    return colorSteps[index];
}

function getLegendBreaks() {
    const { min, max } = currentScale;

    if (max <= min) {
        return [min, max];
    }

    const breaks = [];

    for (let i = 0; i <= colorSteps.length; i++) {
        const t = i / colorSteps.length;
        breaks.push(min + (max - min) * t);
    }

    return breaks;
}

export function updateLegend() {
    const legendTitleEl = document.querySelector(".legend-title");
    const legendLabelsEl = document.querySelector(".legend-labels");
    const legendBarEl = document.querySelector(".legend-bar");

    if (legendTitleEl) {
        legendTitleEl.textContent = currentScale.valueColumn
            ? `${currentScale.valueColumn}${currentScale.isPercentage ? " (%)" : ""}`
            : "Échelle";
    }

    if (legendLabelsEl) {
        const breaks = getLegendBreaks();

        legendLabelsEl.innerHTML = breaks
            .map((value) => `<span>${formatDisplayValue(value, currentScale.isPercentage)}</span>`)
            .join("");
    }

    if (legendBarEl) {
        legendBarEl.innerHTML = colorSteps
            .map((color) => `<span class="legend-step" style="background:${color}"></span>`)
            .join("");
    }
}

/* =========================
   ZONES / TOOLTIPS
========================= */

function refreshAllZoneStyles() {
    Object.entries(layersById).forEach(([id, layer]) => {
        const value = valuesById[id];
        layer.setStyle(styleForValue(value, getColor(value)));
    });
}

function updateTooltip(layer, feature) {
    const id = feature.properties?.id || "sans_id";
    const bv = feature.properties?.bv || "sans_bv";
    const nom = feature.properties?.nom || id;
    const value = valuesById[id];
    const extras = extraDataById[id] || {};

    let extraHtml = "";

    Object.entries(extras).forEach(([key, rawValue]) => {
        extraHtml += `<br>${key} : ${rawValue}`;
    });

    const content = `
        <b>${nom}</b><br>
        BV : ${bv}<br>
        ${currentScale.valueColumn || "Valeur"} : ${formatValue(value)}${extraHtml}
    `;

    layer.unbindTooltip();
    layer.bindTooltip(content, {
        sticky: true,
        direction: "auto",
        className: "zone-tooltip",
        opacity: 1
    });
}

function onEachFeature(feature, layer) {
    const id = feature.properties?.id;
    if (!id) return;

    layersById[id] = layer;
    updateTooltip(layer, feature);

    layer.on("mouseover", function () {
        const value = valuesById[id];

        this.setStyle({
            ...styleForValue(value, getColor(value)),
            color: ZONE_BORDER_HOVER.color,
            weight: ZONE_BORDER_HOVER.weight,
            opacity: ZONE_BORDER_HOVER.opacity,
            fillOpacity: Math.min(zoneFillOpacity + 0.25, 1)
        });

        this.bringToFront();
        this.openTooltip();
    });

    layer.on("mouseout", function () {
        const value = valuesById[id];
        this.setStyle(styleForValue(value, getColor(value)));
        this.closeTooltip();
    });

    layer.on("click", function (e) {
        L.DomEvent.stop(e);
    });
}

/* =========================
   BASEMAP
========================= */

export function updateBaseMap(theme = "dark", showLabels = true) {
    if (baseTileLayer) {
        map.removeLayer(baseTileLayer);
    }

    if (labelsTileLayer) {
        map.removeLayer(labelsTileLayer);
        labelsTileLayer = null;
    }

    baseTileLayer = L.tileLayer(TILE_CONFIG[theme].base, {
        subdomains: "abcd",
        maxZoom: 20,
    }).addTo(map);

    if (showLabels) {
        labelsTileLayer = L.tileLayer(TILE_CONFIG[theme].labels, {
            subdomains: "abcd",
            maxZoom: 20,
            pane: "overlayPane"
        }).addTo(map);
    }
}

/* =========================
   CSV
========================= */

function resetDataStyles() {
    clearObject(valuesById);
    clearObject(extraDataById);

    currentScale = { ...DEFAULT_SCALE };

    Object.values(layersById).forEach((layer) => {
        layer.setStyle(baseStyle());
        updateTooltip(layer, layer.feature);
    });

    updateLegend();
    legendVisibilityHandler(true);
    loadedContentHandler("");
}

export function applyCsv(text, sourceLabel = "CSV") {
    resetDataStyles();

    const rawLines = text.split(/\r?\n/);
    const lines = rawLines.filter((line) => line.trim() !== "");

    if (lines.length < 2) {
        statusHandler("CSV invalide : pas assez de lignes.");
        loadedContentHandler(text);
        return;
    }

    const separator = detectSeparator(text);
    const headers = splitCsvLine(lines[0], separator).map((h) => h.trim());

    if (headers.length < 2) {
        statusHandler("CSV invalide : au moins 2 colonnes attendues.");
        loadedContentHandler(text);
        return;
    }

    const idCol = headers[0];
    const valueCol = headers[1];
    const extraCols = headers.slice(2);

    const missing = [];
    const numericValues = [];

    for (let i = 1; i < lines.length; i++) {
        const cols = splitCsvLine(lines[i], separator);
        if (cols.length < 2) continue;

        const row = {};
        headers.forEach((header, index) => {
            row[header] = (cols[index] ?? "").trim();
        });

        const id = row[idCol];
        const value = parseFlexibleNumber(row[valueCol]);

        if (!id || value == null) continue;

        numericValues.push(value);
        valuesById[id] = value;

        extraDataById[id] = {};
        extraCols.forEach((colName) => {
            extraDataById[id][colName] = row[colName] ?? "";
        });
    }

    currentScale = {
        ...computeScale(numericValues, valueCol),
        valueColumn: valueCol,
        extraColumns: extraCols
    };

    Object.entries(valuesById).forEach(([id, value]) => {
        const layer = layersById[id];

        if (!layer) {
            missing.push(id);
            return;
        }

        layer.setStyle(styleForValue(value, getColor(value)));
        updateTooltip(layer, layer.feature);
    });

    Object.values(layersById).forEach((layer) => {
        updateTooltip(layer, layer.feature);
    });

    updateLegend();
    legendVisibilityHandler(true);
    loadedContentHandler(text);

    let message =
        `${sourceLabel} chargé.\n` +
        `Colonne : ${valueCol}\n` +
        `Échelle : ${formatDisplayValue(currentScale.min, currentScale.isPercentage)} → ${formatDisplayValue(currentScale.max, currentScale.isPercentage)}`;

    if (missing.length > 0) {
        message += `\nIDs absents du GeoJSON : ${missing.join(", ")}`;
    }

    statusHandler(message);
}

/* =========================
   LOADERS
========================= */

export async function loadGeoJson() {
    try {
        const response = await fetch("./geojson/bureaux.geojson");
        if (!response.ok) {
            throw new Error("Impossible de charger bureaux.geojson");
        }

        const geojson = await response.json();

        geoJsonLayer = L.geoJSON(geojson, {
            style: baseStyle,
            onEachFeature
        }).addTo(map);

        map.fitBounds(geoJsonLayer.getBounds(), { padding: [20, 20] });
        statusHandler("Aucun fichier .csv");
        updateLegend();
    } catch (err) {
        console.error(err);
        statusHandler("Erreur lors du chargement de bureaux.geojson.");
    }
}

export async function loadProjectCsv(path, label) {
    try {
        statusHandler(`Chargement de ${label}...`);

        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Impossible de charger ${path}`);
        }

        const text = await response.text();
        applyCsv(text, label);
    } catch (err) {
        console.error(err);
        statusHandler(`Erreur lors du chargement de ${label}.`);
        loadedContentHandler("");
    }
}