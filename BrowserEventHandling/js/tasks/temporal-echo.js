"use strict";

window.TemporalEcho = (function () {

    var MODULE_ID = "temporal-echo";
    var isActive = false;
    var LAST_CLICK_TIME = 0;
    var ECHO_THRESHOLD = AppConstants.TEMPORAL.ECHO_THRESHOLD_MS;

    function init() {
        DOMHelper.bindTask(MODULE_ID, activate, reset);
    }

    function activate() {
        if (isActive) return;
        isActive = true;
        LAST_CLICK_TIME = 0;
        var visual = DOMHelper.query("#" + MODULE_ID + "-visual");
        var result = DOMHelper.query("#" + MODULE_ID + "-result");
        var log = DOMHelper.query("#" + MODULE_ID + "-log");
        DOMHelper.removeChildren(visual);
        result.textContent = "";
        result.className = UIConstants.RESULT.BASE;
        UI.clearLog(log);

        var relic = DOMHelper.create("button", {
            className: UIConstants.TEMPORAL.RELIC,
            id: MODULE_ID + "-relic",
            type: "button"
        }, ["\u23F3"]);
        relic.setAttribute("aria-label", "Temporal relic");
        visual.appendChild(relic);

        DOMHelper.on(relic, "click", handleClick);
        result.textContent = "Click the relic twice within 500ms to create a temporal echo";
        UI.showToast("The Temporal Echo awaits");
    }

    function handleClick(e) {
        if (!isActive) return;
        var now = Date.now();
        var relic = DOMHelper.query("#" + MODULE_ID + "-relic");
        var log = DOMHelper.query("#" + MODULE_ID + "-log");

        if (LAST_CLICK_TIME > 0) {
            var diff = now - LAST_CLICK_TIME;
            if (diff <= ECHO_THRESHOLD) {
                UI.addLogEntry(log, "[temporal] Echo detected after " + diff + "ms. The relic awakens", "custom");

                relic.style.boxShadow = "0 0 40px rgba(183, 255, 90, 0.6)";
                relic.style.transform = "scale(1.2)";
                relic.style.color = "var(--color-rune-glow)";
                setTimeout(function () {
                    relic.style.boxShadow = "";
                    relic.style.transform = "scale(1)";
                }, AnimationConstants.TIMERS.TEMPORAL_GLOW);

                UI.createParticles(relic, 6);
                LAST_CLICK_TIME = 0;
                complete();
                return;
            } else {
                UI.addLogEntry(log, "[click] Interval too long: " + diff + "ms. The echo fades", "click");
            }
        }

        LAST_CLICK_TIME = now;
        UI.addLogEntry(log, "[click] First touch registered at " + now, "click");
    }

    function complete() {
        var relic = DOMHelper.query("#" + MODULE_ID + "-relic");
        if (relic) {
            relic.classList.add(UIConstants.TEMPORAL.RELIC_AWAKENED.split(" ").pop());
            relic.style.boxShadow = "0 0 50px rgba(183, 255, 90, 0.8)";
        }
        var card = DOMHelper.query('[data-mission-id="' + MODULE_ID + '"]');
        card.classList.add(UIConstants.CARDS.COMPLETED.split(" ").pop());
        var badge = DOMHelper.query("." + UIConstants.CARDS.BADGE.split(" ").pop(), card);
        badge.className = UIConstants.CARDS.BADGE + " " + UIConstants.CARDS.BADGE + "--completed";
        badge.textContent = "completed";
        var result = DOMHelper.query("#" + MODULE_ID + "-result");
        result.textContent = "The relic awakened through Date.now(). Repeat another two-click echo whenever you wish";
        result.className = UIConstants.RESULT.SUCCESS;
        UI.completeTask(MODULE_ID);
    }

    function reset() {
        isActive = false;
        LAST_CLICK_TIME = 0;
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




