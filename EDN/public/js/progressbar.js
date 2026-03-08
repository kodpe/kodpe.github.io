class ProgressBar {
    constructor(rootElement, options = {}) {
        this.el = rootElement;

        this.done = Number(options.done ?? 0);
        this.goal = Number(options.goal ?? 100);

        this.flags = {
            showBar: options.showBar ?? true,
            showPercent: options.showPercent ?? true,
            showValues: options.showValues ?? false,
        };

        this.colors = {
            start: options.startColor ?? "#00bbff",
            end: options.endColor ?? "#bb00ff",
            //   start: options.startColor ?? "#00ffff",
            //   end: options.endColor ?? "#ff00ff",
        };

        this.labelEl = this.el.querySelector(".pb-progressbar-label");
        this.fillEl = this.el.querySelector(".pb-progressbar-fill");
        this.valuesEl = this.el.querySelector(".pb-progressbar-values");

        this.applyFlags();
        this.render(false);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.render(true);
            });
        });
    }

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    getPercent() {
        if (this.goal <= 0) return 0;
        return this.clamp((this.done / this.goal) * 100, 0, 100);
    }

    hexToRgb(hex) {
        let clean = hex.replace("#", "").trim();

        if (clean.length === 3) {
            clean = clean.split("").map(c => c + c).join("");
        }

        const int = parseInt(clean, 16);

        return {
            r: (int >> 16) & 255,
            g: (int >> 8) & 255,
            b: int & 255,
        };
    }

    rgbToHex(r, g, b) {
        const toHex = (v) => v.toString(16).padStart(2, "0");
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    mixColors(hex1, hex2, ratio) {
        const c1 = this.hexToRgb(hex1);
        const c2 = this.hexToRgb(hex2);

        const t = this.clamp(ratio, 0, 1);

        const r = Math.round(c1.r + (c2.r - c1.r) * t);
        const g = Math.round(c1.g + (c2.g - c1.g) * t);
        const b = Math.round(c1.b + (c2.b - c1.b) * t);

        return this.rgbToHex(r, g, b);
    }

    getFillColor(percent) {
        return this.mixColors(
            this.colors.start,
            this.colors.end,
            percent / 100
        );
    }

    applyFlags() {
        this.el.classList.toggle("hide-bar", !this.flags.showBar);
        // this.el.classList.toggle("hide-percent", !this.flags.showPercent);
        this.el.classList.toggle("hide-values", !this.flags.showValues);
    }

    updateLabel(percent) {
        if (!this.labelEl) return;

        this.labelEl.classList.remove("edge-left", "edge-right");

        if (percent <= 6) {
            this.labelEl.classList.add("edge-left");
        } else if (percent >= 94) {
            this.labelEl.classList.add("edge-right");
        }

        this.labelEl.style.left = percent + "%";
        this.labelEl.textContent = Math.round(percent) + "%";
    }

    updateValues() {
        if (!this.valuesEl) return;
        this.valuesEl.textContent = `${this.done}/${this.goal}`;
    }

    render(animated = true) {
        const percent = this.getPercent();
        const fillColor = this.getFillColor(percent);

        if (!animated) {
            const prevFillTransition = this.fillEl?.style.transition;
            const prevLabelTransition = this.labelEl?.style.transition;

            if (this.fillEl) this.fillEl.style.transition = "none";
            if (this.labelEl) this.labelEl.style.transition = "none";

            if (this.fillEl) {
                this.fillEl.style.width = percent + "%";
                this.fillEl.style.backgroundColor = fillColor;
            }

            this.updateLabel(percent);
            this.updateValues();

            this.el.offsetHeight;

            if (this.fillEl) this.fillEl.style.transition = prevFillTransition || "";
            if (this.labelEl) this.labelEl.style.transition = prevLabelTransition || "";
            return;
        }

        if (this.fillEl) {
            this.fillEl.style.width = percent + "%";
            this.fillEl.style.backgroundColor = fillColor;
        }

        this.updateLabel(percent);
        this.updateValues();
    }

    setProgress(done, goal = this.goal) {
        this.done = Number(done);
        this.goal = Number(goal);
        this.render(true);
    }

    setFlags(newFlags = {}) {
        this.flags = {
            ...this.flags,
            ...newFlags,
        };
        this.applyFlags();
        this.render(false);
    }

    setColors(startColor, endColor) {
        this.colors.start = startColor;
        this.colors.end = endColor;
        this.render(true);
    }

    getElement() {
        return this.el;
    }
}

function createProgressBar(options = {}) {
    const root = document.createElement("div");
    root.className = "pb-progressbar-widget";

    root.innerHTML = `
        <div class="pb-progressbar-row">
          <div class="pb-progressbar-main">
            <div class="pb-progressbar-label">0%</div>
            <div class="pb-progressbar-track">
              <div class="pb-progressbar-fill"></div>
            </div>
          </div>
          <div class="pb-progressbar-values">0/0</div>
        </div>
      `;

    return new ProgressBar(root, options);
}

/* =========================
   EXEMPLES D'UTILISATION
   ========================= */

/*
const container = document.getElementById("bars-container");

const bar0 = createProgressBar();
const bar1 = createProgressBar({
    done: 0,
    goal: 100,
    showBar: true,
    showPercent: true,
    showValues: false,
});

const bar2 = createProgressBar({
    done: 0,
    goal: 100,
    showBar: true,
    showPercent: true,
    showValues: false,
});
const bar3 = createProgressBar();
const bar4 = createProgressBar();
const bar5 = createProgressBar();

container.appendChild(bar0.getElement());
{
    const spacer = document.createElement("div");
    spacer.style.height = "22px";
    container.appendChild(spacer);
}

container.appendChild(bar1.getElement());

container.appendChild(bar2.getElement());
container.appendChild(bar3.getElement());
container.appendChild(bar4.getElement());
{
    const spacer = document.createElement("div");
    spacer.style.height = "22px";
    container.appendChild(spacer);
}
container.appendChild(bar5.getElement());
{
    const spacer = document.createElement("div");
    spacer.style.height = "22px";
    container.appendChild(spacer);
}

setTimeout(() => {
    bar0.setProgress(0, 3);
    bar1.setProgress(1, 3);
    bar2.setProgress(2, 3);
    bar3.setProgress(3, 3);
    bar4.setProgress(2, 3);
    bar5.setProgress(1, 3);
}, 1800);

*/