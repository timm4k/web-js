"use strict";

window.ForbiddenRelic = (function () {

    var MODULE_ID = "forbidden-relic";
    var isActive = false;

    function init() {
        DOMHelper.bindTask(MODULE_ID, activate, reset);
    }

    function activate() {
        if (isActive) return;
        isActive = true;
        var visual = DOMHelper.query("#" + MODULE_ID + "-visual");
        var result = DOMHelper.query("#" + MODULE_ID + "-result");
        var log = DOMHelper.query("#" + MODULE_ID + "-log");
        DOMHelper.removeChildren(visual);
        result.textContent = "";
        result.className = UIConstants.RESULT.BASE;
        UI.clearLog(log);

        var relic = DOMHelper.create("img", {
            className: UIConstants.RELIC.ARTIFACT,
            id: MODULE_ID + "-relic"
        });
        relic.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' rx='28' fill='%230B0B0B'/%3E%3Ccircle cx='80' cy='80' r='52' fill='%230B3D0B' stroke='%23D4AF37' stroke-width='5'/%3E%3Cpath d='M80 30L98 67L139 73L109 102L116 143L80 124L44 143L51 102L21 73L62 67Z' fill='%23009B77' stroke='%23B7FF5A' stroke-width='3'/%3E%3C/svg%3E";
        relic.alt = "An ancient enchanted relic protected by Loki's illusion";
        relic.draggable = false;
        visual.appendChild(relic);

        DOMHelper.on(relic, "contextmenu", handleContextMenu);
        result.textContent = "Right-click the relic to attempt to claim it";
        UI.showToast("The Forbidden Relic awaits");
    }

    function handleContextMenu(e) {
        if (!isActive) return;
        e.preventDefault();
        var relic = DOMHelper.query("#" + MODULE_ID + "-relic");
        var log = DOMHelper.query("#" + MODULE_ID + "-log");
        var result = DOMHelper.query("#" + MODULE_ID + "-result");

        relic.style.transform = "scale(0.95)";
        relic.style.boxShadow = "0 0 30px rgba(183, 255, 90, 0.4)";
        setTimeout(function () {
            relic.style.transform = "scale(1)";
            relic.style.boxShadow = "";
        }, 200);

        alert("The relic rejects your attempt");
        UI.addLogEntry(log, "[contextmenu] The relic rejects your attempt. Default menu cancelled", "click");
        UI.createParticles(relic, 4);

        complete();
    }

    function complete() {
        var relic = DOMHelper.query("#" + MODULE_ID + "-relic");
        if (relic) {
            relic.style.boxShadow = "0 0 40px rgba(183, 255, 90, 0.6)";
            relic.style.transform = "scale(1.1)";
        }
        var card = DOMHelper.query('[data-mission-id="' + MODULE_ID + '"]');
        card.classList.add(UIConstants.CARDS.COMPLETED.split(" ").pop());
        var badge = DOMHelper.query("." + UIConstants.CARDS.BADGE.split(" ").pop(), card);
        badge.className = UIConstants.CARDS.BADGE + " " + UIConstants.CARDS.BADGE + "--completed";
        badge.textContent = "completed";
        var result = DOMHelper.query("#" + MODULE_ID + "-result");
        result.textContent = "The context menu was cancelled. Right-click the relic again whenever you wish";
        result.className = UIConstants.RESULT.SUCCESS;
        UI.completeTask(MODULE_ID);
    }

    function reset() {
        isActive = false;
        var visual = DOMHelper.query("#" + MODULE_ID + "-visual");
        var result = DOMHelper.query("#" + MODULE_ID + "-result");
        var log = DOMHelper.query("#" + MODULE_ID + "-log");
        DOMHelper.removeChildren(visual);
        result.textContent = "";
        result.className = UIConstants.RESULT.BASE;
        UI.clearLog(log);
    
        UI.resetTask(MODULE_ID);
    }

    return { init: init, reset: reset };

})();



