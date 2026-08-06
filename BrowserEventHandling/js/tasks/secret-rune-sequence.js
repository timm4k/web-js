"use strict";

window.SecretRuneSequence = (function () {
    var MODULE_ID = "secret-rune-sequence";
    var isActive = false;
    var buffer = "";
    var bufferTimer = null;

    function init() {
        DOMHelper.bindTask(MODULE_ID, activate, reset);
    }

    function activate() {
        if (isActive) return;
        isActive = true;
        buffer = "";
        var view = UI.prepareTask(MODULE_ID, "Type L, O, K, I. One physical key press fills exactly one rune slot");
        var display = DOMHelper.create("div", { className: UIConstants.SEQUENCE.DISPLAY, id: MODULE_ID + "-display" });
        AppConstants.SEQUENCE.TARGET.split("").forEach(function (_, index) {
            display.appendChild(DOMHelper.create("span", { className: UIConstants.SEQUENCE.CHAR, dataset: { index: String(index) } }, ["_"]));
        });
        var input = DOMHelper.create("input", {
            type: "text",
            className: UIConstants.SEQUENCE.INPUT,
            id: MODULE_ID + "-input",
            placeholder: "Type LOKI",
            autocomplete: "off"
        });
        view.visual.appendChild(display);
        view.visual.appendChild(input);
        DOMHelper.on(document, "keydown", handleKeyDown);
        input.focus();
    }

    function handleKeyDown(event) {
        if (!isActive || !DOMHelper.isTaskVisible(MODULE_ID) || event.repeat || event.key.length !== 1 || !/^\p{L}$/u.test(event.key)) return;
        buffer += event.key.toUpperCase();
        buffer = buffer.slice(-AppConstants.SEQUENCE.TARGET.length);
        updateDisplay();
        UI.addLogEntry(DOMHelper.getTaskView(MODULE_ID).log, "[keydown] " + event.key.toUpperCase() + " accepted once. Buffer: " + buffer, "keyboard");
        clearTimeout(bufferTimer);
        bufferTimer = setTimeout(clearBuffer, AnimationConstants.TIMERS.SEQUENCE_RESET);
        if (buffer === AppConstants.SEQUENCE.TARGET) complete();
    }

    function updateDisplay() {
        var chars = DOMHelper.queryAll("." + UIConstants.SEQUENCE.CHAR.split(" ").pop(), DOMHelper.query("#" + MODULE_ID + "-display"));
        chars.forEach(function (charElement, index) {
            charElement.textContent = buffer[index] || "_";
            charElement.className = index < buffer.length ? UIConstants.SEQUENCE.CHAR_ACTIVE : UIConstants.SEQUENCE.CHAR;
        });
    }

    function clearBuffer() {
        buffer = "";
        updateDisplay();
        var input = DOMHelper.query("#" + MODULE_ID + "-input");
        if (input) input.value = "";
    }

    function complete() {
        clearTimeout(bufferTimer);
        DOMHelper.queryAll("." + UIConstants.SEQUENCE.CHAR.split(" ").pop(), DOMHelper.query("#" + MODULE_ID + "-display")).forEach(function (charElement) {
            charElement.className = UIConstants.SEQUENCE.CHAR_CORRECT;
        });
        UI.addLogEntry(DOMHelper.getTaskView(MODULE_ID).log, "[success] The Trickster has revealed himself", "custom");
        alert("The Trickster has revealed himself");
        UI.completeTask(MODULE_ID, "LOKI accepted. The buffer will clear for another attempt");
        bufferTimer = setTimeout(clearBuffer, AnimationConstants.TIMERS.SUCCESS_RESET);
    }

    function reset() {
        isActive = false;
        buffer = "";
        clearTimeout(bufferTimer);
        document.removeEventListener("keydown", handleKeyDown);
        UI.resetTask(MODULE_ID);
    }

    return { init: init, reset: reset };
})();


