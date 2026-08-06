"use strict";

var UI = {
    showToast: function (message) {
        var container = DOMHelper.query(".toast-container");
        var toast = DOMHelper.create("div", { className: UIConstants.TOAST.SUCCESS }, [message]);
        container.appendChild(toast);
        setTimeout(function () {
            toast.classList.add(UIConstants.TOAST.REMOVING);
            setTimeout(function () {
                toast.remove();
            }, AnimationConstants.TIMERS.TOAST_REMOVE);
        }, UIConstants.TOAST.DURATION);
    },
    updateProgress: function (completed, total) {
        var fill = DOMHelper.query(".progress-bar__fill");
        var label = DOMHelper.query(".progress-label");
        var progress = DOMHelper.query(".progress-bar");
        fill.style.width = Math.round((completed / total) * 100) + "%";
        label.textContent = completed + " / " + total + " missions";
        if (progress) progress.setAttribute("aria-valuenow", String(completed));
    },
    prepareTask: function (taskId, message) {
        var view = DOMHelper.getTaskView(taskId);
        DOMHelper.removeChildren(view.visual);
        this.clearLog(view.log);
        view.result.textContent = message || "";
        view.result.className = UIConstants.RESULT.BASE;
        return view;
    },
    setTaskResult: function (taskId, message, successful) {
        var result = DOMHelper.getTaskView(taskId).result;
        result.textContent = message;
        result.className = successful ? UIConstants.RESULT.SUCCESS : UIConstants.RESULT.BASE;
    },
    completeTask: function (taskId, message) {
        if (message !== undefined) this.setTaskResult(taskId, message, true);
        else DOMHelper.getTaskView(taskId).result.className = UIConstants.RESULT.SUCCESS;
        document.dispatchEvent(new CustomEvent(AppConstants.CUSTOM_EVENTS.MISSION_COMPLETE, { detail: { missionId: taskId } }));
    },
    resetTask: function (taskId) {
        var view = DOMHelper.getTaskView(taskId);
        DOMHelper.removeChildren(view.visual);
        this.clearLog(view.log);
        view.result.textContent = "";
        view.result.className = UIConstants.RESULT.BASE;
    },
    addLogEntry: function (logElement, text, type) {
        var className = UIConstants.LOG.ENTRY + (type ? " " + UIConstants.LOG.ENTRY + "--" + type : "");
        logElement.appendChild(DOMHelper.create("div", { className: className }, [text]));
        logElement.scrollTop = logElement.scrollHeight;
        if (logElement.children.length > UIConstants.LOG.MAX_ENTRIES) logElement.children[0].remove();
    },
    clearLog: function (logElement) {
        DOMHelper.removeChildren(logElement);
    },
    createParticles: function (container, count) {
        count = count || UIConstants.PARTICLES.COUNT;
        for (var index = 0; index < count; index++) {
            var particle = DOMHelper.create("div", {
                className: UIConstants.PARTICLES.CLASS,
                style: {
                    left: Math.random() * 100 + "%",
                    top: Math.random() * 100 + "%",
                    animationDelay: Math.random() * AnimationConstants.PARTICLE.MAX_DELAY + "ms"
                }
            });
            container.appendChild(particle);
            (function (currentParticle) {
                setTimeout(function () {
                    currentParticle.remove();
                }, AnimationConstants.PARTICLE.LIFETIME);
            })(particle);
        }
    }
};

window.UI = UI;
