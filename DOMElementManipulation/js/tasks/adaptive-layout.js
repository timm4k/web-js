window.AdaptiveLayout = (function () {
  "use strict";

  const MODULE_ID = "adaptive-layout";

  const CHAMBERS = [
    {
      name: "Potion Storage",
      content: "Contains rare moonstone essence and distilled dragon tears",
      icon: "🧪",
    },
    {
      name: "Herb drying room",
      content:
        "Fresh sage, thyme, mandrake root, wolfsbane, and several bundles of enchanted lavender hang from the ceiling rafters. The air smells of dried roses and cinnamon",
      icon: "🌿",
    },
    {
      name: "Crystal Forge",
      content: "A blazing furnace for melting arcane crystals",
      icon: "💎",
    },
    {
      name: "Grimoire Archive",
      content:
        "Ancient spell books, scrolls of forbidden knowledge, hand-copied research notes, ingredient catalogs spanning centuries, and the legendary Codex of Transmutation are stored here",
      icon: "📚",
    },
    {
      name: "Astral Observatory",
      content: "A telescope pointed at the constellations",
      icon: "🔭",
    },
  ];

  function createChamber(data) {
    return DOMHelper.create(
      "div",
      {
        className: "chamber",
        dataset: { name: data.name },
        style: {
          padding: "14px",
          background: "rgba(180,130,255,0.06)",
          border: "1px solid rgba(180,130,255,0.15)",
          borderRadius: "10px",
          transition: "all 0.4s ease",
        },
      },
      [
        DOMHelper.create("div", {
          textContent: data.icon,
          style: { fontSize: "20px", marginBottom: "6px" },
        }),
        DOMHelper.create("div", {
          textContent: data.name,
          style: {
            fontWeight: "600",
            fontSize: "13px",
            color: "#d4b8ff",
            marginBottom: "4px",
          },
        }),
        DOMHelper.create("div", {
          className: "chamber-content",
          textContent: data.content,
          style: { fontSize: "12px", color: "#8b7aa8", lineHeight: "1.5" },
        }),
        DOMHelper.create("div", {
          className: "chamber-height",
          textContent: "offsetHeight: --",
          style: {
            marginTop: "6px",
            fontSize: "11px",
            fontFamily: "monospace",
            color: "#00e5ff",
          },
        }),
      ],
    );
  }

  function readHeights(container) {
    const chambers = DOMHelper.queryAll(".chamber", container);
    const heights = [];
    chambers.forEach(function (ch) {
      const h = ch.offsetHeight;
      heights.push({ name: ch.dataset.name, height: h, element: ch });
      const label = DOMHelper.query(".chamber-height", ch);
      if (label) label.textContent = "offsetHeight: " + h + "px";
    });
    return heights;
  }

  function createHeightDisplay(label, heights) {
    const lines = heights.map(function (h) {
      return h.name + ": " + h.height + "px";
    });
    return DOMHelper.create(
      "div",
      {
        style: {
          fontSize: "12px",
          color: "#8b7aa8",
          fontFamily: "monospace",
          padding: "8px",
          background: "rgba(0,0,0,0.15)",
          borderRadius: "8px",
          marginTop: "8px",
        },
      },
      [
        DOMHelper.create("strong", {
          textContent: label,
          style: { color: "#d4b8ff", display: "block", marginBottom: "4px" },
        }),
        DOMHelper.create("span", { textContent: lines.join(" | ") }),
      ],
    );
  }

  function init() {
    const card = DOMHelper.query('[data-module-id="' + MODULE_ID + '"]');
    if (!card) return;
    const visual = DOMHelper.query(".card__visual", card);
    const btn = DOMHelper.query(".btn", card);
    if (!visual || !btn) return;

    const grid = DOMHelper.create("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "10px",
      },
    });
    CHAMBERS.forEach(function (data) {
      grid.appendChild(createChamber(data));
    });
    visual.appendChild(grid);

    btn.addEventListener("click", function () {
      btn.disabled = true;
      run(visual, btn);
    });
  }

  async function run(visual, btn) {
    const beforeHeights = readHeights(visual);
    const beforeDisplay = createHeightDisplay("Before", beforeHeights);
    visual.appendChild(beforeDisplay);
    await AnimationHelper.waitFor(800);

    const sorted = beforeHeights.slice().sort(function (a, b) {
      return b.height - a.height;
    });
    sorted.forEach(function (item, i) {
      item.element.style.order = String(i);
    });
    await AnimationHelper.waitFor(400);

    const maxH = Math.max.apply(
      null,
      beforeHeights.map(function (h) {
        return h.height;
      }),
    );
    beforeHeights.forEach(function (item) {
      const diff = maxH - item.height;
      if (diff > 0) {
        const content = item.element.querySelector(".chamber-content");
        if (content) {
          content.appendChild(
            DOMHelper.create("p", {
              textContent:
                "Additional essence reservoirs installed to balance chamber capacity",
              style: {
                marginTop: "6px",
                fontSize: "11px",
                color: "#6b5a88",
                fontStyle: "italic",
              },
            }),
          );
        }
      }
    });

    await AnimationHelper.waitFor(500);
    const afterHeights = readHeights(visual);
    const afterDisplay = createHeightDisplay(
      "After equalization",
      afterHeights,
    );
    visual.appendChild(afterDisplay);
    await AnimationHelper.waitFor(400);

    const lines = beforeHeights.map(function (bh) {
      const ah = afterHeights.find(function (a) {
        return a.name === bh.name;
      });
      return (
        bh.name +
        ": " +
        bh.height +
                "px → " +
        (ah ? ah.height : "?") +
        "px"
      );
    });

    const resultHtml =
      "<strong>Layout Analysis</strong><br>" +
      "Chambers sorted by height (tallest first)<br>" +
      "Shorter chambers equalized with extra content<br><br>" +
      lines.join("<br>");

    const panel = UIHelper.renderResultPanel(
      "Layout Report ☆",
      resultHtml,
    );
    visual.appendChild(panel);

    ProgressTracker.completeModule(MODULE_ID);
    UIHelper.markModuleComplete(MODULE_ID);
    btn.textContent = "Complete!";
  }

  return { init: init };
})();
