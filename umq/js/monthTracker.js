function getDateUTC(date) {
    const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const d2 = utcDate.getTime() + (utcDate.getTimezoneOffset() * 60 * 1000);
    return d2;
}

function formatMonthHeader(monthElem, yearElem) {
    if (monthElem) {
        const monthText = monthElem.innerText;
        const abbreviatedMonth = monthText.slice(0, 3);
        monthElem.innerText = abbreviatedMonth.toUpperCase();
    }
    if (yearElem) {
        yearElem.innerText = '';
    }
}

/* PREPRE MONTH LITEPICKER */

const preprePicker = new Litepicker({
    element: document.getElementById('prepre-month'),
    inlineMode: true,
    singleMode: false,
    lang: 'fr',
    startDate: new Date(),
    lockDays: ['*'],
    setup: (preprePicker) => {
        let currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - 2);
        preprePicker.gotoDate(currentDate);
    },
});

function selectDayPrepreMonth(date) {
    // Rechercher l'élément du jour dans le calendrier à partir du timestamp
    const dateElem = preprePicker.ui.querySelector(`[data-time="${date}"]`);
    if (dateElem) {
        dateElem.classList.add('selected-day');
    } else {
        console.error("Date not found.");
    }
}

preprePicker.on('render', async (ui) => {
    // formatMonthHeader(preprePicker.ui.querySelector('.month-item-name', preprePicker.ui.querySelector('.month-item-year')));
    // selectDayPrepreMonth(getDateUTC(new Date('2024-09-12')));
    try {
        const playDays = await getPlayDays();  // Attendre la promesse
        const currentDate = new Date();
        const filteredPlayDays = playDays.filter(playDay => {
            const playDate = new Date(playDay.date);  // Convertir la date en objet Date
            return playDate.getMonth() === currentDate.getMonth() - 2 && playDate.getFullYear() === currentDate.getFullYear();
        });
        filteredPlayDays.forEach(playDay => {
            selectDayPrepreMonth(getDateUTC(new Date(playDay.date)));
        });
    } catch (error) {
        console.error('Error loading play days:', error);
    }
});



/* PREVIOUS MONTH LITEPICKER */

const previousPicker = new Litepicker({
    element: document.getElementById('previous-month'),
    inlineMode: true,
    singleMode: false,
    lang: 'fr',
    format: 'MMM YYYY',
    startDate: new Date(),
    lockDays: ['*'],
    setup: (previousPicker) => {
        let currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - 1);
        previousPicker.gotoDate(currentDate);
    },
});

function selectDayPreviousMonth(date) {
    // Rechercher l'élément du jour dans le calendrier à partir du timestamp
    const dateElem = previousPicker.ui.querySelector(`[data-time="${date}"]`);
    if (dateElem) {
        dateElem.classList.add('selected-day');
    } else {
        console.error("Date not found.");
    }
}

previousPicker.on('render', async (ui) => {
    // formatMonthHeader(previousPicker.ui.querySelector('.month-item-name', previousPicker.ui.querySelector('.month-item-year')));
    // selectDayPreviousMonth(getDateUTC(new Date('2024-10-01')));
    try {
        const playDays = await getPlayDays();  // Attendre la promesse
        const currentDate = new Date();
        const filteredPlayDays = playDays.filter(playDay => {
            const playDate = new Date(playDay.date);  // Convertir la date en objet Date
            return playDate.getMonth() === currentDate.getMonth() - 1 && playDate.getFullYear() === currentDate.getFullYear();
        });
        filteredPlayDays.forEach(playDay => {
            selectDayPreviousMonth(getDateUTC(new Date(playDay.date)));
        });
    } catch (error) {
        console.error('Error loading play days:', error);
    }
});

/* CURRENT MONTH LITEPICKER */
// async function loadCurrentMonth() {

const picker = new Litepicker({
    element: document.getElementById('current-month'),
    inlineMode: true,
    singleMode: false,
    lang: 'fr',
    format: 'MMM YYYY',
    startDate: new Date(),
    lockDays: ['*'],
    setup: (picker) => {
        let currentDate = new Date();
        // currentDate.setMonth(currentDate.getMonth() - 1);
        picker.gotoDate(currentDate);
    },
});

function selectDayCurrentMonth(date) {
    // Rechercher l'élément du jour dans le calendrier à partir du timestamp
    const dateElem = picker.ui.querySelector(`[data-time="${date}"]`);
    if (dateElem) {
        dateElem.classList.add('selected-day');
    } else {
        console.error("Date not found.");
    }
}

picker.on('render', async (ui) => {
    // formatMonthHeader(picker.ui.querySelector('.month-item-name',picker.ui.querySelector('.month-item-year')));
    // selectDayCurrentMonth(getDateUTC(new Date('2024-11-29')));
    try {
        const playDays = await getPlayDays();  // Attendre la promesse
        const currentDate = new Date();
        const filteredPlayDays = playDays.filter(playDay => {
            const playDate = new Date(playDay.date);  // Convertir la date en objet Date
            return playDate.getMonth() === currentDate.getMonth() && playDate.getFullYear() === currentDate.getFullYear();
        });
        filteredPlayDays.forEach(playDay => {
            selectDayCurrentMonth(getDateUTC(new Date(playDay.date)));
        });
    } catch (error) {
        console.error('Error loading play days:', error);
    }
});

preprePicker.render();
previousPicker.render();
picker.render();