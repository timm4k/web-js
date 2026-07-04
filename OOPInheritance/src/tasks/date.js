"use strict";

App.renderExtendedDate = function (container) {
    function formatDateForInput(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return y + '-' + m + '-' + d;
    }

    function todayString() {
        const now = new Date();
        return formatDateForInput(now);
    }

    const hierarchy = document.createElement('div');
    hierarchy.className = 'hierarchy-block';
    hierarchy.innerHTML = '<span class="hierarchy-label">Class</span><span class="hierarchy-name">ExtendedDate</span><span class="hierarchy-label">Inheritance</span><span class="hierarchy-chain">ExtendedDate → Date</span>';

    const purpose = document.createElement('div');
    purpose.className = 'purpose-block';
    purpose.textContent = 'Pick a date from the calendar below. The display updates automatically to show the formatted date, whether it is in the future, whether its year is a leap year, and the following day';

    const dateControls = document.createElement('div');
    dateControls.className = 'date-controls';

    const datePickerLabel = document.createElement('div');
    datePickerLabel.className = 'controls-label';
    datePickerLabel.textContent = 'Select date';

    const datePicker = document.createElement('input');
    datePicker.type = 'date';
    datePicker.className = 'date-picker';
    datePicker.value = todayString();

    dateControls.appendChild(datePickerLabel);
    dateControls.appendChild(datePicker);

    const results = document.createElement('div');
    results.className = 'date-results';

    function createResultItem(id, label, desc) {
        const item = document.createElement('div');
        item.className = 'date-result-item';
        item.innerHTML = '<div class="date-result-label">' + label + '</div><div class="date-result-value" id="' + id + '"></div><div class="date-result-desc">' + desc + '</div>';
        return item;
    }

    results.appendChild(createResultItem('date-formatted', 'Formatted date', 'Shows the day and month as text.'));
    results.appendChild(createResultItem('date-future', 'Is future?', 'Checks whether the selected date is in the future.'));
    results.appendChild(createResultItem('date-leap', 'Leap year', 'Checks whether the selected year contains 366 days.'));
    results.appendChild(createResultItem('date-next', 'Next day', 'Returns the date of the following day.'));

    function updateDateDisplay() {
        const parts = datePicker.value.split('-');
        if (parts.length !== 3) {
            return;
        }
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);

        const ed = new ExtendedDate(year, month, day);

        document.getElementById('date-formatted').textContent = ed.format();
        document.getElementById('date-future').textContent = ed.isFuture() ? 'Yes' : 'No';
        document.getElementById('date-leap').textContent = ed.isLeapYear() ? 'Yes' : 'No';
        document.getElementById('date-next').textContent = ed.nextDay().format();
    }

    datePicker.addEventListener('change', updateDateDisplay);

    container.appendChild(hierarchy);
    container.appendChild(purpose);
    container.appendChild(dateControls);
    container.appendChild(results);

    updateDateDisplay();
};
