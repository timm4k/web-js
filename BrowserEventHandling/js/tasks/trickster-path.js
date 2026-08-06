"use strict";

window.TricksterPath = (function () {
    var MODULE_ID = "trickster-path";
    var isActive = false;
    var x = 0;
    var y = 0;
    var moveCount = 0;
    var field = null;
    var hero = null;

    function init() {
        DOMHelper.bindTask(MODULE_ID, activate, reset);
    }

    function activate() {
        if (isActive) return;
        isActive = true;
        moveCount = 0;
        var view = UI.prepareTask(MODULE_ID, "The rune ᛚ is the hero; do not type it. Control it with the physical arrow keys");
        var controls = DOMHelper.create("div", { className: UIConstants.HERO.CONTROLS }, ["Move: ← ↑ ↓ →   ·   Run: hold Shift + Arrow"]);
        field = DOMHelper.create("div", {
            className: UIConstants.HERO.FIELD,
            id: MODULE_ID + "-field",
            tabIndex: 0,
            role: "application",
            attributes: { "aria-label": "Trickster movement arena" }
        });
        hero = DOMHelper.create("div", { className: UIConstants.HERO.SIGIL, id: MODULE_ID + "-hero" }, ["ᛚ"]);
        field.appendChild(hero);
        view.visual.appendChild(controls);
        view.visual.appendChild(field);
        x = Math.round((field.clientWidth - hero.offsetWidth) / 2);
        y = Math.round((field.clientHeight - hero.offsetHeight) / 2);
        updatePosition();
        DOMHelper.on(document, "keydown", moveHero);
        field.focus();
    }

    function moveHero(event) {
        if (!isActive || !DOMHelper.isTaskVisible(MODULE_ID) || AppConstants.KEYBOARD.ARROW_KEYS.indexOf(event.key) === -1) return;
        event.preventDefault();
        var step = AppConstants.KEYBOARD.WALK_STEP * (event.shiftKey ? AppConstants.KEYBOARD.RUN_MULTIPLIER : 1);
        if (event.key === "ArrowLeft") x -= step;
        if (event.key === "ArrowRight") x += step;
        if (event.key === "ArrowUp") y -= step;
        if (event.key === "ArrowDown") y += step;
        x = DOMHelper.clamp(x, 0, field.clientWidth - hero.offsetWidth);
        y = DOMHelper.clamp(y, 0, field.clientHeight - hero.offsetHeight);
        updatePosition();
        moveCount++;
        var mode = event.shiftKey ? "running" : "walking";
        UI.setTaskResult(MODULE_ID, "Moved " + mode + " to x: " + x + ", y: " + y + ". Keep using the arrows", moveCount >= AppConstants.KEYBOARD.HERO_COMPLETION_MOVES);
        UI.addLogEntry(DOMHelper.getTaskView(MODULE_ID).log, "[keydown] " + event.key + " · " + step + "px · x=" + x + ", y=" + y, "keyboard");
        if (moveCount === AppConstants.KEYBOARD.HERO_COMPLETION_MOVES) UI.completeTask(MODULE_ID, "Movement, boundaries and Shift acceleration demonstrated. The arena remains active");
    }

    function updatePosition() {
        hero.style.left = x + "px";
        hero.style.top = y + "px";
    }

    function reset() {
        isActive = false;
        document.removeEventListener("keydown", moveHero);
        field = null;
        hero = null;
        UI.resetTask(MODULE_ID);
    }

    return { init: init, reset: reset };
})();

