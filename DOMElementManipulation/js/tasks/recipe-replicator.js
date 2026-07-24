window.RecipeReplicator = (function () {
  "use strict";

  const MODULE_ID = "recipe-replicator";

  const RECIPES = [
    {
      name: "Elixir of Shadows",
      ingredients: ["Shadow Root x3", "Bat Wing x2", "Obsidian Shavings x1"],
      instructions:
        "Grind ingredients in moonlight, simmer until dark mist forms",
      color: "#9b59b6",
    },
    {
      name: "Fire Resistance Tonic",
      ingredients: ["Salamander Scale x2", "Frozen Tear x1", "Lava Salt x4"],
      instructions: "Freeze-dry components, blend under extreme heat",
      color: "#e74c3c",
    },
    {
      name: "Speed Potion",
      ingredients: ["Hawk Feather x4", "Zephyr Essence x2", "Quicksilver x1"],
      instructions: "Distill under a hurricane moon, bottle at high pressure",
      color: "#f1c40f",
    },
    {
      name: "Night Vision Brew",
      ingredients: ["Owl Eye x1", "Starlight Ink x3", "Blind Worm Extract x2"],
      instructions: "Mix in complete darkness, seal with wax",
      color: "#1abc9c",
    },
  ];

  function buildRecipeCard(name, ingredients, instructions, color) {
    const card = DOMHelper.create("div", {
      style: {
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderLeft: "3px solid " + color,
        borderRadius: "6px",
        padding: "10px",
        fontSize: "12px",
        transition: "opacity 0.4s, transform 0.4s",
      },
    });

    card.appendChild(
      DOMHelper.create("h5", {
        textContent: name,
        style: { margin: "0 0 6px 0", color: color, fontSize: "13px" },
      }),
    );

    const list = DOMHelper.create("ul", {
      style: { margin: "0 0 6px 14px", padding: "0" },
    });
    ingredients.forEach(function (ing) {
      list.appendChild(
        DOMHelper.create("li", {
          textContent: ing,
          style: { marginBottom: "2px" },
        }),
      );
    });
    card.appendChild(list);

    card.appendChild(
      DOMHelper.create("p", {
        textContent: instructions,
        style: {
          margin: "0",
          color: "#8b7aa8",
          fontSize: "11px",
          lineHeight: "1.4",
        },
      }),
    );

    return card;
  }

  function init() {
    const card = DOMHelper.query('[data-module-id="' + MODULE_ID + '"]');
    if (!card) return;
    const visual = DOMHelper.query(".card__visual", card);
    const btn = DOMHelper.query(".btn", card);
    if (!visual || !btn) return;

    const label = DOMHelper.create("div", {
      textContent: "Recipe Template",
      style: {
        fontSize: "11px",
        color: "#8b7aa8",
        marginBottom: "4px",
        textTransform: "uppercase",
        letterSpacing: "1px",
      },
    });
    visual.appendChild(label);

    const template = buildRecipeCard(
      "Healing Draught",
      ["Moonpetal x2", "Crushed Ruby x1", "Spring Water x3"],
      "Boil water, add ruby dust, steep moonpetals for 10 minutes",
      "#4ecdc4",
    );
    template.dataset.template = "true";
    visual.appendChild(template);

    const resultsArea = DOMHelper.create("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        marginTop: "12px",
      },
    });
    visual.appendChild(resultsArea);

    btn.addEventListener("click", function () {
      btn.disabled = true;
      run(template, resultsArea, visual, btn);
    });
  }

  async function run(template, resultsArea, visual, btn) {
    template.style.opacity = "0.3";
    template.style.borderStyle = "dashed";

    let count = 0;
    for (let i = 0; i < RECIPES.length; i++) {
      const r = RECIPES[i];
      const clone = template.cloneNode(true);
      clone.removeAttribute("data-template");
      clone.style.opacity = "0";
      clone.style.transform = "scale(0.8) translateY(10px)";

      const title = clone.querySelector("h5");
      if (title) {
        title.textContent = r.name;
        title.style.color = r.color;
      }
      clone.style.borderLeftColor = r.color;

      const ul = clone.querySelector("ul");
      if (ul) {
        ul.innerHTML = "";
        r.ingredients.forEach(function (ing) {
          ul.appendChild(
            DOMHelper.create("li", {
              textContent: ing,
              style: { marginBottom: "2px" },
            }),
          );
        });
      }

      const p = clone.querySelector("p");
      if (p) p.textContent = r.instructions;

      resultsArea.appendChild(clone);
      count++;

      await AnimationHelper.waitFor(50);
      clone.style.opacity = "1";
      clone.style.transform = "scale(1) translateY(0)";
      await AnimationHelper.waitFor(300);
    }

    const resultHtml =
      "<strong>Recipe Replication Complete</strong><br>" +
      "Template: <code>Healing Draught</code><br>" +
      "Recipes cloned: <code>" +
      count +
      "</code><br>" +
      "Method: <code>cloneNode(true)</code> deep clone<br>" +
      "Each clone modified with unique recipe data";

    const panel = UIHelper.renderResultPanel(
      "Replication Report ∞",
      resultHtml,
    );
    visual.appendChild(panel);

    ProgressTracker.completeModule(MODULE_ID);
    UIHelper.markModuleComplete(MODULE_ID);
    btn.textContent = "Complete!";
  }

  return { init: init };
})();
