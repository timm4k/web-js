"use strict";

window.PureRuneScript = (function () {
    var MODULE_ID = "pure-rune-script";
    var isActive = false;
    var highlightTimer = null;

    function init() {
        DOMHelper.bindTask(MODULE_ID, activate, reset);
    }

    function activate() {
        if (isActive) return;
        isActive = true;
        var view = UI.prepareTask(MODULE_ID, "Type letters first, then press a digit or symbol to test the filter");
        var input = DOMHelper.create("input", {
            type: "text",
            className: UIConstants.VALIDATION.INPUT,
            id: MODULE_ID + "-input",
            placeholder: "Letters are allowed · Try 7 or @",
            autocomplete: "off"
        });
        view.visual.appendChild(input);
        DOMHelper.on(input, "keydown", validateKey);
        input.focus();
    }

    function validateKey(event) {
        if (!isActive || event.repeat) return;
        if (AppConstants.KEYBOARD.ALLOWED_CONTROL_KEYS.indexOf(event.key) !== -1) return;
        if (/^\p{L}$/u.test(event.key)) {
            UI.setTaskResult(MODULE_ID, "Letter “" + event.key + "” accepted. Now try a digit or special symbol", false);
            UI.addLogEntry(DOMHelper.getTaskView(MODULE_ID).log, "[keydown] Allowed letter: " + event.key, "keyboard");
            return;
        }

        event.preventDefault();
        var input = event.currentTarget;
        input.classList.add(UIConstants.VALIDATION.INVALID);
        clearTimeout(highlightTimer);
        highlightTimer = setTimeout(function () {
            input.classList.remove(UIConstants.VALIDATION.INVALID);
        }, AnimationConstants.TIMERS.INPUT_INVALID);
        UI.addLogEntry(DOMHelper.getTaskView(MODULE_ID).log, "[keydown] Blocked before input: " + event.key, "keyboard");
        UI.completeTask(MODULE_ID, "“" + event.key + "” was blocked before appearing in the field. Try other characters freely");
    }

    function reset() {
        isActive = false;
        clearTimeout(highlightTimer);
        UI.resetTask(MODULE_ID);
    }

    return { init: init, reset: reset };
})();
