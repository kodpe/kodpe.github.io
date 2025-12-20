const panelBtn = document.getElementById('panelBtn')
const panel = document.getElementById('sidePanel')
const overlay = document.getElementById('overlay')

let sidePanelOpen = false;
function toogleSidePanel() {
     panelBtn.classList.toggle("opened");
    if (sidePanelOpen) {
        sidePanelOpen = false;
        closeSidePanel();
    }
    else {
        sidePanelOpen = true;
        openSidePanel();
    }
}

function openSidePanel() {
    panel.classList.add('open')
    overlay.classList.add('active')
    document.body.style.overflow = 'hidden'
}

function closeSidePanel() {
    panel.classList.remove('open')
    overlay.classList.remove('active')
    document.body.style.overflow = ''
}

const btnPlanning = document.getElementById('btn-planning');
const btnProgress = document.getElementById('btn-progress');
const btnSegments = document.getElementById('btn-segments');
const btnItems = document.getElementById('btn-items');
const btnSpecs = document.getElementById('btn-specs');

const cntPlanning = document.getElementById('cnt-planning');
const cntProgress = document.getElementById('cnt-progress');
const cntSegments = document.getElementById('cnt-segments');
const cntItems = document.getElementById('cnt-items');
const cntSpecs = document.getElementById('cnt-specs');

cntPlanning.classList.add('disabled'); // TMP
cntSegments.classList.add('disabled');
cntItems.classList.add('disabled');
cntSpecs.classList.add('disabled');

function disableAllCnt() {
    cntPlanning.classList.add('disabled');
    cntProgress.classList.add('disabled');
    cntSegments.classList.add('disabled');
    cntItems.classList.add('disabled');
    cntSpecs.classList.add('disabled');
}

document.addEventListener("DOMContentLoaded", () => {
    panelBtn.addEventListener('click', toogleSidePanel);
    overlay.addEventListener('click', toogleSidePanel);

    btnPlanning.addEventListener("click", () => {
        disableAllCnt();
        toogleSidePanel();
        cntPlanning.classList.remove('disabled');
    });

    btnProgress.addEventListener("click", () => {
        disableAllCnt();
        toogleSidePanel();
        cntProgress.classList.remove('disabled');
        revisionsChart.reset();
        revisionsChart.update();
    });

    btnSegments.addEventListener("click", () => {
        disableAllCnt();
        toogleSidePanel();
        cntSegments.classList.remove('disabled');
    });

    btnItems.addEventListener("click", () => {
        disableAllCnt();
        toogleSidePanel();
        cntItems.classList.remove('disabled');
    });

    btnSpecs.addEventListener("click", () => {
        disableAllCnt();
        toogleSidePanel();
        cntSpecs.classList.remove('disabled');
    });

});