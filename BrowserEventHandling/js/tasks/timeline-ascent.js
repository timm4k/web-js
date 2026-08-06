"use strict";

window.TimelineAscent = (function () {
    var ID = "timeline-ascent";
    var active = false;
    var button = null;

    function init() {
        DOMHelper.bindTask(ID, activate, reset);
    }

    function activate() {
        if (active) return;
        active = true;
        button = DOMHelper.create("button", { className: UIConstants.ASCENT.BUTTON, type: "button", id: ID + "-button" }, ["Return to the Timeline Crown"]);
        document.body.appendChild(button);
        button.hidden = true;
        window.addEventListener("scroll", onScroll);
        DOMHelper.on(button, "click", goUp);
        DOMHelper.query("#" + ID + "-visual").innerHTML = "<div class='scroll-chronicle'>The long Chronicle extends through the page. Scroll beyond one viewport</div>";
        DOMHelper.query("#" + ID + "-result").textContent = "The ascent sigil appears only after window.scrollY exceeds window.innerHeight";
        onScroll();
    }

    function onScroll() {
        var craft = DOMHelper.query("#craft");
        if (button) button.hidden = !craft || !craft.classList.contains("active") || !(window.scrollY > window.innerHeight * AppConstants.SCROLL.TOP_BUTTON_VIEWPORTS);
    }

    function goUp() {
        window.scrollTo({ top: 0, behavior: "smooth" });
        complete();
    }

    function complete() {
        var r = DOMHelper.query("#" + ID + "-result");
        r.textContent = "The Timeline returned smoothly to its beginning";
        r.className = UIConstants.RESULT.SUCCESS;
        UI.completeTask(ID);
    }

    function reset() {
        active = false;
        window.removeEventListener("scroll", onScroll);
        if (button) button.remove();
        button = null;
        DOMHelper.removeChildren(DOMHelper.query("#" + ID + "-visual"));
        var r = DOMHelper.query("#" + ID + "-result");
        r.textContent = "";
        r.className = UIConstants.RESULT.BASE;
        UI.resetTask(ID);
    }

    return { init: init, reset: reset };
})();
