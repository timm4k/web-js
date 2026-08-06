"use strict";

window.BrowserEvents = (function () {
    var completedMissions = {};
    var pendingBadges = {};

    function getModules() {
        return [
            window.ForbiddenRelic,
            window.BifrostPortal,
            window.MischievousArtifact,
            window.CouncilOfRealms,
            window.ArchiveOfIllusions,
            window.HallOfEchoes,
            window.SacredRelic,
            window.SecretRuneSequence,
            window.TemporalEcho,
            window.EmeraldFamiliar,
            window.PureRuneScript,
            window.TimelineAscent,
            window.TricksterPath,
            window.EnchantmentResonance,
            window.EndlessArchive,
            window.FateBoard,
            window.IllusionSelection,
            window.TimelineScrollSpy
        ];
    }

    function cachePendingBadges() {
        DOMHelper.queryAll("[data-mission-id]").forEach(function (card) {
            var badge = DOMHelper.query(".mission-card__badge", card);
            if (badge) pendingBadges[card.dataset.missionId] = badge.textContent;
        });
    }

    function updateProgress() {
        UI.updateProgress(Object.keys(completedMissions).length, AppConstants.TOTAL_MISSIONS);
    }

    function setMissionCompleted(missionId) {
        var card = DOMHelper.query('[data-mission-id="' + missionId + '"]');
        if (!card) return;
        card.classList.add("completed");
        var badge = DOMHelper.query(".mission-card__badge", card);
        if (badge) {
            badge.className = "mission-card__badge mission-card__badge--completed";
            badge.textContent = "completed";
        }
    }

    function setMissionPending(missionId) {
        var card = DOMHelper.query('[data-mission-id="' + missionId + '"]');
        if (!card) return;
        card.classList.remove("completed");
        var badge = DOMHelper.query(".mission-card__badge", card);
        if (badge) {
            badge.className = "mission-card__badge mission-card__badge--pending";
            badge.textContent = pendingBadges[missionId] || "pending";
        }
    }

    function restoreMissionBanner() {
        var banner = DOMHelper.query(".mission-banner");
        var title = DOMHelper.query(".mission-banner__title");
        var description = DOMHelper.query(".mission-banner__description");
        if (title) title.textContent = "Welcome, Variant";
        if (description) description.textContent = "Eighteen browser-event trials lie across illusion, motion and destiny. Their technical laws remain unchanged";
        if (banner) {
            banner.classList.remove("animate-glow");
            banner.style.borderColor = "";
        }
    }

    function showFinalCompletion() {
        var banner = DOMHelper.query(".mission-banner");
        var title = DOMHelper.query(".mission-banner__title");
        var description = DOMHelper.query(".mission-banner__description");
        if (title) title.textContent = "All Trials Complete!";
        if (description) description.textContent = "You have mastered browser event architecture. The Timeline bends to your will";
        if (banner) {
            banner.classList.add("animate-glow");
            banner.style.borderColor = "var(--color-emerald)";
        }
    }

    function syncCraftOverlays(targetId) {
        var craftIsVisible = targetId === "craft";
        var menu = DOMHelper.query("#timeline-scrollspy-menu");
        var ascentButton = DOMHelper.query("#timeline-ascent-button");
        if (menu) menu.hidden = !craftIsVisible;
        if (ascentButton) {
            ascentButton.hidden = !craftIsVisible || window.scrollY <= window.innerHeight * AppConstants.SCROLL.TOP_BUTTON_VIEWPORTS;
        }
    }

    function selectTab(button) {
        var targetId = button.dataset.tab;
        DOMHelper.queryAll(".tab-btn").forEach(function (tab) {
            var active = tab === button;
            tab.classList.toggle("active", active);
            tab.setAttribute("aria-selected", String(active));
        });
        DOMHelper.queryAll(".tab-panel").forEach(function (panel) {
            var active = panel.id === targetId;
            panel.classList.toggle("active", active);
            panel.hidden = !active;
        });
        syncCraftOverlays(targetId);
    }

    function initTabs() {
        var buttons = DOMHelper.queryAll(".tab-btn");
        buttons.forEach(function (button, index) {
            DOMHelper.on(button, "click", function () {
                selectTab(button);
            });
            DOMHelper.on(button, "keydown", function (event) {
                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                event.preventDefault();
                var direction = event.key === "ArrowRight" ? 1 : -1;
                var next = buttons[(index + direction + buttons.length) % buttons.length];
                next.focus();
                selectTab(next);
            });
        });
    }

    function initMissionStateListeners() {
        document.addEventListener(AppConstants.CUSTOM_EVENTS.MISSION_COMPLETE, function (event) {
            var missionId = event.detail && event.detail.missionId;
            if (!missionId || completedMissions[missionId]) return;
            completedMissions[missionId] = true;
            setMissionCompleted(missionId);
            updateProgress();
            var count = Object.keys(completedMissions).length;
            UI.showToast("Mission complete: " + missionId + " · " + count + "/" + AppConstants.TOTAL_MISSIONS);
            if (count === AppConstants.TOTAL_MISSIONS) showFinalCompletion();
        });
        document.addEventListener("click", function (event) {
            var resetButton = event.target.closest('[data-action="reset"]');
            if (!resetButton) return;
            var missionId = resetButton.dataset.task;
            delete completedMissions[missionId];
            setMissionPending(missionId);
            restoreMissionBanner();
            updateProgress();
        });
    }

    function initModules() {
        getModules().forEach(function (module) {
            if (module && typeof module.init === "function") module.init();
        });
    }

    function init() {
        cachePendingBadges();
        initTabs();
        initMissionStateListeners();
        initModules();
        updateProgress();
    }

    return { init: init };
})();

document.addEventListener("DOMContentLoaded", function () {
    window.BrowserEvents.init();
});
