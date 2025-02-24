import { removeDots, approxBigIntToWords, bigIntToScientificNotation, bigIntToInternationalFormat } from "./lib.js";
// ---------------------
const hoverDiv = document.getElementById('tab');
hoverDiv.addEventListener('mousemove', (event) => {
    const xOffset = 10; // Décalage horizontal
    const yOffset = 10; // Décalage vertical
    description.style.left = `${event.pageX + xOffset}px`; // Position horizontale à côté de la souris
    description.style.top = `${event.pageY + yOffset}px`;  // Position verticale juste en dessous
});
//
const description = document.getElementById('description');
//
const hoverSlicerFromage = document.getElementById('cnt-img-slicer-fromage');
hoverSlicerFromage.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    description.innerHTML = 'La trancheuse à fromage';
});
hoverSlicerFromage.addEventListener('mouseleave', () => {
    description.classList.add('disabled');
});
//
const hoverSlicerPain = document.getElementById('cnt-img-slicer-pain');
hoverSlicerPain.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    description.innerHTML = 'La trancheuse à pain';
});
hoverSlicerPain.addEventListener('mouseleave', () => {
    description.classList.add('disabled');
});
//
const hoverMachineFromage = document.getElementById('cnt-img-machine-fromage');
hoverMachineFromage.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    description.innerHTML = 'La machine à fromage';
});
hoverMachineFromage.addEventListener('mouseleave', () => {
    description.classList.add('disabled');
});
//
const hoverMachinePain = document.getElementById('cnt-img-machine-pain');
hoverMachinePain.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    description.innerHTML = 'La machine à pain';
});
hoverMachinePain.addEventListener('mouseleave', () => {
    description.classList.add('disabled');
});
//
const hoverTartine = document.getElementById('cnt-img-tartine');
hoverTartine.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    description.innerHTML = 'La tartine';
});
hoverTartine.addEventListener('mouseleave', () => {
    description.classList.add('disabled');
});
//
const hoverBras = document.getElementById('cnt-img-bras');
hoverBras.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    description.innerHTML = 'Le bras';
});
hoverBras.addEventListener('mouseleave', () => {
    description.classList.add('disabled');
});
//
const hoverFromage = document.getElementById('cnt-img-fromage');
hoverFromage.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    description.innerHTML = 'Le fromage';
});
hoverFromage.addEventListener('mouseleave', () => {
    description.classList.add('disabled');
});
//
const hoverPain = document.getElementById('cnt-img-pain');
hoverPain.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    description.innerHTML = 'Le pain';
});
hoverPain.addEventListener('mouseleave', () => {
    description.classList.add('disabled');
});
//
const hoverCntPain = document.getElementById('cnt-pain');
hoverCntPain.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    let bg = BigInt(removeDots(hoverCntPain.innerHTML));
    description.innerHTML = approxBigIntToWords(bg) + ' (' + bigIntToScientificNotation(bg) + ')';
});
hoverCntPain.addEventListener('mouseleave', () => {
    description.classList.add('disabled');
});
//
const hoverCntFromage = document.getElementById('cnt-fromage');
hoverCntFromage.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    let bg = BigInt(removeDots(hoverCntFromage.innerHTML));
    description.innerHTML = approxBigIntToWords(bg) + ' (' + bigIntToScientificNotation(bg) + ')';
});
hoverCntFromage.addEventListener('mouseleave', () => {
    description.classList.add('disabled');
});
//
const hoverCntBras = document.getElementById('cnt-bras');
hoverCntBras.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    let bg = BigInt(removeDots(hoverCntBras.innerHTML));
    description.innerHTML = approxBigIntToWords(bg) + ' (' + bigIntToScientificNotation(bg) + ')';
});
hoverCntBras.addEventListener('mouseleave', () => {
    description.classList.add('disabled');
});
//
const hoverCntTartine = document.getElementById('cnt-tartine');
hoverCntTartine.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    let bg = BigInt(removeDots(hoverCntTartine.innerHTML));
    description.innerHTML = approxBigIntToWords(bg) + ' (' + bigIntToScientificNotation(bg) + ')';
});
hoverCntTartine.addEventListener('mouseleave', () => {
    description.classList.add('disabled');
});
//
const hoverCntSlicerPain = document.getElementById('cnt-slicer-pain');
hoverCntSlicerPain.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    let bg = BigInt(removeDots(hoverCntSlicerPain.innerHTML));
    description.innerHTML = approxBigIntToWords(bg) + ' (' + bigIntToScientificNotation(bg) + ')';
});
hoverCntSlicerPain.addEventListener('mouseleave', () => {
    description.classList.add('disabled');
});
//
const hoverCntSlicerFromage = document.getElementById('cnt-slicer-fromage');
hoverCntSlicerFromage.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    let bg = BigInt(removeDots(hoverCntSlicerFromage.innerHTML));
    description.innerHTML = approxBigIntToWords(bg) + ' (' + bigIntToScientificNotation(bg) + ')';
});
hoverCntSlicerFromage.addEventListener('mouseleave', () => {
    description.classList.add('disabled');
});
//
const hoverCntMachinePain = document.getElementById('cnt-machine-pain');
hoverCntMachinePain.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    let bg = BigInt(removeDots(hoverCntMachinePain.innerHTML));
    description.innerHTML = approxBigIntToWords(bg) + ' (' + bigIntToScientificNotation(bg) + ')';
});
hoverCntMachinePain.addEventListener('mouseleave', () => {
    description.classList.add('disabled');
});
//
const hoverCntMachineFromage = document.getElementById('cnt-machine-fromage');
hoverCntMachineFromage.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    let bg = BigInt(removeDots(hoverCntMachineFromage.innerHTML));
    description.innerHTML = approxBigIntToWords(bg) + ' (' + bigIntToScientificNotation(bg) + ')';
});
hoverCntMachineFromage.addEventListener('mouseleave', () => {
    description.classList.add('disabled');
});
//