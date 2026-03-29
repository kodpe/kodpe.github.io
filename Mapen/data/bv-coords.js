export const labels = [
    { name: "BV 1", coords: [49.43015, 1.053] },
    { name: "BV 2", coords: [49.43015, 1.0623] },
    { name: "BV 3", coords: [49.432, 1.0665] },
    { name: "BV 4", coords: [49.4262, 1.0641] },
    { name: "BV 5", coords: [49.4238, 1.0616] },
    { name: "BV 6", coords: [49.4195, 1.059] },
    { name: "BV 7", coords: [49.4209, 1.0582] },
    { name: "BV 8", coords: [49.415, 1.067] },
    { name: "BV 9", coords: [49.4132, 1.0692] },
    { name: "BV 10", coords: [49.4135, 1.068] },
    { name: "BV 11", coords: [49.4295, 1.06] },
    { name: "BV 12", coords: [49.414, 1.066] },
    { name: "BV 13", coords: [49.4271, 1.0595] },
    { name: "BV 14", coords: [49.4308, 1.055] },
    { name: "BV 15", coords: [49.4263, 1.0592] }
];

/* =========================
   LABELS / MARKERS
========================= */

function createLabel(text) {
    return L.divIcon({
        className: "custom-map-label",
        html: `
            <div class="map-label">
                <div class="map-label-chip">${text}</div>
                <div class="map-label-dot"></div>
            </div>
        `,
        iconSize: [120, 40],
        iconAnchor: [60, 32]
    });
}

export function createBvMarkersLayer() {
    const layer = L.layerGroup();

    labels.forEach((label) => {
        L.marker(label.coords, {
            icon: createLabel(label.name)
        }).addTo(layer);
    });

    return layer;
}