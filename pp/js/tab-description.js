import { cnt_nb_fromage, cnt_nb_pain, cnt_need_pain, getFromageNeedPerHourStr, getFromageProdStr, getPainNeedPerHourStr, getPainProdStr } from "./itemsManager.js";
import { removeSpaces, approxBigIntToWords, bigIntToScientificNotation, bigIntToInternationalFormat } from "./lib.js";
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
function descriptionOFF() {
    description.classList.add('disabled');
}
//
function descriptionLePain() {
    description.classList.remove('disabled');
    description.innerHTML = 'Le pain\
    <br>\
    <br><span style="color: #FFFFFF;">Réserve</span><br>\
    '+ approxBigIntToWords(cnt_nb_pain) + ' (' + bigIntToScientificNotation(cnt_nb_pain) + ')\
    <br>\
    <br><span style="color: #00FA9A;">Production <br>\
    + '+ getPainProdStr() +' / h </span>\
    <br>\
    <br><span style="color: #FF6347;">Consommation <br>\
    - '+ getPainNeedPerHourStr() +' / h </span>\
    ';
}
//
function descriptionLeFromage() {
    description.classList.remove('disabled');
    description.innerHTML = 'Le fromage\
    <br>\
    <br><span style="color: #FFFFFF;">Réserve</span><br>\
    > '+ approxBigIntToWords(cnt_nb_fromage) + ' (' + bigIntToScientificNotation(cnt_nb_fromage) + ')\
    <br>\
    <br><span style="color: #00FA9A;">Production <br>\
    + '+ getFromageProdStr() +' / h </span>\
    <br>\
    <br><span style="color: #FF6347;">Consommation <br>\
    - '+ getFromageNeedPerHourStr() +' / h </span>\
    ';
}
//
const hoverTartipod = document.getElementById('cnt-img-tartipod');
if (hoverTartipod) {
    hoverTartipod.addEventListener('mouseenter', () => {
        description.classList.remove('disabled');
        description.innerHTML = 'Le tartipod';
    });
    hoverTartipod.addEventListener('mouseleave', () => {
        descriptionOFF();
    });
}
//
const hoverSlicerFromage = document.getElementById('cnt-img-slicer-fromage');
if (hoverSlicerFromage) {
    hoverSlicerFromage.addEventListener('mouseenter', () => {
        description.classList.remove('disabled');
        description.innerHTML = 'La trancheuse à fromage';
    });
    hoverSlicerFromage.addEventListener('mouseleave', () => {
        descriptionOFF();
    });
}
//
const hoverSlicerPain = document.getElementById('cnt-img-slicer-pain');
if (hoverSlicerPain) {
    hoverSlicerPain.addEventListener('mouseenter', () => {
        description.classList.remove('disabled');
        description.innerHTML = 'La trancheuse à pain';
    });
    hoverSlicerPain.addEventListener('mouseleave', () => {
        descriptionOFF();
    });
}
//
const hoverMachineFromage = document.getElementById('cnt-img-machine-fromage');
if (hoverMachineFromage) {
    hoverMachineFromage.addEventListener('mouseenter', () => {
        description.classList.remove('disabled');
        description.innerHTML = 'La machine à fromage';
    });
    hoverMachineFromage.addEventListener('mouseleave', () => {
        descriptionOFF();
    });
}
//
const hoverMachinePain = document.getElementById('cnt-img-machine-pain');
if (hoverMachinePain) {
    hoverMachinePain.addEventListener('mouseenter', () => {
        description.classList.remove('disabled');
        description.innerHTML = 'La machine à pain';
    });
    hoverMachinePain.addEventListener('mouseleave', () => {
        descriptionOFF();
    });
}
//
const hoverTartine = document.getElementById('cnt-img-tartine');
hoverTartine.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    description.innerHTML = 'La tartine';
});
hoverTartine.addEventListener('mouseleave', () => {
        descriptionOFF();
});
//
const hoverBras = document.getElementById('cnt-img-bras');
hoverBras.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    description.innerHTML = 'Le bras';
});
hoverBras.addEventListener('mouseleave', () => {
        descriptionOFF();
});
//
const hoverFromage = document.getElementById('cnt-img-fromage');
hoverFromage.addEventListener('mouseenter', () => {
    descriptionLeFromage();
});
hoverFromage.addEventListener('mouseleave', () => {
        descriptionOFF();
});
//
const hoverPain = document.getElementById('cnt-img-pain');
hoverPain.addEventListener('mouseenter', () => {
    descriptionLePain();
});
hoverPain.addEventListener('mouseleave', () => {
        descriptionOFF();
});
//
const hoverCntPain = document.getElementById('cnt-pain');
hoverCntPain.addEventListener('mouseenter', () => {
    descriptionLePain();
});
hoverCntPain.addEventListener('mouseleave', () => {
        descriptionOFF();
});
//
const hoverCntFromage = document.getElementById('cnt-fromage');
hoverCntFromage.addEventListener('mouseenter', () => {
    descriptionLeFromage();
});
hoverCntFromage.addEventListener('mouseleave', () => {
        descriptionOFF();
});
//
const hoverCntBras = document.getElementById('cnt-bras');
hoverCntBras.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    let bg = BigInt(removeSpaces(hoverCntBras.innerHTML));
    description.innerHTML = approxBigIntToWords(bg) + ' (' + bigIntToScientificNotation(bg) + ')';
});
hoverCntBras.addEventListener('mouseleave', () => {
        descriptionOFF();
});
//
const hoverCntTartine = document.getElementById('cnt-tartine');
hoverCntTartine.addEventListener('mouseenter', () => {
    description.classList.remove('disabled');
    let bg = BigInt(removeSpaces(hoverCntTartine.innerHTML));
    description.innerHTML = approxBigIntToWords(bg) + ' (' + bigIntToScientificNotation(bg) + ')';
});
hoverCntTartine.addEventListener('mouseleave', () => {
        descriptionOFF();
});
//
const hoverCntSlicerPain = document.getElementById('cnt-slicer-pain');
if (hoverCntSlicerPain) {
    hoverCntSlicerPain.addEventListener('mouseenter', () => {
        description.classList.remove('disabled');
        let bg = BigInt(removeSpaces(hoverCntSlicerPain.innerHTML));
        description.innerHTML = approxBigIntToWords(bg) + ' (' + bigIntToScientificNotation(bg) + ')';
    });
    hoverCntSlicerPain.addEventListener('mouseleave', () => {
        descriptionOFF();
    });
}
//
const hoverCntSlicerFromage = document.getElementById('cnt-slicer-fromage');
if (hoverCntSlicerFromage) {
    hoverCntSlicerFromage.addEventListener('mouseenter', () => {
        description.classList.remove('disabled');
        let bg = BigInt(removeSpaces(hoverCntSlicerFromage.innerHTML));
        description.innerHTML = approxBigIntToWords(bg) + ' (' + bigIntToScientificNotation(bg) + ')';
    });
    hoverCntSlicerFromage.addEventListener('mouseleave', () => {
        descriptionOFF();
    });
}
//
const hoverCntMachinePain = document.getElementById('cnt-machine-pain');
if (hoverCntMachinePain) {
    hoverCntMachinePain.addEventListener('mouseenter', () => {
        description.classList.remove('disabled');
        let bg = BigInt(removeSpaces(hoverCntMachinePain.innerHTML));
        description.innerHTML = approxBigIntToWords(bg) + ' (' + bigIntToScientificNotation(bg) + ')';
    });
    hoverCntMachinePain.addEventListener('mouseleave', () => {
        descriptionOFF();
    });
}
//
const hoverCntMachineFromage = document.getElementById('cnt-machine-fromage');
if (hoverCntMachineFromage) {
    hoverCntMachineFromage.addEventListener('mouseenter', () => {
        description.classList.remove('disabled');
        let bg = BigInt(removeSpaces(hoverCntMachineFromage.innerHTML));
        description.innerHTML = approxBigIntToWords(bg) + ' (' + bigIntToScientificNotation(bg) + ')';
    });
    hoverCntMachineFromage.addEventListener('mouseleave', () => {
        descriptionOFF();
    });
}
//