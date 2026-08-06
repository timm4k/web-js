"use strict";

window.BifrostPortal = (function () {
    var MODULE_ID = "bifrost-portal";
    var isActive = false;

    function init() {
        DOMHelper.bindTask(MODULE_ID, activate, reset);
    }

    function activate() {
        if (isActive) return;
        isActive = true;
        var view = UI.prepareTask(MODULE_ID, "The Bifrost awaits your decision");
        var portal = DOMHelper.create("a", {
            className: UIConstants.RELIC.PORTAL,
            id: MODULE_ID + "-portal",
            href: AppConstants.PORTAL.DESTINATION,
            textContent: "🌈 Portal to Asgard"
        });
        view.visual.appendChild(portal);
        DOMHelper.on(portal, "click", handlePortalClick);
        UI.showToast("The Bifrost Portal is ready");
    }

    function handlePortalClick(event) {
        if (!isActive) return;
        event.preventDefault();
        var portal = DOMHelper.query("#" + MODULE_ID + "-portal");
        var log = DOMHelper.getTaskView(MODULE_ID).log;

        UI.addLogEntry(log, "[click] The portal shimmers. A confirmation is required", "click");
        if (confirm(AppConstants.PORTAL.CONFIRMATION)) {
            UI.addLogEntry(log, "[confirm] Passage accepted. Navigation begins", "custom");
            UI.completeTask(MODULE_ID, "The Bifrost has been crossed. preventDefault, confirm, and manual navigation demonstrated");
            window.location.href = portal.href;
        } else {
            UI.addLogEntry(log, "[confirm] You chose to remain in the Archive", "custom");
            UI.showToast("The portal closes");
        }
    }

    function reset() {
        isActive = false;
        UI.resetTask(MODULE_ID);
    }

    return { init: init, reset: reset };
})();
