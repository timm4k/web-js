"use strict";

window.SacredRelic = (function () {
    var MODULE_ID = "sacred-relic";
    var isActive = false;
    var vaultCount = 0;
    var totalPower = 0;
    var relic = AppConstants.SACRED_RELIC;

    function init() {
        DOMHelper.bindTask(MODULE_ID, activate, reset);
        DOMHelper.on(document, AppConstants.CUSTOM_EVENTS.ARTIFACT_CLAIMED, onArtifactClaimed);
    }

    function activate() {
        if (isActive) return;
        isActive = true;
        vaultCount = 0;
        totalPower = 0;
        var view = UI.prepareTask(MODULE_ID, "The relic shelf and Ancient Vault communicate through a CustomEvent");
        var shelf = DOMHelper.create("section", { className: "relic-shelf" });
        var claimButton = DOMHelper.create("button", {
            className: UIConstants.BUTTONS.GOLD,
            type: "button",
            id: MODULE_ID + "-claim"
        }, ["Claim Relic"]);
        shelf.appendChild(DOMHelper.create("h4", {}, ["Sacred Relic"]));
        shelf.appendChild(claimButton);

        var vault = DOMHelper.create("aside", {
            className: UIConstants.RELIC.VAULT,
            id: MODULE_ID + "-vault"
        });
        vault.appendChild(DOMHelper.create("h4", {}, ["Ancient Vault"]));
        vault.appendChild(DOMHelper.create("p", { id: MODULE_ID + "-summary" }, ["Relics: 0 · Magic power: 0"]));
        view.visual.appendChild(shelf);
        view.visual.appendChild(vault);
        DOMHelper.on(claimButton, "click", dispatchClaim);
    }

    function dispatchClaim() {
        if (!isActive) return;
        var claimEvent = new CustomEvent(AppConstants.CUSTOM_EVENTS.ARTIFACT_CLAIMED, {
            bubbles: true,
            detail: { name: relic.name, rarity: relic.rarity, magicPower: relic.magicPower }
        });
        DOMHelper.query("#" + MODULE_ID + "-claim").dispatchEvent(claimEvent);
    }

    function onArtifactClaimed(event) {
        if (!isActive) return;
        vaultCount++;
        totalPower += event.detail.magicPower;
        DOMHelper.query("#" + MODULE_ID + "-summary").textContent = "Relics: " + vaultCount + " · Magic power: " + totalPower + " · " + event.detail.name + " (" + event.detail.rarity + ")";
        UI.addLogEntry(DOMHelper.getTaskView(MODULE_ID).log, "[artifact-claimed] Ancient Vault received event.detail", "custom");
        UI.completeTask(MODULE_ID, "The Ancient Vault was updated by artifact-claimed. Claim the relic again to add another record");
    }

    function reset() {
        isActive = false;
        vaultCount = 0;
        totalPower = 0;
        UI.resetTask(MODULE_ID);
    }

    return { init: init, reset: reset };
})();
