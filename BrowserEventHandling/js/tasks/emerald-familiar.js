"use strict";

window.EmeraldFamiliar = (function () {
    var ID = "emerald-familiar";
    var active = false;
    var moves = 0;
    var handler;

    function init() {
        DOMHelper.bindTask(ID, activate, reset);
    }

    function activate() {
        if (active) return;
        active = true;
        moves = 0;
        var v = DOMHelper.query("#" + ID + "-visual");
        DOMHelper.removeChildren(v);
        var orb = DOMHelper.create("div", { className: UIConstants.FOLLOWER.ORB, id: ID + "-orb" });
        v.appendChild(orb);
        handler = function (e) {
            if (!active || !DOMHelper.isTaskVisible(ID)) return;
            var rect = v.getBoundingClientRect();
            orb.style.left = (e.clientX - rect.left) + "px";
            orb.style.top = (e.clientY - rect.top) + "px";
            moves++;
            if (moves === AppConstants.POINTER.COMPLETION_MOVES) complete();
        };
        document.addEventListener("mousemove", handler);
        DOMHelper.query("#" + ID + "-result").textContent = "Move the cursor across the chamber. The emerald familiar follows clientX and clientY";
    }

    function complete() {
        var r = DOMHelper.query("#" + ID + "-result");
        r.textContent = "The familiar follows the cursor with a smooth CSS transition";
        r.className = UIConstants.RESULT.SUCCESS;
        UI.completeTask(ID);
    }

    function reset() {
        active = false;
        if (handler) document.removeEventListener("mousemove", handler);
        DOMHelper.removeChildren(DOMHelper.query("#" + ID + "-visual"));
        var r = DOMHelper.query("#" + ID + "-result");
        r.textContent = "";
        r.className = UIConstants.RESULT.BASE;
        UI.resetTask(ID);
    }

    return { init: init, reset: reset };
})();
