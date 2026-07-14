"use strict";

App.renderMultiplyAsync = function (container) {
    var card = createCard("Asynchronous Multiplication", "Async/Await",
        "Demonstrates async/await with error handling. Enter two numbers and observe the asynchronous calculation with a 2-second delay");

    var inputSection = createSection("Input", false);

    var inputGroup = document.createElement("div");
    inputGroup.className = "input-group";

    var inputA = createInput("number", "Example: 6");

    var multiplySign = document.createElement("span");
    multiplySign.className = "multiply-sign";
    multiplySign.textContent = "\u00D7";

    var inputB = createInput("number", "Example: 9");
    var multiplyBtn = createButton("Multiply");

    inputGroup.appendChild(inputA);
    inputGroup.appendChild(multiplySign);
    inputGroup.appendChild(inputB);
    inputGroup.appendChild(multiplyBtn);

    inputSection.appendChild(inputGroup);

    var execution = createSectionWithSteps("Execution", true);
    var output = createResultSection("Result", true);

    multiplyBtn.addEventListener("click", function () {
        var a = inputA.value.trim();
        var b = inputB.value.trim();

        execution.stepList.innerHTML = "";
        execution.section.style.display = "";
        output.section.style.display = "none";
        multiplyBtn.disabled = true;

        if (a === "" || b === "") {
            showError(execution.stepList, MSG.TITLE_INPUT_REQUIRED, MSG.BOTH_VALUES);
            multiplyBtn.disabled = false;
            return;
        }

        var numA = parseNumber(a);
        var numB = parseNumber(b);

        if (numA === null || numB === null) {
            showError(execution.stepList, MSG.TITLE_INPUT_REQUIRED, MSG.BOTH_VALUES);
            multiplyBtn.disabled = false;
            return;
        }

        if (numA === false || numB === false) {
            showError(execution.stepList, MSG.TITLE_INVALID_INPUT, MSG.NUMBERS_ONLY);
            multiplyBtn.disabled = false;
            return;
        }

        execution.stepList.appendChild(createStep("multiplyAsync(" + numA + ", " + numB + ")", "info"));
        execution.stepList.appendChild(createArrow());
        execution.stepList.appendChild(createStep(MSG.CALCULATING, "active"));

        var calcStep = execution.stepList.lastChild;

        async function main() {
            try {
                var result = await multiplyAsync(numA, numB);

                execution.stepList.removeChild(calcStep);
                execution.stepList.appendChild(createStep(MSG.CALCULATION_COMPLETED, "done"));

                showSuccess(output.section, output.resultBox, numA + " \u00D7 " + numB + " = " + result);

                multiplyBtn.disabled = false;
            } catch (error) {
                execution.stepList.removeChild(calcStep);

                showError(execution.stepList, MSG.TITLE_OPERATION_FAILED, error.message);

                multiplyBtn.disabled = false;
            }
        }

        main();
    });

    card.appendChild(inputSection);
    card.appendChild(execution.section);
    card.appendChild(output.section);

    container.appendChild(card);
};
