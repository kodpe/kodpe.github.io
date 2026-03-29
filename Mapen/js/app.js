import { createBvMarkersLayer } from "../data/bv-coords.js";

import {
    configureMapCore,
    getMapInstance,
    getGeoJsonLayer,
    updateBaseMap,
    updateLegend,
    setBaseColor,
    setColorSpread,
    setZoneOpacity,
    loadGeoJson,
    loadProjectCsv,
    applyCsv
} from "./map-core.js";

import {
    hexToRgb,
    setText,
    setVisibleByClass
} from "./utils.js";

/* =========================
   DOM
========================= */

const fileInput = document.getElementById("fileInput");
const fileEl = document.getElementById("file");
const statusEl = document.getElementById("status");

const loadedDataEl = document.getElementById("loadedCount");

const populationBtn = document.getElementById("populationBtn");
const elections2020Btn = document.getElementById("elections2020Btn");

const colorPicker = document.getElementById("colorPicker");
const colorSpreadSlider = document.getElementById("colorSpreadSlider");
const colorSpreadValue = document.getElementById("colorSpreadValue");

const mapThemeSelect = document.getElementById("mapThemeSelect");
const togglePlaceLabels = document.getElementById("togglePlaceLabels");
const toggleTitle = document.getElementById("toggleTitle");
const toggleLegend = document.getElementById("toggleLegend");
const toggleBvPoints = document.getElementById("toggleBvPoints");
const toggleZones = document.getElementById("toggleZones");

const zoneOpacitySlider = document.getElementById("zoneOpacitySlider");
const zoneOpacityValue = document.getElementById("zoneOpacityValue");

/* =========================
   LOCAL STATE
========================= */

const map = getMapInstance();
let bvMarkersLayer = null;

/* =========================
   UI CALLBACKS
========================= */

function setFile(filename) {
    setText(fileEl, filename);
}

function setStatus(message) {
    setText(statusEl, message);
}

function setLoadedContent(text) {
    setText(loadedDataEl, text);
}

function setTitleVisible(visible) {
    setVisibleByClass(".map-title", visible);
}

function setLegendVisible(visible) {
    setVisibleByClass(".legend", visible);
}

/* =========================
   BINDINGS
========================= */

function bindColorControls() {
    if (colorPicker) {
        colorPicker.addEventListener("input", (e) => {
            setBaseColor(hexToRgb(e.target.value));
        });
    }

    if (colorSpreadSlider) {
        colorSpreadSlider.addEventListener("input", () => {
            const spread = Number(colorSpreadSlider.value) / 100;

            setColorSpread(spread);
            setText(colorSpreadValue, `${colorSpreadSlider.value}%`);
        });

        const spread = Number(colorSpreadSlider.value) / 100;
        setColorSpread(spread);
        setText(colorSpreadValue, `${colorSpreadSlider.value}%`);
    }
}

function bindFileControls() {

    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setFile(file.name);
        setStatus("Lecture du fichier en cours...");

        const reader = new FileReader();

        reader.onload = () => {
            try {
                const text = typeof reader.result === "string" ? reader.result : "";
                applyCsv(text, file.name);
            } catch (err) {
                console.error(err);
                setStatus("Erreur pendant la lecture du CSV.");
                setLoadedContent("");
            }
        };

        reader.onerror = () => {
            setStatus("Erreur pendant la lecture du fichier.");
            setLoadedContent("");
        };

        reader.readAsText(file, "utf-8");
    });

    populationBtn.addEventListener("click", () => {
        loadProjectCsv("csv/population_insee_2022.csv", "population_insee_2022");
    });

    elections2020Btn.addEventListener("click", () => {
        loadProjectCsv("csv/exemple_elections_2020.csv", "exemple_elections_2020");
    });
}

function bindMapControls() {
    if (mapThemeSelect) {
        mapThemeSelect.addEventListener("change", () => {
            const theme = mapThemeSelect.value;
            const showLabels = togglePlaceLabels ? togglePlaceLabels.checked : true;
            updateBaseMap(theme, showLabels);
        });
    }

    if (togglePlaceLabels) {
        togglePlaceLabels.addEventListener("change", () => {
            const theme = mapThemeSelect ? mapThemeSelect.value : "dark";
            updateBaseMap(theme, togglePlaceLabels.checked);
        });
    }

    if (toggleTitle) {
        toggleTitle.addEventListener("change", () => {
            setTitleVisible(toggleTitle.checked);
        });
    }

    if (toggleLegend) {
        toggleLegend.addEventListener("change", () => {
            setLegendVisible(toggleLegend.checked);
        });
    }

    if (toggleBvPoints) {
        toggleBvPoints.addEventListener("change", () => {
            if (!bvMarkersLayer) return;

            if (toggleBvPoints.checked) {
                if (!map.hasLayer(bvMarkersLayer)) {
                    map.addLayer(bvMarkersLayer);
                }
            } else {
                if (map.hasLayer(bvMarkersLayer)) {
                    map.removeLayer(bvMarkersLayer);
                }
            }
        });
    }

    if (toggleZones) {
        toggleZones.addEventListener("change", () => {
            const geoJsonLayer = getGeoJsonLayer();
            if (!geoJsonLayer) return;

            if (toggleZones.checked) {
                if (!map.hasLayer(geoJsonLayer)) {
                    map.addLayer(geoJsonLayer);
                }
            } else {
                if (map.hasLayer(geoJsonLayer)) {
                    map.removeLayer(geoJsonLayer);
                }
            }
        });
    }

    if (zoneOpacitySlider) {
        zoneOpacitySlider.addEventListener("input", () => {
            const opacity = Number(zoneOpacitySlider.value) / 100;
            setZoneOpacity(opacity);
            setText(zoneOpacityValue, `${zoneOpacitySlider.value}%`);
        });

        const opacity = Number(zoneOpacitySlider.value) / 100;
        setZoneOpacity(opacity);
        setText(zoneOpacityValue, `${zoneOpacitySlider.value}%`);
    }
}

/* =========================
   BOOTSTRAP
========================= */

function init() {
    configureMapCore({
        setStatus,
        setLoadedContent,
        setLegendVisible
    });

    updateBaseMap("dark", false);

    bvMarkersLayer = createBvMarkersLayer().addTo(map);

    setLoadedContent("");
    updateLegend();
    setTitleVisible(false);
    setLegendVisible(false);

    bindColorControls();
    bindFileControls();
    bindMapControls();

    loadGeoJson();
}

init();