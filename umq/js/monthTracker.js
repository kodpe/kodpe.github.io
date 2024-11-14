function getDateUTC(date) {
    const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const d2 = utcDate.getTime() + (utcDate.getTimezoneOffset() * 60 * 1000);
    return d2;
}

/* PREVIOUS MONTH LITEPICKER */

const previousPicker = new Litepicker({
    element: document.getElementById('previous-month'),
    inlineMode: true,
    singleMode: false,
    lang: 'fr',
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

previousPicker.on('render', (ui) => {
    selectDayPreviousMonth(getDateUTC(new Date('2024-10-01')));
    selectDayPreviousMonth(getDateUTC(new Date('2024-10-02')));
    selectDayPreviousMonth(getDateUTC(new Date('2024-10-03')));
});

setTimeout(() => {
previousPicker.render();
}, 500);

/* CURRENT MONTH LITEPICKER */

const picker = new Litepicker({
    element: document.getElementById('current-month'),
    inlineMode: true,
    singleMode: false,
    lang: 'fr',
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

picker.on('render', (ui) => {
    selectDayCurrentMonth(getDateUTC(new Date('2024-11-01')));
    selectDayCurrentMonth(getDateUTC(new Date('2024-11-10')));
    selectDayCurrentMonth(getDateUTC(new Date('2024-11-24')));
});

setTimeout(() => {
    picker.render();
}, 500);
