"use strict";

function createError(title, message) {
    var block = document.createElement("div");
    block.className = "error-block";
    block.innerHTML =
        "<div class='error-title'>" + title + "</div>" +
        "<div class='error-message'>" + message + "</div>";
    return block;
}

function createStep(text, className) {
    var step = document.createElement("div");
    step.className = "step " + className;
    step.textContent = text;
    return step;
}

function createArrow() {
    var arrow = document.createElement("div");
    arrow.className = "flow-arrow";
    arrow.textContent = "\u2193";
    return arrow;
}

function showSuccess(resultSection, resultBox, text) {
    resultSection.style.display = "";
    resultBox.textContent = text;
    resultBox.className = "result-box success";
}

function showError(container, title, message) {
    container.innerHTML = "";
    container.appendChild(createError(title, message));
}

function createSection(labelText, hidden) {
    var section = document.createElement("div");
    section.className = "task-section";
    if (hidden) {
        section.style.display = "none";
    }

    var label = document.createElement("div");
    label.className = "section-label";
    label.textContent = labelText;

    section.appendChild(label);

    return section;
}

function createSectionWithSteps(labelText, hidden) {
    var section = createSection(labelText, hidden);

    var stepList = document.createElement("div");
    stepList.className = "step-list";
    section.appendChild(stepList);

    return { section: section, stepList: stepList };
}

function createResultSection(labelText, hidden) {
    var section = createSection(labelText, hidden);

    var resultBox = document.createElement("div");
    resultBox.className = "result-box";
    section.appendChild(resultBox);

    return { section: section, resultBox: resultBox };
}
