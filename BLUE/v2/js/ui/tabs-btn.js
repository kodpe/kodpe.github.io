// TABS BTN
const tabButtons = document.querySelectorAll(".tab-btn");
const codeViewers = document.querySelectorAll(".carousel-inner .code-viewer");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const tabIndex = parseInt(btn.dataset.tab);

        // active button
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // show correct code-viewer
        codeViewers.forEach((cv, i) => {
            cv.style.display = i === tabIndex ? "block" : "none";
        });
    });
});