"use strict";

window.EnchantmentResonance = (function () {
    var ID = "enchantment-resonance";
    var active = false;
    var dragging = false;
    var track;
    var thumb;

    function init() {
        DOMHelper.bindTask(ID, activate, reset);
    }

    function activate() {
        if (active) return;
        active = true;
        var v = DOMHelper.query("#" + ID + "-visual");
        DOMHelper.removeChildren(v);
        track = DOMHelper.create("div", { className: UIConstants.SLIDER.TRACK, id: ID + "-track" });
        thumb = DOMHelper.create("div", { className: UIConstants.SLIDER.THUMB, id: ID + "-thumb" });
        track.appendChild(thumb);
        v.appendChild(track);
        thumb.addEventListener("mousedown", start);
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", stop);
        DOMHelper.query("#" + ID + "-result").textContent = "Drag the emerald sigil along the resonance track";
    }

    function start(e) {
        dragging = true;
        e.preventDefault();
        thumb.classList.add(UIConstants.SLIDER.DRAGGING);
    }

    function move(e) {
        if (!active || !dragging) return;
        var rect = track.getBoundingClientRect();
        var max = rect.width - thumb.offsetWidth;
        var left = e.clientX - rect.left - thumb.offsetWidth / 2;
        left = DOMHelper.clamp(left, 0, max);
        thumb.style.left = left + "px";
        var percent = Math.round(left / max * 100);
        DOMHelper.query("#" + ID + "-result").textContent = "Enchantment resonance: " + percent + "%";
    }

    function stop() {
        if (!dragging) return;
        dragging = false;
        thumb.classList.remove(UIConstants.SLIDER.DRAGGING);
        complete();
    }

    function complete() {
        var r = DOMHelper.query("#" + ID + "-result");
        r.textContent += " · mousedown → mousemove → mouseup recorded";
        r.className = UIConstants.RESULT.SUCCESS;
        UI.completeTask(ID);
    }

    function reset() {
        active = false;
        dragging = false;
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", stop);
        DOMHelper.removeChildren(DOMHelper.query("#" + ID + "-visual"));
        var r = DOMHelper.query("#" + ID + "-result");
        r.textContent = "";
        r.className = UIConstants.RESULT.BASE;
        UI.resetTask(ID);
    }

    return { init: init, reset: reset };
})();
