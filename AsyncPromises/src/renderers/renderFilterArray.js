"use strict";

App.renderFilterArray = function (container) {
    var selectedFilter = "even";

    var card = createCard("Filter Array", "Callbacks",
        "Demonstrates array filtering with callbacks. Enter values, choose a filter, and watch each element being evaluated");

    var inputSection = createSection("Input", false);
    var inputRow = document.createElement("div");
    inputRow.className = "controls-row";

    var arrayInput = createInput("text", "Example: 1, 2, 3, 4, 5");
    var filterBtn = createButton("Filter");

    inputRow.appendChild(arrayInput);
    inputRow.appendChild(filterBtn);

    var toggle = createToggleGroup([
        { text: "Even numbers", value: "even" },
        { text: "Short words (\u2264 4 chars)", value: "short" }
    ]);

    inputSection.appendChild(inputRow);
    inputSection.appendChild(toggle.group);

    var processing = createSectionWithSteps("Processing", true);
    var output = createResultSection("Result", true);

    toggle.buttons[0].addEventListener("click", function () {
        selectedFilter = "even";
        activateToggle(toggle.buttons[0], toggle.buttons[1]);
    });

    toggle.buttons[1].addEventListener("click", function () {
        selectedFilter = "short";
        activateToggle(toggle.buttons[1], toggle.buttons[0]);
    });

    filterBtn.addEventListener("click", function () {
        var raw = arrayInput.value.trim();
        processing.section.style.display = "none";
        output.section.style.display = "none";

        if (isEmptyInput(raw)) {
            showError(processing.stepList, MSG.TITLE_INPUT_REQUIRED, MSG.INPUT_REQUIRED);
            processing.section.style.display = "";
            return;
        }

        var array = parseArrayInput(raw);

        if (array.length === 0) {
            showError(processing.stepList, MSG.TITLE_INPUT_REQUIRED, MSG.INPUT_REQUIRED);
            processing.section.style.display = "";
            return;
        }

        if (selectedFilter === "even" && !hasOnlyNumbers(array)) {
            showError(processing.stepList, MSG.TITLE_INVALID_INPUT, MSG.FILTER_NUMBERS_ONLY);
            processing.section.style.display = "";
            return;
        }

        var filterFn = selectedFilter === "even" ? isEven : isShortWord;
        var filterName = selectedFilter === "even" ? "isEven" : "isShortWord";

        processing.stepList.innerHTML = "";
        processing.section.style.display = "";

        processing.stepList.appendChild(createStep(MSG.ORIGINAL_LABEL + " [" + array.join(", ") + "]", "info"));
        processing.stepList.appendChild(createStep(MSG.FILTER_LABEL + " " + filterName, "info"));
        processing.stepList.appendChild(createArrow());

        var i = 0;

        function showNext() {
            if (i >= array.length) {
                processing.stepList.appendChild(createArrow());

                var result = filterArray(array, filterFn);

                processing.stepList.appendChild(createStep(MSG.RESULT_LABEL + " [" + result.join(", ") + "]", "done"));

                showSuccess(output.section, output.resultBox, "[" + result.join(", ") + "]");
                return;
            }

            var val = array[i];
            var numVal = selectedFilter === "even" ? Number(val) : val;
            var passed = filterFn(numVal);

            processing.stepList.appendChild(createStep(MSG.CHECKING + " " + val, "info"));

            var resultText;
            if (selectedFilter === "even") {
                resultText = passed ? "Even number \u2714" : "Odd number \u2718 \u2014 removed";
            } else {
                resultText = "Length: " + val.length + (passed ? " \u2714" : " \u2718 \u2014 removed");
            }

            processing.stepList.appendChild(createStep(resultText, passed ? "done" : "error"));

            i++;
            setTimeout(showNext, 120);
        }

        showNext();
    });

    card.appendChild(inputSection);
    card.appendChild(processing.section);
    card.appendChild(output.section);

    container.appendChild(card);
};
