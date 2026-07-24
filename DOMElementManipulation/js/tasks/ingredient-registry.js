window.IngredientRegistry = (function () {
  "use strict";

  const MODULE_ID = "ingredient-registry";

  const INGREDIENTS = [
    { name: "Dragon scale", rarity: "rare", power: 92, toxicity: 45 },
    { name: "Phoenix feather", rarity: "legendary", power: 98, toxicity: 10 },
    { name: "Moonstone dust", rarity: "uncommon", power: 64, toxicity: 5 },
    { name: "Shadow root", rarity: "common", power: 35, toxicity: 70 },
    { name: "Basilisk venom", rarity: "rare", power: 88, toxicity: 90 },
    { name: "Unicorn hair", rarity: "legendary", power: 76, toxicity: 0 },
    { name: "Griffin claw", rarity: "common", power: 42, toxicity: 30 },
    { name: "Void crystal", rarity: "rare", power: 95, toxicity: 55 },
  ];

  function init() {
    const card = DOMHelper.query('[data-module-id="' + MODULE_ID + '"]');
    if (!card) return;
    const visual = DOMHelper.query(".card__visual", card);
    const btn = DOMHelper.query(".btn", card);
    if (!visual || !btn) return;

    const list = DOMHelper.create("div", {
      style: { display: "flex", flexWrap: "wrap", gap: "8px" },
    });

    INGREDIENTS.forEach(function (ing) {
      const tag = DOMHelper.create(
        "div",
        {
          className: "ingredient-tag " + ing.rarity,
          dataset: {
            name: ing.name,
            rarity: ing.rarity,
            power: String(ing.power),
            toxicity: String(ing.toxicity),
          },
          style: {
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            border: "1px solid rgba(255,255,255,0.15)",
            cursor: "default",
            transition: "all 0.3s",
          },
        },
        [
          DOMHelper.create("span", { textContent: ing.name }),
          DOMHelper.create("span", {
            className: "power-badge",
            textContent: "P:" + ing.power,
            style: {
              marginLeft: "6px",
              padding: "1px 6px",
              borderRadius: "8px",
              fontSize: "10px",
              background: "rgba(255,255,255,0.1)",
            },
          }),
        ],
      );
      list.appendChild(tag);
    });

    visual.appendChild(list);

    btn.addEventListener("click", function () {
      btn.disabled = true;
      run(visual, btn);
    });
  }

  async function run(visual, btn) {
    const tags = DOMHelper.queryAll(".ingredient-tag", visual);
    const log = [];

    log.push("<strong>Reading dataset attributes...</strong>");
    const readPanel = DOMHelper.create("div", {
      style: { marginTop: "10px", fontSize: "12px", lineHeight: "1.8" },
    });
    readPanel.innerHTML = log.join("<br>");
    visual.appendChild(readPanel);

    await AnimationHelper.waitFor(400);

    let registryText = "";
    tags.forEach(function (tag) {
      registryText +=
        tag.dataset.name +
        " [" +
        tag.dataset.rarity +
        "] Power:" +
        tag.dataset.power +
        " Tox:" +
        tag.dataset.toxicity +
        "<br>";
    });
    readPanel.innerHTML =
      "<strong>Ingredient Registry</strong><br>" + registryText;
    await AnimationHelper.waitFor(600);

    log.length = 0;
    log.push("--- classList Operations ---");

    log.push('Toggling "active" on random ingredients...');
    tags.forEach(function (tag) {
      if (Math.random() > 0.5) {
        tag.classList.toggle("active");
        log.push(
          "  " +
            tag.dataset.name +
            " active=" +
            tag.classList.contains("active"),
        );
      }
    });
    readPanel.innerHTML =
      "<strong>Ingredient Registry</strong><br>" +
      registryText +
      "<br>" +
      log.join("<br>");
    await AnimationHelper.waitFor(500);

    log.push("");
    log.push('Adding "highlighted" to power >= 80...');
    tags.forEach(function (tag) {
      if (parseInt(tag.dataset.power, 10) >= 80) {
        tag.classList.add("highlighted");
        log.push("  Highlighted: " + tag.dataset.name);
      }
    });
    readPanel.innerHTML =
      "<strong>Ingredient Registry</strong><br>" +
      registryText +
      "<br>" +
      log.join("<br>");
    await AnimationHelper.waitFor(500);

    log.push("");
    log.push('Removing "common" from rare/legendary...');
    tags.forEach(function (tag) {
      const r = tag.dataset.rarity;
      if (r === "rare" || r === "legendary") {
        tag.classList.remove("common");
        log.push("  " + tag.dataset.name + " (" + r + ") removed common");
      }
    });
    readPanel.innerHTML =
      "<strong>Ingredient Registry</strong><br>" +
      registryText +
      "<br>" +
      log.join("<br>");
    await AnimationHelper.waitFor(500);

    log.push("");
    log.push("Updating power with random multiplier...");
    const factor = MathHelper.randomFloat(0.8, 1.3);
    tags.forEach(function (tag) {
      const old = parseInt(tag.dataset.power, 10);
      const updated = Math.round(old * factor);
      tag.dataset.power = String(updated);
      const badge = tag.querySelector(".power-badge");
      if (badge) badge.textContent = "P:" + updated;
      log.push(
        "  " +
          tag.dataset.name +
          ": " +
          old +
          " -> " +
          updated +
          " (x" +
          factor.toFixed(2) +
          ")",
      );
    });
    readPanel.innerHTML =
      "<strong>Ingredient Registry</strong><br>" + log.join("<br>");

    await AnimationHelper.waitFor(400);

    const resultHtml =
      "<strong>Registry Complete</strong><br>" +
      "Ingredients processed: <code>" +
      tags.length +
      "</code><br>" +
      "classList.toggle() used on random items<br>" +
      'classList.add("highlighted") on high-power items<br>' +
      'classList.remove("common") from rare items<br>' +
      "textContent updated with power multiplier";

    const panel = UIHelper.renderResultPanel("Registry Report ☆", resultHtml);
    visual.appendChild(panel);

    ProgressTracker.completeModule(MODULE_ID);
    UIHelper.markModuleComplete(MODULE_ID);
    btn.textContent = "Complete!";
  }

  return { init: init };
})();
