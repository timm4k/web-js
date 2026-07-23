"use strict";

function initPlanetRating() {
  const btn = document.querySelector("#calculate-rating-btn");
  if (!btn) {
    return;
  }

  const container = document.querySelector("#planets-container");

  btn.addEventListener("click", async () => {
    if (!container) {
      return;
    }

    const planetCards = container.querySelectorAll(".planet-card");
    let recommendedCount = 0;

    for (let c = 0; c < planetCards.length; c++) {
      const card = planetCards[c];
      const rating = parseInt(card.getAttribute("data-rating"), 10);
      const starsEl = card.querySelector(".planet-stars");
      const isRecommended = rating === 5;

      if (isRecommended) {
        recommendedCount++;
      }
      if (starsEl) {
        starsEl.innerHTML = "";
      }

      for (let i = 1; i <= 5; i++) {
        await waitForMs(100);
        if (starsEl) {
          const starClass = i <= rating ? "star-filled" : "star-empty";
          starsEl.appendChild(createEl("span", starClass, "★"));
        }
      }

      await waitForMs(100);
      const existingRec = card.querySelector(".planet-recommendation");
      if (existingRec) {
        existingRec.remove();
      }
      if (isRecommended) {
        card.classList.add("recommended");
        const recEl = createEl(
          "div",
          "planet-recommendation",
          PLANET_RECOMMENDATION_TEXT,
        );
        await renderModule(recEl);
        card.appendChild(recEl);
      }
      await renderModule(card);
      await waitForMs(200);
    }

    addLogEntry(
      "Planet ratings calculated: " + recommendedCount + " recommended",
    );
    showModuleResult(
      "planet-rating",
      "✅ Planet ratings calculated. " +
        recommendedCount +
        " planet" +
        (recommendedCount !== 1 ? "s" : "") +
        " recommended for exploration",
    );
    completeModule("planet-rating");
  });
}
