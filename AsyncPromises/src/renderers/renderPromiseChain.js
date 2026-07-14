"use strict";

App.renderPromiseChain = function (container) {
    var card = createCard("Sequential Promise Execution", "Promises",
        "Demonstrates Promise chaining. Press Start to execute asynchronous operations sequentially and observe the progress");

    var timerInfo = document.createElement("div");
    timerInfo.className = "timer-info";
    timerInfo.innerHTML = "<code>washDishes()</code> \u2014 2s &nbsp;|&nbsp; <code>cleanRoom()</code> \u2014 4s &nbsp;|&nbsp; <code>makeDinner()</code> \u2014 7s";

    var inputSection = createSection("Input", false);
    var btnStart = createButton("Start household tasks");
    inputSection.appendChild(btnStart);

    var progress = createSectionWithSteps("Progress", true);

    var progressContainer = document.createElement("div");
    progressContainer.className = "progress-container";
    var progressFill = document.createElement("div");
    progressFill.className = "progress-fill";
    progressFill.style.width = "0%";
    progressContainer.appendChild(progressFill);
    progress.section.appendChild(progressContainer);

    var output = createResultSection("Result", true);

    btnStart.addEventListener("click", function () {
        btnStart.disabled = true;
        btnStart.textContent = MSG.RUNNING;

        progress.stepList.innerHTML = "";
        progress.section.style.display = "";
        output.section.style.display = "none";
        progressFill.style.width = "0%";

        progress.stepList.appendChild(createStep("Step 1 of 3 \u2014 Washing dishes...", "active"));
        progressFill.style.width = "10%";

        washDishes().then(function () {
            progress.stepList.removeChild(progress.stepList.lastChild);
            progress.stepList.appendChild(createStep("Step 1 of 3 \u2014 Washing dishes... done", "done"));
            progressFill.style.width = "33%";
            progress.stepList.appendChild(createStep("Step 2 of 3 \u2014 Cleaning room...", "active"));

            return cleanRoom();
        }).then(function () {
            progress.stepList.removeChild(progress.stepList.lastChild);
            progress.stepList.appendChild(createStep("Step 2 of 3 \u2014 Cleaning room... done", "done"));
            progressFill.style.width = "66%";
            progress.stepList.appendChild(createStep("Step 3 of 3 \u2014 Preparing dinner...", "active"));

            return makeDinner();
        }).then(function () {
            progress.stepList.removeChild(progress.stepList.lastChild);
            progress.stepList.appendChild(createStep("Step 3 of 3 \u2014 Preparing dinner... done", "done"));
            progressFill.style.width = "100%";

            showSuccess(output.section, output.resultBox, MSG.COMPLETED);

            btnStart.disabled = false;
            btnStart.textContent = "Start household tasks";
        });
    });

    card.appendChild(timerInfo);
    card.appendChild(inputSection);
    card.appendChild(progress.section);
    card.appendChild(output.section);

    container.appendChild(card);
};
