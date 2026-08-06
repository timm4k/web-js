"use strict";

window.TimelineScrollSpy = (function () {
    var ID = "timeline-scrollspy";
    var active = false;
    var menu = null;
    var sections = [];
    var completed = false;

    function init() {
        DOMHelper.bindTask(ID, activate, reset);
    }

    function activate() {
        if (active) return;
        active = true;
        completed = false;
        var v = DOMHelper.query("#" + ID + "-visual");
        DOMHelper.removeChildren(v);
        menu = DOMHelper.create("nav", { className: UIConstants.SCROLLSPY.MENU, id: ID + "-menu" });
        sections = [];
        AppConstants.TIMELINE_SECTIONS.forEach(function (name, i) {
            var section = DOMHelper.create("section", { className: UIConstants.SCROLLSPY.SECTION, id: ID + "-section-" + (i + 1) }, [name + " · The Archive records this branch of destiny"]);
            sections.push(section);
            var link = DOMHelper.create("button", { className: UIConstants.SCROLLSPY.LINK, type: "button", dataset: { target: section.id } }, [name]);
            link.addEventListener("click", navigate);
            menu.appendChild(link);
            v.appendChild(section);
        });
        document.body.appendChild(menu);
        menu.hidden = !DOMHelper.query("#craft").classList.contains("active");
        window.addEventListener("scroll", spy);
        spy();
        DOMHelper.query("#" + ID + "-result").textContent = "Use the fixed Fate menu or scroll manually through the three Timeline sections";
    }

    function navigate(e) {
        document.getElementById(e.currentTarget.dataset.target).scrollIntoView({ behavior: "smooth" });
    }

    function spy() {
        if (!active || !DOMHelper.isTaskVisible(ID)) return;
        var current = sections[0];
        sections.forEach(function (section) {
            var rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight * AppConstants.SCROLL.SPY_VIEWPORT_RATIO) current = section;
        });
        DOMHelper.queryAll("." + UIConstants.SCROLLSPY.LINK, menu).forEach(function (link) {
            link.classList.toggle(UIConstants.SCROLLSPY.ACTIVE, link.dataset.target === current.id);
        });
        if (current === sections[2] && !completed) {
            completed = true;
            complete();
        }
    }

    function complete() {
        var r = DOMHelper.query("#" + ID + "-result");
        r.textContent = "The fixed menu follows the section currently visible in the viewport";
        r.className = UIConstants.RESULT.SUCCESS;
        UI.completeTask(ID);
    }

    function reset() {
        active = false;
        completed = false;
        window.removeEventListener("scroll", spy);
        if (menu) menu.remove();
        menu = null;
        sections = [];
        DOMHelper.removeChildren(DOMHelper.query("#" + ID + "-visual"));
        var r = DOMHelper.query("#" + ID + "-result");
        r.textContent = "";
        r.className = UIConstants.RESULT.BASE;
        UI.resetTask(ID);
    }

    return { init: init, reset: reset };
})();
