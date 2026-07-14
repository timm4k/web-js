"use strict";

App.renderAsyncSort = function (container) {
    var card = createCard("Async Array Sorting", "Async/Await",
        "Demonstrates async/await instead of Promise chaining. Enter an array and observe the asynchronous flow");

    var inputSection = createSection("Input", false);
    var inputRow = document.createElement("div");
    inputRow.className = "controls-row";

    var arrayInput = createInput("text", "Example: 7, 2, 10, 1, 4");
    var sortBtn = createButton("Sort");

    inputRow.appendChild(arrayInput);
    inputRow.appendChild(sortBtn);
    inputSection.appendChild(inputRow);

    var execution = createSectionWithSteps("Execution", true);
    var output = createResultSection("Result", true);

    sortBtn.addEventListener("click", function () {
        var raw = arrayInput.value.trim();
        execution.stepList.innerHTML = "";
        execution.section.style.display = "";
        output.section.style.display = "none";
        sortBtn.disabled = true;

        var numbers = validateNumberArray(raw, execution.stepList, sortBtn);
        if (!numbers) return;

        execution.stepList.appendChild(createStep(MSG.INPUT_LABEL + " [" + numbers.join(", ") + "]", "info"));
        execution.stepList.appendChild(createArrow());
        execution.stepList.appendChild(createStep(MSG.WAITING, "active"));

        setTimeout(function () {
            execution.stepList.removeChild(execution.stepList.lastChild);
            runSortOperation(numbers, execution.stepList, output.section, output.resultBox, sortBtn, sortArray);
        }, 500);
    });

    card.appendChild(inputSection);
    card.appendChild(execution.section);
    card.appendChild(output.section);

    container.appendChild(card);
};
