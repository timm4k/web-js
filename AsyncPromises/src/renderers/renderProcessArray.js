"use strict";

App.renderProcessArray = function (container) {
    var selectedCallback = "double";

    var card = createCard("Process Array", "Callbacks",
        "Demonstrates callback functions. Enter values, choose a callback, and see how each element is transformed");

    var inputSection = createSection("Input", false);
    var inputRow = document.createElement("div");
    inputRow.className = "controls-row";

    var arrayInput = createInput("text", "Example: 1, 2, 3, 4, 5");
    var processBtn = createButton("Process");

    inputRow.appendChild(arrayInput);
    inputRow.appendChild(processBtn);

    var toggle = createToggleGroup([
        { text: "Double elements", value: "double" },
        { text: "Reverse strings", value: "reverse" }
    ]);

    inputSection.appendChild(inputRow);
    inputSection.appendChild(toggle.group);

    var result = createResultSection("Result", true);

    toggle.buttons[0].addEventListener("click", function () {
        selectedCallback = "double";
        activateToggle(toggle.buttons[0], toggle.buttons[1]);
    });

    toggle.buttons[1].addEventListener("click", function () {
        selectedCallback = "reverse";
        activateToggle(toggle.buttons[1], toggle.buttons[0]);
    });

    processBtn.addEventListener("click", function () {
        var raw = arrayInput.value.trim();
        result.section.style.display = "none";

        if (isEmptyInput(raw)) {
            showError(result.resultBox, MSG.TITLE_INPUT_REQUIRED, MSG.INPUT_REQUIRED);
            result.section.style.display = "";
            return;
        }

        var array = parseArrayInput(raw);

        if (array.length === 0) {
            showError(result.resultBox, MSG.TITLE_INPUT_REQUIRED, MSG.INPUT_REQUIRED);
            result.section.style.display = "";
            return;
        }

        var callbackFn = selectedCallback === "double" ? doubleElement : reverseElement;

        if (selectedCallback === "double" && !hasOnlyNumbers(array)) {
            showError(result.resultBox, MSG.TITLE_INVALID_INPUT, MSG.NUMBERS_ONLY);
            result.section.style.display = "";
            return;
        }

        var processed = processArray(array, callbackFn);

        var lines = [];
        for (var j = 0; j < array.length; j++) {
            lines.push("Element " + (j + 1) + ":");
            if (selectedCallback === "double") {
                lines.push(array[j] + " \u2192 " + processed[j]);
            } else {
                lines.push("\u201C" + array[j] + "\u201D \u2192 \u201C" + processed[j] + "\u201D");
            }
            if (j < array.length - 1) {
                lines.push("");
            }
        }

        showSuccess(result.section, result.resultBox, lines.join("\n"));
    });

    card.appendChild(inputSection);
    card.appendChild(result.section);

    container.appendChild(card);
};
