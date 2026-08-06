"use strict";

window.ArchiveOfIllusions = (function () {
    var MODULE_ID = "archive-of-illusions";
    var isActive = false;

    function init() {
        DOMHelper.bindTask(MODULE_ID, activate, reset);
    }

    function activate() {
        if (isActive) return;
        isActive = true;
        var view = UI.prepareTask(MODULE_ID, "Fifty runes await one delegated listener");
        var grid = DOMHelper.create("div", {
            className: "rune-grid",
            id: MODULE_ID + "-grid"
        });

        for (var index = 0; index < AppConstants.RUNE_COUNT; index++) {
            var aura = AppConstants.RUNE_AURAS[index % AppConstants.RUNE_AURAS.length];
            var rune = DOMHelper.create("button", {
                className: UIConstants.RUNE.CELL,
                type: "button",
                title: aura.name,
                dataset: { aura: aura.name },
                style: { backgroundColor: aura.color }
            }, [AppConstants.RUNES[index % AppConstants.RUNES.length]]);
            grid.appendChild(rune);
        }

        view.visual.appendChild(grid);
        DOMHelper.on(grid, "click", handleRuneClick);
    }

    function handleRuneClick(event) {
        if (!isActive) return;
        var rune = DOMHelper.closestWithin(event.target, "." + UIConstants.RUNE.CELL, event.currentTarget);
        if (!rune) return;
        var color = getComputedStyle(rune).backgroundColor;
        document.body.style.backgroundColor = color;
        UI.addLogEntry(DOMHelper.getTaskView(MODULE_ID).log, "[click] " + rune.dataset.aura + " changed the aura to " + color, "click");
        UI.completeTask(MODULE_ID, "The page aura reflects this rune. Choose another rune whenever you wish");
    }

    function reset() {
        isActive = false;
        document.body.style.backgroundColor = "";
        UI.resetTask(MODULE_ID);
    }

    return { init: init, reset: reset };
})();
