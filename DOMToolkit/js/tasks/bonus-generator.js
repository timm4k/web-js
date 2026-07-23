"use strict";

function initBonusGenerator() {
  const btn = document.querySelector("#generate-bonus-btn");
  if (!btn) {
    return;
  }

  const energyEl = document.querySelector("#bonus-energy");
  const fuelEl = document.querySelector("#bonus-fuel");
  const researchEl = document.querySelector("#bonus-research");
  const summaryEl = document.querySelector("#bonus-summary");

  btn.addEventListener("click", async () => {
    const energyValue = randomInt(
      BONUS_RANGES.energy.min,
      BONUS_RANGES.energy.max,
    );
    const fuelValue = randomInt(BONUS_RANGES.fuel.min, BONUS_RANGES.fuel.max);
    const researchValue = randomInt(
      BONUS_RANGES.research.min,
      BONUS_RANGES.research.max,
    );
    const maxValue = Math.max(energyValue, fuelValue, researchValue);

    renderSingleBonus(energyEl, energyValue, BONUS_RANGES.energy, maxValue);
    renderSingleBonus(fuelEl, fuelValue, BONUS_RANGES.fuel, maxValue);
    renderSingleBonus(
      researchEl,
      researchValue,
      BONUS_RANGES.research,
      maxValue,
    );

    if (summaryEl) {
      const totalScore = energyValue + fuelValue * 2 + researchValue * 3;
      const readiness =
        totalScore > 150 ? "Optimal" : totalScore > 80 ? "Adequate" : "Low";
      summaryEl.innerHTML = "";
      const summaryBox = createEl(
        "div",
        "result-box",
        '<span class="label">Mission Readiness</span>' +
          '<span class="value">Total score: <strong>' +
          totalScore +
          "</strong> — " +
          "Status: <strong>" +
          escapeHtml(readiness) +
          "</strong></span>",
      );
      summaryBox.classList.add(
        readiness === "Optimal"
          ? "success"
          : readiness === "Low"
            ? "warning"
            : "",
      );
      await renderModule(summaryBox);
      summaryEl.appendChild(summaryBox);
    }

    await waitForMs(200);
    addLogEntry(
      "Mission resources calculated. Score: " +
        (energyValue + fuelValue * 2 + researchValue * 3),
    );
    showModuleResult(
      "bonus-generator",
      "✅ Mission resources calculated and allocated",
      "success",
    );
    completeModule("bonus-generator");

    const promoEl = document.querySelector("#promo");
    if (promoEl) {
      const discount = Math.floor(Math.random() * 16) + 5;
      promoEl.textContent = "Space resource discount: " + discount + "%";
      promoEl.style.fontSize = "24px";
    }

    const inventoryCounts = document.querySelectorAll(".inventory-count");
    inventoryCounts.forEach(function (span) {
      const count = parseInt(span.textContent, 10);
      if (count === 0) {
        span.parentElement.classList.add("out-of-stock");
        span.textContent = "Out of Stock";
      }
    });
  });
}

function renderSingleBonus(container, value, config, maxValue) {
  if (!container) {
    return;
  }
  const level = getBonusLevel(value, config.max);
  const isMax = value === maxValue;
  container.innerHTML =
    '<div class="bonus-icon">' +
    config.icon +
    "</div>" +
    '<div class="bonus-label">' +
    config.label +
    "</div>" +
    '<div class="bonus-value ' +
    level +
    (isMax ? " high" : "") +
    '">+' +
    value +
    config.unit +
    "</div>";
  renderModule(container);
}
