"use strict";

window.EndlessArchive = (function () {
    var MODULE_ID = "endless-archive";
    var isActive = false;
    var isLoading = false;
    var list = null;
    var batchCount = 0;

    function init() {
        DOMHelper.bindTask(MODULE_ID, activate, reset);
    }

    function activate() {
        if (isActive) return;
        isActive = true;
        isLoading = false;
        batchCount = 0;
        var view = UI.prepareTask(MODULE_ID, "Ten chronicles are open. Scroll near the page bottom to load five more");
        list = DOMHelper.create("div", { className: UIConstants.INFINITE.LIST, id: MODULE_ID + "-list" });
        view.visual.appendChild(list);
        appendRecords(AppConstants.SCROLL.INITIAL_RECORDS);
        DOMHelper.on(window, "scroll", checkScroll);
    }

    function appendRecords(amount) {
        var remaining = AppConstants.SCROLL.MAX_RECORDS - list.children.length;
        var safeAmount = Math.min(amount, remaining);
        for (var index = 0; index < safeAmount; index++) {
            var number = list.children.length + 1;
            list.appendChild(DOMHelper.create("article", { className: UIConstants.INFINITE.RECORD }, ["Chronicle " + number + " · A fragment of the branching Timeline"]));
        }
    }

    function checkScroll() {
        if (!isActive || !DOMHelper.isTaskVisible(MODULE_ID) || isLoading || list.children.length >= AppConstants.SCROLL.MAX_RECORDS) return;
        var nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - AppConstants.SCROLL.BOTTOM_OFFSET;
        if (!nearBottom) return;
        isLoading = true;
        appendRecords(AppConstants.SCROLL.RECORD_BATCH);
        batchCount++;
        UI.addLogEntry(DOMHelper.getTaskView(MODULE_ID).log, "[scroll] Batch " + batchCount + ": five chronicles appended", "custom");
        UI.completeTask(MODULE_ID, "Five chronicles loaded. Scroll away and approach the bottom again for another batch. Demo limit: " + AppConstants.SCROLL.MAX_RECORDS);
        setTimeout(function () { isLoading = false; }, AnimationConstants.TIMERS.INFINITE_COOLDOWN);
    }

    function reset() {
        isActive = false;
        isLoading = false;
        window.removeEventListener("scroll", checkScroll);
        list = null;
        UI.resetTask(MODULE_ID);
    }

    return { init: init, reset: reset };
})();

