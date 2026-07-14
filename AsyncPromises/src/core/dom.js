"use strict";

function createButton(text) {
    var button = document.createElement("button");
    button.className = "btn primary";
    button.textContent = text;
    return button;
}

function createInput(type, placeholder) {
    var input = document.createElement("input");
    input.type = type;
    input.placeholder = placeholder;
    return input;
}

function createCard(titleText, badge, purposeText) {
    var card = document.createElement("div");
    card.className = "card";

    var title = document.createElement("div");
    title.className = "card-title";
    title.innerHTML = titleText + ' <span class="badge">' + badge + "</span>";

    var purpose = document.createElement("div");
    purpose.className = "purpose-block";
    purpose.textContent = purposeText;

    card.appendChild(title);
    card.appendChild(purpose);

    return card;
}

function createToggleGroup(options) {
    var toggleGroup = document.createElement("div");
    toggleGroup.className = "toggle-group";

    var buttons = [];

    for (var i = 0; i < options.length; i++) {
        var btn = document.createElement("button");
        btn.className = "toggle-btn" + (i === 0 ? " active" : "");
        btn.textContent = options[i].text;
        btn.setAttribute("data-value", options[i].value);
        toggleGroup.appendChild(btn);
        buttons.push(btn);
    }

    return { group: toggleGroup, buttons: buttons };
}
