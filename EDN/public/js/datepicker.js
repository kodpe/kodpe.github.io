flatpickr("#date-range", {
  locale: "fr",
  mode: "range",
  dateFormat: "d/m/Y",
  minDate: "today",
  showMonths: 2,
  onClose(selectedDates) {
    if (selectedDates.length === 2) {
      dates.push({
        key: dates.length + 1,
        start: selectedDates[0],
        end: selectedDates[1]
      });
    }
  }
});
