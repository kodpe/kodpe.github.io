const btnBurger = document.querySelector(".menu");
const target = document.querySelector(".burger-menu-panel");
const cntPlanning = document.getElementById('cnt-planning');
const cntProgression = document.getElementById('cnt-progression');
const cntSegments = document.getElementById('cnt-segments');
const cntItems = document.getElementById('cnt-items');
const btnCntPlanning = document.getElementById('cnt-planning-btn');
const btnCntProgression = document.getElementById('cnt-progression-btn');
const btnCntSegments = document.getElementById('cnt-segments-btn');
const btnCntItems = document.getElementById('cnt-items-btn');

// init
cntProgression.classList.add('disabled');
cntSegments.classList.add('disabled');
cntItems.classList.add('disabled');

document.addEventListener("DOMContentLoaded", () => {
    btnBurger.addEventListener("click", () => {
        toggleBtnBurger();
    });
    btnCntPlanning.addEventListener("click", () => {
        toggleBtnBurger();
        cntPlanning.classList.remove('disabled');
        cntProgression.classList.add('disabled');
        cntSegments.classList.add('disabled');
        cntItems.classList.add('disabled');
    });
    btnCntProgression.addEventListener("click", () => {
        toggleBtnBurger();
        cntPlanning.classList.add('disabled');
        cntProgression.classList.remove('disabled');
        cntSegments.classList.add('disabled');
        cntItems.classList.add('disabled');
    });
    btnCntSegments.addEventListener("click", () => {
        toggleBtnBurger();
        cntPlanning.classList.add('disabled');
        cntProgression.classList.add('disabled');
        cntSegments.classList.remove('disabled');
        cntItems.classList.add('disabled');
    });
    btnCntItems.addEventListener("click", () => {
        toggleBtnBurger();
        cntPlanning.classList.add('disabled');
        cntProgression.classList.add('disabled');
        cntSegments.classList.add('disabled');
        cntItems.classList.remove('disabled');
    });
});

let isBurgerOpen = false;
function toggleBtnBurger() {
    const isOpen = btnBurger.classList.toggle("opened");
    btnBurger.setAttribute("aria-expanded", isOpen);
    target.classList.toggle("active", isOpen);
    if (isBurgerOpen == false) {
        isBurgerOpen = true;
        cntPlanning.classList.add('disabled');
        cntProgression.classList.add('disabled');
        cntSegments.classList.add('disabled');
        cntItems.classList.add('disabled');
    }
    else {
        isBurgerOpen = false;
    }
}
