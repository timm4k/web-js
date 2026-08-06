"use strict";

window.FateBoard = (function () {
    var ID = "fate-board";
    var active = false;
    var dragged = null;

    function init() {
        DOMHelper.bindTask(ID, activate, reset);
    }

    function activate() {
        if (active) return;
        active = true;
        var v = DOMHelper.query("#" + ID + "-visual");
        DOMHelper.removeChildren(v);
        var board = DOMHelper.create("div", { className: UIConstants.BOARD.ROOT });
        AppConstants.FATE_BOARD.COLUMNS.forEach(function (name, index) {
            var col = DOMHelper.create("section", { className: UIConstants.BOARD.COLUMN, dataset: { column: String(index) } });
            col.appendChild(DOMHelper.create("h4", {}, [name]));
            if (index === 0) {
                AppConstants.FATE_BOARD.CARDS.forEach(function (text, i) {
                    var card = DOMHelper.create("article", { className: UIConstants.BOARD.CARD, id: ID + "-card-" + i }, [text]);
                    card.draggable = true;
                    card.addEventListener("dragstart", dragStart);
                    col.appendChild(card);
                });
            }
            col.addEventListener("dragover", dragOver);
            col.addEventListener("drop", drop);
            board.appendChild(col);
        });
        v.appendChild(board);
        DOMHelper.query("#" + ID + "-result").textContent = "Drag a Fate Card between the three native drop chambers";
    }

    function dragStart(e) {
        dragged = e.currentTarget;
        e.dataTransfer.setData("text/plain", dragged.id);
        e.dataTransfer.effectAllowed = "move";
    }

    function dragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }

    function drop(e) {
        e.preventDefault();
        var column = e.target.closest("." + UIConstants.BOARD.COLUMN);
        if (!column || !dragged) return;
        column.appendChild(dragged);
        UI.addLogEntry(DOMHelper.query("#" + ID + "-log"), "[drop] Fate Card moved to " + column.querySelector("h4").textContent, "custom");
        complete();
    }

    function complete() {
        var r = DOMHelper.query("#" + ID + "-result");
        r.textContent = "dragstart, dragover with preventDefault, and drop completed";
        r.className = UIConstants.RESULT.SUCCESS;
        UI.completeTask(ID);
    }

    function reset() {
        active = false;
        dragged = null;
        DOMHelper.removeChildren(DOMHelper.query("#" + ID + "-visual"));
        var r = DOMHelper.query("#" + ID + "-result");
        r.textContent = "";
        r.className = UIConstants.RESULT.BASE;
        UI.clearLog(DOMHelper.query("#" + ID + "-log"));
        UI.resetTask(ID);
    }

    return { init: init, reset: reset };
})();
