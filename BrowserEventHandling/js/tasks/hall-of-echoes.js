"use strict";

window.HallOfEchoes = (function () {
    var MODULE_ID = "hall-of-echoes";
    var isActive = false;
    var stopAtCore = false;

    function init() {
        DOMHelper.bindTask(MODULE_ID, activate, reset);
    }

    function activate() {
        if (isActive) return;
        isActive = true;
        stopAtCore = false;
        var visual = DOMHelper.query("#" + MODULE_ID + "-visual");
        var result = DOMHelper.query("#" + MODULE_ID + "-result");
        var log = DOMHelper.query("#" + MODULE_ID + "-log");
        DOMHelper.removeChildren(visual);
        UI.clearLog(log);
        result.className = UIConstants.RESULT.BASE;
        var outer = layer("outer", "Outer Hall");
        var middle = layer("middle", "Rune Chamber");
        var inner = layer("inner", "Hidden Core");
        middle.appendChild(inner);
        outer.appendChild(middle);
        visual.appendChild(outer);
        DOMHelper.on(outer, "click", onLayer);
        DOMHelper.on(middle, "click", onLayer);
        DOMHelper.on(inner, "click", onLayer);
        result.textContent = "First click: observe Hidden Core → Rune Chamber → Outer Hall";
    }

    function layer(id, name) {
        return DOMHelper.create("div", { className: "propagation-node hall-layer hall-layer--" + id, id: MODULE_ID + "-" + id, dataset: { name: name } }, [name]);
    }

    function onLayer(event) {
        if (!isActive) return;
        var name = event.currentTarget.dataset.name;
        console.log(name + " Clicked");
        UI.addLogEntry(DOMHelper.query("#" + MODULE_ID + "-log"), "[bubble] " + name + " Clicked", "custom");
        if (name === "Hidden Core" && stopAtCore) {
            event.stopPropagation();
            UI.addLogEntry(DOMHelper.query("#" + MODULE_ID + "-log"), "[stopPropagation] Hidden Core sealed the echo", "click");
            complete();
            return;
        }
        if (name === "Outer Hall" && !stopAtCore) {
            stopAtCore = true;
            DOMHelper.query("#" + MODULE_ID + "-result").textContent = "Full order recorded. Click Hidden Core again; propagation will stop there";
        }
    }

    function complete() {
        stopAtCore = false;
        var r = DOMHelper.query("#" + MODULE_ID + "-result");
        r.textContent = "Full bubbling and inner stopPropagation are proven. Click Hidden Core to repeat both phases";
        r.className = UIConstants.RESULT.SUCCESS;
        UI.completeTask(MODULE_ID);
    }

    function reset() {
        isActive = false;
        stopAtCore = false;
        DOMHelper.removeChildren(DOMHelper.query("#" + MODULE_ID + "-visual"));
        var r = DOMHelper.query("#" + MODULE_ID + "-result");
        r.textContent = "";
        r.className = UIConstants.RESULT.BASE;
        UI.clearLog(DOMHelper.query("#" + MODULE_ID + "-log"));
        UI.resetTask(MODULE_ID);
    }

    return { init: init, reset: reset };
})();
