/* =========================
   MAP ATTRIBUTION
========================= */
export let attributionDiv = null;

function showAttribution() {
    if (!attributionDiv) {
        attributionDiv = document.createElement("div");
        attributionDiv.className = "custom-attribution";
        attributionDiv.innerHTML = `
            <span>Leaflet | © CARTO © OpenStreetMap contributors</span>
        `;
        document.body.appendChild(attributionDiv);
    }

    attributionDiv.classList.add("visible");
}

function hideAttribution() {
    if (attributionDiv) {
        attributionDiv.classList.remove("visible");
    }
}

export const AttributionToggle = L.Control.extend({
    options: {
        position: "bottomright"
    },

    onAdd() {
        const container = L.DomUtil.create("div", "leaflet-bar attribution-toggle");
        const button = L.DomUtil.create("button", "attribution-btn", container);

        button.innerHTML = "©";
        L.DomEvent.disableClickPropagation(container);

        let open = false;

        L.DomEvent.on(button, "click", () => {
            open = !open;

            if (open) {
                showAttribution();
                container.classList.add("active");
            } else {
                hideAttribution();
                container.classList.remove("active");
            }
        });

        return container;
    }
});