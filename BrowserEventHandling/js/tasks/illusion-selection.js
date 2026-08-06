"use strict";

window.IllusionSelection = (function () {
    var MODULE_ID = "illusion-selection";
    var isActive = false;
    var isDrawing = false;
    var startX = 0;
    var startY = 0;
    var workspace = null;
    var selectionBox = null;
    var selectionCounter = null;

    function init() {
        DOMHelper.bindTask(MODULE_ID, activate, reset);
    }

    function activate() {
        if (isActive) return;
        isActive = true;
        var view = UI.prepareTask(MODULE_ID, "Press and drag from the dotted empty background across one or more scroll icons");
        selectionCounter = DOMHelper.create("div", { className: UIConstants.SELECTION.COUNTER }, ["Selected scrolls: 0"]);
        workspace = DOMHelper.create("div", {
            className: UIConstants.SELECTION.DESKTOP,
            id: MODULE_ID + "-desktop",
            attributes: { "aria-label": "Illusion desktop selection area" }
        });
        AppConstants.DESKTOP_ICONS.forEach(function (position, index) {
            var icon = DOMHelper.create("div", {
                className: UIConstants.SELECTION.ICON,
                style: { left: position.left + "px", top: position.top + "px" }
            });
            icon.appendChild(DOMHelper.create("strong", {}, ["ᚱ"]));
            icon.appendChild(DOMHelper.create("span", {}, ["Scroll " + (index + 1)]));
            workspace.appendChild(icon);
        });
        view.visual.appendChild(selectionCounter);
        view.visual.appendChild(workspace);
        DOMHelper.on(workspace, "mousedown", startSelection);
        DOMHelper.on(document, "mousemove", resizeSelection);
        DOMHelper.on(document, "mouseup", finishSelection);
    }

    function startSelection(event) {
        if (!isActive || event.button !== 0 || event.target.closest("." + UIConstants.SELECTION.ICON)) return;
        event.preventDefault();
        clearSelectedIcons();
        isDrawing = true;
        var bounds = workspace.getBoundingClientRect();
        startX = event.clientX - bounds.left;
        startY = event.clientY - bounds.top;
        selectionBox = DOMHelper.create("div", { className: UIConstants.SELECTION.BOX });
        workspace.appendChild(selectionBox);
        placeSelection(startX, startY, startX, startY);
        UI.setTaskResult(MODULE_ID, "Selection started. Keep holding the mouse and drag across the scrolls", false);
    }

    function resizeSelection(event) {
        if (!isDrawing) return;
        var bounds = workspace.getBoundingClientRect();
        var currentX = DOMHelper.clamp(event.clientX - bounds.left, 0, bounds.width);
        var currentY = DOMHelper.clamp(event.clientY - bounds.top, 0, bounds.height);
        placeSelection(startX, startY, currentX, currentY);
        var selectionBounds = selectionBox.getBoundingClientRect();
        var selectedCount = 0;
        DOMHelper.queryAll("." + UIConstants.SELECTION.ICON, workspace).forEach(function (icon) {
            var iconBounds = icon.getBoundingClientRect();
            var intersects = selectionBounds.left < iconBounds.right && selectionBounds.right > iconBounds.left && selectionBounds.top < iconBounds.bottom && selectionBounds.bottom > iconBounds.top;
            icon.classList.toggle(UIConstants.SELECTION.SELECTED, intersects);
            if (intersects) selectedCount++;
        });
        selectionCounter.textContent = "Selected scrolls: " + selectedCount;
        UI.setTaskResult(MODULE_ID, "Selecting: " + selectedCount + " scroll(s). Release the mouse to keep the highlight; icons do not move in this task", false);
    }

    function placeSelection(x1, y1, x2, y2) {
        selectionBox.style.left = Math.min(x1, x2) + "px";
        selectionBox.style.top = Math.min(y1, y2) + "px";
        selectionBox.style.width = Math.abs(x2 - x1) + "px";
        selectionBox.style.height = Math.abs(y2 - y1) + "px";
    }

    function finishSelection() {
        if (!isDrawing) return;
        isDrawing = false;
        if (selectionBox) selectionBox.remove();
        selectionBox = null;
        var selectedCount = DOMHelper.queryAll("." + UIConstants.SELECTION.ICON + "." + UIConstants.SELECTION.SELECTED, workspace).length;
        selectionCounter.textContent = "Selected scrolls: " + selectedCount;
        UI.addLogEntry(DOMHelper.getTaskView(MODULE_ID).log, "[mouseup] Selection finished with " + selectedCount + " scroll(s)", "mouse");
        UI.completeTask(MODULE_ID, "Selection finished: " + selectedCount + " scroll(s) remain highlighted. The icons do not move; drag again to create a new selection");
    }

    function clearSelectedIcons() {
        DOMHelper.queryAll("." + UIConstants.SELECTION.ICON, workspace).forEach(function (icon) {
            icon.classList.remove(UIConstants.SELECTION.SELECTED);
        });
    }

    function reset() {
        isActive = false;
        isDrawing = false;
        document.removeEventListener("mousemove", resizeSelection);
        document.removeEventListener("mouseup", finishSelection);
        workspace = null;
        selectionBox = null;
        UI.resetTask(MODULE_ID);
    }

    return { init: init, reset: reset };
})();
