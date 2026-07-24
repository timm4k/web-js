window.AlchemyLab = (function () {
  "use strict";

  function buildHeader() {
    const header = DOMHelper.create("header", { className: "app-header" });

    const logo = DOMHelper.create("div", { className: "app-logo" }, [
      DOMHelper.create("span", {
        className: "app-logo__icon",
        textContent: "⚗️",
      }),
      DOMHelper.create("span", {
        className: "app-logo__title",
        textContent: "Alchemy laboratory",
      }),
    ]);
    header.appendChild(logo);

    const progress = DOMHelper.create("div", { className: "app-progress" });
    const bar = DOMHelper.create("div", { className: "app-progress__bar" });
    bar.appendChild(
      DOMHelper.create("div", { className: "app-progress__fill" }),
    );
    progress.appendChild(bar);
    progress.appendChild(
      DOMHelper.create("span", {
        className: "app-progress__text",
        textContent: "0 / 9 experiments",
      }),
    );
    header.appendChild(progress);

    return header;
  }

  function buildMissionBanner() {
    const banner = DOMHelper.create("div", {
      className: "mission-banner animate-fade-in-up",
    });
    banner.appendChild(
      DOMHelper.create("div", {
        className: "mission-banner__icon",
        textContent: "📜",
      }),
    );

    const content = DOMHelper.create("div", {
      className: "mission-banner__content",
    });
    content.appendChild(
      DOMHelper.create("div", {
        className: "mission-banner__title",
        textContent: AppConstants.MISSION.title,
      }),
    );
    content.appendChild(
      DOMHelper.create("p", {
        className: "mission-banner__description",
        textContent: AppConstants.MISSION.description,
      }),
    );
    banner.appendChild(content);

    return banner;
  }

  function buildLevelBadgeClass(levelId) {
    const suffixes = { 1: "level1", 2: "level2", 3: "level3" };
    return "level-section__badge--" + (suffixes[levelId] || "level1");
  }

  function buildLevelSection(levelData) {
    const levelStatus = Progress.getLevelStatus(levelData.id);
    const isLocked = levelStatus === "locked";

    const section = DOMHelper.create("section", {
      className: "level-section",
      dataset: { levelId: String(levelData.id) },
    });

    const header = DOMHelper.create("div", {
      className: "level-section__header",
    });

    const badge = DOMHelper.create("span", {
      className: "level-section__badge " + buildLevelBadgeClass(levelData.id),
      textContent: "Level " + levelData.id,
    });
    header.appendChild(badge);

    header.appendChild(
      DOMHelper.create("h2", {
        className: "level-section__title",
        textContent: levelData.name,
      }),
    );
    section.appendChild(header);

    const grid = DOMHelper.create("div", {
      className: "level-section__modules",
    });

    levelData.moduleIds.forEach(function (moduleId) {
      const modData = AppConstants.MODULES.find(function (m) {
        return m.id === moduleId;
      });
      if (!modData) return;

      const isCompleted = Progress.isModuleCompleted(moduleId);
      const status = isCompleted ? "completed" : "pending";

      const card = UI.renderCard(modData, status);

      if (isLocked && !isCompleted) {
        card.classList.add("card--locked");
      }

      grid.appendChild(card);
    });

    section.appendChild(grid);
    return section;
  }

  function buildMain() {
    const main = DOMHelper.create("main", { className: "app-main" });
    main.appendChild(buildMissionBanner());

    AppConstants.LEVELS.forEach(function (levelData) {
      main.appendChild(buildLevelSection(levelData));
    });

    return main;
  }

  function buildToastContainer() {
    return DOMHelper.create("div", { className: "toast-container" });
  }

  function initModules() {
    const modules = [
      window.OverflowDetector,
      window.RuneModernizer,
      window.LinkGenerator,
      window.AutoScroll,
      window.RecipeReplicator,
      window.IngredientRegistry,
      window.SummoningCircle,
      window.RitualProgress,
      window.AdaptiveLayout,
    ];

    modules.forEach(function (mod) {
      if (mod && typeof mod.init === "function") {
        mod.init();
      }
    });
  }

  function init() {
    Progress.init();

    const container = DOMHelper.create("div", { className: "app-container" });
    container.appendChild(buildHeader());
    container.appendChild(buildMain());
    container.appendChild(buildToastContainer());

    document.body.appendChild(container);

    initModules();
    Progress.updateProgressBar();
  }

  return { init: init };
})();

document.addEventListener("DOMContentLoaded", function () {
  window.AlchemyLab.init();
});
