"use strict";

window.MischievousArtifact = (function () {

    var MODULE_ID = "mischievous-artifact";
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

        var artifact = DOMHelper.create("button", {
            className: UIConstants.RELIC.ARTIFACT + " relic-artifact--moving",
            id: MODULE_ID + "-artifact",
            type: "button"
        }, ["\uD83D\uDD2E"]);
        artifact.setAttribute("aria-label", "Mischievous artifact");
        visual.appendChild(artifact);

        DOMHelper.on(artifact, "mouseenter", handleMouseEnter);
        result.textContent = "Hover over the artifact to catch the Trickster";
        UI.showToast("The Mischievous Artifact awaits");
    }

    function handleMouseEnter(e) {
        if (!isActive) return;
        var artifact = DOMHelper.query("#" + MODULE_ID + "-artifact");
        var visual = DOMHelper.query("#" + MODULE_ID + "-visual");
        var log = DOMHelper.query("#" + MODULE_ID + "-log");

        var rect = visual.getBoundingClientRect();
        var maxX = Math.max(0, rect.width - artifact.offsetWidth);
        var maxY = Math.max(0, rect.height - artifact.offsetHeight);
        var newX = Math.random() * maxX;
        var newY = Math.random() * maxY;
        artifact.style.left = newX + "px";
        artifact.style.top = newY + "px";
        artifact.style.transform = "translate(0, 0)";
        UI.addLogEntry(log, "[mouseenter] The illusion shifts to (" + Math.round(newX) + ", " + Math.round(newY) + ")", "mouse");
        complete();
    }

    function complete() {
        var artifact = DOMHelper.query("#" + MODULE_ID + "-artifact");
        if (artifact) {
            artifact.style.boxShadow = "0 0 40px rgba(183, 255, 90, 0.6)";
        }
        var card = DOMHelper.query('[data-mission-id="' + MODULE_ID + '"]');
        card.classList.add(UIConstants.CARDS.COMPLETED.split(" ").pop());
        var badge = DOMHelper.query("." + UIConstants.CARDS.BADGE.split(" ").pop(), card);
        badge.className = UIConstants.CARDS.BADGE + " " + UIConstants.CARDS.BADGE + "--completed";
        badge.textContent = "completed";
        var result = DOMHelper.query("#" + MODULE_ID + "-result");
        result.textContent = "The artifact moved through style.top and style.left. Chase it again without Reset";
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



