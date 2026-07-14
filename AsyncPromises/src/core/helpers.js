"use strict";

function activateToggle(activeButton, inactiveButton) {
    activeButton.classList.add("active");
    inactiveButton.classList.remove("active");
}

function validateNumberArray(raw, stepList, btn) {
    if (isEmptyInput(raw)) {
        showError(stepList, MSG.TITLE_INPUT_REQUIRED, MSG.INPUT_REQUIRED);
        btn.disabled = false;
        return null;
    }

    var numbers = parseNumberArray(raw);

    if (numbers === null) {
        showError(stepList, MSG.TITLE_INPUT_REQUIRED, MSG.INPUT_REQUIRED);
        btn.disabled = false;
        return null;
    }

    if (numbers === false) {
        showError(stepList, MSG.TITLE_INVALID_INPUT, MSG.NUMBERS_ONLY);
        btn.disabled = false;
        return null;
    }

    return numbers;
}

function runSortOperation(numbers, stepList, outputSection, resultBox, btn, executeFn) {
    stepList.appendChild(createStep(MSG.SORTING, "active"));
    var sortingStep = stepList.lastChild;

    executeFn(numbers).then(function (sorted) {
        stepList.removeChild(sortingStep);
        stepList.appendChild(createStep(MSG.SORTING_COMPLETED, "done"));
        showSuccess(outputSection, resultBox, "[" + sorted.join(", ") + "]");
        btn.disabled = false;
    }).catch(function (error) {
        stepList.removeChild(sortingStep);
        showError(stepList, MSG.TITLE_OPERATION_FAILED, error.message);
        btn.disabled = false;
    });
}
