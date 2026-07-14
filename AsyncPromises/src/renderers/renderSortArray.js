"use strict";

App.renderSortArray = function (container) {
    var card = createCard("Sort Array", "Promise",
        "Demonstrates Promise-based sorting. Enter an array and observe the asynchronous sorting with a 2-second delay");

    var inputSection = createSection("Input", false);
    var inputRow = document.createElement("div");
    inputRow.className = "controls-row";

    var arrayInput = createInput("text", "Example: 8, 2, 5, 1, 9");
    var sortBtn = createButton("Sort");

    inputRow.appendChild(arrayInput);
    inputRow.appendChild(sortBtn);
    inputSection.appendChild(inputRow);

    var status = createSectionWithSteps("Status", true);
    var output = createResultSection("Result", true);

    sortBtn.addEventListener("click", function () {
        var raw = arrayInput.value.trim();
        status.stepList.innerHTML = "";
        status.section.style.display = "";
        output.section.style.display = "none";
        sortBtn.disabled = true;

        var numbers = validateNumberArray(raw, status.stepList, sortBtn);
        if (!numbers) return;

        status.stepList.appendChild(createStep(MSG.INPUT_LABEL + " [" + numbers.join(", ") + "]", "info"));
        status.stepList.appendChild(createArrow());

        runSortOperation(numbers, status.stepList, output.section, output.resultBox, sortBtn, sortArray);
    });

    card.appendChild(inputSection);
    card.appendChild(status.section);
    card.appendChild(output.section);

    container.appendChild(card);
};
