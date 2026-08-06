"use strict";

window.CouncilOfRealms = (function () {
    var MODULE_ID = "council-of-realms";
    var isActive = false;

    function init() {
        DOMHelper.bindTask(MODULE_ID, activate, reset);
    }

    function activate() {
        if (isActive) return;
        isActive = true;
        var view = UI.prepareTask(MODULE_ID, "One listener guards the entire Council table");
        var table = DOMHelper.create("table", { className: UIConstants.COUNCIL.TABLE, id: MODULE_ID + "-table" });
        var tbody = DOMHelper.create("tbody");

        AppConstants.COUNCIL_MEMBERS.forEach(function (member) {
            var row = DOMHelper.create("tr", { className: UIConstants.COUNCIL.ROW });
            var name = DOMHelper.create("td", { className: UIConstants.COUNCIL.NAME }, [member.name]);
            var title = DOMHelper.create("td", { className: UIConstants.COUNCIL.TITLE }, [member.title]);
            var action = DOMHelper.create("td");
            var button = DOMHelper.create("button", {
                className: UIConstants.COUNCIL.DISMISS,
                type: "button",
                dataset: { name: member.name }
            });
            button.appendChild(DOMHelper.create("span", { attributes: { "aria-hidden": "true" } }, ["✦"]));
            button.appendChild(document.createTextNode(" Dismiss"));
            action.appendChild(button);
            row.appendChild(name);
            row.appendChild(title);
            row.appendChild(action);
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        view.visual.appendChild(table);
        DOMHelper.on(table, "click", handleDismiss);
    }

    function handleDismiss(event) {
        if (!isActive) return;
        var button = event.target.closest("button");
        if (!button || !event.currentTarget.contains(button)) return;
        var row = button.closest("tr");
        UI.addLogEntry(
            DOMHelper.getTaskView(MODULE_ID).log,
            "[delegation] target: " + event.target.tagName + " · currentTarget: " + event.currentTarget.tagName + " · " + button.dataset.name + " dismissed",
            "click"
        );
        row.remove();
        UI.completeTask(MODULE_ID, "One row was removed by the delegated table listener. Dismiss any remaining member");
    }

    function reset() {
        isActive = false;
        UI.resetTask(MODULE_ID);
    }

    return { init: init, reset: reset };
})();
